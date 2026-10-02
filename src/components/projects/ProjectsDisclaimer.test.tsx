import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProjectsDisclaimer } from '@/components/projects/ProjectsDisclaimer'

// TextLink is a router <Link>; stub it so the banner renders without a
// router instance.
vi.mock('@/components/ui', () => ({
	TextLink: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}))

describe('ProjectsDisclaimer', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('still renders when storage access throws', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new DOMException('blocked', 'SecurityError')
		})

		render(<ProjectsDisclaimer />)

		expect(screen.getByText('Portfolio Disclaimer')).toBeTruthy()
	})
})
