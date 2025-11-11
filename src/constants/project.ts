import { automatedTranslationsProject as automatedTranslations } from "@/components/projects/AutomatedTranslations";
import { dataUploadProject as dataUpload } from "@/components/projects/DataUpload";
import { javaToReactFormBuilderProject as javaToReactFormBuilder } from "@/components/projects/form-builder/ReactFormBuilder";
import { googleVaultProject as googleVaultCollector } from "@/components/projects/GoogleVaultCollector";
import { legalHoldNotificationsProject as legalHoldNotifications } from "@/components/projects/LegalHoldNotifications";
import { microsoftEDiscoveryProject as microsoftEDiscoveryCollector } from "@/components/projects/MicrosoftEDiscoveryCollector";
import { platformWebApp } from "@/components/projects/PlatformWebApp";
import { selenumE2ETestSuiteProject as selenumE2ETestSuite } from "@/components/projects/SeleniumE2ETestSuite";
import { thirdPartyServicesProject as thirdPartyServices } from "@/components/projects/ThirdPartyServicesFramework";
import { webPortfolioProject as webPortfolio } from "@/components/projects/WebPortfolio";
import { Project, type ProjectProps } from "@/types/ProjectTypes";

const projectsMap: Map<string, Project> = new Map();

function addProject(props: ProjectProps) {
    const proj = new Project(props);
    projectsMap.set(proj.pathname, proj);
    props.pathname = proj.pathname;
}

addProject(platformWebApp);
addProject(legalHoldNotifications);
addProject(javaToReactFormBuilder);
addProject(thirdPartyServices);
addProject(googleVaultCollector);
addProject(microsoftEDiscoveryCollector);
addProject(dataUpload);
addProject(selenumE2ETestSuite);
addProject(automatedTranslations);
addProject(webPortfolio);


const projects = Array.from(projectsMap.values());

interface ProjectMap {
    [key: string]: Project[];
}

const projectsByType: ProjectMap = projects.reduce((prev, curr) => {
    if (prev[curr.type] == null) {
        prev[curr.type] = [];
    }
    prev[curr.type].push(curr);
    return prev;
}, {} as ProjectMap);

export { projects, projectsByType, projectsMap };

