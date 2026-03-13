# PropMange — Project Architecture

**Stack:** Spring Boot 4, Java 21, React 19, TypeScript, TanStack Router, TanStack Query, PostgreSQL, Liquibase, JWT / OIDC, Docker, Caddy, Authentik

---

## Sections

1. [Overview](#overview)
2. [Properties & Units](#properties--units)
3. [Lease Management](#lease-management)
4. [Lease Templates](#lease-templates)
5. [Tenant Portal](#tenant-portal)
6. [Organizations & Multi-Tenancy](#organizations--multi-tenancy)
7. [Membership & Access Control](#membership--access-control)
8. [Invitations & Onboarding](#invitations--onboarding)
9. [Activity & Audit Trail](#activity--audit-trail)
10. [Notifications](#notifications)
11. [Offline-First Architecture](#offline-first-architecture)
12. [Authentication & Security](#authentication--security)
13. [Infrastructure & Deployment](#infrastructure--deployment)
14. [Database Schema](#database-schema)

---

## Overview

PropMange is a full-stack property management system designed to handle the full operational lifecycle of rental properties — from unit availability and lease agreements to tenant communication and organizational billing. It is built as a monorepo containing two sub-projects: a **Spring Boot REST API** and a **React 19 frontend**, both deployed together via Docker Compose and Cloudflare.

The system is built around several integrated, modular components:

- **Properties & Units** — The foundational inventory of buildings and rentable spaces.
- **Lease Management** — A structured, state-machine-driven lease lifecycle covering creation through expiry or termination.
- **Tenant Portal** — A read-only, offline-capable view for tenants to access their active lease details.
- **Organizations & Multi-Tenancy** — All data is scoped to an organization, enabling the same platform to serve multiple independent property managers.
- **Membership & Access Control** — A fine-grained permission system that controls what each member of an organization can see and do.
- **Activity & Audit Trail** — A persisted event log that records all significant domain actions for transparency and auditability.
- **Notifications** — Email-based notifications triggered by lease lifecycle events and configurable per user.

The architecture emphasizes **data integrity**, **resilience**, and **developer ergonomics**. Key cross-cutting decisions — UUID v7 IDs, optimistic locking, idempotent mutations, and offline-first caching — are applied uniformly across both the backend and frontend.

---

## Properties & Units

Properties and units form the foundational data layer of the system. A **Property** (`Prop`) represents a physical building or land asset — it holds the legal name, address, and property type (e.g., residential, commercial). A **Unit** represents an individual rentable space within a property, with its own type, rent amount, and availability status.

### Hierarchy

Properties and units form a strict parent-child hierarchy. A unit always belongs to exactly one property, and a property can have many units. This relationship is enforced at the database level with a foreign key and at the API level: deleting a property with active units is rejected with a `422 Unprocessable Entity` response. Likewise, a unit with an active lease cannot be deleted.

### Unit Status

Units carry a `status` field that reflects their current availability: `VACANT`, `OCCUPIED`, or `MAINTENANCE`. This status is updated automatically as leases move through their lifecycle — when a lease is activated, the associated unit transitions to `OCCUPIED`; when a lease expires or is terminated, the unit returns to `VACANT`. This gives property managers an always-accurate inventory view without manual bookkeeping.

### Frontend

Both properties and units have their own dedicated list and detail views in the manager section of the UI. The list views support pagination and are backed by TanStack Query with optimistic updates — creating or updating a property or unit reflects in the UI immediately, before the server confirms the change.

---

## Lease Management

Lease management is the core workflow of PropMange. A **Lease** is the central agreement object that ties together a unit, a set of tenants, financial terms, and a period of occupancy. Lease management is implemented as a structured **state machine**, ensuring that leases move through their lifecycle in a controlled, auditable sequence.

### Lease Lifecycle

A lease begins in `DRAFT` status, where all fields can be freely edited. From there, it progresses through the following states:

| State | Description |
|---|---|
| `DRAFT` | Editable. All fields can be modified or the lease can be deleted. |
| `REVIEW` | Submitted for review. No further edits until resolved. |
| `SIGNED` | All required tenants have acknowledged the lease. |
| `ACTIVE` | Lease is live. The associated unit transitions to `OCCUPIED`. |
| `EXPIRED` | The lease end date has passed and the system has closed it out. |
| `TERMINATED` | The lease was ended early by a manager action. |
| `EVICTED` | The lease was ended due to an eviction workflow. |

Only `DRAFT` leases can be deleted. State transitions are triggered by dedicated API endpoints (`/submit`, `/activate`, `/terminate`) and are validated server-side — a lease cannot skip states or transition backwards.

### Lease Tenants

A lease can have multiple tenants, each assigned a role (e.g., `PRIMARY`, `CO_APPLICANT`). Tenants are linked to the lease via a join entity (`LeaseTenant`) that tracks their individual role and, in the future, their signing status. The multi-tenant structure allows for household configurations while keeping the primary contact distinct.

### Financial Terms

Each lease stores the monthly rent amount, security deposit, and the start and end dates of the tenancy. These values are stamped at lease creation and do not change once the lease moves past `DRAFT` — ensuring a reliable audit record of the original agreed terms.

### Frontend

The lease list view groups leases by status and provides quick-action menus for common transitions. The detail view shows all associated tenants, financial terms, and the full history of state transitions. Destructive actions (terminate, delete) are disabled when the lease status does not permit them, providing a clear affordance before the user even attempts the action.

---

## Lease Templates

Lease templates act as reusable blueprints for generating new leases. Rather than filling in lease terms from scratch each time, managers define a template once and stamp it onto a new lease during creation.

### Template Rendering

A lease template contains a Markdown body with parameterized placeholders — things like `{{tenant_name}}`, `{{unit_address}}`, and `{{start_date}}`. When a lease is created from a template, the `LeaseTemplateRenderer` replaces these placeholders with the actual values from the lease and its associated tenants and unit. The rendered output is stored on the lease itself, creating a standalone snapshot that is decoupled from the original template.

### Separation of Concerns

This separation is intentional: modifying a template after leases have been generated does not affect those existing leases. Each lease carries its own rendered copy of the agreement, giving managers a stable, auditable record of exactly what was agreed to at the time of signing.

### Frontend

Templates have their own management section in the UI with full CRUD support. When creating a new lease, managers can select a template from a dropdown, which pre-populates the lease body. Templates are also paginated and searchable.

---

## Tenant Portal

The tenant portal is a dedicated, read-only interface that gives tenants a direct view of their active lease without exposing any manager functionality. It is designed around the assumption that a tenant primarily needs to answer the question: *"What am I currently signed up to?"*

### Aggregate Endpoint

Rather than requiring the frontend to assemble tenant data from multiple API calls, the backend exposes a single aggregate endpoint: `GET /api/tenant/my-lease`. This endpoint reads the authenticated user's identity, finds their active `LeaseTenant` record, and returns a unified response containing the lease terms, the unit details, the property address, and their co-tenants — all in one payload.

### Long-Term Caching

The tenant portal query is cached aggressively — for up to 7 days — in the frontend's IndexedDB store. This is a deliberate design decision: a tenant's lease details rarely change, and a tenant may need to access this information on moving day when network connectivity is unreliable. The long cache TTL ensures they can always see their lease details regardless of connectivity.

### Read-Only Enforcement

The tenant portal routes are protected by a role-based layout guard (`_tenant`) in the frontend. Tenants cannot navigate to any manager-only routes. On the backend, the `my-lease` endpoint is restricted to the `ROLE_TENANT` authority, and all returned data is read-only — there are no mutation endpoints exposed in the tenant portal.

---

## Organizations & Multi-Tenancy

All data in PropMange is scoped to an **Organization**. An organization represents a single property management company or independent landlord. Every entity in the system — properties, units, leases, tenants — belongs to exactly one organization and is never visible to members of another.

### Data Isolation

Organization scoping is enforced at the service layer. Every query that fetches a list of resources filters by the active organization's ID. The active organization is derived from the authenticated user's JWT and their membership record. This means two organizations can have properties with identical names, and neither will ever see the other's data.

### Organization Context in the Frontend

The frontend holds the active organization in a React context (`OrganizationContext`). The active `orgId` is reflected in the URL as a search parameter (`?orgId=<uuid>`), making it bookmarkable and shareable. All API calls automatically include the `orgId` via an Axios request interceptor, so individual query hooks and mutation hooks do not need to manage it explicitly.

### Multi-Org Support

A single user can be a member of multiple organizations. The UI provides an organization switcher that updates the active `orgId` in the URL context and invalidates all cached queries, ensuring the user sees data for the newly selected organization immediately.

---

## Membership & Access Control

Membership defines the relationship between a user and an organization, including what that user is allowed to do. PropMange uses a two-layer permission model: **role-based access control** (RBAC) at the coarse level via JWT groups, and a **fine-grained permission policy system** (SPAC) for more specific authorization.

### Roles

At the broadest level, users carry a `groups` claim in their JWT (e.g., `ADMIN`, `MANAGER`, `TENANT`). These groups map to Spring Security's `ROLE_` authorities and gate entire sections of the API — a tenant cannot call manager endpoints regardless of their policy assignments.

### SPAC Permission Policies

Within an organization, managers can define **Permission Policies** and assign them to memberships. A policy encodes a specific permission as a structured string:

```
ACTION : DOMAIN : TARGET : ORG_ID
```

For example, `C:LEASE:ORG:abc123` grants the ability to create leases within organization `abc123`. Actions cover read (`R`), create (`C`), update (`U`), and delete (`D`). Domains include `PORTFOLIO`, `LEASE`, `TENANT`, `MEMBERSHIP`, and others. This allows fine-grained delegation — a property manager can be granted the ability to create and update leases without the ability to delete them or manage memberships.

### Frontend Permission Gating

The frontend mirrors this permission model in the UI. Before rendering action buttons or navigation items, components check the active user's resolved permissions. If a user lacks the `D:LEASE` permission, the delete option is hidden from the UI entirely — not just disabled — reducing visual clutter and preventing confusion. The server still enforces permissions independently, so UI-level hiding is an ergonomic enhancement, not a security boundary.

---

## Invitations & Onboarding

New members join an organization through an invitation flow. A manager creates an **Invite** by specifying the intended recipient's email address and desired role. The system generates a time-limited invite token and sends an email with a sign-up link.

### Invite Lifecycle

Invites carry a status: `PENDING`, `ACCEPTED`, or `EXPIRED`. Pending invites expire after 72 hours. If the recipient doesn't accept in time, the invite transitions to `EXPIRED` and the manager can resend it, which generates a new token and resets the expiry window.

### Onboarding Flow

When a new user follows the invite link, they are directed to the identity provider (Authentik in production, or the dev login endpoint in development) to create their account. Upon first login, the backend matches their verified email address against the pending invite record, creates their membership in the organization with the configured role, and marks the invite as `ACCEPTED`. This matching is done automatically — no additional steps are required from the inviting manager.

### Frontend

The invites section is available within the organization settings area. Managers can see all outstanding invites, their status, and the expiry date. Resend and revoke actions are available for pending invites.

---

## Activity & Audit Trail

All significant domain events in PropMange are persisted to an **activity event store**. This provides a running audit trail of what happened, who did it, and when — useful both for administrative review and as the data source for the dashboard activity feed.

### Event Architecture

The backend uses Spring's application event system to decouple event publishing from event handling. When a domain action occurs — a lease is activated, an invite is accepted, a member's role is changed — the responsible service publishes a typed domain event. An `ActivityEventListener` consumes these events using `@TransactionalEventListener(phase = AFTER_COMMIT)`, meaning events are only persisted after the originating transaction has successfully committed. This prevents phantom activity records from appearing if the primary transaction rolls back.

### Stored Data

Each `ActivityEvent` record captures the event type, the ID of the actor (the user who triggered it), the organization it belongs to, a timestamp, and a flexible `metadata` field (stored as JSONB in PostgreSQL) containing event-specific details — such as which lease was activated or which user was invited.

### API & Frontend

The activity feed is exposed via `GET /api/activity?orgId=<uuid>`, returning a paginated list of events in reverse-chronological order. In the frontend, the dashboard home page renders this feed as a real-time-feeling list of recent actions, giving managers an at-a-glance view of organizational activity without needing to navigate into individual record views.

---

## Notifications

PropMange delivers email notifications to relevant users when significant lease events occur. The notifications system is designed to be configurable per user — each user can choose which events they want to receive emails for.

### Event Triggers

Email notifications are triggered by lease lifecycle transitions: when a lease moves to `ACTIVE`, when it is nearing expiry, when it is terminated, or when a new tenant is added. The backend's event listener infrastructure (the same system used for activity events) handles notification dispatch asynchronously — email sending does not block the primary transaction.

### User Preferences

Each user has a `UserNotificationPreference` record per organization, storing a set of enabled notification types. Before sending an email, the notification service checks this preference record. If the user has disabled a particular notification type, the email is skipped.

### Delivery Tracking

Each outbound email is recorded as a `NotificationDelivery` record, capturing the recipient, the event type, the timestamp, and the delivery status (`PENDING`, `SENT`, `FAILED`). This allows administrators to audit whether critical notifications were delivered and provides a basis for retry logic on failures.

---

## Offline-First Architecture

The frontend is designed to remain functional during network outages. This is especially important for tenant users, who may need to reference their lease details in situations where connectivity is unreliable — on moving day, in a building with poor signal, or during a brief service disruption.

### IndexedDB Persistence

TanStack Query's cache is persisted to **IndexedDB** using Dexie. Each user gets their own isolated database (`prop-manager-{userId}`), ensuring that one user's cached data is never visible to another user on the same device. The cache is populated during normal online use and remains available when the user goes offline.

### Mutation Queuing

All mutations use `networkMode: 'online'`. When the user is offline, mutation calls are not dropped — they are paused and queued. When connectivity is restored, the queue is automatically drained and each mutation is replayed in order. The pending mutation queue is also persisted to IndexedDB, so queued mutations survive page refreshes and browser restarts.

### Idempotency

Because queued mutations may be replayed after a network interruption, each mutation is accompanied by a stable `X-Request-Id` header — a hash derived from the mutation key and payload. This allows the backend to detect and safely ignore duplicate requests, ensuring that a mutation that was partially submitted before a connectivity drop does not produce duplicate records when replayed.

### Cache Scoping and Invalidation

When a user logs out, their query client and associated IndexedDB database are cleared. When a user switches the active organization, all queries are invalidated and re-fetched, ensuring the UI reflects the correct organizational context.

---

## Authentication & Security

### JWT-Based Auth

PropMange uses JWT-based authentication via Spring's OAuth2 Resource Server. The frontend includes the JWT as a `Bearer` token on every API request, and the backend validates the token's signature and expiry before processing the request.

The JWT's `groups` claim is mapped to Spring Security `ROLE_` authorities. This means the identity provider — not the application — is the source of truth for a user's top-level role. Endpoint-level authorization uses `@PreAuthorize("hasRole('...')")` annotations, and method-level permission evaluation covers the SPAC policy checks.

### Development vs. Production

In the **development profile**, a local HS256 JWT is generated by the backend itself via a `POST /api/dev/login` endpoint. No external identity provider is required. The frontend stores the returned token in `localStorage` and the Axios client picks it up automatically on every request.

In **production**, authentication is delegated to **Authentik**, a self-hosted OIDC provider. The frontend performs a PKCE authorization code flow, and the resulting JWT is issued by Authentik. The backend validates these tokens against Authentik's JWKS endpoint via the `AUTH_ISSUER_URI` environment variable. This means the same codebase handles both environments with a profile switch, and no credentials are ever stored in the application.

### Rate Limiting & Audit Logging

Every inbound request passes through two filters before reaching a controller:

- **Rate Limiting**: A Resilience4j-backed filter enforces a cap of 100 requests per minute per IP address. Requests exceeding this limit receive a `429 Too Many Requests` response.
- **Audit Logging**: A filter logs every request — including the timestamp, the authenticated user, the endpoint, and the response status code — to provide a complete access log for security review.

---

## Infrastructure & Deployment

### Production Stack

The production environment is managed via Docker Compose and consists of five services:

| Service | Role |
|---|---|
| **PostgreSQL** | Primary relational database |
| **Spring Boot API** | Backend application server (port 8080, internal) |
| **Authentik** | Self-hosted OIDC identity provider |
| **Caddy** | Reverse proxy, TLS termination, forward auth |
| **Cloudflare Tunnel** | Exposes the stack without opening inbound firewall ports |

The frontend is hosted separately on **Cloudflare Pages**, which handles global CDN distribution and automatic deploys from the main branch.

### Request Flow

```
User → Cloudflare Pages (React SPA)
     ↓ (PKCE auth code flow)
User → Authentik (OIDC, issues JWT)
     ↓ (JWT in Authorization header)
User → Cloudflare Tunnel → Caddy (TLS, forward auth validation)
     ↓
Spring Boot API (re-validates JWT against JWKS)
     ↓
PostgreSQL
```

### Development Profile

In development, the full production stack is not required. The backend runs against an **H2 in-memory database** (no PostgreSQL needed), and authentication uses a local HS256 JWT via the dev login endpoint (no Authentik needed). The frontend dev server proxies all `/api` requests to `localhost:8080`. This allows the full application to run on a single machine with a single `mvnw spring-boot:run` and `pnpm dev`.

### Database Migrations

Schema changes are managed by **Liquibase**. All migrations live in a single changelog file (`initial-schema.yaml`), keeping the full schema history in one place. In production, Liquibase runs automatically on startup with `ddl-auto: validate` — the application will refuse to start if the schema does not match. In development, schema creation is handled by Hibernate directly and Liquibase is disabled.

---

## Database Schema

All data models are stored in PostgreSQL (production) or H2 (development). Every table includes `version` (for optimistic locking), `created_at`, and `updated_at` audit columns inherited from `BaseEntity`.

| Entity | Relations |
|---|---|
| **Organization** | Has many properties, memberships, invites, and activity events. |
| **Property** (`Prop`) | Belongs to one organization. Has many units. Cannot be deleted while units exist. |
| **Unit** | Belongs to one property. Has many leases. Status reflects active lease state. |
| **Lease** | Belongs to one unit and one organization. Has many lease tenants. Has one optional template stamp. |
| **LeaseTenant** | Join between a lease and a tenant. Carries role and (future) signing status. |
| **LeaseTemplate** | Belongs to one organization. Can be stamped onto multiple leases. |
| **Tenant** | Belongs to one organization. Can be a participant in many leases via LeaseTenant. |
| **User** | Global (not org-scoped). Has many memberships and notification preferences. |
| **Membership** | Join between a user and an organization. Carries role and policy assignments. |
| **PermissionPolicy** | Belongs to one organization. Can be assigned to many memberships. |
| **PolicyAssignment** | Join between a membership and a permission policy. |
| **Invite** | Belongs to one organization. Carries status (`PENDING`, `ACCEPTED`, `EXPIRED`) and expiry timestamp. |
| **ActivityEvent** | Belongs to one organization. Stores event type, actor ID, and JSONB metadata. |
| **NotificationDelivery** | Belongs to one user and one organization. Tracks send status per notification event. |
| **UserNotificationPreference** | Belongs to one user per organization. Stores enabled notification types. |
