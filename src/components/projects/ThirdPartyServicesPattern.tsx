import { LoremIpsumAlt2 } from "@/constants/LoremIpsum";
import { languageType, projectType, techType, type ProjectProps } from "@/types/ProjectTypes";


export const thirdPartyServicesProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Third-Party Services Pattern',
    duration: '2024',
    description: 'A pattern of abstract classes used to provide third-party service connector implementations, from back-end storage to front-end form submission and authentication.',
    languages: [languageType.Java, languageType.JavaScript, languageType.JSX],
    tech: [techType.React, techType.Dropwizard, techType.RDBMS],
    sections: [
        { title: 'Back-end Implementation', body: BackEndProjectSection },
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
