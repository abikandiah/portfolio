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
        { title: 'System Design', body: Architecture },
    ]
};

function Overview() {
    return (
        <>
            <p>
                This is a tool for tracking and notifying custodians placed on legal hold. It does not place any preservation or holds on data nor does it manage any data. It's only meant for sending notices and surveys and making custodians aware of the fact they are on hold or that they have been released. It's main purpose is for administration and communication.
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
                message="Although not mentioned yet, sending notices and emails can be disabled if all that's needed is a system for tracking custodians. Triggering workflows is also optional."
            />
            <p>
                Once a legal hold is activated, all custodians are sent hold notices to notify them of the hold and survey notices for additional questioning. When released, all custodians are similarly sent release notices to notify them of being released. Administrators are also notified of legal hold status changes. Worklfows configured to trigger on legal hold status changes are also appropriately submitted for execution.
            </p>
            <p>
                Custodians can sign-on manually or via SSO (single-sign on) links and view and respond to their received notices. If the notice has no survey questions then all they can do is view.
            </p>
            <Banner type="note"
                message="All notices can contain survey questions and custodians can only respond to notices with survey questions."
            />
            <p>
                Custodians can also engage in conversation with the legal hold administrators via comments on their individual notices.
            </p>
            <p>
                Notices can be configured to require responses or viewing by a certain day, with further notices for reminders as that day grows near and escalations if passed.
            </p>
            <p>
                Custodians and administrators are tracked as participations of a legal hold. Participations have roles and states. Role is either custodian or administrator and state is the hold state for custodians.
            </p>

            <h3 className="sub-heading">Database Schema</h3>
            <p>
                All data models associated with the legal hold application are stored in the general platform database. The following diagram shows the relation between all models:
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
                The legal hold notification system was built as a combination of four major parts:
            </p>

            <UnorderedList>
                <li>A user management system to source and track available users</li>
                <li>Notice templates and configuration</li>
                <li>SMTP servers for sending emails</li>
                <li>A workflow trigger mechanism to trigger workflows on legal hold events, such as placing a custodian on hold</li>
            </UnorderedList>


            <h3 className="sub-heading">User Sourcing</h3>
            <p>
                Custodians and administrators had to come from somewhere and that somewhere was from our method of sourcing users. We defined multiple ways of providing user lists:
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
                Notice templates have their own front-end and CRUD endpoints. Once created they are
                Notice templates define the markdown message of the notice and optionally a list of survey questions for the custodian.
            </p>
            <p>
                The reason we used templates for notices is so
            </p>

            <h3 className="sub-heading">Notice Comments</h3>

            <h3 className="sub-heading">SMTP Server Configuration</h3>

            <h3 className="sub-heading">SSO Links</h3>

            <h3 className="sub-heading">Workflow Triggers</h3>

        </>
    )
}
