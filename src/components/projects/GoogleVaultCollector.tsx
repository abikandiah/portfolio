import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { TextLink } from "../ui";
import { MessageBanner } from "../ui/banner";
import { UnorderedList } from "../ui/list";
import { thirdPartyServicesProject } from "./ThirdPartyServicesFramework";


export const googleVaultProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Google Vault Collector',
    duration: '2024',
    description: `An integration of the Google Vault eDiscovery tool into the workflow automation platform, providing a structured, automated approach for end-to-end data collections.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React,
    techType.Dropwizard, techType.RestAPI, techType.GoogleCloud, techType.GoogleVault, techType.OIDC],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Deep Dive', body: DeepDive }
    ]
};

function Overview() {
    return (
        <>
            <p>
                <span className="font-semibold">Google Vault</span> is the dedicated eDiscovery tool for Google Workspace, allowing admins to search, review, and export data. This integration connects Vault's core functions to our platform, allowing users to include these operations as steps in their automated workflows. For example, a user can execute a Vault search and export, download and process the data, and then upload the collected information to a supported review platform.
            </p>
            <p>
                To use this integration, users must first provide their Google Workspace connection details and authorize access using their Google Vault admin credentials. Authentication and authorization are handled securely via a standard OAuth with OIDC login flow. The integration itself is implemented as a set of workflow operations, with a guided job wizard to simplify the submission of workflow jobs to the automation platform's scheduler.
            </p>
        </>
    )
}

function DeepDive() {
    return (
        <>
            <p>
                This feature is an implementation of the <TextLink to="/projects/$projectKey" params={{ projectKey: thirdPartyServicesProject.pathname }}>{thirdPartyServicesProject.name}</TextLink>. There are four main parts: The Google Vault <span className="font-semibold">Service Configuration</span>, the set of Google <span className="font-semibold">Vault Operations</span>, the <span className="font-semibold">REST Client</span>, and the guided <span className="font-semibold">Job Wizard</span>.
            </p>

            <h3 className="sub-heading">Service Configuration</h3>
            <p>
                The first step to using this integration is to define the necessary service configuration for the Google Workspace and Vault environment. This configuration contains all the details required to connect to and manage Google Vault, including the Google Cloud project details needed to support the secure OAuth and OIDC login flow.
            </p>
            <MessageBanner type="note"
                message="Users must create and properly configure a dedicated Google Cloud project within their Google Workspace environment. This is required for setting up OIDC authentication with the necessary scopes and permissions, to allow authorizing our platform to perform delegated Google Vault API requests." />

            <h3 className="sub-heading">Authentication and Authorization</h3>
            <p>
                The second step involves securing delegated authorization to perform operations on the Vault administrator's behalf. A vault administrator must sign in and grant this access via a secure OAuth with OIDC login flow. Upon successful authorization, our platform receives an access token to make the necessary REST API requests. For secure, long-term use, this token is encrypted, stored and periodically refreshed until the user explicitly revokes access.
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


            <h3 className="sub-heading">Vault Operations</h3>
            <p>
                Once the service configuration is defined and delegated authorization is obtained, users can begin to define and execute automated workflows that incorporate Vault operations.
            </p>
            <p>
                Built upon the Google Vault APIs and common user workflows, the Vault operations were designed with a focus on modularity. This flexibility allows users to create and execute a variety of workflows, including complete end-to-end data collection, detailed search and query, or simple export and download workflows.
            </p>
            <p>
                Consider the <code className="code">Set Vault Matter</code> operation as an example. This operation combines the creation and selection of a Vault Matter into one step. Based on the <code className="code">create if doesn't exist</code> option, the operation will either create a new Matter or selects the existing one. Afterwards, the operation sets it as a global variable, making it accessible to all subsequent workflow operations.
            </p>
            <MessageBanner type={"info"}
                message={"This is a required operation in most workflows, as it specifies which Matter all future operations will work with."}
            />


            <h3 className="sub-heading">REST Client</h3>
            <p>
                The platform manages and creates a dedicated REST client for all Google Vault API requests, with the following behaviors:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Authentication</span>: Requests are authenticated using the access token obtained during the Vault administrator sign-in.</li>
                <li><span className="font-semibold">Logging</span>: A circular buffer tracks requests, response metadata, and errors for debugging and auditing.</li>
                <li><span className="font-semibold">Fault Tolerance</span>: Exponential backoffs and response code validations are used to provide tolerance against rate limiters and unexpected API failures.</li>
            </UnorderedList>
            <p>
                This client is short-lived, created only when needed, and is automatically torn down after a brief period of inactivity.
            </p>

            <h3 className="sub-heading">Job Wizard</h3>
            <p>
                The Job Wizard is a guided frontend tool designed to help users define key operation parameters when submitting workflow jobs. It achieves this by providing guided panels for each Vault operation within the workflow. Each panel internally makes API requests to fetch necessary values—such as the list of available matters, data sources, and exports—for user selection.
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
