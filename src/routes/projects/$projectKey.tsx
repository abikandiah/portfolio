import { Card } from '@abumble/design-system/components/Card'
import { Separator } from '@abumble/design-system/components/Separator'
import { cn } from '@abumble/design-system/utils'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import type {
	Project,
	ProjectSection,
	TProjectView,
} from '@/types/ProjectTypes'
import { projectView } from '@/types/ProjectTypes'
import { CaseStudyBody } from '@/components/projects/CaseStudyBody'
import { ViewToggle } from '@/components/projects/ViewToggle'
import { NotFound } from '@/components/NotFound'
import { PageDescription, PageHeader, TextLink } from '@/components/ui'
import { BadgeContainer, TechBadge } from '@/components/ui/badge'
import { projectsMap } from '@/constants/project'

interface ProjectSearch {
	view?: TProjectView
}

export const Route = createFileRoute('/projects/$projectKey')({
	validateSearch: (search: Record<string, unknown>): ProjectSearch => {
		if (
			search.view === projectView.CaseStudy ||
			search.view === projectView.Engineering
		) {
			return { view: search.view }
		}
		return {}
	},
	component: RouteComponent,
})

function resolveView(
	requested: TProjectView | undefined,
	hasCaseStudy: boolean,
	hasEngineering: boolean,
): TProjectView {
	if (requested === projectView.CaseStudy && hasCaseStudy) {
		return projectView.CaseStudy
	}
	if (requested === projectView.Engineering && hasEngineering) {
		return projectView.Engineering
	}
	return hasCaseStudy ? projectView.CaseStudy : projectView.Engineering
}

function RouteComponent() {
	const { projectKey } = Route.useParams()
	const { view: requestedView } = Route.useSearch()
	const navigate = Route.useNavigate()
	const proj = projectsMap.get(projectKey)

	if (proj == null) {
		return <NotFound />
	}

	const hasCaseStudy = proj.caseStudy != null
	const hasEngineering = proj.sections != null && proj.sections.length > 0
	const activeView = resolveView(requestedView, hasCaseStudy, hasEngineering)

	function onSelectView(view: TProjectView) {
		navigate({ search: { view }, replace: true })
	}

	return (
		<ProjectContainer className="space-y-4 mt-4">
			<BackToProjectsLink className="px-3" />

			<Card>
				<section className="space-y-4">
					<ProjectHeader proj={proj} />

					<ViewToggle
						hasCaseStudy={hasCaseStudy}
						hasEngineering={hasEngineering}
						activeView={activeView}
						onSelect={onSelectView}
					/>
				</section>

				{!hasCaseStudy && !hasEngineering ? (
					<p className="text-sm text-muted-foreground">
						No write-up for this project yet — check back soon.
					</p>
				) : activeView === projectView.CaseStudy && proj.caseStudy != null ? (
					<CaseStudyBody caseStudy={proj.caseStudy} />
				) : (
					<EngineeringBody sections={proj.sections ?? []} />
				)}

				<BackToProjectsLink className="border-t pt-4" />
			</Card>
		</ProjectContainer>
	)
}

function BackToProjectsLink({ className }: { className?: string }) {
	return (
		<TextLink
			to="/projects"
			className={cn('inline-flex items-center gap-1 text-sm', className)}
		>
			<ChevronLeft className="h-4 w-4" />
			All Projects
		</TextLink>
	)
}

function ProjectContainer({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div className={cn('mx-auto w-full max-w-3xl', className)} {...props} />
	)
}

function ProjectHeader({ proj }: { proj: Project }) {
	return (
		<div>
			<PageHeader size="sm">{proj.name}</PageHeader>

			<PageDescription size="sm" className="mt-1">
				{proj.description}
			</PageDescription>

			{proj.url != null && (
				<a
					href={proj.url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-link mt-2 inline-block text-sm"
				>
					{new URL(proj.url).hostname} ↗
				</a>
			)}

			<BadgeContainer className="mt-4">
				{proj.tech.map((tech) => (
					<TechBadge key={tech} value={tech} />
				))}
			</BadgeContainer>
		</div>
	)
}

function EngineeringBody({ sections }: { sections: Array<ProjectSection> }) {
	return (
		<div className="flex flex-col gap-6">
			{sections.map((section, index) => (
				<Fragment key={index}>
					{index > 0 && <Separator />}
					<ProjectBodySection section={section} />
				</Fragment>
			))}
		</div>
	)
}

function ProjectBodySection({ section }: { section: ProjectSection }) {
	return (
		<section className="p-text space-y-4">
			{section.title && (
				<h2
					id={section.pathname}
					className="font-semibold text-lg text-foreground mb-1"
				>
					{section.title}
				</h2>
			)}

			<section.body />
		</section>
	)
}
