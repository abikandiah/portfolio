// With site data blocked (browser privacy settings, some private modes,
// sandboxed iframes), merely reading `window.localStorage` throws. Code we
// don't control reads it unguarded during render — notably
// @abumble/design-system's ThemeProvider — which would take the whole app
// down. Swapping in an in-memory Storage keeps everything working for the
// visit; nothing persists, which is the most a blocked visitor can get.
function installStorageFallback() {
	try {
		const probe = '__storage_probe__'
		window.localStorage.setItem(probe, probe)
		window.localStorage.removeItem(probe)
		return
	} catch {
		// Fall through to the in-memory replacement.
	}

	const data = new Map<string, string>()
	const memoryStorage: Storage = {
		get length() {
			return data.size
		},
		clear: () => data.clear(),
		getItem: (key) => data.get(key) ?? null,
		key: (index) => Array.from(data.keys())[index] ?? null,
		removeItem: (key) => {
			data.delete(key)
		},
		setItem: (key, value) => {
			data.set(key, String(value))
		},
	}

	try {
		Object.defineProperty(window, 'localStorage', {
			configurable: true,
			value: memoryStorage,
		})
	} catch {
		// Not redefinable here — callers' own guards are all that's left.
	}
}

export { installStorageFallback }
