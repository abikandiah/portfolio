import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Diagram } from '@/components/projects/content/Diagram'

const mermaid = vi.hoisted(() => ({
	initialize: vi.fn(),
	render: vi.fn(),
}))

vi.mock('mermaid', () => ({ default: mermaid }))

function setDark(dark: boolean) {
	act(() => {
		document.documentElement.classList.toggle('dark', dark)
	})
}

describe('Diagram', () => {
	afterEach(() => {
		vi.clearAllMocks()
		document.documentElement.classList.remove('dark')
	})

	// Regression: a theme change dropped back to the loading placeholder
	// (a flash and a layout jump) until the re-render landed.
	it('keeps the current drawing on screen while a theme change re-renders', async () => {
		mermaid.render.mockResolvedValueOnce({
			svg: '<svg data-theme="light"></svg>',
		})
		const { container } = render(<Diagram code="flowchart LR" caption="Flow" />)
		await waitFor(() =>
			expect(container.querySelector('svg[data-theme="light"]')).not.toBeNull(),
		)

		let finishDark: (value: { svg: string }) => void = () => {}
		mermaid.render.mockReturnValueOnce(
			new Promise((resolve) => {
				finishDark = resolve
			}),
		)
		setDark(true)

		// Mid re-render: still the old drawing, never the placeholder.
		await waitFor(() => expect(mermaid.render).toHaveBeenCalledTimes(2))
		expect(container.querySelector('svg[data-theme="light"]')).not.toBeNull()

		act(() => {
			finishDark({ svg: '<svg data-theme="dark"></svg>' })
		})
		await waitFor(() =>
			expect(container.querySelector('svg[data-theme="dark"]')).not.toBeNull(),
		)
		expect(mermaid.initialize).toHaveBeenLastCalledWith(
			expect.objectContaining({ theme: 'dark', suppressErrorRendering: true }),
		)
	})

	it('falls back to the source on a syntax error, and recovers with new code', async () => {
		mermaid.render.mockRejectedValueOnce(new Error('Parse error'))
		const { container, rerender } = render(<Diagram code="not mermaid" />)
		await waitFor(() => expect(screen.getByText('not mermaid')).toBeTruthy())

		mermaid.render.mockResolvedValueOnce({ svg: '<svg data-ok="true"></svg>' })
		rerender(<Diagram code="flowchart LR" />)
		await waitFor(() =>
			expect(container.querySelector('svg[data-ok="true"]')).not.toBeNull(),
		)
	})
})
