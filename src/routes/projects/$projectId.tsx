import Project, { projectsMap } from '@/constants/project';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { projectId } = Route.useParams();

    const proj = projectsMap.get(projectId);
    if (proj == null) {
        return (
            null
        )
    }

    return (
        <div className='ml-8 mr-3'>
            <ProjectHeader proj={proj} />
            <ProjectBody proj={proj}/>
        </div>
    )
}

function ProjectHeader({ proj }: { proj: Project }) {
    return (
        <>
            <h1 className="font-bold tracking-tight text-gray-900 text-2xl">
                {proj.name}
            </h1>

            <h2 className="mt-1 font-light text-gray-700 text-lg">
                {proj.description}
            </h2>
        </>
    )
}

function ProjectBody({ proj }: { proj: Project }) {
    return (
        <section className='mt-6 card h-full'>

        </section>
    )
}
