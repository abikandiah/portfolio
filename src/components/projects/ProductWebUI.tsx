import { languageType, projectType, techType, type ProjectProps } from "@/types/ProjectTypes";

export const productWebUIProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Product Web UI',
    duration: '2018 - 2025',
    description: '',
    languages: [languageType.JavaScript, languageType.SASS, languageType.JSX],
    tech: [techType.React, techType.ReactRedux, techType.ReduxSagas, techType.RestAPI, techType.OIDC, techType.Axios, techType.WebWorkers]
};

