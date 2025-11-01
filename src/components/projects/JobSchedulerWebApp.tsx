import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { MessageBanner } from "../ui/banner";
import { CodeDisplay } from "../ui/code";
import { UnorderedList } from "../ui/list";

export const jobSchedulerWebApp: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Job Scheduler Web App',
    duration: '2018 - 2025',
    description: `A management console to create, schedule and submit eDiscovery workflows for execution. Built as a React web app with a Java backend.`,
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
                This web application is the frontend for a workflow job scheduler. It's built as a React single-page app (SPA) and provides a user interface for complete management of the scheduler tool, enabling users to:
            </p>
            <UnorderedList>
                <li>Design and build custom workflows</li>
                <li>Submit, schedule, and view workflow executions</li>
                <li>Track and manage clients and matters</li>
                <li>Manage users, roles and third-party services</li>
                <li>Configure settings and infrastructure</li>
            </UnorderedList>

            <p>
                It consists of pages to submit and view jobs, create and edit workflows, set user policies, and configure execution settings. The application contains several data models and uses a custom framework for abstraction and scaling.
            </p>
        </>
    )
}

function Framework() {
    return (
        <>
            <p>
                A pattern for integrating backend data models in the frontend. It provides support for common abstractions, such as state management and CRUD (Create, Read, Update and Delete) operations. It has its own custom component library, built from the ground up as needed, as well as custom hooks and utility functions.
            </p>
            <p>
                It was built with three main libraries: <span className="font-semibold">React</span>, <span className="font-semibold">React-Redux</span> and <span className="font-semibold">Redux-Sagas</span>. React is used for all things components and styling, with SASS used as the pre-processor for CSS. React-Redux paired with Redux-Sagas for global app state management and asynchronous logic. The three were used to create the app and the framework for common data model abstractions and frontend component building.
            </p>
            <p>
                There are two necessary abstract classes for data model integration: The <span className="font-semibold">Model</span> class and the <span className="font-semibold">ModelSaga</span> class.
            </p>

            <h3 className="sub-heading">Model Class</h3>
            <p>
                The Model class defines the data model in the frontend. It describes the class structure, Redux state management, list of available endpoints, and any user flows.
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
                The ModelSaga class defines all user flow handlers for a data model. Handlers are implemented as Redux saga functions and are executed asynchronously when triggered by an action. Functions include those for data fetching, CRUD operations and more complex ones such as coordinating a guided job submission.
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
            <MessageBanner type="note"
                message="Both Model and ModelSaga extend base classes that contain further abstractions and simplifications. These base classes also serve as the base for other, smaller use cases within the framework." />

            <h3 className="sub-heading">Component Library</h3>
            <p>
                The component library consists of a suite of reusable components and hooks. They're used to create pages, views, tables, forms and other model specific components. Hooks consists of utility functions such as input handlers, local data fetching, virtualized rendering, observing component intersections, and more. Components and hooks were added as needed and varied in complexity.
            </p>
            <CodeDisplay code={`function SampleForm() {
    const state = useState(initialState);
    const inputHandler = useInputHandler();
    const submit = useSubmit();

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
                The framework also had support for other common operations, such as authentication, API requests and page navigation.
            </p>

            <h3 className="sub-heading">Authentication</h3>
            <p>
                Authentication was configurable and could be done with a username / password form or through third-party OIDC providers. On-successful login with the backend server, a short-lived session token is returned for API authentication. This token only lives in the API request web worker; we did not make use of any cookies other than those for the OIDC auth flow. A refresh token is also received and used to refresh the session token on half-life.
            </p>

            <h3 className="sub-heading">API Requests</h3>
            <p>
                API requests are made with <span className="font-semibold">Axios</span>. All requests are proxied through a web worker for token isolation; only the web worker contained the session token. Whenever an API request was made, it would be sent to the web worker. The web worker then proxies it and returns the response. The communication between the app, the web worker and the backend are all handled with promises.
            </p>

            <h3 className="sub-heading">Page Navigation</h3>
            <p>
                Navigation was handled with <span className="font-semibold">React-Router</span> and it's hash router.
            </p>
        </>
    )
}
