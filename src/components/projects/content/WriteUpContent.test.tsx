import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { compileContentFile } from '../../../../plugins/project-content'
import type { Root } from 'hast'
import { WriteUpContent } from '@/components/projects/content/WriteUpContent'

const FILE = '/repo/src/content/projects/demo-project/index.md'

// Renders one section of a write-up, compiled exactly as the build does.
function renderSection(body: string) {
	const compiled = compileContentFile(
		`---\nname: Demo Project\ntype: Work\nstartYear: 2020\nendYear: present\ndescription: A demo.\ntech: [Java]\n---\n\n## Overview\n\n${body}`,
		FILE,
	)
	if (compiled == null || !('sections' in compiled)) {
		throw new Error('expected a project')
	}
	const tree: Root = compiled.sections[0].tree
	return render(<WriteUpContent tree={tree} />)
}

describe('WriteUpContent', () => {
	it('opens web links in a new tab but mail links in place', () => {
		renderSection(
			'See [the docs](https://example.com) or [email](mailto:me@example.com).',
		)
		expect(screen.getByText('the docs').getAttribute('target')).toBe('_blank')
		expect(screen.getByText('email').getAttribute('target')).toBeNull()
	})

	// Regression: the copy-link label fell back to the slug whenever the
	// heading wasn't a single string.
	it('labels a sub-heading anchor with its full text', () => {
		renderSection('### The `Set Matter` operation\n\nText.')
		expect(
			screen.getByLabelText('Copy link to The Set Matter operation section'),
		).toBeTruthy()
	})

	// Regression: the CSS counter always started at 1.
	it('numbers :::steps from the list start', () => {
		const { container } = renderSection(
			':::steps\n\n3. Third.\n4. Fourth.\n\n:::',
		)
		const list = container.querySelector('ol.write-up-steps') as HTMLElement
		expect(list.style.counterReset).toBe('write-up-step 2')
	})

	it('renders banners as notes, not alerts', () => {
		renderSection(':::info\n\nAside.\n\n:::')
		expect(screen.getByRole('note').textContent).toContain('Aside.')
		expect(screen.queryByRole('alert')).toBeNull()
	})
})
