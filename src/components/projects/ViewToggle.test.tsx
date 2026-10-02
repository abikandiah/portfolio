import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import type { TProjectView } from '@/types/ProjectTypes'
import { VIEW_PANEL_ID, ViewToggle } from '@/components/projects/ViewToggle'
import { projectView } from '@/types/ProjectTypes'

const BOTH = [projectView.CaseStudy, projectView.Engineering]

function Harness({ views = BOTH }: { views?: Array<TProjectView> }) {
	const [active, setActive] = useState<TProjectView>(views[0])
	return (
		<ViewToggle
			availableViews={views}
			activeView={active}
			onSelect={setActive}
		/>
	)
}

describe('ViewToggle', () => {
	it('renders nothing when there is only one view', () => {
		const { container } = render(<Harness views={[projectView.Engineering]} />)
		expect(container.innerHTML).toBe('')
	})

	it('wires tabs to the panel with a roving tabindex', () => {
		render(<Harness />)
		const [caseStudy, design] = screen.getAllByRole('tab')

		expect(caseStudy.getAttribute('aria-selected')).toBe('true')
		expect(caseStudy.getAttribute('tabindex')).toBe('0')
		expect(design.getAttribute('aria-selected')).toBe('false')
		expect(design.getAttribute('tabindex')).toBe('-1')
		for (const tab of [caseStudy, design]) {
			expect(tab.getAttribute('aria-controls')).toBe(VIEW_PANEL_ID)
		}
	})

	it('moves selection and focus with arrow, Home, and End keys', () => {
		render(<Harness />)
		const [caseStudy, design] = screen.getAllByRole('tab')
		caseStudy.focus()

		fireEvent.keyDown(caseStudy, { key: 'ArrowRight' })
		expect(design.getAttribute('aria-selected')).toBe('true')
		expect(document.activeElement).toBe(design)

		// Wraps around at the end.
		fireEvent.keyDown(design, { key: 'ArrowRight' })
		expect(caseStudy.getAttribute('aria-selected')).toBe('true')
		expect(document.activeElement).toBe(caseStudy)

		fireEvent.keyDown(caseStudy, { key: 'End' })
		expect(document.activeElement).toBe(design)

		fireEvent.keyDown(design, { key: 'Home' })
		expect(document.activeElement).toBe(caseStudy)

		fireEvent.keyDown(caseStudy, { key: 'ArrowLeft' })
		expect(document.activeElement).toBe(design)
	})
})
