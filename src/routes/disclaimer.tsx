import { PageDescription, PageHeader } from '@/components/ui';
import { UnorderedList } from '@abumble/design-system/components/List';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/disclaimer')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Disclaimer />
	);
}

function Disclaimer() {
	return (
		<div className='space-y-4 m-5'>
			<section>
				<PageHeader>
					Disclaimer
				</PageHeader>

				<PageDescription className='mt-1'>
					Please read this carefully before reviewing project details.
				</PageDescription>
			</section>

			<DisclaimerBody />

		</div>
	)
}

export function DisclaimerBody() {
	return (
		<section>
			<p className='leading-relaxed'>
				The content within this portfolio, including all designs, images and descriptive text, is intended solely to showcase my product design vision, problem-solving process, and conceptual abilities.
			</p>

			<UnorderedList variant="clear">
				<li>
					<p className='leading-relaxed'>
						<span className='font-semibold'>Conceptual Focus Only</span>: The project overviews represent high-level, abstract design concepts. They focus primarily on the systems and models involved and do not represent actual implementations.
					</p>
				</li>
				<li>
					<p className='leading-relaxed'>

						<span className='font-semibold'>Not Representative of Final Product</span>: These presentations are not representative of actual, implemented, or released products. They intentionally omit crucial, proprietary implementation details related to technical architecture, specific algorithms, engineering challenges, financial modeling, or detailed market data.
					</p>
				</li>
				<li>
					<p className='leading-relaxed'>
						<span className='font-semibold'>IP Protection</span>: For the purpose of Intellectual Property (IP) protection, confidential details, proprietary methods, and specific business intelligence have been deliberately excluded or abstracted. Any resemblance to a final product or internal company data is coincidental and not an endorsement of actual implementation.
					</p>
				</li>
			</UnorderedList>

			<p className='leading-relaxed'>
				The information presented is for hiring and educational evaluation purposes only.
			</p>
		</section>
	)
}
