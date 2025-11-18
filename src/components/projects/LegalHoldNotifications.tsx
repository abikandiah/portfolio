import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { MessageBanner } from "@abumble/design-system/components/Banner";
import { OrderedList, UnorderedList } from "@abumble/design-system/components/List";
import { Skeleton } from "@abumble/design-system/components/Skeleton";

export const legalHoldNotificationsProject: ProjectProps = {
    type: projectType.Work,
    name: 'Legal Hold Notifications',
    duration: '2020 - 2021',
    description: `A communication platform for administrating and auditing legal holds.`,
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.SSOLinks, techType.SMTP, techType.RDBMS, techType.LDAP, techType.ThreadPools],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'Notice Templates', body: NoticeTemplates },
        { title: 'User Sources', body: UserSources },
        { title: 'SMTP Servers', body: SmtpServers },
        { title: 'SSO Links', body: SsoLinks },
        { title: 'The Legal Hold', body: LegalHold },
        { title: 'Database Schema', body: DatabaseSchema }
    ]
};
<p>
    Everything is handled within a single <span className="font-semibold">Legal Hold</span> object. Administrators are added to administrate and manage the hold and custodians are added to be placed on hold with notices and surveys. The list of notices sent are defined here as well, as well as the SMTP server to use for emails and the workflows to submit on an event trigger.
</p>

function Overview() {
    return (
        <>
            <p>
                This is a specialized application designed for the <strong>administration and communication</strong> of legal holds. Its core function is to track custodians and manage the distribution of both notices and compliance surveys throughout the legal hold lifecycle. This platform is strictly a communication layer and does not interact with, manage, or place preservation holds on any underlying data systems.
            </p>
            <p>
                The legal hold application is built as a combination of integrated, modular components:
            </p>
            <UnorderedList>
                <li><strong>Notice Templating</strong>: Defines notices using markdown and allows for the creation of compliance surveys with fully configurable form components.</li>
                <li><strong>SMTP Servers</strong>: Used to define and configure the SMTP servers for sending all notification emails.</li>
                <li><strong>User Services</strong>: Manages external services to source and synchronize the list of available users for custodian and administrator roles.</li>
                <li><strong>Workflow Triggers</strong>: Used to submit workflows to the automation platform on legal hold events.</li>
                <li><strong>Legal Hold</strong>: The central component that unifies all elements to configure, initiate, and administrate the complete legal hold lifecycle.</li>
            </UnorderedList>
        </>
    )
}

function NoticeTemplates() {
    return (
        <>
            <p>
                Notices are first defined as <strong>Notice Templates</strong>. These templates are defined in a separate section and act as reusable blueprints to create the specific notice object used within a legal hold.
            </p>
            <p>
                This modular approach offers several benefits:
            </p>
            <UnorderedList>
                <li>It allows reusability of notices across multiple legal holds.</li>
                <li>It separates the logic of defining notices from the legal hold process itself.</li>
                <li>Templates can be modified without affecting the notices already in use in existing legal holds.</li>
            </UnorderedList>
            <p>
                Once a notice is generated for a legal hold, it becomes a distinct, separate object that exists solely for that specific hold, detached from its original template.
            </p>
            <p>
                Notice templates have their own frontend and CRUD endpoints. They define the notice's markdown message, customizable parameters for use in a hold, and a list of survey questions for the custodian.
            </p>


            <h3 className="sub-heading">Notice Comments</h3>
            <p>
                The Notice Comments system is a communication tool operating at the <strong>notice event level</strong>, designed to facilitate discussions regarding a specific custodian's notice.
            </p>
            <p>
                It provides two distinct channels for communication:
            </p>
            <UnorderedList>
                <li><strong>Custodian/Admin Communication</strong>: This channel allows custodians to communicate directly with legal hold administrators about their notice.</li>
                <li><strong>Admin Notes (Internal)</strong>: Administrators can submit private notes to each other on a custodian's notice, enabling internal discussions and tracking that are not visible to the custodian.</li>
            </UnorderedList>
        </>
    )
}

function UserSources() {
    return (
        <>
            <p>
                All <strong>custodians and administrators</strong> must be selected from a central pool of users managed by the platform. There are multiple methods for sourcing these users:
            </p>
            <UnorderedList>
                <li><strong>Manual Upload</strong>: Directly upload a list of users to a self-managed user service.</li>
                <li><strong>Microsoft Entra ID (Azure AD)</strong>: Connect and synchronize the user list from an Entra ID instance.</li>
                <li><strong>LDAP Server</strong>: Connect and synchronize the user list from an LDAP server.</li>
            </UnorderedList>
            <p>
                All selected custodians and administrators draw from these sourced users. The list of users is cached within the platform's database, and synchronization occurs on a configurable, periodic basis. User sources can also be configured, updated, or removed as needed.
            </p>
            <MessageBanner type="info"
                message={
                    <>
                        To successfully send <strong>SMTP emails</strong>, the sourced users must include <strong>valid, working email addresses</strong> for each user.
                    </>
                }
            />
        </>
    )
}

function SmtpServers() {
    return (
        <>
            <p>
                SMTP server configurations define the required details for a <strong>self-hosted SMTP server</strong>. This platform itself does not provide or run SMTP servers; this configuration serves as the connection bridge to external services (e.g., Google, Outlook, etc.).
            </p>
            <p>
                The configuration requires standard connection details: <strong>host, port, username and password</strong>. All legal hold emails will appear to be sent from the specified username.
            </p>
            <p>
                Similar to notice templates, SMTP server configurations have their own dedicated frontend and CRUD endpoints for easy management.
            </p>

            <h3 className="sub-heading">Asynchronous Email Processing</h3>
            <p>
                The platform handles email delivery efficiently using an <strong>asynchronous queuing system</strong> powered by a threadpool. This ensures that sending emails—which can number in the thousands—does not block the application or require synchronous processing.
            </p>
            <p>
                The backend service for email management includes endpoints for queue control, offering functionality to:
            </p>
            <UnorderedList>
                <li><strong>Export</strong> and <strong>Archive</strong> the email history.</li>
                <li><strong>Retry</strong> failed send attempts.</li>
                <li><strong>Purge</strong> the email queue.</li>
            </UnorderedList>
            <p>
                Emails are assigned a <strong>state</strong> to actively track their sending progress and record any errors encountered during the delivery process.
            </p>
        </>
    )
}

function SsoLinks() {
    return (
        <>
            <p>
                SSO links are utilized in emails to provide custodians and administrators with simple, one-click access to legal hold and notice details. These links are short-lived and designed for <strong>one-time use</strong>, though they can be refreshed upon request.
            </p>

            <h3 className="sub-heading">Security and Validation</h3>
            <p>
                The security of SSO links relies on symmetric encryption and a caching mechanism. An SSO link carries two main components:
            </p>

            <Skeleton className="h-15 lg:w-[80%] xl:w-[70%]"
                variant="none"
            />

            {/* <OrderedList>
                <li>A <strong>payload</strong> containing navigation information about the specific notice or legal hold.</li>
                <li>An <strong>encrypted signature</strong> of that payload.</li>
            </OrderedList> */}

            <p>
                The payload is encrypted using a <strong>secret key</strong> maintained exclusively by the platform. To verify the integrity and authenticity of an incoming SSO link, the system performs the following steps:
            </p>

            <Skeleton className="h-25 lg:w-[80%] xl:w-[70%]"
                variant="none"
            />

            {/* 
            <OrderedList>
                <li>The link payload is <strong>re-hashed</strong> using a pre-defined hashing algorithm.</li>
                <li>The resulting hash is then <strong>encrypted</strong> with the platform's secret key.</li>
                <li>The encrypted result is compared against the signature attached to the link.</li>
            </OrderedList> */}
            <p>
                A successful match confirms that the platform created the payload.
            </p>

            <h3 className="sub-heading">Expiration and Status Tracking</h3>
            <p>
                To manage validity, the platform uses caching to track active SSO links. Each cached link entry is assigned a TTL (Time-to-Live), and expired links are treated as a cache miss. Expired links, however, can still be refreshed by the user.
            </p>

            <MessageBanner type="info"
                message="SSO links are an optional feature of legal holds. Disabling them requires custodians and administrators to sign in manually."
            />
            <MessageBanner type="info"
                message="Upon system restart, all cached SSO links are lost and immediately become expired, though they remain refreshable."
            />
        </>
    )
}

function LegalHold() {
    return (
        <>
            <p>
                A <strong>Legal Hold</strong> is the central object that governs the entire process. It is defined by the following components:
            </p>
            <UnorderedList>
                <li>The list of <strong>custodians and administrators</strong>.</li>
                <li>The configured <strong>notices</strong> to be sent (Hold, Survey, Release).</li>
                <li>The <strong>SMTP server</strong> used for all related emails.</li>
                <li>Optional <strong>workflows</strong> to be triggered on selected events.</li>
                <li>The overall status of the legal hold.</li>
            </UnorderedList>
            <MessageBanner type="info"
                message="Notices and emails are optional and can be disabled if the system is used solely for tracking custodians. Workflow triggering is also optional."
            />

            <h3 className="sub-heading">Lifecycle Events</h3>
            <OrderedList>
                <li><strong>Activation</strong>: Once activated, custodians receive <strong>Hold Notices</strong> to inform them of their obligations and optional <strong>Survey Notices</strong> for additional data collection.</li>
                <li><strong>Release</strong>: When the hold ends, all custodians receive <strong>Release Notices</strong>.</li>
                <li><strong>Status Changes</strong>: Administrators are notified of all significant legal hold status changes, and any configured workflows are automatically triggered for execution.</li>
            </OrderedList>

            <h3 className="sub-heading">Custodian Interaction</h3>
            <p>
                Custodians can access and respond to their received notices by signing on manually or using the <strong>SSO (Single Sign-On) links</strong>.
            </p>
            <UnorderedList>
                <li>They can respond to a notice <strong>only if it contains survey questions</strong>.</li>
                <li>If a notice has no surveys, the custodian can only view the message.</li>
                <li>Custodians can contact administrators using <strong>Notice Comments</strong> on their individual notice event.</li>
            </UnorderedList>
            <p>
                Notices can be configured to require responses or viewing by a <strong>specific deadline</strong>. The system supports sending <strong>reminders</strong> as the deadline approaches and initiating <strong>escalations</strong> if the deadline is missed.
            </p>
            <MessageBanner type="info"
                message={
                    <>
                        <strong>Notice Event Tracking</strong>: Custodians interact with <strong>Notice Event</strong> objects. A Notice Event tracks the receiving user, send/view dates, and survey responses. This event is derived from its <strong>parent Notice object</strong>, which defines the message and survey questions.
                    </>
                }
            />
            <p>
                Custodians and administrators are tracked as <strong>participants</strong> in a legal hold, each assigned specific roles and statuses.
            </p>

            <h3 className="sub-heading">Workflow Triggers</h3>
            <p>
                Legal holds provide integration with the automation platform. Holds can be configured to submit workflows to the automation platform upon specific legal hold events, such as <strong>activation</strong> or <strong>custodian release</strong>.
            </p>
            <p>
                These workflows receive detailed information about the triggering event, including data about the legal hold and the involved custodian(s). This effectively connects the legal hold application with the broader platform, allowing for the execution of any operation or workflow defined within the automation environment.
            </p>
        </>
    )
}

function DatabaseSchema() {
    return (
        <>
            <p>
                All data models associated with the legal hold application are stored in the platform database. The following relations define the structure of the data:
            </p>

            <div className="my-4 border-container rounded text-sm">
                <table className="divide-y divide-stone-300/80 min-w-full">
                    <thead>
                        <tr className="text-xs text-left font-semibold uppercase">
                            <th scope="col" className="px-3 py-2 tracking-wider w-1/3">
                                Component
                            </th>
                            <th scope="col" className="px-3 py-2 tracking-wider w-2/3">
                                Relations
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-300/80 font-medium">
                        <tr>
                            <td className="px-3 py-2">
                                Legal Hold
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                                Has multiple participations, events, and notices; uses one SMTP server.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2">
                                Notice Template
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                                Can be used by multiple legal holds and can have multiple child notices.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2">
                                Notice
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                                Is attached to one legal hold and can have multiple notice events.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2">
                                User
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                                Can participate in multiple legal holds and receive multiple notice events.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2">
                                SMTP Server
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                                Can be used in multiple legal holds.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* 
            <img
                className="object-cover mx-auto mt-12"
                src={legalHoldDbSchema}
                alt="Legal Hold Database Schema"
            /> */}
        </>
    )
}


