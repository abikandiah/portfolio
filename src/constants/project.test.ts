import { afterEach, describe, expect, it, vi } from 'vitest'

// The registry logs (rather than throws) on bad project names and section
// titles so one mistake can't blank the live site — this is what turns
// those logs into a failure before deploy.
describe('project registry', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('registers every project and section without slug errors', async () => {
		const consoleError = vi.spyOn(console, 'error')
		vi.resetModules()

		const { projects } = await import('@/constants/project')

		expect(consoleError).not.toHaveBeenCalled()
		expect(projects.length).toBeGreaterThan(0)
	})

	it('gives every project a unique URL and every titled section an anchor', async () => {
		const { projects } = await import('@/constants/project')

		const pathnames = projects.map((proj) => proj.pathname)
		expect(new Set(pathnames).size).toBe(pathnames.length)
		expect(pathnames).not.toContain('')

		for (const proj of projects) {
			for (const section of proj.sections ?? []) {
				if (section.title != null) {
					expect(section.pathname, `${proj.name}: "${section.title}"`).toMatch(
						/^[a-z0-9]+(-[a-z0-9]+)*$/,
					)
				}
			}
		}
	})
})
