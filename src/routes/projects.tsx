import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="mt-8">
			<Outlet />
		</div>
	)
}
