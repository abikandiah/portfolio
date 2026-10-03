import type { ComponentType } from 'react'

function CaseStudyBody({ caseStudy: CaseStudy }: { caseStudy: ComponentType }) {
	return (
		<section className="write-up p-text space-y-4">
			<CaseStudy />
		</section>
	)
}

export { CaseStudyBody }
