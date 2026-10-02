import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col center-page mt-8">
			<Outlet />
		</div>
	)
}
