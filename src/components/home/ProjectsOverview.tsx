import { Card, CardContent } from '@abumble/design-system/components/Card'
import { Link } from '@tanstack/react-router'
import { ArrowRight, FolderCode } from 'lucide-react'
import { CardH2Header } from '../ui/card'
import { TechBadgeList } from '../ui/badge'
import type { Project } from '@/types/ProjectTypes'
import { featuredProjects } from '@/constants/project'

function ProjectsOverview() {
	return (
		<Card>
			<CardH2Header title={'Key Projects'} Icon={FolderCode} />

			<CardContent className="space-y-2">
				{featuredProjects.map((proj) => (
					<ProjectOverview key={proj.name} proj={proj} />
				))}
			</CardContent>
		</Card>
	)
}

function ProjectOverview({ proj }: { proj: Project }) {
	const { name, duration, description, tech } = proj

	return (
		<Link
			to="/projects/$projectKey"
			params={{ projectKey: proj.pathname }}
			className="group block rounded-lg p-3 -mx-3 transition-colors hover:bg-foreground/4 focus-visible:outline-2 focus-visible:outline-ring"
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

			<TechBadgeList tech={tech} size="sm" className="mt-2" />

			<span className="inline-flex items-center gap-1 text-xs text-link mt-2">
				View Project
				<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
			</span>
		</Link>
	)
}

export default ProjectsOverview
