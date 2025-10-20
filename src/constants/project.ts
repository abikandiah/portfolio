interface ProjectSectionProps {
    title: string;
    body: string;
}

class ProjectSection {
    title: string;
    body: string;
    pathname: string;

    constructor({ title, body }: ProjectSectionProps) {
        this.title = title;
        this.body = body;
        this.pathname = toUrl(title);
    }
}

interface ProjectProps {
    name: string;
    description: string;
    duration: string;
    icon?: React.ElementType;
    sections?: ProjectSectionProps[];
}

class Project implements ProjectProps {
    name: string;
    duration: string;
    description: string;
    url: string;

    icon?: React.ElementType;
    sections?: ProjectSection[];

    constructor({ name, duration, description, sections, icon }: ProjectProps) {
        this.name = name;
        this.duration = duration;
        this.description = description;
        this.icon = icon;
        this.sections = sections?.map(props => new ProjectSection(props));
        this.url = toUrl(this.name);
    }
}

function toUrl(str: string): string {
    return str.toLowerCase().replaceAll(' ', '-');
}

const projectsMap: Map<string, Project> = new Map();

function addProject(props: ProjectProps) {
    const proj = new Project(props);
    projectsMap.set(proj.url, proj);
}

addProject({
    name: 'Java-To-React Form Builder',
    duration: '2023',
    description: 'A React form generator for backend Java classes. Removes front-end development time by allowing back-end devs to describe form configurations directly on the Java class with annotations.',
    sections: [
        { title: 'Back-end Implementation', body: '' }
    ]
});
addProject({
    name: 'Google Vault Collector',
    duration: '2024',
    description: 'A third-party connector to the Google Vault eDiscovery tool. Allows users to customize and run end-to-end data collection workflows within their Google Workspace environment'
});
addProject({
    name: 'Third-Party Services Pattern',
    duration: '2024',
    description: 'A pattern of abstract classes used to provide third-party service connector implementations, from back-end storage to front-end form submission and authentication.'
});
addProject({
    name: 'Microsoft eDiscovery Collector',
    duration: '2022',
    description: 'A third-party connector to the Microsoft eDiscovery tool. Allows users to customize and run end-to-end data collection workflows within their E365 environment.'
});
addProject({
    name: 'Legal Hold Notifications',
    duration: '2022',
    description: 'A Legal Hold notification system to track and send customizable hold and survey notices to custodians. Supports SSO links, SMTP servers, and workflow triggers.'
});
addProject({
    name: 'Data Upload',
    duration: '2021',
    description: ''
});
addProject({
    name: 'Core React Web UI',
    duration: '2018 - 2025',
    description: ''
});


const projects = Array.from(projectsMap.values());

export { Project, projects, ProjectSection, projectsMap };

