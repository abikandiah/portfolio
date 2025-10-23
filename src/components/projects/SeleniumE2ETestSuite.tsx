import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const selenumE2ETestSuiteProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Selenium E2E Test Suite',
    duration: '2019 - 2025',
    description: `A test suite built with Selenium and Java to automate end-to-end user actions in the front-end.`,
    tech: [techType.Java, techType.XPath, techType.Selenium, techType.Jenkins],

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
