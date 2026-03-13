import type { ProjectProps } from '@/types/ProjectTypes'
import { automatedTranslationsProject as automatedTranslations } from '@/projects/AutomatedTranslations'
import { dataUploadProject as dataUpload } from '@/projects/DataUpload'
import { javaToReactFormBuilderProject as javaToReactFormBuilder } from '@/projects/form-builder/ReactFormBuilder'
import { googleVaultProject as googleVaultCollector } from '@/projects/GoogleVaultCollector'
import { legalHoldNotificationsProject as legalHoldNotifications } from '@/projects/LegalHoldNotifications'
import { microsoftEDiscoveryProject as microsoftEDiscoveryCollector } from '@/projects/MicrosoftEDiscoveryCollector'
import { platformWebApp } from '@/projects/PlatformWebApp'
import { propMangeProject } from '@/projects/PropMange'
import { selenumE2ETestSuiteProject as selenumE2ETestSuite } from '@/projects/SeleniumE2ETestSuite'
import { thirdPartyServicesProject as thirdPartyServices } from '@/projects/ThirdPartyServicesFramework'
import { webPortfolioProject as webPortfolio } from '@/projects/WebPortfolio'
import { Project } from '@/types/ProjectTypes'

const projectsMap: Map<string, Project> = new Map()

function addProject(props: ProjectProps) {
	const proj = new Project(props)
	projectsMap.set(proj.pathname, proj)
	props.pathname = proj.pathname
}

addProject(platformWebApp)
addProject(legalHoldNotifications)
addProject(javaToReactFormBuilder)
addProject(thirdPartyServices)
addProject(googleVaultCollector)
addProject(microsoftEDiscoveryCollector)
addProject(dataUpload)
addProject(selenumE2ETestSuite)
addProject(automatedTranslations)
addProject(webPortfolio)
addProject(propMangeProject);

const projects = Array.from(projectsMap.values())

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

export { projects, projectsByType, projectsMap }
