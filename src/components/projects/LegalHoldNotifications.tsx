import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const legalHoldNotificationsProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Legal Hold Notifications',
    duration: '2020 - 2021',
    description: 'A Legal Hold notification system to track and send customizable hold and survey notices to custodians. Supports SSO links, SMTP servers, and workflow triggers.',
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.Dropwizard,
    techType.RestAPI, techType.SSOLinks, techType.SMTP, techType.RDBMS, techType.LDAP, techType.ThreadPools],

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

