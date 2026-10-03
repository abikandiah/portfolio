---
name: Third-Party Services Framework
type: Work
startYear: 2024
endYear: 2024
description: A full-stack framework to build integrations to third-party services.
tech: [Java, Dropwizard, React, RDBMS, JavaScript]
related: [google-vault-collector, microsoft-ediscovery-collector]
---

## Overview

When integrating various third-party services, we found a clear, repeated pattern of basic setup (boilerplate) across database design, API code creation, and handling credentials. Previously, these integrations were built using unique, service-specific code without any common structure.

This framework standardizes that common infrastructure into a generic, reusable pattern. It uses polymorphism to unify all these different service integrations under one system.

The framework's architecture is defined by the following abstract and concrete components:

:::terms

- **Data Layer**: Generic database models and tables that reference abstract types but store the specific implementation types.
- **API Layer**: Generic API resources that operate consistently using abstract types, but execute the specific code for their respective concrete implementation types.
- **User Interface**: Reusable frontend components designed for building service-specific forms, views, tables, and completing the standard OIDC login process.
- **Service Implementation**: A set of abstract classes that developers must extend to define the service's configuration, credentials storage, and REST client.

:::

**Goal**: To create a highly efficient, scalable, and maintainable approach for continually adding new service integrations to the platform.

## The Framework

To integrate a new service using this framework, developers must extend four core abstract classes. These classes define the unique behavior of the service while fitting into the framework's generic blueprint:

:::terms

- **Third-Party Service**: Defines the necessary service-specific settings.
- **Third-Party Credential**: Handles the storage and retrieval of tokens, passwords and keys.
- **Third-Party REST Client**: Manages all direct communication (API requests and responses) with the third-party service.
- **Third-Party Session**: Controls the active connection state and lifecycle.

:::

### Third-Party Service

This is the primary abstract class that defines the configuration for a third-party service integration. It comes pre-built with common fields and is extended for type-specific needs:

:::terms

- **Common Fields**: The abstract class includes fields like name, description, and active state, which are shared across all service implementations.
- **Type-Specific Fields**: Concrete implementations extend the abstract class to add unique fields, such as client ID, hostname, port, and other specialized settings.

:::

The class also includes abstract methods (like validation and update methods) that must be implemented by the specific service types. This design uses polymorphism as the foundation, allowing generic resources (such as the API and ORM (object-relational mapping)) to correctly execute the service-specific logic at runtime.

### Third-Party Credential

The next abstract class to implement is the Third-Party Credential class. This abstract class is dedicated to securely managing all service authentication details, such as usernames, access tokens, refresh tokens, and relevant expiration dates.

:::info

All sensitive data, including tokens and passwords, stored within this class are encrypted by the framework to ensure security.

:::

There is less implementation involved here when implementing the type-specific credential classes, developers only need to specify the supported authentication methods. The framework currently supports three common methods:

- **Username and password** authentication
- **Secret key** authentication
- **OIDC** (OpenID Connect) authentication

Credentials can be configured at two distinct levels, providing flexibility based on the service's use case:

:::terms

- **Per-Service Level**: Only a single user needs to sign in to grant platform-wide access. After this, all users can utilize that single credential to execute API requests.
- **Per-User Level**: Each individual user must sign in. Users cannot make API requests without their own dedicated credential.

:::

:::note

While the Per-Service Level allows a single set of credentials to be used by all users, users still need to be authorized for access to the third-party service. This effectively means that only users with specific platform authorization are allowed to utilize that single shared credential for API requests.

:::

Credential tokens, keys or passwords are never exposed, they are only used internally by the REST client when making API requests.

Each supported authentication method requires its own specific frontend flow to obtain the service credential. Once successfully saved, the service REST client can use it to make API requests. Credentials can be deleted at any time. Furthermore, for the OIDC login flow, tokens are periodically refreshed if a corresponding refresh token was obtained during the initial authentication (not all flows provide a refresh token).

### Third-Party REST Client

The Third-Party REST Client is the third abstract class developers implement, serving as the dedicated interface for communicating with the external service. It uses the service configuration and the service credentials to connect to and speak with the third-party service.

While it requires implementing specific abstract methods for testing and validation, the class is mostly implementation-focused. It comes with built-in capabilities for making REST API calls, including:

:::terms

- **Resilience**: It supports tolerating rate-limiters and handling unexpected failures automatically.
- **Robust Handling**: Achieved via exponential-back off logic and automated HTTP response code checking.

:::

This makes integrating the actual API logic straightforward and robust.

### Third-Party Session

The Third-Party Session is the final abstract class, acting as the container and primary access point for the entire third-party service integration.

It integrates the three previous classes (Configuration, Credentials, and REST Client) and provides essential session-tracking logic. This includes capturing important data like request and response metadata, application logging, and any errors encountered during the connection.

:::info

The third-party session only lives in memory and is never written to the database. It is short-lived and is evicted after a period of inactivity. Each user has their own session object and uses it when working with a third-party service.

:::

### Third-Party Service Operations

This is the final piece of the puzzle—the reason we build these integrations in the first place. We integrate with third-party services (like Google Vault, Microsoft Purview, or Relativity) to provide workflow operations that perform work directly within those systems.

This framework provides the foundation that these operations consume: the defined **Service Configurations, Credentials, REST Client, and Session**. This allows us to build powerful, consistent workflows that interact reliably with any integrated service.

:::info

To use a third-party service operation within a workflow, the corresponding third-party service must be configured and authorized.

:::

### Generic Database ORM (Object-Relational Mapping)

The framework achieves generic database binding and mapping of all implementation classes through the use of GSON and its built-in support for polymorphic types.

The binding logic is defined on the abstract types. By registering each new third-party service implementation with GSON, the library can intelligently perform type-specific serialization and deserialization—meaning it knows exactly how to read and write the unique fields for each service type.

To allow all third-party services to share the same database tables and schemas, we employ a simplified design:

:::terms

- **Column Storage**: The database schema only uses standard columns for common fields found in the abstract classes (e.g., ID and active state).
- **JSON Column Storage**: All remaining, type-specific class fields are serialized into a single JSON object and stored in one designated database column.

:::

This approach ensures the underlying database structure remains uniform, while the ORM handles the task of extracting the correct, type-specific object from the JSON column using GSON.

### Generic API Resource

The generic API resource is crucial for maintaining polymorphism across the entire platform. It defines all endpoints to work strictly with abstract types, leaving GSON to automatically handle the serialization and deserialization of objects into their correct, underlying implementation types.

To handle requests that require unique, type-specific behavior, we do not create separate API endpoints. Instead, the framework exposes a generic proxy endpoint.

This endpoint calls a corresponding proxy abstract method defined in the Service REST Client and Session classes. This pattern ensures the API resource layer remains entirely generic and polymorphic, while the service implementation executes the necessary unique logic.

The generic API endpoints supports essential functions:

- **CRUD** (Create, Read, Update, Delete) operations.
- **Proxying** unique, service-specific requests.
- **Querying** lists of objects from the third-party service.

Further generic endpoints are added as the framework evolves.

### Frontend Implementation

The frontend architecture consists of generic building-block components designed to assemble and support any third-party service implementation.

These reusable components include:

:::terms

- **Core UI**: Generic forms, tables, and views for displaying configuration and data.
- **Authentication**: Necessary authentication forms supporting all framework methods (username/password, secret key, and the OIDC login flow).
- **Session View**: A dedicated view for monitoring the state of the active session.

:::
