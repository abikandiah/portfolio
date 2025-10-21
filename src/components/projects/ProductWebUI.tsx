import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { Banner } from "../ui/banner";
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
        { title: 'Overview', body: Overview },
        { title: 'Chapter One: The Beginning', body: TheBeginning },
        { title: 'Next, The Internals', body: Internals }
    ]
};

function Overview() {
    return (
        <>
            <p>

            </p>
        </>
    )
}

function TheBeginning() {
    return (
        <>
            <p>
                The web UI was built with a set of four main libraries: <span className="font-semibold">React</span>, <span className="font-semibold">React-Redux</span> and <span className="font-semibold">Redux-Sagas</span>. React is used for all things components and styling, with SASS used as the pre-processor for CSS. React-Redux paired with Redux-Sagas for global app state management and asynchronous front-end business logic.
            </p>
            <p>
                The three were used to create a framework for application startup, authentication, queries and polling, CRUD operations for API classes, and UI component building.
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

            <CodeDisplay code={`class Saga extends BaseSaga {
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
                Saga functions are provided as callbacks for action listeners. When an action is dispatched the sagas middleware will trigger all sagas that are listening for it. From a triggered saga, any other code can be executed, including dispatching further actions and redux state changes.
            </p>
            <p>
                Actions can be dispatched from user actions or by any other code elsewhere in the app. They can be handled by either one ore more redux state reducers or by one or more saga functions.
            </p>

            {/* Tip Example (Blue/Lightbulb) */}
            <Banner
                type="info"
                title="Pro Tip: Use Context API"
                message="For state that needs to be accessed by many components, consider using React's Context API to avoid prop drilling."
            />

            {/* Note Example (Green/Info) */}
            <Banner
                type="note"
                title="Project Note"
                message="The deployment date has been moved up to next Friday. Please finalize all outstanding features by then."
            />

            {/* Warning Example (Yellow/Alert) */}
            <Banner
                type="warning"
                title="Low Disk Space"
                message="Your local development environment is running low on disk space. This may impact compilation speed."
            />

            {/* Alert/Error Example (Red/Error) */}
            <Banner
                type="alert"
                title="Critical Error: API Unavailable"
                message="The primary backend API is currently down. Contact the DevOps team immediately for resolution."
            />

            <p>
                The benefit of using Redux-Sagas comes from its natural asynchronous behavior with generator functions.
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
