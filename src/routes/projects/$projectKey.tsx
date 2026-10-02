import { Separator } from '@abumble/design-system/components/Separator'
import { cn } from '@abumble/design-system/utils'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import type {
	Project,
	ProjectSection,
	TProjectView,
} from '@/types/ProjectTypes'
import type { TocEntry } from '@/components/projects/TableOfContents'
import { projectView } from '@/types/ProjectTypes'
import { CaseStudyBody } from '@/components/projects/CaseStudyBody'
import { Section } from '@/components/projects/Section'
import { TableOfContents } from '@/components/projects/TableOfContents'
import { ViewToggle } from '@/components/projects/ViewToggle'
import { ProjectsDisclaimer } from '@/components/projects/ProjectsDisclaimer'
import { NotFound } from '@/components/NotFound'
import { PageDescription, PageHeader, TextLink } from '@/components/ui'
import { BadgeContainer, TechBadge } from '@/components/ui/badge'
import { projects, projectsMap } from '@/constants/project'

// Below this many sections, a sidebar TOC is more furniture than help — the
// page already reads fine at a glance, so it only appears once there's
// enough structure to actually get lost in.
const MIN_SECTIONS_FOR_TOC = 4

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

	const tocEntries: Array<TocEntry> = (proj.sections ?? []).flatMap(
		(section) =>
			section.title != null && section.pathname != null
				? [{ title: section.title, pathname: section.pathname }]
				: [],
	)
	const showToc =
		activeView === projectView.Engineering &&
		tocEntries.length >= MIN_SECTIONS_FOR_TOC

	function onSelectView(view: TProjectView) {
		navigate({ search: { view }, replace: true })
	}

	return (
		<ProjectContainer className="space-y-8">
			<div className="space-y-4">
				<ProjectsDisclaimer />
				<BackToProjectsLink />
			</div>

			<header className="space-y-5 border-b pb-6">
				<ProjectHeader proj={proj} />

				<ViewToggle
					hasCaseStudy={hasCaseStudy}
					hasEngineering={hasEngineering}
					activeView={activeView}
					onSelect={onSelectView}
				/>
			</header>

			{/* The TOC hangs in the right margin rather than taking a column, so
			    the reading column keeps the same width and position whether or
			    not it's shown — switching views never shifts the page. */}
			<div className="relative">
				{!hasCaseStudy && !hasEngineering ? (
					<p className="text-sm text-muted-foreground">
						No write-up for this project yet — check back soon.
					</p>
				) : activeView === projectView.CaseStudy && proj.caseStudy != null ? (
					<CaseStudyBody caseStudy={proj.caseStudy} />
				) : (
					<EngineeringBody sections={proj.sections ?? []} />
				)}

				{showToc && (
					<TableOfContents
						entries={tocEntries}
						className="absolute top-0 left-full ml-8 h-full w-52"
					/>
				)}
			</div>

			<ProjectFooterNav current={proj} className="border-t pt-6" />
		</ProjectContainer>
	)
}

function ProjectFooterNav({
	current,
	className,
}: {
	current: Project
	className?: string
}) {
	const index = projects.findIndex((p) => p.pathname === current.pathname)
	const prev = index > 0 ? projects[index - 1] : undefined
	const next =
		index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined

	if (prev == null && next == null) {
		return null
	}

	return (
		<nav
			aria-label="More projects"
			className={cn('grid grid-cols-2 gap-4', className)}
		>
			<ProjectNavLink project={prev} direction="prev" />
			<ProjectNavLink project={next} direction="next" />
		</nav>
	)
}

function ProjectNavLink({
	project,
	direction,
}: {
	project?: Project
	direction: 'prev' | 'next'
}) {
	if (project == null) {
		return <span />
	}

	const isNext = direction === 'next'

	return (
		<TextLink
			to="/projects/$projectKey"
			params={{ projectKey: project.pathname }}
			className={cn('flex flex-col gap-1', isNext && 'items-end text-right')}
		>
			<span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
				{isNext ? 'Next' : 'Previous'}
			</span>

			<span
				className={cn(
					'inline-flex items-center gap-1',
					isNext && 'flex-row-reverse',
				)}
			>
				{isNext ? (
					<ChevronRight className="h-4 w-4 shrink-0" />
				) : (
					<ChevronLeft className="h-4 w-4 shrink-0" />
				)}
				<span>{project.name}</span>
			</span>
		</TextLink>
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
		<div className={cn('mx-auto w-full max-w-2xl', className)} {...props} />
	)
}

function ProjectHeader({ proj }: { proj: Project }) {
	return (
		<div>
			<PageHeader>{proj.name}</PageHeader>

			<PageDescription size="sm" className="mt-2">
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
		<Section
			title={section.title}
			id={section.pathname}
			className="p-text space-y-4"
			headingClassName="mb-1"
		>
			<section.body />
		</Section>
	)
}
