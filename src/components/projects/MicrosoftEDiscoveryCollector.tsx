import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { TextLink } from "../ui";
import { MessageBanner } from "../ui/banner";
import { UnorderedList } from "../ui/list";
import { thirdPartyServicesProject } from "./ThirdPartyServicesFramework";

export const microsoftEDiscoveryProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Microsoft eDiscovery Collector',
    duration: '2022 - 2024',
    description: `A set of guided operations to help manage and use Microsoft Purview eDiscovery.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.AzureAD, techType.MicrosoftEDiscovery, techType.OIDC],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Architecture', body: Architecture }
    ]
};

function Overview() {
    return (
        <>
            <p>
                <span className="font-semibold">Microsoft Purview eDiscovery</span> is an eDiscovery tool for Microsoft 365. It is used to search, review, export, and place legal holds on data across M365 services.
            </p>
            <p>
                This integration connects Microsoft Purview eDiscovery to the rest of our platform, enabling users to perform Purview eDiscovery operations as part of their automated workflows. For example, a user can create an eDiscovery case, add custodians, place data on hold, filter for narrow data, and export it for processing through the rest of our available operations.
            </p>
            <p>
                A lot of organizations, and our clients, use M365 for their organization environment. Connecting information governance and collection from M365 to our workflow automation platform bridged a gap that most had to deal with on their own. With our feature, clients can now run an entire M365 search, query, export, ingest, process and review workflow all within a single platform. We connected the M365 data collection with our platform.
            </p>
            <MessageBanner type="note" title="Automation Platform"
                message="The automation platform is truly a mix of many services. We bring together multiple data sources (such as Google Vault and Microsoft Purview eDiscovery), processing platforms (such as Nuix) and review platforms (such as Nuix Discover and Relativity), then build configurable operations for them. These operations are then used to build all sorts of automated workflows."
            />
        </>
    )
}

function Architecture() {
    return (
        <>
            <p>
                This feature is an implementation of the <TextLink to="/projects/$projectKey" params={{ projectKey: thirdPartyServicesProject.pathname }}>{thirdPartyServicesProject.name}</TextLink>. There are four main parts: The Microsoft Purview eDiscovery <span className="font-semibold">Service Configuration</span>, the set of Microsoft <span className="font-semibold">eDiscovery Operations</span>, the <span className="font-semibold">REST Client</span>, and the guided <span className="font-semibold">Job Wizard</span>.
            </p>
            <MessageBanner type="info"
                message="This integration is similar to the Google Vault integration. They're both built the same way and only differ in the operations available for their service."
            />

            <h3 className="sub-heading">Authentication and Authorization</h3>
            <p>
                To perform eDiscovery operations, we need eDiscovery manager authorization. To get that authorization we require users to sign in with an eDiscovery manager and grant us delegated authorization via an access token. This is done through an OAuth with OIDC login flow. We encrypt, store and refresh the access token until the user revokes it via a removal method. Access tokens are periodically refreshed for long-term usage.
            </p>
            <p>
                Access tokens can be configured to be tracked on a per-service level or a per-user level:
            </p>
            <UnorderedList>
                <li>Per-service: One user signs in to provide the access token for all users of the service.</li>
                <li>Per-user: Each user signs in to obtain their own access token, without which they cannot perform Vault operations.</li>
            </UnorderedList>
            <MessageBanner type={"info"}
                message={"Access token details are never shared or exposed, they are only used internally by a REST client."}
            />


            <h3 className="sub-heading">Service Configuration</h3>
            <p>
                The service configuration consists of everything required to connect to and manage Microsoft Purview eDiscovery. This includes the Azure AD app registration and the OIDC connection details.
            </p>

            <h3 className="sub-heading">eDiscovery Operations</h3>
            <p>
                Operations were designed around the available Purview eDiscovery API and typical use cases. We took a look at all the use cases and broke them up into modular operations. These operations are then used to build various Purview eDiscovery workflows.
            </p>
            <p>
                For example, we defined the following operations: <code className="code">Set eDiscovery Case</code>, <code className="code">Add Custodian</code>, <code className="code">Add Data Source</code>, <code className="code">Add to Review Set</code>, <code className="code">Export Review Set</code>, <code className="code">Download Export</code>, and etc.
            </p>

            <h3 className="sub-heading">REST Client</h3>
            <p>
                All API requests made to Purview eDiscovery are done through a REST client created and managed by our platform, with the following behaviours:
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
                The guided job wizard lives in the frontend and helps users fill in key operation details when submitting a Microsoft Purview eDiscovery workflow. For example, details such as the case, the data sources, the queries, and the export download location.
            </p>
            <MessageBanner type="note"
                message="Workflows can be customized with both hard-coded settings and execution-time settings, such as the location of source data or the name of the case to work with."
            />
            <p>
                It does so with the help of frontend guided operation panels designed for each eDiscovery operation. For example, the <code className="code">Set eDiscovery Case</code> operation has it's own panel which provides a list of available eDiscovery cases for selection. This allows users to select the case to work on when submitting the workflow rather than hard-coding the value when building the workflow.
            </p>
            <p>
                Guided operation panels are only rendered if their corresponding operation is present in a workflow. Users can mix-and-match operations as desired and the guided experience will reflect it, enabling them to create guided experiences that suite their workflow needs.
            </p>
        </>
    )
}
