import type { ComponentType } from "react";
import { type TTech } from "./TechTypes";

const projectType = {
    NuixRampiva: 'Nuix / Rampiva',
    Personal: 'Personal'
} as const;

type TProjectType = (typeof projectType)[keyof typeof projectType];

interface ProjectSectionProps {
    title?: string;
    body: React.ElementType;
    pathname?: string;
}

interface ProjectProps {
    type: TProjectType;
    name: string;
    description: string;
    duration: string;
    tech: TTech[];

    pathname?: string;
    icon?: ComponentType<any> | undefined;
    sections?: ProjectSectionProps[] | undefined;
}

class ProjectSection implements ProjectSectionProps {
    title?: string;
    pathname?: string;
    body: React.ElementType;

    constructor(props: ProjectSectionProps) {
        this.title = props.title;
        this.body = props.body;

        if (this.title != null) {
            this.pathname = toUrl(this.title);
        }
    }
}

class Project implements ProjectProps {
    type: TProjectType;
    name: string;
    description: string;
    duration: string;

    tech: TTech[];
    pathname: string;

    icon?: ComponentType<any> | undefined;
    sections?: ProjectSection[] | undefined;

    constructor(props: ProjectProps) {
        this.type = props.type;
        this.name = props.name;
        this.description = props.description;
        this.duration = props.duration;

        this.tech = props.tech;
        this.pathname = toUrl(this.name);

        if (Array.isArray(props.sections)) {
            this.sections = props.sections.map(section => new ProjectSection(section));
        }
    }
}

function toUrl(str: string): string {
    return str.toLowerCase().replaceAll(' ', '-');
}

export { Project, ProjectSection, projectType };
export type { ProjectProps, ProjectSectionProps };

