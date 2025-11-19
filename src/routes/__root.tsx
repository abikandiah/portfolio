import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { config } from '@/config';
import { UnderConstruction } from '@abumble/design-system/components/UnderConstruction';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

// GLOBALS

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root
});

function Root() {

	if (!config.constructionDisabled) {
		return (
			<div className="flex flex-col h-full">
				<div className='flex flex-grow justify-center'>
					<UnderConstruction />
				</div>

				<Footer showLinks={false} />
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full">
			<Header />

			<main className="w-full mt-10 px-3">
				<Outlet />
			</main>

			<Footer />
		</div>
	)
}

