import Footer from '@/components/Footer'
import Header from '@/components/Header'
import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<div className="">
			<Header />
			
			<main className="max-w-screen-xl mx-auto p-8 profile-background">
				<Outlet />
			</main>

			<Footer />
		</div>
	)
})
