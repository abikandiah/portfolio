import { Card, CardContent } from '@abumble/design-system/components/Card'
import { Link } from '@tanstack/react-router'
import { ArrowRight, FolderCode } from 'lucide-react'
import { CardH2Header } from '../ui/card'
import { TechBadge } from '../ui/badge'
import type { Project } from '@/types/ProjectTypes'
import { projects } from '@/constants/project'

const MAX_VISIBLE_TECH = 4

function ProjectsOverview() {
	return (
		<Card>
			<CardH2Header title={'Key Projects'} Icon={FolderCode} />

			<CardContent className="space-y-2">
				{projects.slice(0, 5).map((proj) => (
					<ProjectOverview key={proj.name} proj={proj} />
				))}
			</CardContent>
		</Card>
	)
}

function ProjectOverview({ proj }: { proj: Project }) {
	const { name, duration, description, tech } = proj
	const visibleTech = tech.slice(0, MAX_VISIBLE_TECH)
	const remainingTech = tech.length - visibleTech.length

	return (
		<Link
			to="/projects/$projectKey"
			params={{ projectKey: proj.pathname }}
			className="group block rounded-lg p-3 -mx-3 transition-all hover:-translate-y-0.5 hover:bg-foreground/4 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
		>
			<div className="flex flex-auto">
				<span className="text-sm font-medium text-foreground leading-6">
					{name}
				</span>

				<span className="ml-auto text-xs leading-5 text-muted-foreground">
					{duration}
				</span>
			</div>

			<p className="text-sm leading-5 text-muted-foreground">{description}</p>

			<div className="flex flex-wrap items-center gap-1.5 mt-2">
				{visibleTech.map((t) => (
					<TechBadge key={t} value={t} size="sm" />
				))}
				{remainingTech > 0 && (
					<span className="text-xs text-muted-foreground">
						+{remainingTech} more
					</span>
				)}
			</div>

			<span className="inline-flex items-center gap-1 text-xs text-link mt-2">
				View Project
				<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
			</span>
		</Link>
	)
}

export default ProjectsOverview
