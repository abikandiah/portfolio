import { UnderConstruction } from '@abumble/design-system/components/UnderConstruction'
import { ThemeProvider } from '@abumble/design-system/themes'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { config } from '@/config'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

// GLOBALS

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root,
})

function Root() {
	if (!config.constructionDisabled) {
		return (
			<div className="flex flex-col h-full">
				<div className="flex grow justify-center">
					<UnderConstruction />
				</div>

				<Footer showLinks={false} />
			</div>
		)
	}

	return (
		<ThemeProvider defaultColorTheme="steel">
			<div className="flex flex-col h-full">
				<Header />

				<main className="w-full px-3 mt-14">
					<Outlet />
				</main>

				<Footer />
			</div>
		</ThemeProvider>
	)
}
