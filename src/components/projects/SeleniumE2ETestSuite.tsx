import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { MessageBanner } from "../ui/banner";
import { UnorderedList } from "../ui/list";

export const selenumE2ETestSuiteProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Selenium E2E Test Suite',
    duration: '2019 - 2025',
    description: `A Selenium and Java-based test suite for scalable end-to-end (E2E) testing of user flows across the web application. This suite is fully integrated into the CI/CD pipeline's test stage where it verifies application behaviour to prevent deploying broken builds.`,
    tech: [techType.Java, techType.XPath, techType.Selenium, techType.Jenkins],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Architecture', body: Architecture }
    ]
};

function Overview() {
    return (
        <>
            <p>
                This test suite was created to automate and verify user flows within the web application; to have a guarantee that user actions always perform as expected. This suite plays a central test role in the build pipeline and helps prevent bugs from being released.
            </p>
            <p>
                It was designed with scalability in mind, so tests can be readily added as the platform expands. Since last checked, it covers over 250 user flows.
            </p>
        </>
    )
}

function Architecture() {
    return (
        <>
            <p>
                Built with Java, Selenium and XPath, this test suite creates a structure that mirrors the web application it automates.
            </p>

            <h3 className="sub-heading">Test-Building Framework</h3>
            <p>
                All repeatable and typical user actions were packaged into respective Selenium classes. When it came to test building, only those classes had to be referenced rather than rewriting the same Selenium selector logic over and over. Less XPath and more test path.
            </p>
            <p>
                This led to a design where actions for frontend components were being packaged and described as classes in the test suite. A frontend dropdown would have a corresponding Selenium dropdown that included all the possible user actions a frontend dropdown could perform, such as opening and selecting an item.
            </p>
            <p>
                The test suite also had the following helper classes:
            </p>
            <UnorderedList>
                <li>XPathHelper: Helper to build and combine xpaths for selecting frontend components, elements and text.</li>
                <li>WaitCondition: A series of selector conditions that extend Selenium's ExpectedConditions, to specify custom selector conditions to wait on.</li>
                <li>TestRestClient: A REST client used to make test requests to the platform's back-end.</li>
            </UnorderedList>

            <MessageBanner type="note"
                message="Selenium's ExpectedConditions provide a way to wait for conditions to be true on a web application, such as the visibility of an element or for certain text to appear. We expect them to be true and are simply waiting for them to be true. We need to wait because web apps need time to render after state changes. If after the wait they are still not true, then the expected condition will fail."
            />

            <h3 className="sub-heading">Execution</h3>
            <p>
                The start of every test begins with a restart of the application platform and a reset of it's databases to default values. This is done to prevent tests from interferring with each other. To increase speed, tests during the build pipeline are split and executed in parallel. Tests do not rely nor interefere with one another, so they can be readily split and parallelized.
            </p>
        </>
    )
}
