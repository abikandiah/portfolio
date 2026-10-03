import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compileContentFile } from '../../plugins/project-content'
import { lintWriteUp } from '../../plugins/write-up-lint'
import { findDraftReferences } from './draftReferences'

const CONTENT_DIR = resolve(__dirname, 'projects')
const FILE = '/repo/src/content/projects/demo-project/index.md'

const FRONTMATTER = `---
name: Demo Project
type: Work
startYear: 2020
endYear: present
description: A demo project.
tech: [Java, React]
---
`

function compile(body: string, frontmatter = FRONTMATTER) {
	return compileContentFile(`${frontmatter}\n${body}`, FILE)
}

describe('write-up format', () => {
	it('splits sections at ## and anchors ### sub-headings', () => {
		const result = compile(
			'## Overview\n\nText.\n\n## Deep Dive\n\n### A Part\n\nMore.',
		)
		expect(result).toMatchObject({
			slug: 'demo-project',
			meta: {
				name: 'Demo Project',
				endYear: undefined,
				tech: ['Java', 'React'],
			},
			sections: [
				{ title: 'Overview', headings: [] },
				{ title: 'Deep Dive', headings: [{ title: 'A Part', id: 'a-part' }] },
			],
		})
	})

	it('compiles each block type to its element', () => {
		const result = compile(
			[
				'## Overview',
				':::terms\n\n- **Term**: Definition.\n\n:::',
				':::steps\n\n1. First.\n2. Second.\n\n:::',
				':::note[Title]\n\nAside.\n\n:::',
				'::redacted{lines=2}',
				'```mermaid Caption\nflowchart LR\n  A --> B\n```',
			].join('\n\n'),
		)
		const json = JSON.stringify(result)
		for (const tag of [
			'dl',
			'dt',
			'dd',
			'steps',
			'banner',
			'redacted',
			'diagram',
		]) {
			expect(json).toContain(`"tagName":"${tag}"`)
		}
	})

	it('keeps ordinary colons in prose as text', () => {
		const json = JSON.stringify(compile('## Overview\n\nA 3:1 ratio.'))
		expect(json).toContain(':1')
	})

	it.each([
		[
			'content before the first section',
			'Intro.\n\n## Overview\n\nText.',
			/must start with a "## Section"/,
		],
		['#### headings', '## Overview\n\n#### Deep\n\nText.', /"####" headings/],
		[
			'unknown blocks',
			'## Overview\n\n:::warning\n\nText.\n\n:::',
			/unknown block ":::warning"/,
		],
		[
			'malformed terms',
			'## Overview\n\n:::terms\n\n- Term - definition\n\n:::',
			/\*\*Term\*\*: definition/,
		],
		[
			'relative links',
			'## Overview\n\nSee [this](../other).',
			/must be an http\(s\) or mailto: URL, or a project link/,
		],
		[
			'raw HTML',
			'## Overview\n\n<div>Hi</div>',
			/"html" isn't part of the write-up format/,
		],
		[
			'duplicate anchors',
			'## Overview\n\n### Overview\n\nText.',
			/share the anchor "overview"/,
		],
		// Regression: these used to compile with no anchor, no TOC entry and
		// no duplicate check.
		[
			'### inside a banner',
			'## Overview\n\n:::note\n\n### Inside\n\nText.\n\n:::',
			/belong directly in a section/,
		],
		[
			'### inside a list item',
			'## Overview\n\n- ### Inside',
			/belong directly in a section/,
		],
		// Regression: used to render raw checkboxes.
		['task lists', '## Overview\n\n- [ ] Todo', /task lists/],
	])('rejects %s', (_, body, message) => {
		expect(() => compile(body)).toThrow(message)
	})

	// Regression: the ## title was read before text directives were
	// restored, turning "3:1" into "3".
	it('keeps colons in ## titles and their anchors', () => {
		const result = compile('## Ratio 3:1 split\n\nText.')
		expect(result).toMatchObject({
			sections: [{ title: 'Ratio 3:1 split' }],
		})
	})

	// Regression: a definition had to start with plain text.
	it.each([
		['inline code', '- **Term**: `Option` does x.'],
		['a link', '- **Term**: [Docs](https://example.com) explain it.'],
		['emphasis', '- **Term**: *Mostly* plain.'],
	])('accepts a :::terms definition that starts with %s', (_, item) => {
		const json = JSON.stringify(
			compile(`## Overview\n\n:::terms\n\n${item}\n\n:::`),
		)
		expect(json).toContain('"tagName":"dd"')
	})

	it('still rejects a :::terms item with nothing after the colon', () => {
		expect(() =>
			compile('## Overview\n\n:::terms\n\n- **Term**:\n\n:::'),
		).toThrow(/\*\*Term\*\*: definition/)
	})

	// Regression: a bare email autolinks to mailto:, which failed the build.
	it('accepts email addresses and mailto: links', () => {
		const json = JSON.stringify(
			compile(
				'## Overview\n\nWrite to me@example.com or [email](mailto:me@example.com).',
			),
		)
		expect(json).toContain('"href":"mailto:me@example.com"')
	})

	it("keeps a numbered :::steps list's start", () => {
		const json = JSON.stringify(
			compile('## Overview\n\n:::steps\n\n3. Third.\n4. Fourth.\n\n:::'),
		)
		expect(json).toContain('"start":3')
	})

	it('rejects unknown tech and a folder that does not match the name', () => {
		expect(() =>
			compile(
				'## Overview\n\nText.',
				FRONTMATTER.replace('[Java, React]', '[Rust]'),
			),
		).toThrow(/unknown tech "Rust"/)
		expect(() =>
			compile(
				'## Overview\n\nText.',
				FRONTMATTER.replace('Demo Project', 'Renamed'),
			),
		).toThrow(/belongs in "renamed\/"/)
	})
})

// Regression: drafts are dropped only from production builds, so a link to
// one worked in dev and tests but 404'd on the live site.
describe('draft references', () => {
	const project = (
		slug: string,
		draft: boolean,
		references: Array<string> = [],
	) => ({
		slug,
		draft,
		references,
	})

	it('flags a published project pointing at a draft', () => {
		expect(
			findDraftReferences([
				project('published', false, ['upcoming']),
				project('upcoming', true),
			]),
		).toEqual([expect.stringContaining('published: points at "upcoming"')])
	})

	it('lets drafts point anywhere, and published projects at each other', () => {
		expect(
			findDraftReferences([
				project('published', false, ['other']),
				project('other', false, ['published']),
				project('upcoming', true, ['published', 'other-draft']),
				project('other-draft', true),
			]),
		).toEqual([])
	})
})

describe('write-up lint', () => {
	it('flags code-level detail and adjacent banners', () => {
		const issues = lintWriteUp(
			`${FRONTMATTER}\n## Overview\n\nThe userId is sent to GET /api/users and returns 422 Unprocessable Entity.\n\n:::info\n\nOne.\n\n:::\n\n:::note\n\nTwo.\n\n:::\n`,
			FILE,
		)
		const messages = issues.map((issue) => issue.message).join('\n')
		expect(messages).toMatch(/camelCase identifier/)
		expect(messages).toMatch(/HTTP endpoint/)
		expect(messages).toMatch(/HTTP status code/)
		expect(messages).toMatch(/two banners in a row/)
	})

	it('errors on names from the do-not-name list', () => {
		const issues = lintWriteUp(
			`${FRONTMATTER}\n## Overview\n\nBuilt at Acme Corp.\n`,
			FILE,
			{
				forbid: ['Acme Corp'],
			},
		)
		expect(issues).toContainEqual(expect.objectContaining({ level: 'error' }))
	})

	it('matches do-not-name entries that start or end with punctuation', () => {
		const issues = lintWriteUp(
			`${FRONTMATTER}\n## Overview\n\nWritten in C++ and .NET.\n`,
			FILE,
			{ forbid: ['C++', '.NET'] },
		)
		expect(issues.filter((issue) => issue.level === 'error')).toHaveLength(2)
	})

	it('flags first person in a Work write-up, including contractions', () => {
		for (const sentence of [
			'I built it.',
			'Then I’ll explain.',
			"I'll explain.",
		]) {
			const issues = lintWriteUp(
				`${FRONTMATTER}\n## Overview\n\n${sentence}\n`,
				FILE,
			)
			expect(issues.map((issue) => issue.message).join('\n'), sentence).toMatch(
				/first person singular/,
			)
		}
	})

	// The migrated write-ups are the skill's examples, so they must stay
	// inside the format — and free of errors under the lint they teach.
	it.each(readdirSync(CONTENT_DIR))(
		'%s compiles and lints without errors',
		(slug) => {
			for (const name of ['index.md', 'case-study.md']) {
				const file = join(CONTENT_DIR, slug, name)
				let source: string
				try {
					source = readFileSync(file, 'utf8')
				} catch {
					continue
				}
				const errors = lintWriteUp(source, file).filter(
					(issue) => issue.level === 'error',
				)
				expect(errors).toEqual([])
			}
		},
	)
})
