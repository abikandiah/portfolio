import { UnderConstruction } from '@abumble/design-system/components/UnderConstruction'
import { ThemeProvider } from '@abumble/design-system/themes'
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
	useLocation,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { config } from '@/config'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { pageTitle } from '@/lib/pageTitle'

// GLOBALS

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	// Child routes override this with their own page's title. A 404 is
	// shown by whichever matched route the router flags `_notFound` on (the
	// root for /nope, /projects for /projects/a/b, …). The flag is internal
	// and untyped, so it's read defensively: if a router upgrade drops it,
	// 404 tabs just fall back to the plain site title.
	head: ({ matches }) => ({
		meta: [
			{
				title: matches.some(isNotFoundMatch)
					? pageTitle('Not Found')
					: pageTitle(),
			},
		],
	}),
	component: Root,
})

function isNotFoundMatch(match: object): boolean {
	return '_notFound' in match && match._notFound === true
}

function Root() {
	const { pathname } = useLocation()
	const isHome = pathname === '/'

	if (!config.constructionDisabled) {
		return (
			<div className="flex flex-col h-full">
				<HeadContent />
				<div className="flex grow justify-center">
					<UnderConstruction />
				</div>

				<Footer showLinks={false} />
			</div>
		)
	}

	return (
		<ThemeProvider defaultColorTheme="linen">
			<HeadContent />
			<div className="flex flex-col h-full">
				<Header />

				<main className="w-full px-3 mt-14">
					<Outlet />
				</main>

				<Footer showSocials={!isHome} />
			</div>
		</ThemeProvider>
	)
}
