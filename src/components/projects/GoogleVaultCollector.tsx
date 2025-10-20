import LoremIpsum, { LoremIpsumAlt1 } from "@/constants/LoremIpsum";
import { languageType, projectType, techType, type ProjectProps } from "@/types/ProjectTypes";


export const googleVaultProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Google Vault Collector',
    duration: '2024',
    description: 'A third-party connector to the Google Vault eDiscovery tool. Allows users to customize and run end-to-end data collection workflows within their Google Workspace environment',
    languages: [languageType.Java, languageType.JavaScript, languageType.SASS, languageType.JSX],
    tech: [techType.React, techType.Dropwizard, techType.RestAPI, techType.GoogleCloud, techType.GoogleVault, techType.OIDC],
    sections: [
        { title: 'Back-end Implementation', body: BackEndProjectSection },
        { title: 'Job Submission Wizard', body: JobSubmissionWizard },
    ]
};

function BackEndProjectSection() {
    return (
        <>
            <p>
                {LoremIpsum}
            </p>
        </>
    )
}


function JobSubmissionWizard() {
    return (
        <>
            <p>
                {LoremIpsumAlt1}
            </p>
        </>
    )
}