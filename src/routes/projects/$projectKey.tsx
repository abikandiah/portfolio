import { NotFound } from '@/components/NotFound';
import { PageDescription, PageHeader } from '@/components/ui';
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
		<ProjectContainer className="space-y-4">
			<section className="px-3">
				<ProjectHeader proj={proj} />
			</section>

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
			className={cn("", className)}
			{...props}
		/>
	)
}

function ProjectHeader({ proj }: { proj: Project }) {
	return (
		<div>
			<PageHeader size="sm">
				{proj.name}
			</PageHeader>

			<PageDescription size="sm" className="mt-1">
				{proj.description}
			</PageDescription>

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
			// className={cn('flex flex-col gap-6 p-3', className)}
			className={cn('card', className)}
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

