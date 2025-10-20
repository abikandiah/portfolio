import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const dataUploadProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Data Upload',
    duration: '2021',
    description: 'A resumable file upload feature to upload data from the web UI to a set of user-defined servers. Implements the tus resumable file upload protocol and integrates two open source projects.',
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX,
    techType.React, techType.Dropwizard, techType.RestAPI, techType.OpenSource, techType.TusProtocol]
};