import { LoremIpsumAlt2 } from "@/constants/LoremIpsum";
import { languageType, projectType, techType, type ProjectProps } from "@/types/ProjectTypes";

export const microsoftEDiscoveryProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Microsoft eDiscovery Collector',
    duration: '2022',
    description: 'A third-party connector to the Microsoft eDiscovery tool. Allows users to customize and run end-to-end data collection workflows within their E365 environment.',
    languages: [languageType.Java, languageType.JavaScript, languageType.SASS, languageType.JSX],
    tech: [techType.React, techType.Dropwizard, techType.RestAPI, techType.AzureAD, techType.MicrosoftEDiscovery, techType.OIDC],
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