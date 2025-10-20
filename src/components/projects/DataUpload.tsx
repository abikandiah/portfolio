import { languageType, projectType, techType, type ProjectProps } from "@/types/ProjectTypes";

export const dataUploadProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Data Upload',
    duration: '2021',
    description: '',
    languages: [languageType.Java, languageType.JavaScript, languageType.SASS, languageType.JSX],
    tech: [techType.React, techType.Dropwizard, techType.RestAPI, techType.OpenSource, techType.TusProtocol]
};