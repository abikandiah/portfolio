import { LoremIpsumAlt2 } from "@/constants/LoremIpsum";
import type { ProjectProps } from "@/constants/project";


export const thirdPartyServicesProject: ProjectProps = {
    name: 'Third-Party Services Pattern',
    duration: '2024',
    description: 'A pattern of abstract classes used to provide third-party service connector implementations, from back-end storage to front-end form submission and authentication.',
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
