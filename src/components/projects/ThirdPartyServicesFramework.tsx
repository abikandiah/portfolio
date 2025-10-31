import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { Banner } from "../ui/banner";
import { UnorderedList } from "../ui/list";


export const thirdPartyServicesProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Third-Party Services Framework',
    duration: '2024',
    description: 'A full-stack framework to build connectors to third-party services.',
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
                This is a framework for integrating third-party services into our platform. We regularly work with and integrate third-party services, and all the setup and boilerplate is very similar, so we decided it'd be best to create a generic implementation pattern to help ease our lives.
            </p>
            <p>
                Normally when integrating a third-party service, we'd do it cut-and-dry without any abstraction and be very specific to the third-party service we're integrating. However, when you look at it from afar, a visible boilerplate pattern can be seen. It just needed to be abstracted out and argued into a generic, repeatable and efficient pattern.
            </p>
            <p>
                That's where this framework came in; as a solution to the generic, repeatable pattern. This framework consists of the following:
            </p>
            <UnorderedList>
                <li>Generic database models and tables where everything references abstract types but stores the implementation types</li>
                <li>Generic API resources where everything references abstract types but operates on the implementation types</li>
                <li>Generic frontend components for building type-specific forms, views, tables, and for completing the OIDC login flow</li>
                <li>Abstract classes used to implement the third-party service configuration, credentials and REST client</li>
            </UnorderedList>

            <Banner type="note"
                message="This framework uses polymorphism to create a boilerplate out of all the common behaviours of third-party service integrations."
            />
        </>
    )
}

function Framework() {
    return (
        <>
            <p>
                To implement this framework, a set of third-party service abstract classes need to be implemented. One for the service configuration, another for the credentials, one more for the REST client and a final one for the service session.
            </p>

            <h3 className="sub-heading">Third-Party Service</h3>
            <p>
                The first abstract class to implement is the Third-Party Service class is used to describe all the configuration details for a third-party service. It contains common info such as the name, description and active state. It also contains type-specific info such as the client ID, hostname, port and others. These type-specific fields are added with the type-specific implementations while the common info are present in the abstract classes (hence why they're common).
            </p>
            <p>
                The abstract class also contains abstract methods the implementation types need to implement, such as a validation method and an update method. This allows references to abstract types to execute code defined in implementation types due to polymorphism. This is the basis of how the generic API resource and database ORM (object-relational mapping) operate.
            </p>

            <h3 className="sub-heading">Third-Party Credential</h3>
            <p>
                The next abstract class to implement is the Third-Party Credential class. This class is used to store all the details regarding service credentials, such as the username, access token, refresh token and relevant dates. All tokens and passwords present in this class are encrypted for security.
            </p>
            <p>
                There is less implementation involved here when implementing the type-specific credential classes, only need to specify the supported authentication methods. This framework supports three common auth methods:
            </p>
            <UnorderedList>
                <li>Username and password authentication</li>
                <li>Secret key authentication</li>
                <li>OIDC authentication</li>
            </UnorderedList>

            <Banner type="note"
                message="Credentials can be tracked on a per-service level or on a per-user level. Per-service level shares a single credential for all users of the service while per-user requires each user to obtain their own credential. Per-service may sound fishy at first but our platform had further authorization rules that could limit the users who had access to a service, thus still allowing finer control for who can use the credential."
            />
            <Banner type="info"
                message="Credential tokens, keys or passwords are never exposed, they are only used internally by the REST client when making API requests."
            />

            <p>
                Each authentication method has it's own frontend flow for obtaining a service credential. Once saved, the service REST client can use it to make API requests. Credentials can be removed at any time. Tokens are also periodically refreshed if a corresponding refresh token was obtained when completing the OIDC login flow (not all flows return refresh tokens).
            </p>

            <h3 className="sub-heading">Third-Party REST Client</h3>
            <p>
                The third abstract class to implement is the Third-Part REST client. This is the class used to make API requests to the third-party service. It uses the service configuration and the service credentials to connect to and speak with the third-party service.
            </p>
            <p>
                The REST client requires implementing abstract methods for testing and validation, but it is mostly implementation-focused. It comes with built-in methods for making REST API calls and supports tolerating rate-limiters and unexpected failures via exponential back-off and response code-checking.
            </p>

            <h3 className="sub-heading">Third-Party Session</h3>
            <p>
                The final abstract class is the Third-Party Session class. This class integrates the three previous classes and provides additional session-tracking logic, such as request and response metadata, application logging and errors if any. It behaves as a container and access point for the whole third-party service integration.
            </p>
            <Banner type="info"
                message="The third-party session only lives in memory and is never written to the database. It is short-lived and is evicted after a period of inactivity. Each user has their own session object and uses it when working with a third-party service." />


            <h3 className="sub-heading">Third-Party Service Operations</h3>
            <p>
                The real final piece to the puzzle; why we even have third-party integrations to begin with. We integrate with so many third-party services because we provide workflow operations to perform work with those third-party services, such as performing work with Google Vault, Microsoft Purview eDiscovery, Nuix Discover or Relativity.
            </p>
            <p>
                This framework provides the third-party service configurations, credentials, REST client, and session that these operations consume. We then build workflows with them to interact with third-party services.
            </p>
            <Banner type="info"
                message="To use a third-party service operation in a workflow, the corresponding service configuration and credential need to be defined." />


            <h3 className="sub-heading">Generic Database ORM (Object-Relational Mapping)</h3>
            <p>
                The database binding and mapping of implementation classes to the database model and vice-versa is done mostly with the power of GSON and it's ability to understand the polymorphic types. The binding and mapping were defined on the abstract type but by letting GSON know about the implementation types (every time a third-party service is integrated we need to let GSON know) it is able to deduce type-specific serialization and deserialization.
            </p>
            <p>
                There is also one hack required. The database schema did not consist of columns for all the class fields; instead, only relevant and abstract class fields, such as the ID and active state, were stored as columns, while the rest were shoved into a JSON column as a single serialized JSON object. This allowed the sharing of database tables and schemas for all the third-party service types.
            </p>

            <h3 className="sub-heading">Generic API Resource</h3>
            <p>
                The generic API resource also made excellent use of GSON's power, defining all endpoints to work with abstract types and leaving GSON to handle serializing and deserializing objects into the correct implementation type. This worked perfectly; all that was required was telling GSON the list of implementation types.
            </p>
            <p>
                When an implementation type needs a specific endpoint or behaviour, it is not added as a type-specific endpoint in the generic API resource, instead it is exposed through a generic proxy endpoint which in turns calls a <span className="font-semibold">proxy abstract method</span> defined in the third-party service REST session and client. This is done to always maintain generic and polymorphic behaviour.
            </p>
            <p>
                The generic API endpoints support endpoints for CRUD (create-read-update-delete), proxying requests and for querying list of objects from the third-party service. Further generic endpoints are added as needed.
            </p>

            <h3 className="sub-heading">frontend Implementation</h3>
            <p>
                The frontend consisted of generic building-block components to put together the third-party service implementations. This included forms, tables, views, and the necessary authentication forms for the various authentication methods (username and pass, secret key and the OIDC login flow). It also consists of the view for the third-party serive session.
            </p>
        </>
    )
}
