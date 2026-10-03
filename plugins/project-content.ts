import { basename, dirname } from 'node:path'
import { toHast } from 'mdast-util-to-hast'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { parse as parseYaml } from 'yaml'
import { RESERVED_PAGE_IDS } from '../src/lib/pageIds.ts'
import { toUrl } from '../src/lib/slug.ts'
import { techType } from '../src/types/TechTypes.ts'
import type { Root as HastRoot } from 'hast'
import type {
	ListItem,
	Nodes,
	Parent,
	PhrasingContent,
	Root,
	RootContent,
} from 'mdast'
import type {} from 'mdast-util-directive'
import type { Plugin } from 'vite'
import type {
	CaseStudyContent,
	ContentHeading,
	ContentSection,
	ProjectContent,
	ProjectMeta,
} from '../src/content/types.ts'
import type { TTech } from '../src/types/TechTypes.ts'

/*
 * Compiles project write-ups (src/content/projects/<slug>/index.md and
 * case-study.md) into section trees the app renders with its own
 * components. The Markdown vocabulary is deliberately small — anything
 * outside it is a build error rather than something that renders oddly —
 * so generated write-ups can't drift from the house format. The vocabulary
 * itself is documented in .claude/skills/write-project/format.md.
 */

const CONTENT_FILE =
	/\/src\/content\/projects\/([^/]+)\/(index|case-study)\.md$/

const WORDS_PER_MINUTE = 200

class ContentError extends Error {
	constructor(
		file: string,
		message: string,
		node?: { position?: Nodes['position'] },
	) {
		const line = node?.position?.start.line
		super(`${file}${line != null ? `:${line}` : ''} — ${message}`)
		this.name = 'ContentError'
	}
}

function parseMarkdown(source: string): Root {
	return unified()
		.use(remarkParse)
		.use(remarkFrontmatter, ['yaml'])
		.use(remarkGfm)
		.use(remarkDirective)
		.parse(source)
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

const META_KEYS = new Set([
	'name',
	'type',
	'startYear',
	'endYear',
	'description',
	'tech',
	'url',
	'role',
	'related',
	'draft',
])

function parseMeta(file: string, slug: string, raw: unknown): ProjectMeta {
	const fail = (message: string): never => {
		throw new ContentError(file, `frontmatter: ${message}`)
	}

	if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
		return fail('expected a YAML mapping')
	}
	const data = raw as Record<string, unknown>

	for (const key of Object.keys(data)) {
		if (!META_KEYS.has(key)) {
			fail(`unknown key "${key}"`)
		}
	}

	const str = (key: string, required: boolean): string | undefined => {
		const value = data[key]
		if (value == null) {
			return required ? fail(`"${key}" is required`) : undefined
		}
		if (typeof value !== 'string' || value.trim() === '') {
			return fail(`"${key}" must be a non-empty string`)
		}
		return value.trim()
	}

	const name = str('name', true)!
	if (toUrl(name) !== slug) {
		fail(
			`the folder must be named after the project — "${name}" belongs in "${toUrl(name)}/", not "${slug}/"`,
		)
	}

	const type = data.type
	if (type !== 'Work' && type !== 'Personal') {
		fail('"type" must be Work or Personal')
	}

	const startYear = data.startYear
	if (!Number.isInteger(startYear)) {
		fail('"startYear" must be a year')
	}

	let endYear: number | undefined
	if (data.endYear === 'present') {
		endYear = undefined
	} else if (Number.isInteger(data.endYear)) {
		endYear = data.endYear as number
		if (endYear < (startYear as number)) {
			fail('"endYear" is before "startYear"')
		}
	} else {
		fail('"endYear" must be a year, or "present" for an ongoing project')
	}

	if (!Array.isArray(data.tech) || data.tech.length === 0) {
		fail('"tech" must be a non-empty list')
	}
	const tech = (data.tech as Array<unknown>).map((key): TTech => {
		if (typeof key !== 'string' || !Object.hasOwn(techType, key)) {
			return fail(
				`unknown tech "${String(key)}" — use a key from src/types/TechTypes.ts (e.g. ${Object.keys(techType).slice(0, 4).join(', ')}), or add it there first`,
			)
		}
		return techType[key as keyof typeof techType]
	})

	const url = str('url', false)
	if (url != null && !/^https?:\/\//.test(url)) {
		fail('"url" must be an http(s) URL')
	}

	let related: Array<string> | undefined
	if (data.related != null) {
		if (
			!Array.isArray(data.related) ||
			data.related.some((value) => typeof value !== 'string')
		) {
			fail('"related" must be a list of project slugs')
		}
		related = data.related as Array<string>
	}

	if (data.draft != null && typeof data.draft !== 'boolean') {
		fail('"draft" must be true or false')
	}

	return {
		name,
		type: type as ProjectMeta['type'],
		startYear: startYear as number,
		endYear,
		description: str('description', true)!,
		tech,
		url,
		role: str('role', false),
		related,
		draft: data.draft === true ? true : undefined,
	}
}

// ---------------------------------------------------------------------------
// Body
// ---------------------------------------------------------------------------

interface WalkState {
	file: string
	source: string
	projectLinks: Set<string>
	words: number
}

const BANNER_TYPES = new Set(['info', 'note'])

function plainText(node: Nodes): string {
	if ('value' in node && node.type !== 'code') {
		return node.value
	}
	if ('children' in node) {
		return (node.children as Array<Nodes>).map(plainText).join('')
	}
	return ''
}

function countWords(text: string): number {
	return text.split(/\s+/).filter(Boolean).length
}

// Rewrites the tree in place into the shapes mdast-util-to-hast turns into
// the app's custom elements (via data.hName), validating as it goes.
//
// `topLevel` is true only for a section's (or a case study's) direct
// children — the one place a ### sub-heading may appear.
function transformChildren(parent: Parent, state: WalkState, topLevel = false) {
	const next: Array<RootContent> = []
	for (const child of parent.children) {
		next.push(...transformNode(child, state, topLevel))
	}
	parent.children = next
}

function transformNode(
	node: RootContent,
	state: WalkState,
	topLevel: boolean,
): Array<RootContent> {
	const { file } = state
	const fail = (message: string): never => {
		throw new ContentError(file, message, node)
	}

	switch (node.type) {
		case 'paragraph':
		case 'strong':
		case 'emphasis':
		case 'tableRow':
		case 'tableCell':
			transformChildren(node, state)
			return [node]

		case 'listItem':
			if (node.checked != null) {
				fail('task lists ("- [ ] item") aren\'t part of the format')
			}
			transformChildren(node, state)
			return [node]

		case 'list':
			transformChildren(node, state)
			return [node]

		case 'table':
			transformChildren(node, state)
			return [node]

		case 'text':
			state.words += countWords(node.value)
			return [node]

		case 'inlineCode':
			state.words += countWords(node.value)
			return [node]

		case 'break':
			return [node]

		case 'heading':
			// Section (##) headings are split off before the walk, so only ###
			// can reach here.
			if (node.depth !== 3) {
				fail(
					node.depth === 2
						? '"##" headings start sections and aren\'t allowed here'
						: `"${'#'.repeat(node.depth)}" headings aren't part of the format — use "##" for sections and "###" for sub-headings`,
				)
			}
			if (!topLevel) {
				fail(
					'"###" sub-headings belong directly in a section, not inside a list or block',
				)
			}
			transformChildren(node, state)
			return [node]

		case 'link': {
			const url = node.url
			const projectLink = /^\/projects\/([a-z0-9-]+)$/.exec(url)
			if (projectLink != null) {
				state.projectLinks.add(projectLink[1])
			} else if (!/^(https?:\/\/|mailto:)/.test(url)) {
				fail(
					`link "${url}" must be an http(s) or mailto: URL, or a project link like /projects/some-project`,
				)
			}
			transformChildren(node, state)
			return [node]
		}

		case 'code': {
			const isDiagram = node.lang === 'mermaid'
			return [
				{
					type: 'code',
					value: node.value,
					data: {
						hName: isDiagram ? 'diagram' : 'codeblock',
						hProperties: isDiagram
							? { code: node.value, caption: node.meta ?? undefined }
							: { code: node.value, language: node.lang ?? undefined },
						hChildren: [],
					},
				},
			]
		}

		case 'containerDirective':
			if (BANNER_TYPES.has(node.name)) {
				let title: string | undefined
				const first = node.children.at(0)
				const rest = node.children.slice(1)
				let body = node.children
				if (first?.type === 'paragraph' && first.data?.directiveLabel) {
					title = plainText(first)
					body = rest
				}
				if (body.length === 0) {
					fail(`":::${node.name}" is empty`)
				}
				node.children = body
				transformChildren(node, state)
				node.data = {
					hName: 'banner',
					hProperties: { type: node.name, title },
				}
				return [node]
			}
			if (node.name === 'terms') {
				return [termList(node.children, state, fail)]
			}
			if (node.name === 'steps') {
				const list = node.children.at(0)
				if (
					list?.type !== 'list' ||
					!list.ordered ||
					node.children.length > 1
				) {
					return fail('":::steps" must contain exactly one numbered list')
				}
				transformChildren(list, state)
				list.data = { hName: 'steps' }
				return [list]
			}
			return fail(
				`unknown block ":::${node.name}" — the format allows :::info, :::note, :::terms and :::steps`,
			)

		case 'leafDirective':
			if (node.name === 'redacted') {
				const lines = Number(node.attributes?.lines ?? 1)
				if (!Number.isInteger(lines) || lines < 1 || lines > 10) {
					fail('"::redacted" takes lines=1..10')
				}
				node.data = {
					hName: 'redacted',
					hProperties: { lines: String(lines) },
					hChildren: [],
				}
				return [node]
			}
			return fail(
				`unknown block "::${node.name}" — the only one-line block is ::redacted`,
			)

		case 'textDirective': {
			// `:word` in ordinary prose (a ratio, "Note:this") parses as a text
			// directive. None are part of the format, so put the source back.
			const start = node.position?.start.offset
			const end = node.position?.end.offset
			const value =
				start != null && end != null
					? state.source.slice(start, end)
					: `:${node.name}`
			state.words += countWords(value)
			return [{ type: 'text', value }]
		}

		default:
			return fail(
				`"${node.type}" isn't part of the write-up format (see .claude/skills/write-project/format.md)`,
			)
	}
}

// `:::terms` — a bullet list where every item reads "**Term**: definition",
// rendered as a definition list.
function termList(
	children: Array<RootContent>,
	state: WalkState,
	fail: (message: string) => never,
): RootContent {
	const list = children.at(0)
	if (list?.type !== 'list' || list.ordered || children.length > 1) {
		return fail('":::terms" must contain exactly one bullet list')
	}

	const items = list.children.map((item: ListItem) => {
		// Validate the item's contents first; the row is rebuilt from the
		// result, using carrier nodes the walk doesn't need to see again.
		transformChildren(item, state)

		const lead = item.children.at(0)
		const blocks = item.children.slice(1)
		const inline = lead?.type === 'paragraph' ? lead.children : []
		const term = inline.at(0)
		const separator = inline.at(1)
		const rest = inline.slice(2)
		// The colon sits in the text right after the term; the definition can
		// carry on in that text or start with any inline node ("**Term**:
		// `Option` does x", "**Term**: [Docs](...)").
		const leadText =
			separator?.type === 'text' && /^:\s*/.test(separator.value)
				? separator.value.replace(/^:\s*/, '')
				: undefined
		if (
			term?.type !== 'strong' ||
			leadText == null ||
			(leadText === '' && rest.length === 0)
		) {
			throw new ContentError(
				state.file,
				'every ":::terms" item must read "**Term**: definition"',
				item,
			)
		}

		const definition: Array<PhrasingContent> = [
			...(leadText !== '' ? [{ type: 'text' as const, value: leadText }] : []),
			...rest,
		]

		return carrier('div', [
			{ type: 'paragraph', children: term.children, data: { hName: 'dt' } },
			carrier(
				'dd',
				blocks.length > 0
					? [{ type: 'paragraph', children: definition }, ...blocks]
					: [
							{
								type: 'paragraph',
								children: definition,
								data: { hName: 'span' },
							},
						],
			),
		])
	})

	return carrier('dl', items)
}

// A block container that renders as `tagName`. Blockquote is used only
// because mdast-util-to-hast passes its children through untouched; the
// format itself doesn't allow blockquotes (the walk rejects them).
function carrier(tagName: string, children: Array<RootContent>): RootContent {
	return {
		type: 'blockquote',
		children: children as Array<never>,
		data: { hName: tagName },
	}
}

function stripPositions(node: unknown) {
	if (node != null && typeof node === 'object') {
		delete (node as { position?: unknown }).position
		const children = (node as { children?: Array<unknown> }).children
		children?.forEach(stripPositions)
	}
}

function toTree(children: Array<RootContent>): HastRoot {
	const tree = toHast({ type: 'root', children }) as HastRoot
	stripPositions(tree)
	return tree
}

// Claims a heading's anchor, rejecting one that's empty, already used in
// this write-up, or taken by the page around it.
function claimAnchor(
	title: string,
	marker: string,
	file: string,
	seen: Set<string>,
	node: Nodes,
): string {
	const id = toUrl(title)
	if (id === '') {
		throw new ContentError(
			file,
			`"${marker} ${title}" has no letters or digits to build an anchor from`,
			node,
		)
	}
	if (RESERVED_PAGE_IDS.has(id)) {
		throw new ContentError(
			file,
			`"${marker} ${title}" would take the anchor "${id}", which the project page already uses — reword the heading`,
			node,
		)
	}
	if (seen.has(id)) {
		throw new ContentError(file, `two headings share the anchor "${id}"`, node)
	}
	seen.add(id)
	return id
}

function assignHeadingIds(
	children: Array<RootContent>,
	file: string,
	seen: Set<string>,
): Array<ContentHeading> {
	const headings: Array<ContentHeading> = []
	for (const node of children) {
		if (node.type === 'heading' && node.depth === 3) {
			const title = plainText(node)
			const id = claimAnchor(title, '###', file, seen, node)
			node.data = { ...node.data, hProperties: { id } }
			headings.push({ title, id })
		}
	}
	return headings
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

function compileProject(
	source: string,
	file: string,
	slug: string,
): ProjectContent {
	const root = parseMarkdown(source)
	const front = root.children.at(0)
	const body = root.children.slice(1)
	if (front?.type !== 'yaml') {
		throw new ContentError(file, 'missing frontmatter (a --- block at the top)')
	}

	let raw: unknown
	try {
		raw = parseYaml(front.value)
	} catch (error) {
		throw new ContentError(
			file,
			`frontmatter isn't valid YAML: ${(error as Error).message}`,
		)
	}
	const meta = parseMeta(file, slug, raw)

	const state: WalkState = { file, source, projectLinks: new Set(), words: 0 }
	const seen = new Set<string>()
	const sections: Array<ContentSection> = []

	let current: { title: string; children: Array<RootContent> } | undefined
	const groups: Array<NonNullable<typeof current>> = []
	for (const node of body) {
		if (node.type === 'heading' && node.depth === 2) {
			// Walk the heading first, so prose like "3:1" (parsed as a text
			// directive) is restored before the title and anchor are read.
			transformChildren(node, state)
			const title = plainText(node)
			claimAnchor(title, '##', file, seen, node)
			current = { title, children: [] }
			groups.push(current)
		} else if (current == null) {
			throw new ContentError(
				file,
				'content must start with a "## Section" heading',
				node,
			)
		} else {
			current.children.push(node)
		}
	}

	for (const group of groups) {
		if (group.children.length === 0) {
			throw new ContentError(file, `section "${group.title}" is empty`)
		}
		const wrapper: Root = { type: 'root', children: group.children }
		transformChildren(wrapper, state, true)
		const headings = assignHeadingIds(wrapper.children, file, seen)
		sections.push({
			title: group.title,
			headings,
			tree: toTree(wrapper.children),
		})
	}

	return {
		slug,
		meta,
		sections,
		readingMinutes: Math.max(1, Math.round(state.words / WORDS_PER_MINUTE)),
		projectLinks: [...state.projectLinks],
	}
}

function compileCaseStudy(source: string, file: string): CaseStudyContent {
	const root = parseMarkdown(source)
	if (root.children[0]?.type === 'yaml') {
		throw new ContentError(
			file,
			'case studies take no frontmatter — it lives in index.md',
		)
	}
	if (root.children.length === 0) {
		throw new ContentError(file, 'case study is empty')
	}

	const state: WalkState = { file, source, projectLinks: new Set(), words: 0 }
	transformChildren(root, state, true)
	assignHeadingIds(root.children, file, new Set())

	return {
		tree: toTree(root.children),
		readingMinutes: Math.max(1, Math.round(state.words / WORDS_PER_MINUTE)),
		projectLinks: [...state.projectLinks],
	}
}

/** Compiles one content file, throwing a ContentError (with file:line) on anything outside the format. */
function compileContentFile(
	source: string,
	file: string,
): ProjectContent | CaseStudyContent | undefined {
	const match = CONTENT_FILE.exec(file.replaceAll('\\', '/'))
	if (match == null) {
		return undefined
	}
	const slug = basename(dirname(file))
	return match[2] === 'index'
		? compileProject(source, file, slug)
		: compileCaseStudy(source, file)
}

function projectContent(): Plugin {
	return {
		name: 'project-content',
		enforce: 'pre',
		transform(source, id) {
			// Leave query imports (?raw, ?url, ...) to Vite; only the plain
			// module — or its HMR re-request, ?t=<timestamp> — is compiled.
			const [path, query = ''] = id.split('?')
			if (query !== '' && !/^t=\d+$/.test(query)) {
				return null
			}
			const compiled = compileContentFile(source, path)
			if (compiled == null) {
				return null
			}
			return {
				code: `export default ${JSON.stringify(compiled)}`,
				map: null,
			}
		},
	}
}

export {
	compileContentFile,
	ContentError,
	parseMarkdown,
	plainText,
	projectContent,
}
