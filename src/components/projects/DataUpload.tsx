import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const dataUploadProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Data Upload',
    duration: '2021',
    description: '',
    tech: [techType.Java, techType.JavaScript, techType.SASS, techType.JSX,
    techType.React, techType.Dropwizard, techType.RestAPI, techType.OpenSource, techType.TusProtocol]
};