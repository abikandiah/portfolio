import { NotFound } from '@/components/NotFound';
import { BadgeContainer, TechBadge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { projectsMap } from '@/constants/project';
import { cn } from '@/lib/utils';
import type { Project, ProjectSection } from '@/types/ProjectTypes';
import { createFileRoute } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';

export const Route = createFileRoute('/projects/$projectKey')({
	component: RouteComponent,
})

function RouteComponent() {
	const { projectKey } = Route.useParams();
	const proj = projectsMap.get(projectKey);

	if (proj == null) {
		return (
			<NotFound />
		)
	}

	return (
		<ProjectContainer>
			<ProjectHeader proj={proj} />

			<ProjectBody>
				{Array.isArray(proj.sections) && proj.sections.map((section, index) => (
					<Fragment key={index}>
						{index > 0 &&
							<Separator />
						}
						<ProjectBodySection key={index} section={section} />
					</Fragment>
				))}
			</ProjectBody>
		</ProjectContainer>
	)
}

function ProjectContainer({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn('ml-8', className)}
			{...props}
		/>
	)
}

function ProjectHeader({ proj }: { proj: Project }) {
	return (
		<div className="pr-3">
			<div className="flex">
				<h1 className="font-bold tracking-tight text-gray-900 text-2xl">
					{proj.name}
				</h1>

				<span className="ml-auto leading-5 text-gray-500">
					{proj.duration}
				</span>
			</div>

			<p className="mt-1 text-gray-700 text-lg">
				{proj.description}
			</p>

			<BadgeContainer className="mt-4">
				{proj.tech?.map(tech => (
					<TechBadge key={tech} value={tech} />
				))}
			</BadgeContainer>
		</div>
	)
}

function ProjectBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn('card pr-3 mt-8', className)}
			{...props}
		/>
	)
}

function ProjectBodySection({ section }: { section: ProjectSection }) {
	return (
		<section className="p-text space-y-4">
			{section.title &&
				<h2 id={section.pathname} className="font-semibold text-lg text-gray-900 mb-1">
					{section.title}
				</h2>
			}

			{section.body && <section.body />}
		</section>
	)
}

