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

			<main className="w-full">
				<LandscapeContainer />
				<Outlet />
			</main>

			<Footer />
		</div>
	)
})

function LandscapeContainer() {
	return (
		<div className="image-background">
			{/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"></div> */}
		</div>
	);
}

