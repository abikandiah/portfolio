import { ConstructionLanding } from '@/components/UnderConstruction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playground')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<ConstructionLanding />
	)

	return (
		<div className="flex flex-col center-page mt-12">
			<div className="card">
				<section className="p-text space-y-4">
				</section>
			</div>
		</div>
	)
}
