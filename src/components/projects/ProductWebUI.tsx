import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { CodeDisplay } from "../ui/code";
import { UnorderedList } from "../ui/list";

export const automateWebApplicationProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Automate Web Application',
    duration: '2018 - 2025',
    description: 'The core React web application for the Automate product, providing users with a unified user interface for\
     configuration, job scheduling and result analysis. Developed with React, React Redux, Redux Sagas, React Router and a custom-built component library.',
    tech: [techType.JavaScript, techType.SASS, techType.JSX, techType.React, techType.ReactRedux,
    techType.ReduxSagas, techType.ReactRouter, techType.RestAPI, techType.OIDC, techType.Axios, techType.WebWorkers],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'The Framework', body: Framework },
        { title: 'Next, The Internals', body: Internals }
    ]
};

function Overview() {
    return (
        <>
            <p>
                This web application is the <span className="font-semibold">central management console</span> for the Automate platform. It is a React single-page application (SPA) created using the deprecated <code className="code">create-react-app</code> build setup. It provides a user interface for end-to-end management, enabling users to:
            </p>
            <UnorderedList>
                <li>Design and build custom workflows;</li>
                <li>Submit, schedule, and view workflow executions;</li>
                <li>Track and manage clients and matters;</li>
                <li>Configure platform settings and infrastructure;</li>
                <li>Manage users, roles and third-party services.</li>
            </UnorderedList>
            <p>
                The application was designed as a framework that includes all common data state management, operations and components, so to reduce the amount of work required to scale and extend, allowing the platform to grow from supporting fewer than 10 back-end data models to well over 30.
            </p>
            <p>
                It was built with a custom component library. The library began with the application and components were built as needed. Components were always built to be reusable. Custom hooks and helper functions were also defined as needed, to help with component lifecycles,  behaviours and state management.
            </p>
            <p>
                The framework uses an implementation pattern for integrating back-end data models in the front-end; including support for CRUD operations, polling and caching, and other coordinated flows.
            </p>
        </>
    )
}

function Framework() {
    return (
        <>
            <p>
                The web UI was built with a set of three main libraries: <span className="font-semibold">React</span>, <span className="font-semibold">React-Redux</span> and <span className="font-semibold">Redux-Sagas</span>. React is used for all things components and styling, with SASS used as the pre-processor for CSS. React-Redux paired with Redux-Sagas for global app state management and asynchronous front-end logic.
            </p>
            <p>
                The three were used to create a framework for implementing data model operations, application state management, authentication, error handling, data fetching and polling, and UI component building.
            </p>
            <p>
                It consisted of two abstract classes for data model implementation: The <span className="font-semibold">Model</span> class and the <span className="font-semibold">ModelSaga</span> class. For UI building it had a suite of generic components as well as components to help compose Forms, Views and Tables.
            </p>

            <h3 className="sub-heading">Model Class</h3>
            <p>
                A Model class describes the front-end equivalent for a back-end resource, including the class structure, Redux state management, the list of available endpoints, and any front-end user action to help user flows.
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
                A model's Saga class contains all the asynchronous action handlers for when more than global state change is needed. It includes functions for making queries, validations, polling, submitting and editing forms, managing API objects, and others such as starting a guided job submission.
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

            <p>
                Saga functions are provided as callbacks for action listeners. When an action is dispatched the sagas middleware will trigger all sagas that are listening for it. From a triggered saga, any other code can be executed, including dispatching further actions and Redux state changes.
            </p>
            <p>
                Actions can be dispatched from user actions or by any other code elsewhere in the app. They can be handled by either one ore more redux state reducers or by one or more saga functions.
            </p>

            <h3 className="sub-heading">Forms and Views</h3>
            <p>
                Forms, Views, Templates and others are composed with custom and generic React components. Styled as desired.
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
                <span className="font-semibold">React-Router</span> is used for SPA page navigation, <span className="font-semibold">Axios</span> and a <span className="font-semibold">web worker</span> for API requests, and custom hooks, functions and components for the UI / UX.
            </p>

            <h3 className="sub-heading">Component Library</h3>
            <p>
                The component library consists of generic re-usable form, view and template components. More complex and specific components were added as needed. Such as, tables with custom cells supporting inputs and dropdowns, and containers for switching items around.
            </p>
            <p>
                Custom hooks for any repeatable component internal action were created and re-used. Similarly for helper functions and constants.
            </p>

            <h3 className="sub-heading">Authentication</h3>
            <p>
                Authentication was handled with session tokens generated after login with the back-end server. Authenticating could be done with a username / password form or through configured third-party <span className="font-semibold">OIDC</span> providers.
            </p>

            <h3 className="sub-heading">API Requests</h3>
            <p>

            </p>
        </>
    )
}
