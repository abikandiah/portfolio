import { ChevronRight, FolderCode } from 'lucide-react'
import { TextLink } from '../ui'
import { HomeSection } from './HomeSection'
import { ProjectRows } from '@/components/projects/ProjectRow'
import { featuredProjects } from '@/constants/project'

function ProjectsOverview() {
	return (
		<HomeSection title="Key Projects" Icon={FolderCode}>
			<ProjectRows projects={featuredProjects} />

			<TextLink
				to="/projects"
				className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium"
			>
				All projects
				<ChevronRight className="h-4 w-4" aria-hidden="true" />
			</TextLink>
		</HomeSection>
	)
}

export default ProjectsOverview
