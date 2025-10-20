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

const projectType = {
    Work: 'Work',
    Personal: 'Personal'
} as const;

type TProjectType = (typeof projectType)[keyof typeof projectType];

interface ProjectProps {
    type: TProjectType;
    name: string;
    description: string;
    duration: string;
    pathname?: string;

    order?: number | undefined;
    icon?: ElementType<any, keyof JSX.IntrinsicElements> | undefined;
    sections?: ProjectSectionProps[] | undefined;
}

class Project implements ProjectProps {
    type: TProjectType;
    name: string;
    description: string;
    duration: string;
    pathname: string;

    order?: number | undefined;
    icon?: ElementType<any, keyof JSX.IntrinsicElements> | undefined;
    sections?: ProjectSection[] | undefined;

    constructor(props: ProjectProps) {
        this.type = props.type;
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

export { Project, ProjectSection, projectType };
export type { ProjectProps, ProjectSectionProps, TProjectType };

