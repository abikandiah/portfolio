import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { TextLink } from "../ui";
import { MessageBanner } from "@abumble/design-system/components/Banner";
import { UnorderedList } from "@abumble/design-system/components/List";
import { thirdPartyServicesProject } from "./ThirdPartyServicesFramework";


export const microsoftEDiscoveryProject: ProjectProps = {
    type: projectType.Work,
    name: 'Microsoft eDiscovery Collector',
    duration: '2022 - 2024',
    description: `An integration of the Microsoft Purview eDiscovery tool into the workflow automation platform, providing a structured, automated approach for end-to-end data collections.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.AzureAD, techType.MicrosoftEDiscovery, techType.OIDC],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Deep Dive', body: DeepDive }
    ]
};

function Overview() {
    return (
        <>
            <p>
                <span className="font-semibold">Microsoft Purview eDiscovery</span> is the eDiscovery tool for managing legal holds and collecting data across all Microsoft 365 services. This integration connects Purview eDiscovery directly to the automation platform, enabling users to perform Purview operations—including creating cases, adding custodians, and exporting data—as steps within automated workflows.
            </p>
            <p>
                To use this integration, users must first provide their M365 connection details and authorize access as an eDiscovery Administrator. Authentication and authorization are handled securely using a standard OAuth with OIDC login flow. The integration itself is implemented as a set of workflow operations, featuring a guided job wizard to simplify submitting jobs to the automation platform's scheduler.
            </p>
        </>
    )
}

function DeepDive() {
    return (
        <>
            <p>
                This feature is an implementation of the <TextLink to="/projects/$projectKey" params={{ projectKey: thirdPartyServicesProject.pathname }}>{thirdPartyServicesProject.name}</TextLink>. There are four main parts: The Purview eDiscovery <span className="font-semibold">Service Configuration</span>, the set of <span className="font-semibold">Purview eDiscovery Operations</span>, the <span className="font-semibold">REST Client</span>, and the guided <span className="font-semibold">Job Wizard</span>.
            </p>
            <MessageBanner type="info"
                message={
                    <>
                        This integration is similar to the Google Vault integration, as both are built upon the same <span className="font-semibold">Third-Party Services Framework</span> core structure. They differ only in the service-specific operations available for each platform.
                    </>
                }
            />

            <h3 className="sub-heading">Service Configuration</h3>
            <p>
                To begin, users must define the service configuration. This configuration stores all the necessary details to connect to and manage a Purview eDiscovery environment, including the Microsoft Entra ID app registration and OIDC connection settings required to support the secure OAuth and OIDC login flow.
            </p>
            <MessageBanner type="note"
                message="The automation platform must be registered as a Microsoft Entra ID application. This step enables OIDC authentication, ensuring the platform has the required scopes and permissions to be authorized for delegated Purview eDiscovery API requests." />


            <h3 className="sub-heading">Authentication and Authorization</h3>
            <p>
                Next, delegated authorization must be secured to perform operations on the eDiscovery administrator's behalf. An eDiscovery manager signs in and grants this access via a secure OAuth with OIDC login flow. Upon successful authorization, the automation platform receives the necessary access token to make REST API requests. For secure, long-term use, this token is then encrypted, stored, and periodically refreshed until the user explicitly revokes access.
            </p>
            <p>
                Delegated authorization can be configured at either a <span className="font-semibold">per-service</span> level or a <span className="font-semibold">per-user</span> level:
            </p>
            <UnorderedList>
                <li>The <span className="font-semibold">per-service</span> level requires only one user to sign in and grant access, after which all users can use that single token to perform API requests.</li>
                <li>The <span className="font-semibold">per-user</span> level requires each user to provide their own delegated authorization; without which they cannot make API requests.</li>
            </UnorderedList>

            <MessageBanner type={"info"}
                message={"Access token details are never exposed, they are only used internally by the REST client."}
            />


            <h3 className="sub-heading">Purview eDiscovery Operations</h3>
            <p>
                Once the service configuration is defined and delegated authorization is obtained, users can begin to define and execute automated workflows that incorporate Purview eDiscovery operations.
            </p>
            <p>
                Operations were designed based on the available Purview eDiscovery API and common user workflows, with a focus on modularity. This approach gives users the flexibility to create and customize various Purview eDiscovery workflows, including complete end-to-end collection, search and query, or simple export and download workflows.
            </p>
            <p>
                For example, key operations include: <code className="code">Set eDiscovery Case</code>, <code className="code">Add Custodian</code>, <code className="code">Add Data Source</code>, <code className="code">Add to Review Set</code>, <code className="code">Export Review Set</code>, and <code className="code">Download Export</code>.
            </p>


            <h3 className="sub-heading">REST Client</h3>
            <p>
                The platform manages and creates a dedicated REST client for all Purview eDiscovery API requests, with the following behaviors:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Authentication</span>: Requests are authenticated using the access token obtained during the eDiscovery administrator sign-in.</li>
                <li><span className="font-semibold">Logging</span>: A circular buffer tracks requests, response metadata, and errors for debugging and auditing.</li>
                <li><span className="font-semibold">Fault Tolerance</span>: Exponential backoffs and response code validations are used to provide tolerance against rate limiters and unexpected API failures.</li>
            </UnorderedList>
            <p>
                This client is short-lived, created only when needed, and is automatically torn down after a brief period of inactivity.
            </p>


            <h3 className="sub-heading">Job Wizard</h3>
            <p>
                The Job Wizard is a guided frontend tool designed to help users define key operation parameters when submitting workflow jobs. It achieves this by providing guided panels for each Purview eDiscovery operation within the workflow. Each panel internally makes API requests to fetch necessary values—such as the list of available cases, data sources, and exports—for user selection.
            </p>
            <MessageBanner type="note"
                message="Workflows can be customized using hard-coded settings (defined during workflow creation) and execution-time setting (provided via the user during submission). The Job Wizard utilizes these execution-time settings to help users define the operation parameters."
            />
            <p>
                Guided operation panels are only rendered if their corresponding operation is present in the workflow. Users are free to mix-and-match operations, and the guided experience will automatically adjust to reflect these choices, enabling them to create a submission process that suits their workflow needs.
            </p>
        </>
    )
}

