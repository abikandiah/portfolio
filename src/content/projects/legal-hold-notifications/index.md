---
name: Legal Hold Notifications
type: Work
startYear: 2020
endYear: 2021
description: A communication platform for administrating and auditing legal holds.
tech: [Java, Dropwizard, React, LDAP, RDBMS, JavaScript, SASS]
---

## Overview

This is a specialized application designed for the **administration and communication** of legal holds. Its core function is to track custodians and manage the distribution of both notices and compliance surveys throughout the legal hold lifecycle. This platform is strictly a communication layer and does not interact with, manage, or place preservation holds on any underlying data systems.

The legal hold application is built as a combination of integrated, modular components:

:::terms

- **Notice Templating**: Defines notices using markdown and allows for the creation of compliance surveys with fully configurable form components.
- **SMTP Servers**: Used to define and configure the SMTP servers for sending all notification emails.
- **User Services**: Manages external services to source and synchronize the list of available users for custodian and administrator roles.
- **Workflow Triggers**: Used to submit workflows to the automation platform on legal hold events.
- **Legal Hold**: The central component that unifies all elements to configure, initiate, and administrate the complete legal hold lifecycle.

:::

## Notice Templates

Notices are first defined as **Notice Templates**. These templates are defined in a separate section and act as reusable blueprints to create the specific notice object used within a legal hold.

This modular approach offers several benefits:

- It allows reusability of notices across multiple legal holds.
- It separates the logic of defining notices from the legal hold process itself.
- Templates can be modified without affecting the notices already in use in existing legal holds.

Once a notice is generated for a legal hold, it becomes a distinct, separate object that exists solely for that specific hold, detached from its original template.

Notice templates have their own frontend and CRUD endpoints. They define the notice's markdown message, customizable parameters for use in a hold, and a list of survey questions for the custodian.

### Notice Comments

The Notice Comments system is a communication tool operating at the **notice event level**, designed to facilitate discussions regarding a specific custodian's notice.

It provides two distinct channels for communication:

:::terms

- **Custodian/Admin Communication**: This channel allows custodians to communicate directly with legal hold administrators about their notice.
- **Admin Notes (Internal)**: Administrators can submit private notes to each other on a custodian's notice, enabling internal discussions and tracking that are not visible to the custodian.

:::

## User Sources

All **custodians and administrators** must be selected from a central pool of users managed by the platform. There are multiple methods for sourcing these users:

:::terms

- **Manual Upload**: Directly upload a list of users to a self-managed user service.
- **Microsoft Entra ID (Azure AD)**: Connect and synchronize the user list from an Entra ID instance.
- **LDAP Server**: Connect and synchronize the user list from an LDAP server.

:::

All selected custodians and administrators draw from these sourced users. The list of users is cached within the platform's database, and synchronization occurs on a configurable, periodic basis. User sources can also be configured, updated, or removed as needed.

:::info

To successfully send **SMTP emails**, the sourced users must include **valid, working email addresses** for each user.

:::

## SMTP Servers

SMTP server configurations define the required details for a **self-hosted SMTP server**. This platform itself does not provide or run SMTP servers; this configuration serves as the connection bridge to external services (e.g., Google, Outlook, etc.).

The configuration requires standard connection details: **host, port, username and password**. All legal hold emails will appear to be sent from the specified username.

Similar to notice templates, SMTP server configurations have their own dedicated frontend and CRUD endpoints for easy management.

### Asynchronous Email Processing

The platform handles email delivery efficiently using an **asynchronous queuing system** powered by a threadpool. This ensures that sending emails—which can number in the thousands—does not block the application or require synchronous processing.

The backend service for email management includes endpoints for queue control, offering functionality to:

- **Export** and **Archive** the email history.
- **Retry** failed send attempts.
- **Purge** the email queue.

Emails are assigned a **state** to actively track their sending progress and record any errors encountered during the delivery process.

## SSO Links

SSO links are utilized in emails to provide custodians and administrators with simple, one-click access to legal hold and notice details. These links are short-lived and designed for **one-time use**, though they can be refreshed upon request.

### Security and Validation

The security of SSO links relies on symmetric encryption and a caching mechanism. An SSO link carries two main components:

::redacted{lines=2}

The payload is encrypted using a **secret key** maintained exclusively by the platform. To verify the integrity and authenticity of an incoming SSO link, the system performs the following steps:

::redacted{lines=3}

A successful match confirms that the platform created the payload.

### Expiration and Status Tracking

To manage validity, the platform uses caching to track active SSO links. Each cached link entry is assigned a TTL (Time-to-Live), and expired links are treated as a cache miss. Expired links, however, can still be refreshed by the user.

Upon system restart, all cached SSO links are lost and immediately become expired, though they remain refreshable.

:::info

SSO links are an optional feature of legal holds. Disabling them requires custodians and administrators to sign in manually.

:::

## The Legal Hold

A **Legal Hold** is the central object that governs the entire process. It is defined by the following components:

- The list of **custodians and administrators**.
- The configured **notices** to be sent (Hold, Survey, Release).
- The **SMTP server** used for all related emails.
- Optional **workflows** to be triggered on selected events.
- The overall status of the legal hold.

:::info

Notices and emails are optional and can be disabled if the system is used solely for tracking custodians. Workflow triggering is also optional.

:::

### Lifecycle Events

:::steps

1. **Activation**: Once activated, custodians receive **Hold Notices** to inform them of their obligations and optional **Survey Notices** for additional data collection.
2. **Release**: When the hold ends, all custodians receive **Release Notices**.
3. **Status Changes**: Administrators are notified of all significant legal hold status changes, and any configured workflows are automatically triggered for execution.

:::

### Custodian Interaction

Custodians can access and respond to their received notices by signing on manually or using the **SSO (Single Sign-On) links**.

- They can respond to a notice **only if it contains survey questions**.
- If a notice has no surveys, the custodian can only view the message.
- Custodians can contact administrators using **Notice Comments** on their individual notice event.

Notices can be configured to require responses or viewing by a **specific deadline**. The system supports sending **reminders** as the deadline approaches and initiating **escalations** if the deadline is missed.

:::info[Notice Event Tracking]

Custodians interact with **Notice Event** objects. A Notice Event tracks the receiving user, send/view dates, and survey responses. This event is derived from its **parent Notice object**, which defines the message and survey questions.

:::

Custodians and administrators are tracked as **participants** in a legal hold, each assigned specific roles and statuses.

### Workflow Triggers

Legal holds provide integration with the automation platform. Holds can be configured to submit workflows to the automation platform upon specific legal hold events, such as **activation** or **custodian release**.

These workflows receive detailed information about the triggering event, including data about the legal hold and the involved custodian(s). This effectively connects the legal hold application with the broader platform, allowing for the execution of any operation or workflow defined within the automation environment.

## Database Schema

All data models associated with the legal hold application are stored in the platform database. The following relations define the structure of the data:

| Component       | Relations                                                                   |
| --------------- | --------------------------------------------------------------------------- |
| Legal Hold      | Has multiple participations, events, and notices; uses one SMTP server.     |
| Notice Template | Can be used by multiple legal holds and can have multiple child notices.    |
| Notice          | Is attached to one legal hold and can have multiple notice events.          |
| User            | Can participate in multiple legal holds and receive multiple notice events. |
| SMTP Server     | Can be used in multiple legal holds.                                        |
