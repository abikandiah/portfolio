---
name: Google Vault Collector
type: Work
startYear: 2024
endYear: 2024
description: An integration of the Google Vault eDiscovery tool into the workflow automation platform, providing a structured, automated approach for end-to-end data collections.
tech:
  [Java, Dropwizard, React, GoogleVault, GoogleCloud, OIDC, JavaScript, SASS]
related: [third-party-services-framework, microsoft-ediscovery-collector]
---

## Overview

**Google Vault** is the dedicated eDiscovery tool for Google Workspace, allowing admins to search, review, and export data. This integration connects Vault's core functions to the automation platform, allowing users to include these operations as steps in their automated workflows. For example, a user can execute a Vault search and export, download and process the data, and then upload the collected information to a supported review platform.

To use this integration, users must first provide their Google Workspace connection details and authorize access using their Google Vault admin credentials. Authentication and authorization are handled securely via a standard OAuth with OIDC login flow. The integration itself is implemented as a set of workflow operations, with a guided job wizard to simplify the submission of workflow jobs to the automation platform's scheduler.

## Deep Dive

This feature is an implementation of the [Third-Party Services Framework](/projects/third-party-services-framework). There are four main parts: The Google Vault **Service Configuration**, the set of Google **Vault Operations**, the **REST Client**, and the guided **Job Wizard**.

:::info

This integration is similar to the Microsoft Purview eDiscovery integration, as both are built upon the same **Third-Party Services Framework** core structure. They differ only in the service-specific operations available for each platform.

:::

### Service Configuration

The first step to using this integration is to define the necessary service configuration for the Google Workspace and Vault environment. This configuration contains all the details required to connect to and manage Google Vault, including the Google Cloud project details required to support the secure OAuth and OIDC login flow.

:::note

Users must create and properly configure a dedicated Google Cloud project within their Google Workspace environment. This is required for setting up OIDC authentication with the necessary scopes and permissions, to allow authorizing the platform to perform delegated Google Vault API requests.

:::

### Authentication and Authorization

The second step involves securing delegated authorization to perform operations on the Vault administrator's behalf. A vault administrator must sign in and grant this access via a secure OAuth with OIDC login flow. Upon successful authorization, the platform receives the necessary access token to make the necessary REST API requests. For secure, long-term use, this token is encrypted, stored and periodically refreshed until the user explicitly revokes access.

Delegated authorization can be configured at either a **per-service** level or a **per-user** level:

- The **per-service** level requires only one user to sign in and grant access, after which all users can use that single token to perform API requests.
- The **per-user** level requires each user to provide their own delegated authorization; without which they cannot make API requests.

:::info

Access token details are never exposed, they are only used internally by the REST client.

:::

### Vault Operations

Once the service configuration is defined and delegated authorization is obtained, users can begin to define and execute automated workflows that incorporate Vault operations.

Built upon the Google Vault APIs and common user workflows, the Vault operations were designed with a focus on modularity. This flexibility allows users to create and execute a variety of workflows, including complete end-to-end data collection, detailed search and query, or simple export and download workflows.

Consider the `Set Vault Matter` operation as an example. This operation combines the creation and selection of a Vault Matter into one step. Based on the `create if doesn't exist` option, the operation will either create a new Matter or selects the existing one. Afterwards, the operation sets it as a global variable, making it accessible to all subsequent workflow operations.

:::info

This is a required operation in most workflows, as it specifies which Matter all future operations will work with.

:::

### REST Client

The platform manages and creates a dedicated REST client for all Google Vault API requests, with the following behaviors:

:::terms

- **Authentication**: Requests are authenticated using the access token obtained during the Vault administrator sign-in.
- **Logging**: A circular buffer tracks requests, response metadata, and errors for debugging and auditing.
- **Fault Tolerance**: Exponential backoffs and response code validations are used to provide tolerance against rate limiters and unexpected API failures.

:::

This client is short-lived, created only when needed, and is automatically torn down after a brief period of inactivity.

### Job Wizard

The Job Wizard is a guided frontend tool designed to help users define key operation parameters when submitting workflow jobs. It achieves this by providing guided panels for each Vault operation within the workflow. Each panel internally makes API requests to fetch necessary values—such as the list of available matters, data sources, and exports—for user selection.

:::note

Workflows can be customized using hard-coded settings (defined during workflow creation) and execution-time setting (provided via the user during submission). The Job Wizard utilizes these execution-time settings to help users define the operation parameters.

:::

Guided operation panels are only rendered if their corresponding operation is present in the workflow. Users are free to mix-and-match operations, and the guided experience will automatically adjust to reflect these choices, enabling them to create a submission process that suits their workflow needs.
