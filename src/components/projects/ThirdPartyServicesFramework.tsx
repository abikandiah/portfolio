import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";
import { Banner } from "../ui/banner";
import { UnorderedList } from "../ui/list";


export const thirdPartyServicesProject: ProjectProps = {
    type: projectType.NuixRampiva,
    name: 'Third-Party Services Framework',
    duration: '2024',
    description: 'A full-stack framework to build connectors to third-party services and APIs.',
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
                Our automation platform is a giant integration of many third-party services, such as Google and Microsoft. A lot of the boilerplate for establishing, managing and using the third-party services followed a similar pattern. Recognizing this, as well as the need for more third-party services, we decided it'd be best to create a framework for integrating them.
            </p>
            <p>
                This framework consisted of the database binding and mapping of objects, the CRUD endpoints and the front-end counterpart, authentication and authorization, a REST client session, and a set of third-party service operations. These were all defined as abstract and generic classes that needed to be extended and implemented.
            </p>
        </>
    )
}

function Framework() {
    return (
        <>
            <p>
                To integrate a third-party service, a set of abstract classes needed to be implemented. One for the configuration details of the service, another for the credential storage and a final for the REST client session.
            </p>
            <Banner type="info"
                message="The implemented classes needed to be tracked by GSON (Java-to-JSON serializer/deserializer) so that it can properly serialize and deserialize the implementation types when dealing with the generic database storage and CRUD endpoints; which would only reference the abstract type."
            />

            <h3 className="sub-heading">Third-Party Service</h3>
            <p>
                The Third-Party Service class was used to describe all the configuration details for a third-party service. It contained the basic information such as the name, description, active state, and etc. It would also contain service specific information such as the client ID, hostname, port, and others.
            </p>
            <p>
                This class also defines the validation and update methods used by the generic CRUD endpoints. The CRUD endpoints operate on the abstract class rather than implementations, so this is how type-specific validations and updates are handled.
            </p>
            <Banner type="info"
                message="The CRUD endpoints and the database storage ORM (object-relational mapping) only ever reference the abstract types. All type-specific behaviour would be handled with abstract method implementations, such as the case for validation and object updates. This allowed all third-party service implementations to be handled by a single database table and a single set of CRUD endpoints, because they would only ever work with the single abstract type."
            />

            <h3 className="sub-heading">Third-Party Credential</h3>
            <p>
                The Third-Party Credential class was used to store and encrypt access credentials relating to the third-party service, such as access and refresh tokens.
            </p>
            <p>
                Multiple modes of authentication were supported, such as token, secret key, username/pass, and none. Implementation specifics included setting the available modes of authentication for a service.
            </p>
            <p>
                Credentials had one of two scopes:
            </p>
            <UnorderedList>
                <li>Service-level: There is only one credential for the third-party service and all users make requests with the one credential.</li>
                <li>User-level: Each user needs their own credential when making requests to the third-party service.</li>
            </UnorderedList>

            <h3 className="sub-heading">Third-Party REST Session</h3>
            <p>
                The Third-Party REST Session contained everything to do with making API requests to a third-party service. This was a highly implementation-specific class and would mirror the available API endpoints of the third-party service. The abstract class would implement the boilerplate involved with creating and managing the REST client as well as the fault tolerance of it all. It came pre-built with an exponential backoff and in-depth metadata logging of the requests and responses.
            </p>

            <h3 className="sub-heading">API Resource</h3>
            <h3 className="sub-heading">Database ORM (Object-Relational Mapping)</h3>

            <h3 className="sub-heading">Front-End Implementation</h3>
            <p>
                The front-end consisted of generic building-block components to put together third-party service implementations. This included forms, tables and views, as well as the necessary authentication forms for username/pass, secret keys and the whole OAuth and OIDC login flow for access and refresh tokens.
            </p>
            <p>
                The implemented third-party services are separated in their own section and have a view to their REST client session. From there, the client status and logs can be viewed.
            </p>
            <p>Can also be reset and logged out and logged in, etc.</p>
        </>
    )
}
