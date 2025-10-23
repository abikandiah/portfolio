import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const microsoftEDiscoveryProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Microsoft eDiscovery Collector',
    duration: '2022 - 2024',
    description: `An integration of Microsoft eDiscovery operations into our workflow automation tool, enabling users to run end-to-end Microsoft eDiscovery collections from our platform.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.AzureAD, techType.MicrosoftEDiscovery, techType.OIDC],

    sections: [
        { title: 'Overview', body: Overview }
    ]
};

function Overview() {
    return (
        <>
            <p>
            </p>
        </>
    )
}