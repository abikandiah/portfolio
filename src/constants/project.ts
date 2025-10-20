import { dataUploadProject } from "@/components/projects/DataUpload";
import { googleVaultProject } from "@/components/projects/GoogleVaultCollector";
import { legalHoldNotificationsProject } from "@/components/projects/LegalHoldNotifications";
import { microsoftEDiscoveryProject } from "@/components/projects/MicrosoftEDiscoveryCollector";
import { productWebUIProject } from "@/components/projects/ProductWebUI";
import { javaToReactFormBuilderProject } from "@/components/projects/ReactFormBuilder";
import { thirdPartyServicesProject } from "@/components/projects/ThirdPartyServicesPattern";
import type { ElementType, JSX } from "react";

interface ProjectSectionProps {
    title: string;
    body: ElementType<any, keyof JSX.IntrinsicElements>
    pathname?: string;
}

class ProjectSection implements ProjectSectionProps {
    title: string;
    pathname: string;
    body: ElementType<any, keyof JSX.IntrinsicElements>;

    constructor(props: ProjectSectionProps) {
        this.title = props.title;
        this.body = props.body;
        this.pathname = toUrl(this.title);
    }
}

interface ProjectProps {
    name: string;
    description: string;
    duration: string;
    pathname?: string;

    order?: number | undefined;
    icon?: ElementType<any, keyof JSX.IntrinsicElements> | undefined;
    sections?: ProjectSectionProps[] | undefined;
}

class Project implements ProjectProps {
    name: string;
    description: string;
    duration: string;
    pathname: string;

    order?: number | undefined;
    icon?: ElementType<any, keyof JSX.IntrinsicElements> | undefined;
    sections?: ProjectSection[] | undefined;

    constructor(props: ProjectProps) {
        this.name = props.name;
        this.description = props.description;
        this.duration = props.duration;
        this.pathname = toUrl(this.name);

        this.order = props.order;
        if (Array.isArray(props.sections)) {
            this.sections = props.sections.map(section => new ProjectSection(section));
        }
    }
}

function toUrl(str: string): string {
    return str.toLowerCase().replaceAll(' ', '-');
}

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

export { Project, projects, ProjectSection, projectsMap };
export type { ProjectProps, ProjectSectionProps };

