import { languageType, projectType, techType, type ProjectProps } from "@/types/ProjectTypes";

export const legalHoldNotificationsProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Legal Hold Notifications',
    duration: '2022',
    description: 'A Legal Hold notification system to track and send customizable hold and survey notices to custodians. Supports SSO links, SMTP servers, and workflow triggers.',
    languages: [languageType.Java, languageType.JavaScript, languageType.SASS, languageType.JSX],
    tech: [techType.React, techType.Dropwizard, techType.RestAPI, techType.SSOLinks, techType.SMTP, techType.RDBMS, techType.LDAP, techType.ThreadPools]
};

