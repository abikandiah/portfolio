import { dataUploadProject } from "@/components/projects/DataUpload";
import { googleVaultProject } from "@/components/projects/GoogleVaultCollector";
import { legalHoldNotificationsProject } from "@/components/projects/LegalHoldNotifications";
import { microsoftEDiscoveryProject } from "@/components/projects/MicrosoftEDiscoveryCollector";
import { productWebUIProject } from "@/components/projects/ProductWebUI";
import { javaToReactFormBuilderProject } from "@/components/projects/ReactFormBuilder";
import { thirdPartyServicesProject } from "@/components/projects/ThirdPartyServicesPattern";
import { Project, type ProjectProps } from "@/types/ProjectTypes";

const projectsMap: Map<string, Project> = new Map();

function addProject(props: ProjectProps): Project {
    const proj = new Project(props);
    projectsMap.set(proj.pathname, proj);
    return proj;
}

addProject(productWebUIProject);
addProject(javaToReactFormBuilderProject);
addProject(thirdPartyServicesProject);
addProject(googleVaultProject);
addProject(microsoftEDiscoveryProject);
addProject(legalHoldNotificationsProject);
addProject(dataUploadProject);


const projects = Array.from(projectsMap.values());

export { projects, projectsMap };

