import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { Banner } from "../ui/banner";
import { UnorderedList } from "../ui/list";

export const legalHoldNotificationsProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Legal Hold Notifications',
    duration: '2020 - 2021',
    description: `A notification and survey system for administrating and tracking legal holds.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.SSOLinks, techType.SMTP, techType.RDBMS, techType.LDAP, techType.ThreadPools],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'The Legal Hold', body: LegalHold },
        { title: 'Architecture', body: Architecture },
    ]
};

function Overview() {
    return (
        <>
            <p>
                This is a tool for tracking and notifying custodians placed on legal hold. It does not place any preservation or holds on data nor does it manage any data. It's only meant for sending notices and surveys and letting custodians know they're on hold or released. It's main purpose is for administration and communication.
            </p>
            <p>
                Everything is handled within a single <span className="font-semibold">Legal Hold</span> object. Administrators are added to administrate and manage the hold and custodians are added to be placed on hold with notices and surveys. The list of notices sent are defined here as well, as well as the SMTP server to use for emails and the workflows to submit on an event trigger.
            </p>
            <p>
                This feature is essentially an entire application on it's own. It has it's own database schema with several normalized tables, it's own front-end for configuring, managing and viewing, it's own back-end for all the API resources, and even it's own authentication mechanism via single-sign on (SSO) links.
            </p>
            <p>
                Although it could stand on its own as an application, it was built as a mini-application within our main platform; which allowed it to share several pre-built mechanisms such as user authentication and authorization, as well as all the database, API configurations and even triggering of workflows.
            </p>
            <p>
                It was easier to create it as a sub-application within our already defined application stack rather than creating it as it's own application, even though having it as a separate service would have been better for modularity and flexibility.
            </p>
        </>
    )
}

function LegalHold() {
    return (
        <>
            <p>
                A Legal Hold is an object that consists of the list of custodians and administrators, the configured notices to be sent, the workflows to be triggered on selected events, the SMTP server to use for emails, and the status of the legal hold.
            </p>
            <Banner type="info"
                message="Notices and emails can be disabled if all that's needed is a system for tracking custodians. Triggering workflows is also optional."
            />
            <p>
                Once a legal hold is activated, custodians are sent hold notices to notify them of the hold and survey notices for additional questioning. When released, all custodians are sent release notices to notify them of being released. Administrators are also notified of legal hold status changes. Worklfows configured to trigger on legal hold status changes are also appropriately triggered for execution.
            </p>
            <p>
                Custodians can sign-on manually or via SSO (single-sign on) links and view and respond to their received notices. If the notice has no survey questions then all they can do is view. If custodians have any questions or comments, they can contact administrators via notice comments on their individual notice events.
            </p>
            <Banner type="note"
                message="Survey questions are optional on notices and any notice can contain surveys. Custodians can only respond to notices with survey questions, otherwise they simply read and view them."
            />
            <Banner type="info"
                message="Custodians receive notices as Notice Event objects. A notice event tracks the receiving user, sent and view dates, and responses for any survey questions. The parent notice object tracks the message and survey questions."
            />
            <p>
                Notices can be configured to require responses or viewing by a certain day, with reminders as that day grows near and escalations if passed.
            </p>
            <p>
                Custodians and administrators are tracked as participations of a legal hold with roles and states.
            </p>

            <h3 className="sub-heading">Database Schema</h3>
            <p>
                All data models associated with the legal hold application are stored in the platform database. The following diagram shows the relation between all models:
            </p>
            <img
                className="object-cover mx-auto my-6"
                src="/src/assets/legal-hold-schema.svg"
                alt="Legal Hold Database Schema"
            />
            <UnorderedList>
                <li>A legal hold can have multiple participations, events, and notices, and one SMTP server</li>
                <li>A notice template can be used by multiple legal holds and can have multiple child notices</li>
                <li>A notice is attached to one legal hold and can have multiple notice events</li>
                <li>A user can participate in multiple legal holds and receive multiple notice events</li>
                <li>An SMTP server can be used in multiple legal holds</li>
            </UnorderedList>
        </>
    )
}

function Architecture() {
    return (
        <>
            <p>
                The legal hold notification system is built as a combination of four parts:
            </p>

            <UnorderedList>
                <li>A user management system to source and track available users</li>
                <li>Notice templates and configuration</li>
                <li>SMTP servers for sending emails</li>
                <li>A workflow trigger mechanism to trigger workflows on legal hold events, such as placing a custodian on hold</li>
            </UnorderedList>


            <h3 className="sub-heading">User Sourcing</h3>
            <p>
                Custodians and administrators had to come from somewhere and that somewhere was from our method of sourcing users. We defined multiple ways of providing user sources:
            </p>
            <UnorderedList>
                <li>Manually uploading a list of users to a self-managed user service</li>
                <li>Connecting to Microsoft Entra ID (Azure AD) and synchronizing the list of users</li>
                <li>Connecting to an LDAP server and synchronzing the list of users</li>
            </UnorderedList>
            <p>
                All custodians and administrators are selected from these sourced users. User synchronization occurs on a periodic basis and can be configured, erased and updated. The list of users are cached within our database.
            </p>
            <Banner type="info"
                message="In order to send SMTP emails, the list of users must also come with working email addresses for each user."
            />

            <h3 className="sub-heading">Notices and Templates</h3>
            <p>
                Notices are first defined as <span className="font-semibold">Notice Templates</span>. These templates are defined in their own section and are used like stamps to create the notice object used within a legal hold. This is done for re-usability of notices and to separate the logic of defining notices from legal holds. Also, this allows templates to be modified without affecting the notice used within an existing legal hold. All in all for better modularity; once a notice has been created for a legal hold it becomes seperate from its template.
            </p>
            <p>
                Notice templates have their own front-end and CRUD endpoints. They define the markdown message of the notice, parameters that can be updated when used in a legal hold, and a list of survey questions for the custodian.
            </p>

            <h3 className="sub-heading">Notice Comments</h3>
            <p>
                Notice comments is a whole comment system to enable communication between a custodian and the legal hold administrators. It operates on the notice event level. Admins also optionally have a method to subit admin notes to each other on a custodian's notice, for admin-level discussions.
            </p>

            <h3 className="sub-heading">SMTP Server Configuration</h3>
            <p>
                SMTP server configurations define the details for a self-hosted SMTP server. We do not provide SMTP servers and do not run SMTP servers within our platform. This configuration can be used to connect to any SMTP server such as that provided by Google. It requires the connection details such as host, port, username and password. All emails will be seen to be sent from this username.
            </p>
            <p>
                SMTP server configurations, similar to notice templates, have their own front-end and CRUD endpoints. The back-end for managing emails also includes endpoints to export, archive, retry and purge the email queue.
            </p>
            <p>
                Emails are sent with a threadpool and are queued asynchronously to prevent blocking. There could be as many as 10,000 emails being sent at once and we do not want to wait or handle it synchronously. Emails also have state to track sending progress and errors if any.
            </p>

            <h3 className="sub-heading">SSO Links</h3>
            <p>
                SSO links are sent in emails to enable custodians and administrators to easily open and access the legal hold and notice details. SSO links are one-time use and are short-lived. They can be refreshed on request.
            </p>
            <p>
                SSO links use asymmetric encryption and caching for security validation. An SSO link contains a payload containing navigation information about the notice or legal hold and an encrypted signature of that payload. The payload is encrypted by a secret key only maintained by our platform. To verify an SSO link we do the following:
            </p>
            <UnorderedList className="list-digit">
                <li>Re-hash the link payload with a pre-defined hashing algorithm</li>
                <li>Encrypt the hash with the platform's secret key</li>
                <li>Verify if the encrypted result matches the signature attached to the link</li>
            </UnorderedList>
            <p>
                If the result matches the SSO link signature, then we can be guaranteed that we created the payload for that link. But it may still be invalid due to expiration. For that, we use caching to keep track of active SSO links. The cache assigns a TTL (Time-to-live) to all SSO link entries and treats them as a cache miss if expired. However, SSO links can still be refreshed if expired.
            </p>
            <Banner type="info"
                message="On system restart, the cached SSO links are lost and they all become expired, but they can still be refreshed."
            />
            <Banner type="info"
                message="SSO links are an optional feature of legal holds. They can be disabled, requiring custodians and administrators to always manually sign-on." />

            <h3 className="sub-heading">Workflow Triggers</h3>
            <p>
                Legal holds can be configured to submit workflows to the automation platform on legal hold events, such as activating a legal hold or relasing a custodian. These workflows are passed details about the triggering event, such as the legal hold and custodian(s) involved. Effectively connecting the legal hold application with the rest of our platform. Any operation and workflow defined within our automation platform can be triggered here.
            </p>
        </>
    )
}
