
class Project {
    name: string;
    duration: string;
    description: string;
    url: string;

    constructor(name: string, duration: string, description: string) {
        this.name = name;
        this.duration = duration;
        this.description = description;
        this.url = this.getUrl();
    }

    getUrl() {
        return this.name.toLowerCase().replaceAll(' ', '-');
    }
}

const javaToReactFormBuilder = new Project('Java-to-React Form Builder', '2023',
    'A form builder used to generate React forms from Backend Java objects. Built with Java annotations, reflections and React form components in the front-end.'
);

const googleVaultCollector = new Project('Google Vault Collector', '2024',
    'A form builder used to generate React forms from Backend Java objects. Built with Java annotations, reflections and React form components in the front-end.'
);
const microsoftEDiscoveryCollector = new Project('Microsoft eDiscovery Collector', '2023',
    'A form builder used to generate React forms from Backend Java objects. Built with Java annotations, reflections and React form components in the front-end.'
);
const thirdPartyServices = new Project('Third-Party Services', '2024',
    'A form builder used to generate React forms from Backend Java objects. Built with Java annotations, reflections and React form components in the front-end.'
);
const legalHold = new Project('Legal Hold', '2021',
    'A form builder used to generate React forms from Backend Java objects. Built with Java annotations, reflections and React form components in the front-end.'
);
const smtpServers = new Project('SMTP Servers', '2022',
    'A form builder used to generate React forms from Backend Java objects. Built with Java annotations, reflections and React form components in the front-end.'
);

const projectsMap: Map<string, Project> = new Map([
    [javaToReactFormBuilder.url, javaToReactFormBuilder],
    [googleVaultCollector.url, googleVaultCollector],
    [microsoftEDiscoveryCollector.url, microsoftEDiscoveryCollector],
    [thirdPartyServices.url, thirdPartyServices],
    [legalHold.url, legalHold],
    [smtpServers.url, smtpServers]
]);

const projects = Array.from(projectsMap.values());

export default Project;
export { projects, projectsMap };

