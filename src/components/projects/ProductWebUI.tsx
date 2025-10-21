import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const automateWebUIProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Product Web UI',
    duration: '2018 - 2025',
    description: 'The React web application front-end for the core Rampiva Automate product. Built with React, React-Redux, Redux Sagas and a custom component library.',
    tech: [techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.ReactRedux,
    techType.ReduxSagas, techType.RestAPI, techType.OIDC, techType.Axios, techType.WebWorkers],

    sections: [
        
    ]
};



