import type { ElementType, JSX } from "react";

const projectType = {
    NuixRampiva: 'Nuix / Rampiva',
    Personal: 'Personal'
} as const;

type TProjectType = (typeof projectType)[keyof typeof projectType];

const languageType = {
    TypeScript: 'TypeScript',
    JavaScript: 'JavaScript',
    Java: 'Java',
    Ruby: 'Ruby',
    Python: 'Python',
    CSS: 'CSS',
    HTML: 'HTML',
    SASS: 'SASS / CSS',
    JSX: 'JSX / HTML',
    TSX: 'TSX / HTML'
} as const;

type TLanguage = (typeof languageType)[keyof typeof languageType];

const techType = {
    React: 'React',
    ReactRedux: 'React-Redux',
    ReduxSagas: 'Redux-Sagas',
    Axios: 'Axios',
    ReactRouter: 'React Router',
    TanstackRouter: 'Tanstack Router',
    TailwindCss: 'Tailwind CSS',
    Dropwizard: 'Dropwizard',
    OIDC: 'OIDC Authentication',
    RestAPI: 'REST API',
    GoogleCloud: 'Google Cloud',
    GoogleVault: 'Google Vault',
    AzureAD: 'Azure AD',
    MicrosoftEDiscovery: 'Microsoft eDiscovery',
    JavaAnnotations: 'Java Annotations',
    JavaReflections: 'Java Reflections',
    OpenSource: 'Open Source',
    TusProtocol: 'TUS Upload Protocol',
    RDBMS: 'RDBMS SQL',
    ThreadPools: 'Thread Pools',
    Concurrency: 'Concurrency and Synchronization',
    WebWorkers: 'Web Workers',
    SSOLinks: 'SSO Links',
    SMTP: 'SMTP',
    LDAP: 'LDAP'
} as const;

type TTech = (typeof techType)[keyof typeof techType];


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

    languages: TLanguage[];
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

    languages: TLanguage[];
    tech: TTech[];

    pathname: string;
    icon?: ElementType<any, keyof JSX.IntrinsicElements> | undefined;
    sections?: ProjectSection[] | undefined;

    constructor(props: ProjectProps) {
        this.type = props.type;
        this.name = props.name;
        this.description = props.description;
        this.duration = props.duration;

        this.languages = props.languages?.sort();
        this.tech = props.tech?.sort();

        this.pathname = toUrl(this.name);

        if (Array.isArray(props.sections)) {
            this.sections = props.sections.map(section => new ProjectSection(section));
        }
    }
}

function toUrl(str: string): string {
    return str.toLowerCase().replaceAll(' ', '-');
}

export { languageType, Project, ProjectSection, projectType, techType };
export type { ProjectProps, ProjectSectionProps, TProjectType };

