import { Separator } from '@abumble/design-system/components/Separator'
import { cn } from '@abumble/design-system/utils'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import type {
	Project,
	ProjectSection,
	TProjectView,
} from '@/types/ProjectTypes'
import type { TocEntry } from '@/components/projects/TableOfContents'
import { projectView } from '@/types/ProjectTypes'
import {
	BackToTopLink,
	FloatingBackToTop,
	PAGE_TOP_ID,
} from '@/components/projects/BackToTop'
import { CaseStudyBody } from '@/components/projects/CaseStudyBody'
import { Section } from '@/components/projects/Section'
import {
	InlineTableOfContents,
	TableOfContents,
	flattenEntries,
} from '@/components/projects/TableOfContents'
import {
	ALL_VIEWS,
	VIEW_PANEL_ID,
	ViewToggle,
	viewTabId,
} from '@/components/projects/ViewToggle'
import { ProjectsDisclaimer } from '@/components/projects/ProjectsDisclaimer'
import { NotFound } from '@/components/NotFound'
import { PageDescription, PageHeader, TextLink } from '@/components/ui'
import { BadgeContainer, TechBadge } from '@/components/ui/badge'
import { projectsMap } from '@/constants/project'
import { RELATED_PROJECTS_ID } from '@/lib/pageIds'

// Below this many headings (sections and their sub-headings together), a
// TOC is more furniture than help — the page already reads fine at a
// glance, so it only appears once there's enough structure to get lost in.
const MIN_HEADINGS_FOR_TOC = 4

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
	const availableViews = ALL_VIEWS.filter((view) =>
		view === projectView.CaseStudy ? hasCaseStudy : hasEngineering,
	)
	const hasViewTabs = availableViews.length > 1

	const tocEntries: Array<TocEntry> = (proj.sections ?? []).flatMap(
		(section) =>
			section.title != null && section.pathname != null
				? [
						{
							title: section.title,
							pathname: section.pathname,
							children: section.headings.map((heading) => ({
								title: heading.title,
								pathname: heading.id,
							})),
						},
					]
				: [],
	)
	const showToc =
		activeView === projectView.Engineering &&
		flattenEntries(tocEntries).length >= MIN_HEADINGS_FOR_TOC

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
				<ProjectHeader proj={proj} activeView={activeView} />

				<ViewToggle
					availableViews={availableViews}
					activeView={activeView}
					onSelect={onSelectView}
				/>
			</header>

			{/* Keyed so it starts collapsed again after following a link to
			    another project (a related project, or one in the write-up) —
			    the route component is reused across projects, and <details>
			    would otherwise carry its open state over. */}
			{showToc && (
				<InlineTableOfContents key={projectKey} entries={tocEntries} />
			)}

			{/* The TOC hangs in the right margin rather than taking a column, so
			    the reading column keeps the same width and position whether or
			    not it's shown — switching views never shifts the page. */}
			<div className="relative">
				{/* Only a tabpanel when there are tabs to control it. */}
				<div
					{...(hasViewTabs && {
						role: 'tabpanel',
						id: VIEW_PANEL_ID,
						'aria-labelledby': viewTabId(activeView),
						tabIndex: 0,
						className:
							'rounded outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
					})}
				>
					{!hasCaseStudy && !hasEngineering ? (
						<p className="text-sm text-muted-foreground">
							No write-up for this project yet — check back soon.
						</p>
					) : activeView === projectView.CaseStudy && proj.caseStudy != null ? (
						<CaseStudyBody caseStudy={proj.caseStudy} />
					) : (
						<EngineeringBody sections={proj.sections ?? []} />
					)}
				</div>

				{showToc && (
					<TableOfContents
						entries={tocEntries}
						className="absolute top-0 left-full ml-8 h-full w-52"
					/>
				)}
			</div>

			<RelatedProjects proj={proj} />

			{/* The way on from the end of a write-up: back to the list, or back
			    up the page. */}
			<nav
				aria-label="Page"
				className="flex items-center justify-between gap-4 border-t pt-6"
			>
				<BackToProjectsLink />
				<BackToTopLink />
			</nav>

			<FloatingBackToTop />
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
		<div
			className={cn('mx-auto w-full max-w-2xl px-3', className)}
			{...props}
		/>
	)
}

function ProjectHeader({
	proj,
	activeView,
}: {
	proj: Project
	activeView: TProjectView
}) {
	// The write-up and case study differ in length, so this follows the view.
	const readingMinutes =
		activeView === projectView.CaseStudy
			? proj.readingMinutes.caseStudy
			: proj.readingMinutes.engineering
	const meta = [
		proj.type,
		proj.duration,
		proj.role,
		readingMinutes != null ? `${readingMinutes} min read` : undefined,
	].filter((item): item is string => item != null)

	return (
		<div>
			<p className="mb-2 flex flex-wrap gap-x-2 text-sm text-muted-foreground">
				{meta.map((item, index) => (
					<Fragment key={item}>
						{index > 0 && <span aria-hidden="true">·</span>}
						<span>{item}</span>
					</Fragment>
				))}
			</p>

			{/* The back-to-top target: focusable from script only, so returning
			    to the top moves keyboard focus here too. */}
			<PageHeader id={PAGE_TOP_ID} tabIndex={-1} className="outline-none">
				{proj.name}
			</PageHeader>

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

function RelatedProjects({ proj }: { proj: Project }) {
	const related = proj.related.flatMap((pathname) => {
		const match = projectsMap.get(pathname)
		return match != null ? [match] : []
	})

	if (related.length === 0) {
		return null
	}

	// Part of the article, not site navigation: each related project comes
	// with its description — a reason to read it next — laid out in the same
	// ruled rows as a :::terms list (the write-up-rows utilities).
	return (
		<section aria-labelledby={RELATED_PROJECTS_ID}>
			<h2
				id={RELATED_PROJECTS_ID}
				className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
			>
				Related Projects
			</h2>

			<ul className="write-up-rows">
				{related.map((match) => (
					<li key={match.pathname}>
						<Link
							to="/projects/$projectKey"
							params={{ projectKey: match.pathname }}
							className="group write-up-row outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
						>
							<span className="font-semibold text-foreground group-hover:text-primary">
								{match.name}
								{/* Inline, so it follows the name's last line rather than
								    the edge of the column when the name wraps. */}
								<ArrowRight className="ml-1 inline h-4 w-4 align-[-0.15em] transition-transform group-hover:translate-x-0.5" />
							</span>
							<span className="text-sm leading-relaxed text-muted-foreground">
								{match.description}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}

function EngineeringBody({ sections }: { sections: Array<ProjectSection> }) {
	return (
		<div className="write-up flex flex-col gap-10">
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
			headingClassName="mb-2 text-2xl tracking-tight"
		>
			<section.body />
		</Section>
	)
}
