import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FloatingBackToTop, PAGE_TOP_ID } from '@/components/projects/BackToTop'

function scrollTo(y: number) {
	act(() => {
		Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
		window.dispatchEvent(new Event('scroll'))
	})
}

describe('back to top', () => {
	beforeEach(() => {
		// Run the per-frame scroll check immediately.
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
			callback(0)
			return 0
		})
		window.matchMedia = vi.fn().mockReturnValue({ matches: false })
		window.scrollTo = vi.fn()
		Object.defineProperty(window, 'innerHeight', {
			value: 800,
			configurable: true,
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
		scrollTo(0)
	})

	it('shows the floating button only once scrolled down, without a title', () => {
		render(<FloatingBackToTop />)
		const button = screen.getByLabelText('Back to top', { selector: 'button' })

		expect(button.getAttribute('aria-hidden')).toBe('true')
		expect(button.tabIndex).toBe(-1)

		scrollTo(1200)
		expect(button.getAttribute('aria-hidden')).toBe('false')
		expect(button.tabIndex).toBe(0)

		scrollTo(100)
		expect(button.getAttribute('aria-hidden')).toBe('true')
	})

	it('appears once the title has scrolled out of view', () => {
		render(
			<>
				<h1 id={PAGE_TOP_ID} tabIndex={-1}>
					Title
				</h1>
				<FloatingBackToTop />
			</>,
		)
		const title = document.getElementById(PAGE_TOP_ID)!
		const link = screen.getByRole('button', { hidden: true })
		expect(link.getAttribute('aria-hidden')).toBe('true')
		expect(link.tabIndex).toBe(-1)

		vi.spyOn(title, 'getBoundingClientRect').mockReturnValue({
			bottom: -10,
		} as DOMRect)
		scrollTo(300)
		expect(link.getAttribute('aria-hidden')).toBe('false')
		expect(link.tabIndex).toBe(0)
	})

	it('scrolls to the top and moves focus to the title', () => {
		render(
			<>
				<h1 id={PAGE_TOP_ID} tabIndex={-1}>
					Title
				</h1>
				<FloatingBackToTop />
			</>,
		)

		fireEvent.click(screen.getByRole('button', { hidden: true }))

		expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
		expect(document.activeElement?.id).toBe(PAGE_TOP_ID)
	})
})
