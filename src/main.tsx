import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { NotFound } from './components/NotFound.tsx'
import reportWebVitals from './reportWebVitals.ts'
import '@fontsource-variable/inter'
import './styles.css'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProviderContext,
	},
	defaultPreload: 'intent',
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
	defaultNotFoundComponent: NotFound,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// Linen is the only accent theme now that the picker is gone. Clear any
// value a visit from before that removal left in localStorage so
// ThemeProvider can't pick a stale theme back up. Storage can throw (private
// browsing, sandboxed iframes, etc.), and this runs before anything can
// catch it, so it must not take the whole app down with it.
try {
	localStorage.removeItem('color-theme')
} catch {
	// Storage unavailable — nothing to clean up.
}

// @abumble/design-system's ThemeProvider falls back to 'dark' when no
// 'theme' key is stored yet — there's no prop to override that default from
// here. Seeding 'light' for first-time visitors (before ThemeProvider's
// first read) gets the default we want without touching a return visitor's
// explicit choice, dark or light.
try {
	if (localStorage.getItem('theme') == null) {
		localStorage.setItem('theme', 'light')
	}
} catch {
	// Storage unavailable — ThemeProvider falls back to its own default.
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
				<RouterProvider router={router} />
			</TanStackQueryProvider.Provider>
		</StrictMode>,
	)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
