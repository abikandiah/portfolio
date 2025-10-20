import type { ElementType, JSX } from "react";
import { techColorMap, type TTech } from "./TechTypes";

const projectType = {
    NuixRampiva: 'Nuix / Rampiva',
    Personal: 'Personal'
} as const;

type TProjectType = (typeof projectType)[keyof typeof projectType];

interface ProjectSectionProps {
    title: string;
    body: ElementType<any, keyof JSX.IntrinsicElements>
    pathname?: string;
}

interface ProjectProps {
    type: TProjectType;
    name: string;
    description: string;
    duration: string;
    tech: TTech[];

    pathname?: string;
    icon?: ElementType<any, keyof JSX.IntrinsicElements> | undefined;
    sections?: ProjectSectionProps[] | undefined;
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

class Project implements ProjectProps {
    type: TProjectType;
    name: string;
    description: string;
    duration: string;

    tech: TTech[];
    pathname: string;

    icon?: ElementType<any, keyof JSX.IntrinsicElements> | undefined;
    sections?: ProjectSection[] | undefined;

    constructor(props: ProjectProps) {
        this.type = props.type;
        this.name = props.name;
        this.description = props.description;
        this.duration = props.duration;

        this.tech = props.tech?.sort(sortTech);
        this.pathname = toUrl(this.name);

        if (Array.isArray(props.sections)) {
            this.sections = props.sections.map(section => new ProjectSection(section));
        }
    }
}

function sortTech(a: string, b: string): number {
    const colorA = techColorMap[a];
    const colorB = techColorMap[b];

    if (colorA == null && colorB != null) {
        return 1;
    }
    if (colorA != null && colorB == null) {
        return -1;
    }
    return a.localeCompare(b);
}

function toUrl(str: string): string {
    return str.toLowerCase().replaceAll(' ', '-');
}

export { Project, ProjectSection, projectType };
export type { ProjectProps, ProjectSectionProps };

