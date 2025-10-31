import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<ProjectsView />
	)
}

function ProjectsView() {
	return (
		<section className="mt-8 space-y-2">
			<Outlet />
		</section>
	)
}
