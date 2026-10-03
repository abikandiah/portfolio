import {
	ContentError,
	compileContentFile,
	parseMarkdown,
	plainText,
} from './project-content.ts'
import type { Nodes, Root, RootContent } from 'mdast'
import type { ProjectContent } from '../src/content/types.ts'

/*
 * Style checks for project write-ups — the cheap, mechanical half of the
 * write-project skill's critic pass. Structure (block types, headings,
 * frontmatter) is already enforced by the content plugin, which this runs
 * first; these checks catch the *voice* drifting toward code documentation:
 * identifiers, endpoints, status codes, file paths and the like.
 *
 * Warnings, not errors: a flagged line is sometimes the right call (the
 * style guide allows code detail when it's the interesting part), so each
 * one is a prompt to justify or rewrite, not a hard stop.
 */

interface LintIssue {
	level: 'error' | 'warning'
	line?: number
	message: string
}

interface LintOptions {
	/** Names that must not appear (employer, client, internal product names). */
	forbid?: Array<string>
}

const MAX_SECTIONS = 7
const MIN_WORDS = 250
const MAX_WORDS = 1800
const MAX_DESCRIPTION = 220
const MAX_INLINE_CODE = 10

// Prose patterns that mean the write-up has dropped to code level.
const PROSE_SMELLS: Array<[RegExp, string]> = [
	[/\b[a-z]{2,}[A-Z]\w*\b/, 'camelCase identifier'],
	[/\b[A-Z][A-Z0-9]*_[A-Z0-9_]+\b/, 'constant or environment variable'],
	[/\b(GET|POST|PUT|PATCH|DELETE)\s+\//, 'HTTP endpoint'],
	[/(^|\s)\/api\//, 'API path'],
	[
		/\b[1-5]\d\d\s+(OK|Created|Accepted|No Content|Bad Request|Unauthorized|Forbidden|Not Found|Conflict|Unprocessable)/i,
		'HTTP status code',
	],
	[
		/\b[\w-]+\.(ts|tsx|js|jsx|java|py|rb|go|rs|c|h|yml|yaml|json|xml|sql|properties)\b/,
		'file name',
	],
	[/\b\w+\(\)/, 'function call'],
]

// "I", "I'm", "I've", "I'd", "I'll", with straight or curly apostrophes.
const FIRST_PERSON = /(^|[\s("“])I(['’](m|ve|d|ll))?(?=[\s,.;:!?)]|$)/

// Inline code is for names a user sees (operations, options), so anything
// shaped like source code is suspect.
// "eDiscovery"-style brand casing is fine; "camelCase" and single-token
// "PascalCase" names aren't.
const CODE_SMELL =
	/[a-z]{2,}[A-Z]|^[A-Z][a-z]+[A-Z]\w*$|^[A-Z0-9_]{3,}$|[()=/{}<>;]|\.\w+$|::|->/

function lintWriteUp(
	source: string,
	file: string,
	options: LintOptions = {},
): Array<LintIssue> {
	const issues: Array<LintIssue> = []
	const warn = (message: string, node?: { position?: Nodes['position'] }) =>
		issues.push({ level: 'warning', line: node?.position?.start.line, message })

	let compiled: ReturnType<typeof compileContentFile>
	try {
		compiled = compileContentFile(source, file)
	} catch (error) {
		if (error instanceof ContentError) {
			return [{ level: 'error', message: error.message }]
		}
		throw error
	}
	if (compiled == null) {
		return [
			{
				level: 'error',
				message: `${file} isn't a write-up (expected src/content/projects/<slug>/index.md or case-study.md)`,
			},
		]
	}

	const root: Root = parseMarkdown(source)
	const project = 'meta' in compiled ? compiled : undefined

	if (project != null) {
		lintProject(project, warn)
	}

	// Prose and inline code
	let inlineCodeCount = 0
	let words = 0
	walk(root, (node) => {
		if (node.type === 'text') {
			words += node.value.split(/\s+/).filter(Boolean).length
			for (const [pattern, label] of PROSE_SMELLS) {
				const match = pattern.exec(node.value)
				if (match != null) {
					warn(
						`${label} in prose ("${match[0]}") — describe the concept, not the code`,
						node,
					)
				}
			}
		}
		if (node.type === 'inlineCode') {
			inlineCodeCount++
			if (CODE_SMELL.test(node.value)) {
				warn(
					`\`${node.value}\` looks like source code — inline code is for names a user sees (operations, options)`,
					node,
				)
			}
		}
		if (node.type === 'code' && node.lang !== 'mermaid') {
			warn(
				'code block — keep only if the shape of the code is the point (see the style guide)',
				node,
			)
		}
	})

	if (inlineCodeCount > MAX_INLINE_CODE) {
		warn(
			`${inlineCodeCount} inline code spans — a sign the write-up has drifted into implementation detail`,
		)
	}
	if (
		project != null &&
		project.sections.length > 0 &&
		(words < MIN_WORDS || words > MAX_WORDS)
	) {
		warn(
			`${words} words — hand-written write-ups run ${MIN_WORDS}–${MAX_WORDS}`,
		)
	}

	// Banners: asides, so never two in a row.
	walkSiblings(root, (node, previous) => {
		if (isBanner(node) && previous != null && isBanner(previous)) {
			warn('two banners in a row — merge them, or make one plain prose', node)
		}
	})

	// Voice: work projects are "we", and names on the forbid list never appear.
	if (project?.meta.type === 'Work') {
		walk(root, (node) => {
			if (node.type === 'text' && FIRST_PERSON.test(node.value)) {
				warn(
					'first person singular in a Work write-up — work projects use "we"',
					node,
				)
			}
		})
	}
	for (const name of options.forbid ?? []) {
		// Lookarounds rather than \b, which never matches beside a non-word
		// character — "C++" or ".NET" would otherwise never be found.
		const pattern = new RegExp(
			`(?<![\\p{L}\\p{N}_])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}_])`,
			'iu',
		)
		if (pattern.test(source)) {
			issues.push({
				level: 'error',
				message: `"${name}" is on the do-not-name list (see the brief)`,
			})
		}
	}

	return issues
}

function lintProject(content: ProjectContent, warn: (message: string) => void) {
	const { meta, sections } = content

	if (meta.description.length > MAX_DESCRIPTION) {
		warn(
			`description is ${meta.description.length} characters — keep it to one sentence (under ${MAX_DESCRIPTION})`,
		)
	}
	if (!meta.description.endsWith('.')) {
		warn('description should be a full sentence ending in a period')
	}
	if (sections.length > MAX_SECTIONS) {
		warn(
			`${sections.length} sections — hand-written write-ups use 1–3 (${MAX_SECTIONS} at most, for products with genuinely separate modules); fold detail into ### sub-headings`,
		)
	}
	if (sections.length > 0 && sections[0].title !== 'Overview') {
		warn(
			`the first section is "${sections[0].title}" — write-ups open with "## Overview"`,
		)
	}
}

function isBanner(node: RootContent): boolean {
	return (
		node.type === 'containerDirective' &&
		(node.name === 'info' || node.name === 'note')
	)
}

function walk(node: Nodes, visit: (node: Nodes) => void) {
	visit(node)
	if ('children' in node) {
		for (const child of node.children as Array<Nodes>) {
			walk(child, visit)
		}
	}
}

// Visits every node with the sibling just before it (undefined for a first
// child) — "previous" never crosses into or out of a parent.
function walkSiblings(
	node: Nodes,
	visit: (node: RootContent, previous: RootContent | undefined) => void,
) {
	if ('children' in node) {
		const children = node.children as Array<RootContent>
		children.forEach((child, index) => {
			visit(child, index > 0 ? children[index - 1] : undefined)
			walkSiblings(child, visit)
		})
	}
}

export { lintWriteUp, plainText }
export type { LintIssue, LintOptions }
