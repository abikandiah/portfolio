import { LoremIpsumAlt2 } from "@/constants/LoremIpsum";
import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const microsoftEDiscoveryProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Microsoft eDiscovery Collector',
    duration: '2022',
    description: 'A third-party connector to the Microsoft eDiscovery tool. Allows users to customize and run end-to-end data collection workflows within their E365 environment.',
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.AzureAD, techType.MicrosoftEDiscovery, techType.OIDC],
    sections: [
        { title: 'Back-end Implementation', body: BackEndProjectSection }
    ]
};

function BackEndProjectSection() {
    return (
        <>
            <p>
                {LoremIpsumAlt2}
            </p>
        </>
    )
}