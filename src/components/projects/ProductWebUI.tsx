import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../ui/code";

export const automateWebUIProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Product Web UI',
    duration: '2018 - 2025',
    description: 'The core React web application for the Nuix Automate product, providing users with a unified user interface for\
     configuration, job scheduling and result analysis. Developed with React, React Redux, Redux Sagas, React Router and a custom-built component library.',
    tech: [techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.ReactRedux,
    techType.ReduxSagas, techType.ReactRouter, techType.RestAPI, techType.OIDC, techType.Axios, techType.WebWorkers],

    sections: [
        { title: 'Chapter One: The Beginning', body: TheBeginning }
    ]
};

function TheBeginning() {
    return (
        <>
            <p>
                The web UI was built with a set of four main libraries: <span className="font-semibold">React</span>, <span className="font-semibold">React-Redux</span> and <span className="font-semibold">Redux-Sagas</span>. React is used for all things components and styling, with SASS used as the pre-processor for CSS. React-Redux paired with Redux-Sagas for global app state management and asynchronous front-end business logic.
            </p>
            <p>
                The three were used to create a framework for application startup, authentication, queries and polling, CRUD operations for API classes, and UI component building.
            </p>

            <h3 className="sub-heading">The Model Class</h3>
            <p>
                A Model class describes the front-end equivalent for a back-end resource, including the class structure, the list of available endpoints, and any front-end user action to help user flows.
            </p>

            <CodeDisplay code={`class Model {
    static actions = {};
    static actionCreators = {};
    static endpoints = {};    

    id: string;
    name: string;
    description: string;

    constructor(props: { [key: string]: any }) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
    }
}`
            } />

            <h3 className="sub-heading">The Saga Class</h3>
            <p>
                A Saga class contains all the asynchronous action handlers for when more than global state change is needed. It includes functions for making queries, validations, polling, submitting and editing forms, managing API objects, and others such as starting a guided job submission.
            </p>

            <CodeDisplay code={`class Saga {
    submit();
    edit();
    delete();
    queryObjects();
    pollObjects();
    startGuidedJobSubmission();
    validateForm();
}`
            } />
        </>
    )
}

