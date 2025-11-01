import { Goals } from '@/components/projects/WebPortfolio'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col center-page mt-12">
			<section className='p-text space-y-4'>
				<Goals />
			</section>
		</div>
	)
}
