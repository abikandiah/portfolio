import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { MessageBanner } from "../ui/banner";
import { UnorderedList } from "../ui/list";


export const thirdPartyServicesProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Third-Party Services Framework',
    duration: '2024',
    description: 'A full-stack framework to build integrations to third-party services.',
    tech: [techType.Java, techType.JavaScript, techType.JSX, techType.React, techType.Dropwizard, techType.RDBMS],

    sections: [
        { title: 'Overview', body: Overview },
        { title: 'The Framework', body: Framework }
    ]
};

function Overview() {
    return (
        <>
            <p>
                When integrating various third-party services, we found a clear, repeated pattern of basic setup (boilerplate) across database design, API code creation, and handling credentials. Previously, these integrations were built using unique, service-specific code without any common structure.
            </p>
            <p>
                This framework standardizes that common infrastructure into a generic, reusable pattern. It uses polymorphism to unify all these different service integrations under one system.
            </p>
            <p>
                The framework's architecture is defined by the following abstract and concrete components:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Data Layer</span>: Generic database models and tables that reference abstract types but store the specific implementation types.</li>
                <li><span className="font-semibold">API Layer</span>: Generic API resources that operate consistently using abstract types, but execute the specific code for their respective concrete implementation types.</li>
                <li><span className="font-semibold">User Interface</span>: Reusable frontend components designed for building service-specific forms, views, tables, and completing the standard OIDC login process.</li>
                <li><span className="font-semibold">Service Implementation</span>: A set of abstract classes that developers must extend to define the service's configuration, credentials storage, and REST client.</li>
            </UnorderedList>
            <p>
                <span className="font-semibold">Goal</span>: To create a highly efficient, scalable, and maintainable approach for continually adding new service integrations to the platform.
            </p>
        </>
    )
}

function Framework() {
    return (
        <>
            <p>
                To integrate a new service using this framework, developers must extend four core abstract classes. These classes define the unique behavior of the service while fitting into the framework's generic blueprint:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Third-Party Service</span>: Defines the necessary service-specific settings.</li>
                <li><span className="font-semibold">Third-Party Credential</span>: Handles the storage and retrieval of tokens, passwords and keys.</li>
                <li><span className="font-semibold">Third-Party REST Client</span>: Manages all direct communication (API requests and responses) with the third-party service.</li>
                <li><span className="font-semibold">Third-Party Session</span>: Controls the active connection state and lifecycle.</li>
            </UnorderedList>


            <h3 className="sub-heading">Third-Party Service</h3>
            <p>
                This is the primary abstract class that defines the configuration for a third-party service integration. It comes pre-built with common fields and is extended for type-specific needs:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Common Fields</span>: The abstract class includes fields like name, description, and active state, which are shared across all service implementations.</li>
                <li><span className="font-semibold">Type-Specific Fields</span>: Concrete implementations extend the abstract class to add unique fields, such as client ID, hostname, port, and other specialized settings.</li>
            </UnorderedList>
            <p>
                The class also includes abstract methods (like validation and update methods) that must be implemented by the specific service types. This design uses polymorphism as the foundation, allowing generic resources (such as the API and ORM (object-relational mapping)) to correctly execute the service-specific logic at runtime.
            </p>


            <h3 className="sub-heading">Third-Party Credential</h3>
            <p>
                The next abstract class to implement is the Third-Party Credential class. This abstract class is dedicated to securely managing all service authentication details, such as usernames, access tokens, refresh tokens, and relevant expiration dates.
            </p>
            <MessageBanner type="info"
                message={
                    <>
                        All sensitive data, including tokens and passwords, stored within this class are encrypted by the framework to ensure security.
                    </>
                } />

            <p>
                There is less implementation involved here when implementing the type-specific credential classes, developers only need to specify the supported authentication methods. The framework currently supports three common methods:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Username and password</span> authentication</li>
                <li><span className="font-semibold">Secret key</span> authentication</li>
                <li><span className="font-semibold">OIDC</span> (OpenID Connect) authentication</li>
            </UnorderedList>

            <p>
                Credentials can be configured at two distinct levels, providing flexibility based on the service's use case:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Per-Service Level</span>: Only a single user needs to sign in to grant platform-wide access. After this, all users can utilize that single credential to execute API requests.</li>
                <li><span className="font-semibold">Per-User Level</span>: Each individual user must sign in. Users cannot make API requests without their own dedicated credential.</li>
            </UnorderedList>

            <MessageBanner type="note"
                message="While the Per-Service Level allows a single set of credentials to be used by all users, users still need to be authorized for access to the third-party service. This effectively means that only users with specific platform authorization are allowed to utilize that single shared credential for API requests."
            />
            <MessageBanner type="info"
                message="Credential tokens, keys or passwords are never exposed, they are only used internally by the REST client when making API requests."
            />

            <p>
                Each supported authentication method requires its own specific frontend flow to obtain the service credential. Once successfully saved, the service REST client can use it to make API requests. Credentials can be deleted at any time. Furthermore, for the OIDC login flow, tokens are periodically refreshed if a corresponding refresh token was obtained during the initial authentication (not all flows provide a refresh token).
            </p>


            <h3 className="sub-heading">Third-Party REST Client</h3>
            <p>
                The Third-Party REST Client is the third abstract class developers implement, serving as the dedicated interface for communicating with the external service. It uses the service configuration and the service credentials to connect to and speak with the third-party service.
            </p>
            <p>
                While it requires implementing specific abstract methods for testing and validation, the class is mostly implementation-focused. It comes with built-in capabilities for making REST API calls, including:
            </p>
            <UnorderedList>
                <li><span className="font-semibold">Resilience</span>: It supports tolerating rate-limiters and handling unexpected failures automatically.</li>
                <li><span className="font-semibold">Robust Handling</span>: Achieved via exponential-back off logic and automated HTTP response code checking.</li>
            </UnorderedList>
            <p>
                This makes integrating the actual API logic straightforward and robust.
            </p>


            <h3 className="sub-heading">Third-Party Session</h3>
            <p>
                The Third-Party Session is the final abstract class, acting as the container and primary access point for the entire third-party service integration.
            </p>
            <p>
                It integrates the three previous classes (Configuration, Credentials, and REST Client) and provides essential session-tracking logic. This includes capturing important data like request and response metadata, application logging, and any errors encountered during the connection.
            </p>

            <MessageBanner type="info"
                message="The third-party session only lives in memory and is never written to the database. It is short-lived and is evicted after a period of inactivity. Each user has their own session object and uses it when working with a third-party service." />


            <h3 className="sub-heading">Third-Party Service Operations</h3>
            <p>
                This is the final piece of the puzzle—the reason we build these integrations in the first place. We integrate with third-party services (like Google Vault, Microsoft Purview, or Relativity) to provide workflow operations that perform work directly within those systems.
            </p>
            <p>
                This framework provides the foundation that these operations consume: the defined <strong>Service Configurations, Credentials, REST Client, and Session</strong>. This allows us to build powerful, consistent workflows that interact reliably with any integrated service.
            </p>
            <MessageBanner type="info"
                message="To use a third-party service operation within a workflow, the corresponding third-party service must be configured and authorized." />


            <h3 className="sub-heading">Generic Database ORM (Object-Relational Mapping)</h3>
            <p>
                The framework achieves generic database binding and mapping of all implementation classes through the use of GSON and its built-in support for polymorphic types.
            </p>
            <p>
                The binding logic is defined on the abstract types. By registering each new third-party service implementation with GSON, the library can intelligently perform type-specific serialization and deserialization—meaning it knows exactly how to read and write the unique fields for each service type.
            </p>
            <p>
                To allow all third-party services to share the same database tables and schemas, we employ a simplified design:
            </p>
            <UnorderedList>
                <li><strong>Column Storage</strong>: The database schema only uses standard columns for common fields found in the abstract classes (e.g., ID and active state).</li>
                <li><strong>JSON Column Storage</strong>: All remaining, type-specific class fields are serialized into a single JSON object and stored in one designated database column.</li>
            </UnorderedList>
            <p>
                This approach ensures the underlying database structure remains uniform, while the ORM handles the task of extracting the correct, type-specific object from the JSON column using GSON.
            </p>


            <h3 className="sub-heading">Generic API Resource</h3>
            <p>
                The generic API resource is crucial for maintaining polymorphism across the entire platform. It defines all endpoints to work strictly with abstract types, leaving GSON to automatically handle the serialization and deserialization of objects into their correct, underlying implementation types.
            </p>
            <p>
                To handle requests that require unique, type-specific behavior, we do not create separate API endpoints. Instead, the framework exposes a generic proxy endpoint.
            </p>
            <p>
                This endpoint calls a corresponding proxy abstract method defined in the Service REST Client and Session classes. This pattern ensures the API resource layer remains entirely generic and polymorphic, while the service implementation executes the necessary unique logic.
            </p>
            <p>
                The generic API endpoints supports essential functions:
            </p>
            <UnorderedList>
                <li><strong>CRUD</strong> (Create, Read, Update, Delete) operations.</li>
                <li><strong>Proxying</strong> unique, service-specific requests.</li>
                <li><strong>Querying</strong> lists of objects from the third-party service.</li>
            </UnorderedList>
            <p>
                Further generic endpoints are added as the framework evolves.
            </p>

            <h3 className="sub-heading">Frontend Implementation</h3>
            <p>
                The frontend architecture consists of generic building-block components designed to assemble and support any third-party service implementation.
            </p>
            <p>
                These reusable components include:
            </p>
            <UnorderedList>
                <li><strong>Core UI</strong>: Generic forms, tables, and views for displaying configuration and data.</li>
                <li><strong>Authentication</strong>: Necessary authentication forms supporting all framework methods (username/password, secret key, and the OIDC login flow).</li>
                <li><strong>Session View</strong>: A dedicated view for monitoring the state of the active session.</li>
            </UnorderedList>
        </>
    )
}

