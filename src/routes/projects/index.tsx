import { Navigate, createFileRoute } from '@tanstack/react-router'
import { projects } from '@/constants/project'

export const Route = createFileRoute('/projects/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<Navigate to={projects[0]?.pathname} replace />
		</>
	)
}
