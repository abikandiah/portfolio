import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { projectId } = Route.useParams();
    console.log(projectId)
    return <div>Hello "/projects/$projectId"!</div>
}
