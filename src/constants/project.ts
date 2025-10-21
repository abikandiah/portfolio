import { automatedTranslationsProject } from "@/components/projects/AutomatedTranslations";
import { dataUploadProject } from "@/components/projects/DataUpload";
import { googleVaultProject } from "@/components/projects/GoogleVaultCollector";
import { legalHoldNotificationsProject } from "@/components/projects/LegalHoldNotifications";
import { microsoftEDiscoveryProject } from "@/components/projects/MicrosoftEDiscoveryCollector";
import { automateWebUIProject } from "@/components/projects/ProductWebUI";
import { javaToReactFormBuilderProject } from "@/components/projects/ReactFormBuilder";
import { selenumE2ETestSuiteProject } from "@/components/projects/SeleniumE2ETestSuite";
import { thirdPartyServicesProject } from "@/components/projects/ThirdPartyServicesPattern";
import { Project, type ProjectProps } from "@/types/ProjectTypes";

const projectsMap: Map<string, Project> = new Map();

function addProject(props: ProjectProps): Project {
    const proj = new Project(props);
    projectsMap.set(proj.pathname, proj);
    return proj;
}

addProject(automateWebUIProject);
addProject(legalHoldNotificationsProject);
addProject(javaToReactFormBuilderProject);
addProject(thirdPartyServicesProject);
addProject(googleVaultProject);
addProject(microsoftEDiscoveryProject);
addProject(dataUploadProject);
addProject(selenumE2ETestSuiteProject);
addProject(automatedTranslationsProject);


const projects = Array.from(projectsMap.values());

export { projects, projectsMap };

