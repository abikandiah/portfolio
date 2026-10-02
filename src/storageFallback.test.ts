import { afterEach, describe, expect, it } from 'vitest'
import { installStorageFallback } from '@/storageFallback'

describe('installStorageFallback', () => {
	const original = Object.getOwnPropertyDescriptor(window, 'localStorage')

	afterEach(() => {
		if (original != null) {
			Object.defineProperty(window, 'localStorage', original)
		}
	})

	it('leaves working storage alone', () => {
		const before = window.localStorage
		installStorageFallback()
		expect(window.localStorage).toBe(before)
	})

	it('swaps in memory storage when access throws', () => {
		Object.defineProperty(window, 'localStorage', {
			configurable: true,
			get() {
				throw new DOMException('blocked', 'SecurityError')
			},
		})

		installStorageFallback()

		window.localStorage.setItem('theme', 'light')
		expect(window.localStorage.getItem('theme')).toBe('light')
		expect(window.localStorage.getItem('missing')).toBeNull()
		expect(window.localStorage.length).toBe(1)
	})
})
