---
name: Microsoft eDiscovery Collector
type: Work
startYear: 2022
endYear: 2024
description: An integration of the Microsoft Purview eDiscovery tool into the workflow automation platform, providing a structured, automated approach for end-to-end data collections.
tech:
  [
    Java,
    Dropwizard,
    React,
    MicrosoftEDiscovery,
    AzureAD,
    OIDC,
    JavaScript,
    SASS,
  ]
related: [third-party-services-framework, google-vault-collector]
---

## Overview

**Microsoft Purview eDiscovery** is the eDiscovery tool for managing legal holds and collecting data across all Microsoft 365 services. This integration connects Purview eDiscovery directly to the automation platform, enabling users to perform Purview operations—including creating cases, adding custodians, and exporting data—as steps within automated workflows.

To use this integration, users must first provide their M365 connection details and authorize access as an eDiscovery Administrator. Authentication and authorization are handled securely using a standard OAuth with OIDC login flow. The integration itself is implemented as a set of workflow operations, featuring a guided job wizard to simplify submitting jobs to the automation platform's scheduler.

## Deep Dive

This feature is an implementation of the [Third-Party Services Framework](/projects/third-party-services-framework). There are four main parts: The Purview eDiscovery **Service Configuration**, the set of **Purview eDiscovery Operations**, the **REST Client**, and the guided **Job Wizard**.

:::info

This integration is similar to the Google Vault integration, as both are built upon the same **Third-Party Services Framework** core structure. They differ only in the service-specific operations available for each platform.

:::

### Service Configuration

To begin, users must define the service configuration. This configuration stores all the necessary details to connect to and manage a Purview eDiscovery environment, including the Microsoft Entra ID app registration and OIDC connection settings required to support the secure OAuth and OIDC login flow.

:::note

The automation platform must be registered as a Microsoft Entra ID application. This step enables OIDC authentication, ensuring the platform has the required scopes and permissions to be authorized for delegated Purview eDiscovery API requests.

:::

### Authentication and Authorization

Next, delegated authorization must be secured to perform operations on the eDiscovery administrator's behalf. An eDiscovery manager signs in and grants this access via a secure OAuth with OIDC login flow. Upon successful authorization, the automation platform receives the necessary access token to make REST API requests. For secure, long-term use, this token is then encrypted, stored, and periodically refreshed until the user explicitly revokes access.

Delegated authorization can be configured at either a **per-service** level or a **per-user** level:

- The **per-service** level requires only one user to sign in and grant access, after which all users can use that single token to perform API requests.
- The **per-user** level requires each user to provide their own delegated authorization; without which they cannot make API requests.

:::info

Access token details are never exposed, they are only used internally by the REST client.

:::

### Purview eDiscovery Operations

Once the service configuration is defined and delegated authorization is obtained, users can begin to define and execute automated workflows that incorporate Purview eDiscovery operations.

Operations were designed based on the available Purview eDiscovery API and common user workflows, with a focus on modularity. This approach gives users the flexibility to create and customize various Purview eDiscovery workflows, including complete end-to-end collection, search and query, or simple export and download workflows.

For example, key operations include: `Set eDiscovery Case`, `Add Custodian`, `Add Data Source`, `Add to Review Set`, `Export Review Set`, and `Download Export`.

### REST Client

The platform manages and creates a dedicated REST client for all Purview eDiscovery API requests, with the following behaviors:

:::terms

- **Authentication**: Requests are authenticated using the access token obtained during the eDiscovery administrator sign-in.
- **Logging**: A circular buffer tracks requests, response metadata, and errors for debugging and auditing.
- **Fault Tolerance**: Exponential backoffs and response code validations are used to provide tolerance against rate limiters and unexpected API failures.

:::

This client is short-lived, created only when needed, and is automatically torn down after a brief period of inactivity.

### Job Wizard

The Job Wizard is a guided frontend tool designed to help users define key operation parameters when submitting workflow jobs. It achieves this by providing guided panels for each Purview eDiscovery operation within the workflow. Each panel internally makes API requests to fetch necessary values—such as the list of available cases, data sources, and exports—for user selection.

:::note

Workflows can be customized using hard-coded settings (defined during workflow creation) and execution-time setting (provided via the user during submission). The Job Wizard utilizes these execution-time settings to help users define the operation parameters.

:::

Guided operation panels are only rendered if their corresponding operation is present in the workflow. Users are free to mix-and-match operations, and the guided experience will automatically adjust to reflect these choices, enabling them to create a submission process that suits their workflow needs.
