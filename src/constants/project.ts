import type { ProjectProps } from '@/types/ProjectTypes'
import { Project } from '@/types/ProjectTypes'
import { automatedTranslationsProject as automatedTranslations } from '@/projects/AutomatedTranslations'
import { dataUploadProject as dataUpload } from '@/projects/DataUpload'
import { javaToReactFormBuilderProject } from '@/projects/form-builder/ReactFormBuilder'
import { googleVaultProject as googleVaultCollector } from '@/projects/GoogleVaultCollector'
import { legalHoldNotificationsProject as legalHoldNotifications } from '@/projects/LegalHoldNotifications'
import { microsoftEDiscoveryProject as microsoftEDiscoveryCollector } from '@/projects/MicrosoftEDiscoveryCollector'
import { platformWebApp } from '@/projects/PlatformWebApp'
import { chip8EmulatorProject } from '@/projects/Chip8Emulator'
import { propMangeProject } from '@/projects/PropMange'
import { selenumE2ETestSuiteProject as selenumE2ETestSuite } from '@/projects/SeleniumE2ETestSuite'
import { thirdPartyServicesProject } from '@/projects/ThirdPartyServicesFramework'
import { webPortfolioProject as webPortfolio } from '@/projects/WebPortfolio'

const projectsMap: Map<string, Project> = new Map()

function addProject(props: ProjectProps): Project {
	const proj = new Project(props)
	projectsMap.set(proj.pathname, proj)
	return proj
}

const propMange = addProject(propMangeProject)
addProject(platformWebApp)
addProject(legalHoldNotifications)
const javaToReactFormBuilder = addProject(javaToReactFormBuilderProject)
const thirdPartyServices = addProject(thirdPartyServicesProject)
addProject(chip8EmulatorProject)
addProject(webPortfolio)
addProject(googleVaultCollector)
addProject(microsoftEDiscoveryCollector)
addProject(dataUpload)
addProject(selenumE2ETestSuite)
addProject(automatedTranslations)

// Reverse-chronological: most recently active projects first. This is the
// canonical browsing order (the /projects grid, projectsByType below). See
// featuredProjects further down for the separately curated home page list.
const projects = Array.from(projectsMap.values()).sort(
	(a, b) => b.sortYear - a.sortYear || b.startYear - a.startYear,
)

interface ProjectMap {
	[key: string]: Array<Project> | undefined
}

const projectsByType: ProjectMap = projects.reduce((prev, curr) => {
	if (prev[curr.type] == null) {
		prev[curr.type] = []
	}
	prev[curr.type]!.push(curr)
	return prev
}, {} as ProjectMap)

// Key Projects, hand-picked and in display order — deliberately independent
// of the reverse-chronological `projects` sort above. "Key" means important,
// not "most recent." These reuse the Project instances `addProject` already
// created above, rather than re-deriving them by name, so a rename can't
// silently break this list.
const featuredProjects: Array<Project> = [
	propMange,
	javaToReactFormBuilder,
	thirdPartyServices,
]

export { featuredProjects, projects, projectsByType, projectsMap }
