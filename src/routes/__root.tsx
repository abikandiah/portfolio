import Footer from '@/components/Footer'
import Header from '@/components/Header'
import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<div className="flex flex-col h-full mx-auto max-w-screen-xl gap-8">
			<Header />
			
			<main className="w-full profile-background water-themse">
				<Outlet />
			</main>

			<Footer />
		</div>
	)
})
