import LoremIpsum, { LoremIpsumAlt1 } from "@/constants/LoremIpsum";
import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";


export const googleVaultProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Google Vault Collector',
    duration: '2024',
    description: 'A third-party connector to the Google Vault eDiscovery tool. Allows users to customize and run end-to-end data collection workflows within their Google Workspace environment',
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.GoogleCloud, techType.GoogleVault, techType.OIDC],
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