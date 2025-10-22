import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../ui/code";
import { UnorderedList } from "../ui/list";

export const automateWebApplicationProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Automate Web Application',
    duration: '2018 - 2025',
    description: `A central management console for the Automate platform. Developed with React, React Redux, Redux Sagas and a custom-built component library.`,
    tech: [techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.ReactRedux,
    techType.ReduxSagas, techType.ReactRouter, techType.RestAPI, techType.OIDC, techType.Axios, techType.WebWorkers],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'The Framework', body: Framework },
        { title: 'Next, the Support', body: Internals }
    ]
};

function Overview() {
    return (
        <>
            <p>
                This web application is a <span className="font-semibold">central management console</span> for the Automate platform. It is a React single-page application (SPA) built to provide a user interface for end-to-end management, enabling users to:
            </p>
            <UnorderedList>
                <li>Design and build custom workflows;</li>
                <li>Submit, schedule, and view workflow executions;</li>
                <li>Track and manage clients and matters;</li>
                <li>Configure platform settings and infrastructure;</li>
                <li>Manage users, roles and third-party services.</li>
            </UnorderedList>
            <p>
                The application was designed as a framework that includes all common data state management, operations and components, to reduce the amount of work required to scale and extend, allowing the platform to grow from supporting fewer than 10 back-end data models to well over 30.
            </p>
            <p>
                It was built with a custom component library. The library began with the application and components were built as needed. Components were built to be reusable. Custom hooks and helper functions were also defined as needed, to help with component lifecycles,  behaviours and state management.
            </p>
            <p>
                The framework defines a pattern for integrating a data model in the front-end. It supports CRUD operations, polling and caching and other coordinated flows.
            </p>
        </>
    )
}

function Framework() {
    return (
        <>
            <p>
                The web UI was built with a set of three main libraries: <span className="font-semibold">React</span>, <span className="font-semibold">React-Redux</span> and <span className="font-semibold">Redux-Sagas</span>. React is used for all things components and styling, with SASS used as the pre-processor for CSS. React-Redux paired with Redux-Sagas for global app state management and asynchronous logic.
            </p>
            <p>
                The three were used to create a framework for implementing data model operations, state management and UI component building.
            </p>
            <p>
                It consisted of two abstract classes for data model implementation: The <span className="font-semibold">Model</span> class and the <span className="font-semibold">ModelSaga</span> class. For UI building it had a suite of generic components as well as components to help compose Forms, Views and Tables.
            </p>

            <h3 className="sub-heading">Model Class</h3>
            <p>
                A Model class describes the front-end equivalent for a back-end data model, including the class structure, Redux state management, the list of available endpoints, and any front-end user action to help user flows.
            </p>

            <CodeDisplay code={`class Model extends BaseModel {
    static actions: {};
    static actionCreators: {};
    static endpoints: {};
    static reducer: (state: {}, action: string) => {};

    id: string;
    name: string;
    description: string;

    constructor(props: { [key: string]: any }) {
        super();
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
    }
}`
            } />

            <h3 className="sub-heading">Saga Class</h3>
            <p>
                A model Saga class contains all the user flows for a data model. Each user flow defined as a saga function that is executed asynchronously as a side effect. It includes functions for polling updates, form submission and validation, and others such as coordinating a guided job submission.
            </p>

            <CodeDisplay code={`class ModelSaga extends BaseSaga {
    *submit();
    *edit();
    *delete();
    *queryObjects();
    *pollObjects();
    *startGuidedJobSubmission();
    *validateForm();
}`
            } />

            <h3 className="sub-heading">Forms and Views</h3>
            <p>
                Forms, Views, Tables and others are composed with custom and generic React components.
            </p>
            <CodeDisplay code={`function SampleForm() {
    const state = useState(initialState);
    function inputHandler();
    function submit();

    return (
        <Form>
            <FormHeader/>
            <FormBody>
                <Dropdown />
                <Input />
                <TextArea />
                <Checkbox />
            </FormBody>
            <FormFooter/>
        </Form>
    )
}`
            } />
        </>
    )
}

function Internals() {
    return (
        <>
            <p>
                <span className="font-semibold">React-Router</span> is used for SPA page navigation, <span className="font-semibold">Axios</span> and a web worker for API requests, and custom hooks, functions and components for application development.
            </p>

            <h3 className="sub-heading">Component Library</h3>
            <p>
                The component library consists of reusable building blocks to help build pages, tables, views, forms, dialogs and more. Components were added as needed and would vary in complexity. Such as guided job form submissions and containers for switching items around.
            </p>
            <p>
                Customs hooks were created for generic component behaviours, similarly for helper functions and constants.
            </p>

            <h3 className="sub-heading">Authentication</h3>
            <p>
                Authentication was handled with session tokens obtained after login with the back-end server. Authenticating could be done with a username / password form or through configured third-party <span className="font-semibold">OIDC</span> providers.
            </p>

            <h3 className="sub-heading">API Requests</h3>
            <p>
                API requests were made with Axios. An interval would run to refresh tokens at their half life. All requests were proxied through a web worker that acted as a separate service to send requests; in order to seperate token storage from application code. We did not use cookies for authentication.
            </p>
        </>
    )
}
