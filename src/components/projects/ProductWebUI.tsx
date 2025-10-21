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
        { title: 'Chapter One: The Beginning', body: Introduction }
    ]
};

function Introduction() {
    return (
        <>
            <p>
                The web UI was built with a set of four main libraries: <span className="font-semibold">React</span>
                , <span className="font-semibold">React-Redux</span>
                , and <span className="font-semibold">Redux-Sagas</span>.
                React is used for all things components and styling, with SASS as the pre-processor for CSS.
                React-Redux for the global app state and for its middleware feature,
                allowing Redux-Sagas for asynchronous action handling.
            </p>

            <p>
                The three were used to create a framework for application startup, querying and caching API objects
                , defining back-end corresponding classes for APIs and CRUD actions.
            </p>
        </>
    )
}

