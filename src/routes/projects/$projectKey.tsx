import { Project, ProjectSection, projectsMap } from '@/constants/project';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectKey')({
	component: RouteComponent,
})

function RouteComponent() {

	const { projectKey } = Route.useParams();
	const proj = projectsMap.get(projectKey);

	if (proj == null) {
		return null;
	}

	return (
		<ProjectContainer>
			<ProjectHeader proj={proj} />

			<ProjectBody>
				{Array.isArray(proj.sections) && proj.sections.map(section => (
					<ProjectBodySection key={section.pathname} section={section} />
				))}
			</ProjectBody>
		</ProjectContainer>
	)
}

function ProjectHeader({ proj }: { proj: Project }) {
	return (
		<div>
			<div className="flex">
				<h1 className="font-bold tracking-tight text-gray-900 text-2xl">
					{proj.name}
				</h1>

				<span className="ml-auto text-sm leading-5 text-gray-500">
					{proj.duration}
				</span>
			</div>

			<p className="mt-1 font-light text-gray-700 text-lg">
				{proj.description}
			</p>
		</div>
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

function ProjectBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn('mt-6 pr-3 card', className)}
			{...props}
		/>
	)
}

function ProjectBodySection({ section }: { section: ProjectSection }) {
	return (
		<section>
			<h2 id={section.pathname} className="font-semibold text-lg text-gray-900 tracking-tight">
				{section.title}
			</h2>
		</section>
	)
}

