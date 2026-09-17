import { Card } from '@abumble/design-system/components/Card'
import { Link } from '@tanstack/react-router'
import type { Project } from '@/types/ProjectTypes'
import { TechBadgeList } from '@/components/ui/badge'

function ProjectCard({ proj }: { proj: Project }) {
	return (
		<Link
			to="/projects/$projectKey"
			params={{ projectKey: proj.pathname }}
			className="block h-full"
		>
			<Card className="interactive-card h-full">
				<div className="flex items-start justify-between gap-2">
					<h3 className="font-semibold text-foreground">{proj.name}</h3>
					<span className="shrink-0 text-xs text-muted-foreground">
						{proj.duration}
					</span>
				</div>

				<p className="line-clamp-3 text-sm text-muted-foreground">
					{proj.description}
				</p>

				<TechBadgeList tech={proj.tech} size="sm" className="mt-auto" />
			</Card>
		</Link>
	)
}

export { ProjectCard }
