import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/goals')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col">

		</div>
	)
}
