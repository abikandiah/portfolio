import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
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
        { title: 'Architecture', body: Architecture },
    ]
};

function Overview() {
    return (
        <>
            <p>
                This tool is used to notify and track custodians being placed on hold. It does not apply any preservation on data nor does it manage any data, it is simply a notification tool. Administrators can send notices and surveys to custodians and custodians can log in to view and respond to them.
            </p>
            <p>
                The whole system is tracked under a single Legal Hold object. This object contains the legal hold status, the list of custodians and administrators, the notices and surveys, the workflow triggers, the SMTP server for emails, and more.
            </p>
            <p>
                Building this required working on all levels of a full-stack environment:
            </p>
            <UnorderedList>
                <li>Creating a normalized database schema to track all data models;</li>
                <li>Creating CRUD and more endpoints for all objects involved;</li>
                <li>Ensuring secure access when using SSO links;</li>
                <li>Building the front-end for all objecs for CRUD and more;</li>
                <li>Designing a multi-threaded environment to perform tasks in parallel</li>
                <li>Handle updates asynchronously to prevent freezing up the request handler</li>
            </UnorderedList>
        </>
    )
}

function Architecture() {
    return (
        <>
            <p>
                This is a system built of many parts:
            </p>
            <UnorderedList>
                <li>The overall Legal Hold object;</li>
                <li>Custodians and administrators;</li>
                <li>Notices and survey customization;</li>
                <li>Notice custodian and administrator comments;</li>
                <li>SMTP email server configuration;</li>
                <li>SSO links;</li>
                <li>Workflow submission triggers.</li>
            </UnorderedList>

            <h3 className="sub-heading">The Legal Hold</h3>

            <h3 className="sub-heading">Custodians and Administrators</h3>

            <h3 className="sub-heading">Notices and Templates</h3>

            <h3 className="sub-heading">Notice Comments</h3>

            <h3 className="sub-heading">SMTP Server Configuration</h3>

            <h3 className="sub-heading">SSO Links</h3>

            <h3 className="sub-heading">Workflow Triggers</h3>

            <h3 className="sub-heading">Database Schema</h3>
        </>
    )
}
