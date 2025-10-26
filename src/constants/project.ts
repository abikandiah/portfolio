import { automatedTranslationsProject } from "@/components/projects/AutomatedTranslations";
import { dataUploadProject } from "@/components/projects/DataUpload";
import { javaToReactFormBuilderProject } from "@/components/projects/form-builder/ReactFormBuilder";
import { googleVaultProject } from "@/components/projects/GoogleVaultCollector";
import { legalHoldNotificationsProject } from "@/components/projects/LegalHoldNotifications";
import { microsoftEDiscoveryProject } from "@/components/projects/MicrosoftEDiscoveryCollector";
import { automateWebApplicationProject } from "@/components/projects/ProductWebUI";
import { selenumE2ETestSuiteProject } from "@/components/projects/SeleniumE2ETestSuite";
import { thirdPartyServicesProject } from "@/components/projects/ThirdPartyServicesFramework";
import { webPortfolioProject } from "@/components/projects/WebPortfolio";
import { Project, type ProjectProps } from "@/types/ProjectTypes";

const projectsMap: Map<string, Project> = new Map();

function addProject(props: ProjectProps) {
    const proj = new Project(props);
    projectsMap.set(proj.pathname, proj);
    props.pathname = proj.pathname;
}

addProject(automateWebApplicationProject);
addProject(legalHoldNotificationsProject);
addProject(javaToReactFormBuilderProject);
addProject(thirdPartyServicesProject);
addProject(googleVaultProject);
addProject(microsoftEDiscoveryProject);
addProject(dataUploadProject);
addProject(selenumE2ETestSuiteProject);
addProject(automatedTranslationsProject);
addProject(webPortfolioProject);


const projects = Array.from(projectsMap.values());

export { projects, projectsMap };

