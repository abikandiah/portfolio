import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { TextLink } from "../ui";
import { Banner } from "../ui/banner";
import { UnorderedList } from "../ui/list";
import { thirdPartyServicesProject } from "./ThirdPartyServicesPattern";


export const googleVaultProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Google Vault Collector',
    duration: '2024',
    description: `An integration of Google Vault with our workflow automation platform, enabling users to perform Google Vault operations from our plaform.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.GoogleCloud, techType.GoogleVault, techType.OIDC],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Architecture', body: Architecture }
    ]
};

function Overview() {
    return (
        <>
            <p>
                <span className="font-semibold">Google Vault</span> is an eDiscovery tool for Google Workspace. Vault admins can use it to search, review and export data from their Workspace.
            </p>
            <p>
                This integration connects Google Vault to the rest of our platform, enabling users to perform Google Vault operations as part of their automated workflows. For example, a user could search for and export data from Google Vault, then ingest, process it with processing operations, and then upload it for review to a supported review platform.
            </p>
        </>
    )
}

function Architecture() {
    return (
        <>
            <p>
                This feature is an implementation of the <TextLink to="/projects/$projectKey" params={{ projectKey: thirdPartyServicesProject.pathname }}>{thirdPartyServicesProject.name}</TextLink>. There are four main parts: The Google Vault <span className="font-semibold">Service Configuration</span>, the set of Google <span className="font-semibold">Vault Operations</span>, the <span className="font-semibold">REST Client</span>, and the guided <span className="font-semibold">Job Wizard</span>.
            </p>

            <h3 className="sub-heading">Authentication and Authorization</h3>
            <p>
                In order to use this feature, users need to provide delegated Vault administrator access. This is done through an OAuth 2.0 with OIDC login flow where a Vault administrator signs in to Google and authorizes our platform to perform requests on their behalf. We encrypt, store and refresh the access token when needed for repeated use, until the user revokes it via a removal method.
            </p>
            <p>
                Access tokens can be configured to be tracked on a per-service level or a per-user level:
            </p>

            <UnorderedList>
                <li>Per-service: One user signs in to provide the access token for all users of the service.</li>
                <li>Per-user: Each user signs in to obtain their own access token, without which they cannot perform Vault operations.</li>
            </UnorderedList>
            <Banner type={"info"}
                message={"Access token details are never shared or exposed, they are only used internally by a REST client."}
            />

            <h3 className="sub-heading">Service Configuration</h3>
            <p>
                The service configuration consists of all details required to connect to and manage a Google Vault environment. This includes the Google Cloud project details and the OIDC connection details.
            </p>

            <h3 className="sub-heading">Vault Operations</h3>
            <p>
                For every possible API operation exposed by Google Vault, we created a sensible and configurable operation to represent it, taking user experience and flow into account.
            </p>
            <p>
                For example, the <code className="code">Set Vault Matter</code> operation combines the creating and selecting a Vault Matter into one. If the Matter to select doesn't exist, the operation will either attempt to create it or fail, depending on the <code className="code">create if doesn't exist</code> option. If the Matter does exist, the operation will select it. Once created or selected, the operation sets the Matter as a global variable accessible by all future operations, enabling them to perform work on that selected Matter.
            </p>

            <h3 className="sub-heading">REST Client</h3>
            <p>
                All API requests made to Google Vault are done through a REST client created and managed by our platform, with the following behaviours:
            </p>
            <UnorderedList>
                <li>Requests are made with the access token obtained from the Vault administrator sign in.</li>
                <li>Circular buffer logs are used to track requests, response metadata and errors.</li>
                <li>Exponential backoffs and response code validations are used to provide tolerance support against rate-limiters and unexpected failures.</li>
            </UnorderedList>
            <p>
                Clients are short-lived and torn down after a period of inactivity and created again when needed.
            </p>

            <h3 className="sub-heading">Job Wizard</h3>
            <p>
                The guided job wizard lives in the front-end and helps users fill in key operation details when submitting a Google Vault workflow. For example, details such as the matter, the data sources, the queries, and the export download location.
            </p>
            <Banner type="note"
                message="Workflows can be customized with both hard-coded settings and execution-time settings, such as the location of source data or the name of the case to work with."
            />
            <p>
                It does so with the help of front-end guided operation panels designed for each Vault operation. For example, the <code className="code">Set Vault Matter</code> operation has it's own panel which provides a list of available Vault matters for selection. This allows users to select the matter to work on when submitting the workflow rather than hard-coding the value when building the workflow.
            </p>
            <p>
                Guided operation panels are only rendered if their corresponding operation is present in a workflow. Users can mix-and-match operations as desired and the guided experience will reflect it, enabling them to create guided experiences that suite their workflow needs.
            </p>
        </>
    )
}
