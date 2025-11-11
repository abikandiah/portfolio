import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { MessageBanner } from "../ui/banner";
import { CodeDisplay } from "../ui/code";
import { UnorderedList } from "../ui/list";

export const platformWebApp: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Platform Web Application',
    duration: '2018 - 2025',
    description: `A React-based management console for the Java backend, enabling users to create, schedule, and submit eDiscovery workflows for processing.`,
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
                This web application is the user interface for an enterprise automation platform, providing complete end-to-end management of the system. The application enables users to design, schedule, and monitor custom workflows while managing core data models (clients/matters), user access policies, system configuration, and third-party integrations. Built as a scalable React Single-Page Application (SPA) utilizing a custom abstraction framework.
            </p>
            <p>
                The frontend provides a centralized management console, featuring dedicated views for the full lifecycle of automation jobs (submission, viewing, and configuration) and comprehensive administrative control over the system. This functionality is supported by a design featuring multiple core data models and underpinned by a custom framework built for abstraction and long-term scalability.
            </p>
        </>
    )
}

function Framework() {
    return (
        <>
            <p>
                The framework defines a pattern for integrating backend data models into the frontend application. It standardizes common frontend concerns, offering built-in support for:
            </p>
            <UnorderedList>
                <li><strong>State Management</strong>: Enables querying, polling, and centralized, global tracking of application data model objects.</li>
                <li><strong>Data Operations</strong>: Full CRUD (Create, Read, Update, Delete) functionality.</li>
                <li><strong>Component Ecosystem</strong>: A suite of custom components, hooks, and utility functions to aid development.</li>
            </UnorderedList>
            <p>
                It's built with three main libraries:
            </p>
            <UnorderedList>
                <li><strong>React</strong>: For the base for the user interface, components, and styling (leveraging <strong>SASS</strong> as the CSS pre-processor).</li>
                <li><strong>React-Redux</strong>: Provides scalable global state management across the application.</li>
                <li><strong>Redux-Sagas</strong>: Supports defining and managing complex, asynchronous logic and side-effects.</li>
            </UnorderedList>

            <p>
                To successfully integrate data models according to this pattern, developers must extend two essential abstract base classes: The <span className="font-semibold">Model</span> class and the <span className="font-semibold">ModelSaga</span> class.
            </p>

            <h3 className="sub-heading">Model Class</h3>
            <p>
                The Model class serves as the central definition for a backend data model within the frontend. It describes the class structure, its integration with Redux state management, and registers the list of available API endpoints.
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
                The ModelSaga class is responsible for defining and controlling all asynchronous user flow handlers associated with a data model. These handlers are implemented as Redux Saga functions and are triggered by specific Redux actions.
            </p>
            <p>
                Its responsibilities encompass standard functions for data fetching and CRUD operations, as well as complex logic, such as coordinating multi-step guided job submissions.
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

            <h3 className="sub-heading">Component Ecosystem</h3>
            <p>
                The framework includes a suite of reusable components, custom hooks, and utility functions, designed to accelerate frontend development and maintain UI consistency.
            </p>
            <p>
                The components are utilized to construct core application views, including pages, popups, data tables, forms, and model-specific interfaces.
            </p>
            <p>
                The custom hooks provide abstracted utility and logic across a wide range of needs, from standard input handling and local data fetching to more complex operations, such as virtualized rendering and component intersection observation.
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
                The framework supports other common operations, such as authentication, API requests, and page navigation.
            </p>

            <h3 className="sub-heading">Authentication</h3>
            <p>
                Authentication is configurable and supports <strong>username/password forms</strong> or <strong>third-party OIDC providers</strong>.
            </p>
            <UnorderedList>
                <li>Upon successful backend login, the frontend receives a short-lived session token used for API authentication.</li>
                <li>For securty, this session token is isolated within a web worker and is not stored within a cookie.</li>
                <li>A refresh token is also utilized to automatically renew the session token at its half-life.</li>
            </UnorderedList>

            <h3 className="sub-heading">API Requests</h3>
            <p>
                All API requests are made with <strong>Axios</strong> and are routed through a dedicated web worker for token isolation.
            </p>
            <UnorderedList>
                <li>This approach ensures that the session token resides only within the web worker, enhancing security.</li>
                <li>The communication flow—from the application to the Web Worker and subsequently to the backend—is fully handled using Promises.</li>
            </UnorderedList>

            <h3 className="sub-heading">Page Navigation</h3>
            <p>
                Application navigation is managed using <strong>React-Router</strong>, built upon its <strong>Hash Router</strong> implementation.
            </p>
        </>
    )
}

