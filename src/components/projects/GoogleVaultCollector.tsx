import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { TextLink } from "../ui";
import { thirdPartyServicesProject } from "./ThirdPartyServicesPattern";


export const googleVaultProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Google Vault Collector',
    duration: '2024',
    description: `An integration of Google Vault eDiscovery operations into our workflow automation tool, enabling users to run end-to-end Google Vault collections from our platform.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.GoogleCloud, techType.GoogleVault, techType.OIDC],

    sections: [
        { title: 'Overview', body: Overview },
    ]
};

function Overview() {
    return (
        <>
            <p>
                <span className="font-semibold">Google Vault</span> is an eDiscovery tool for Google Workspace. Vault admins can use it to search, review and export data from their Workspace. We created this tool to connect Google Vault with the rest of our platform, enabling further data processing via our workflow automation suite.
            </p>

            <p>
                This feature consists of four main parts: The Google Vault Service configuration, the set of Google Vault operations, the REST client session, and the guided job submission wizard.
            </p>
            <p>
                This is an implementation of the <TextLink to="/projects/$projectKey" params={{ projectKey: thirdPartyServicesProject.pathname }}>Third-Party Services Pattern</TextLink>.
            </p>

            <h3 className="sub-heading">Service Configuration</h3>
            <h3 className="sub-heading">Operations</h3>
            <h3 className="sub-heading">REST Client Session</h3>
            <h3 className="sub-heading">Guided Job Submission</h3>
        </>
    )
}
