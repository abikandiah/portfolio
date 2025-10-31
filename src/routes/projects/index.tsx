import { projects } from '@/constants/project';
import { createFileRoute, Navigate } from '@tanstack/react-router';

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
