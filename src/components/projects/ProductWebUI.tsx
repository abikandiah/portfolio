import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const automateWebUIProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Product Web UI',
    duration: '2018 - 2025',
    description: 'The core React web application for the Nuix Automate product, providing users with a unified user interface for\
     configuration, job scheduling and result analysis. Developed with React, React Redux, Redux Sagas, React Router and a custom-built component library.',
    tech: [techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.ReactRedux,
    techType.ReduxSagas, techType.ReactRouter, techType.RestAPI, techType.OIDC, techType.Axios, techType.WebWorkers],

    sections: [
        { body: Introduction }
    ]
};

function Introduction() {
    return (
        <p>The web UI was built with a set of four main libraries: React, React-Redux, Redux-Sagas and React-Router.</p>
    )
}



