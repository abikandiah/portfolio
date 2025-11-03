import { Goals } from '@/components/projects/WebPortfolio'
import UnderConstruction from '@/components/UnderConstruction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='relative top-100'>
			<UnderConstruction />
		</div>

	)

	return (
		<div className="flex flex-col center-page mt-12">
			<div className="card">
				<section className="p-text space-y-4">
					<Goals />
				</section>
			</div>
		</div>
	)
}
