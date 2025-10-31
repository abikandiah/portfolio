import Footer from '@/components/Footer'
import Header from '@/components/Header'
import UnderConstruction from '@/components/UnderConstruction'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

// GLOBALS
const CONSTRUCTION = false;



interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root
});

function Root() {

	if (CONSTRUCTION) {
		return (
			<div className="flex flex-col h-full">
				<div className='flex flex-grow justify-center'>
					<UnderConstruction />
				</div>

				<Footer />
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full mx-auto max-w-screen-xl">
			<Header />

			<main className="w-full mt-10">
				<Outlet />
			</main>

			<Footer />
		</div>
	)
}

