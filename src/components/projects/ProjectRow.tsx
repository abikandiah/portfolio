import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { Project } from '@/types/ProjectTypes'
import { TechBadgeList } from '@/components/ui/badge'

// The list of clickable project rows, shared by the home page's Key
// Projects and the projects page so the two can't drift apart.
function ProjectRows({ projects }: { projects: Array<Project> }) {
	return (
		// Rules between rows keep each project a distinct block; the rows'
		// own padding keeps their hover background clear of the rules.
		<ul className="-my-1 divide-y divide-border">
			{projects.map((proj) => (
				<li key={proj.pathname} className="py-1">
					<ProjectRow proj={proj} />
				</li>
			))}
		</ul>
	)
}

function ProjectRow({ proj }: { proj: Project }) {
	const { name, duration, description, tech } = proj

	return (
		<Link
			to="/projects/$projectKey"
			params={{ projectKey: proj.pathname }}
			className="group -mx-3 flex items-start gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-foreground/4 focus-visible:outline-2 focus-visible:outline-ring"
		>
			<div className="min-w-0 flex-auto">
				<div className="flex items-baseline gap-2">
					<span className="text-sm leading-6 font-medium text-foreground">
						{name}
					</span>
					<span className="ml-auto shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
						{duration}
					</span>
				</div>

				<p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
					{description}
				</p>

				<TechBadgeList tech={tech} max={3} size="sm" className="mt-2" />
			</div>

			{/* Always visible, so the row reads as a link on touch screens too,
			    where there's no hover state to give it away. */}
			<ChevronRight
				aria-hidden="true"
				className="mt-1 h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
			/>
		</Link>
	)
}

export { ProjectRows }
