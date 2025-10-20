import { LoremIpsumAlt2 } from "@/constants/LoremIpsum";
import type { ProjectProps } from "@/constants/project";

export const microsoftEDiscoveryProject: ProjectProps = {
    name: 'Microsoft eDiscovery Collector',
    duration: '2022',
    description: 'A third-party connector to the Microsoft eDiscovery tool. Allows users to customize and run end-to-end data collection workflows within their E365 environment.',
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