# PropMange — Project Architecture

**Stack:** Spring Boot 4, Java 21, React 19, TypeScript, TanStack Router, TanStack Query, PostgreSQL, Liquibase, JWT / OIDC, Docker, Caddy, Logto

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
- **Lease Management** — A structured, state-machine-driven lease lifecycle covering creation through termination or eviction.
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

Units carry a `status` field with four possible values: `VACANT`, `OCCUPIED`, `UNDER_MAINTENANCE`, and `NOTICE_GIVEN`. The lease lifecycle drives the core transitions automatically: activating a lease sets the unit to `OCCUPIED`; terminating or evicting sets it back to `VACANT`. The `UNDER_MAINTENANCE` and `NOTICE_GIVEN` values are set manually by managers to reflect real-world conditions outside the lease lifecycle.

### Frontend

Both properties and units have their own dedicated list and detail views in the manager section of the UI. List views are backed by TanStack Query with optimistic updates — creating or updating a property or unit reflects in the UI immediately, before the server confirms the change.

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
| `EXPIRED` | The lease end date has passed; transitioned automatically by a scheduled task. |
| `TERMINATED` | The lease was ended early by a manager action. |
| `EVICTED` | The lease was ended due to an eviction workflow. |

Only `DRAFT` leases can be deleted. Manual state transitions are triggered by dedicated API endpoints (`/submit`, `/activate`, `/revert`, `/terminate`, `/evict`) and are validated server-side — a lease cannot skip states or transition backwards. `REVIEW` and `SIGNED` leases can be reverted to `DRAFT` via `/revert`. `EXPIRED` is set automatically by a scheduled task, not via an endpoint.

### Lease Tenants

A lease can have multiple tenants, each assigned a role (e.g., `PRIMARY`, `CO_APPLICANT`). Tenants join a lease via an invite flow — a `LeaseTenant` record is created when the invite is issued and linked to the `Tenant` record once the invite is accepted. The join entity tracks the tenant's role, invite status, signed date, and the lease version they acknowledged. The multi-tenant structure allows for household configurations while keeping the primary contact distinct.

### Financial Terms

Each lease stores the monthly rent amount, rent due day, security deposit, late fee type and amount, and the start and end dates of the tenancy. These values are stamped at lease creation and do not change once the lease moves past `DRAFT` — ensuring a reliable audit record of the original agreed terms. The rendered agreement text (`executedContentMarkdown`) is stamped at the point of activation, not creation.

### Frontend

The lease list view groups leases by status and provides quick-action menus for common transitions. The detail view shows all associated tenants, financial terms, and the full history of state transitions. Destructive actions (terminate, delete) are disabled when the lease status does not permit them, providing a clear affordance before the user even attempts the action.

---

## Lease Templates

Lease templates act as reusable blueprints for generating new leases. Rather than filling in lease terms from scratch each time, managers define a template once and stamp it onto a new lease during creation.

### Template Rendering

A lease template contains a Markdown body with parameterized placeholders. The `LeaseTemplateRenderer` supports the following built-in placeholders:

`{{property_name}}`, `{{unit_number}}`, `{{start_date}}`, `{{end_date}}`, `{{rent_amount}}`, `{{rent_due_day}}`, `{{security_deposit}}`

Templates can also define their own custom `templateParameters` (stored as JSON), which are merged with the built-in values — lease-level overrides take highest priority. The rendered output is stored in the `executedContentMarkdown` field on the lease and is stamped at **activation** time, not at creation. This creates a standalone snapshot decoupled from the original template.

### Separation of Concerns

This separation is intentional: modifying a template after leases have been generated does not affect those existing leases. Each lease carries its own rendered copy of the agreement, giving managers a stable, auditable record of exactly what was agreed to at the time of activation.

### Frontend

Templates have their own management section in the UI with full CRUD support. When creating a new lease, managers can select a template from a dropdown, which pre-populates the lease body. Templates are also paginated and searchable.

---

## Tenant Portal

The tenant portal is a dedicated, read-only interface that gives tenants a direct view of their active lease without exposing any manager functionality. It is designed around the assumption that a tenant primarily needs to answer the question: *"What am I currently signed up to?"*

### Aggregate Endpoint

Rather than requiring the frontend to assemble tenant data from multiple API calls, the backend exposes a single aggregate endpoint: `GET /api/tenant/my-lease?orgId=<uuid>`. This endpoint reads the authenticated user's identity, finds their active `LeaseTenant` record, and returns a unified response containing the lease terms, the unit details, the property address, associated assets, co-tenants, and the caller's own `LeaseTenant` status — all in one payload.

### Long-Term Caching

The tenant portal query is cached aggressively in the frontend's IndexedDB store. The cache TTL is configurable via `VITE_QUERY_CACHE_MAX_AGE_HOURS` (default: 24 hours). This is a deliberate design decision: a tenant's lease details rarely change, and a tenant may need to access this information on moving day when network connectivity is unreliable. The long cache TTL ensures they can always see their lease details regardless of connectivity.

### Read-Only Enforcement

The tenant portal routes are protected by a role-based layout guard (`_tenant`) in the frontend. Tenants cannot navigate to any manager-only routes. On the backend, the `my-lease` endpoint requires only `isAuthenticated()` — the response is naturally scoped to the caller's own active lease record, and there are no mutation endpoints exposed in the tenant portal.

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

Membership defines the relationship between a user and an organization, including what that user is allowed to do. PropMange uses a **hydration-based, hierarchy-aware permission model** driven by Permission Policies and Access Entries. Spring roles play no part in business-operation authorization.

### Permission Policies

A `PermissionPolicy` is a named, reusable set of permissions stored as a JSON object mapping domain codes to action letters:

```json
{ "l": "cru", "m": "r", "p": "crud" }
```

Domain codes: `l` = Leases, `m` = Maintenance, `f` = Finances, `c` = People (contacts), `o` = Organization, `p` = Portfolio. Action letters: `r` = read, `c` = create, `u` = update, `d` = delete. Policies can be system-wide templates or org-specific, and are reusable — the same policy can be assigned to many members.

### Policy Assignments

A `PolicyAssignment` links a `Membership` to a policy at a specific **scope**: `ORG`, `PROPERTY`, `UNIT`, or `ASSET`, identified by a resource ID. Assignments can carry per-assignment `overrides` (a custom permissions JSON) that replace the linked policy's defaults entirely for that scope. This means a member can have full CRUD on leases at organization scope but read-only access on maintenance at a specific property.

### Access Entry Hydration

At request time, a user's effective permissions are materialized as a list of `AccessEntry` records — each carrying `(orgId, scopeType, scopeId, permissions)` where `permissions` is a domain → action bitmask map.

The `JwtAccessHydrationFilter` runs after JWT authentication on every request and either:

1. Reads the `access` claim directly from the JWT (dev tokens include this pre-embedded), or
2. Calls `JwtHydrationService` to build the list fresh from the database (production Logto tokens carry no `access` claim and always hydrate from DB)

`JwtHydrationService` compiles the access list from three sources:
- **Policy assignments** — resolved from the user's memberships across all organizations
- **Property ownership** — full CRUD on all domains at `PROPERTY` scope for properties the user owns
- **Active lease tenancy** — read-only on Leases and Maintenance at `UNIT` scope for units the user is actively leasing

The resulting list is cached per user and evicted whenever membership or policy assignments change.

### Hierarchy-Aware Authorization

Permission checks are **hierarchy-aware**: a permission granted at a parent scope covers all its children. The resolution walks from most specific to least specific:

```
UNIT → PROPERTY → ORG  (first match wins)
```

Enforcement uses Spring's `@PreAuthorize` with a `PermissionGuard` SpEL bean:

```java
@PreAuthorize("@permissionGuard.hasAccess('UPDATE', 'LEASES', 'LEASE', #id, #orgId)")
```

Convenience meta-annotations (`@PreAuthorizePropAccess`, `@PreAuthorizeLeaseAccess`, etc.) wrap the common patterns so most controllers need no boilerplate SpEL.

### Global Admin

Users with `ROLE_ADMIN` in their JWT `groups` claim bypass all permission checks and have unrestricted access. This is the **only** role the backend enforces. Other group values (`MANAGER`, `TENANT`, `USER`) are carried in the JWT for the frontend to use when controlling UI visibility — they have no effect on backend authorization.

### Frontend Permission Gating

The frontend reads the user's resolved access entries from the session and checks them before rendering action buttons or navigation items. If a user lacks update access on the Leases domain, the edit option is hidden entirely — not just disabled — reducing visual clutter. The server enforces all permissions independently; UI-level hiding is ergonomic only, not a security boundary.

---

## Invitations & Onboarding

New members join an organization through an invitation flow. Invites have two target types: **`MEMBERSHIP`** (inviting someone to an organization) and **`LEASE`** (inviting a tenant to sign a lease). In both cases a manager specifies the recipient's email address, the system generates a time-limited token, and an email with a sign-up link is sent.

### Invite Lifecycle

Invites carry a status: `PENDING`, `ACCEPTED`, or `EXPIRED`. Pending invites expire after **72 hours**. If the recipient doesn't accept in time, the invite transitions to `EXPIRED` and the manager can resend it — subject to a **15-minute resend cooldown** — which generates a new token and resets the expiry window.

### Onboarding Flow

When a new user follows the invite link, they are directed to the identity provider (Logto in production, or the dev login endpoint in development) to create their account. Upon first login, the backend matches their verified email address against the pending invite record, creates their membership in the organization with the configured role, and marks the invite as `ACCEPTED`. This matching is done automatically — no additional steps are required from the inviting manager.

### Frontend

The invites section is available within the organization settings area. Managers can see all outstanding invites, their status, and the expiry date. Resend and revoke actions are available for pending invites.

---

## Activity & Audit Trail

All significant domain events in PropMange are persisted to an **activity event store**. This provides a running audit trail of what happened, who did it, and when — useful both for administrative review and as the data source for the dashboard activity feed.

### Event Architecture

The backend uses Spring's application event system to decouple event publishing from event handling. When a domain action occurs — a lease is activated, an invite is accepted, a member's role is changed — the responsible service publishes a typed domain event. An `ActivityEventListener` consumes these events using `@TransactionalEventListener(phase = AFTER_COMMIT)`, meaning events are only persisted after the originating transaction has successfully committed. This prevents phantom activity records from appearing if the primary transaction rolls back.

### Stored Data

Each `ActivityEvent` record captures the event type, the subject type and ID (the entity the event concerns), the actor ID (the user who triggered it), the organization, a timestamp, and a flexible `metadata` field stored as JSONB. The current set of tracked event types is:

`LEASE_SUBMITTED_FOR_REVIEW`, `LEASE_TENANT_SIGNED`, `LEASE_ALL_TENANTS_SIGNED`, `LEASE_ACTIVATED`, `LEASE_EXPIRING_SOON`, `LEASE_EXPIRED`, `LEASE_TERMINATED`, `LEASE_EVICTED`, `ORGANIZATION_CREATED`, `INVITE_ACCEPTED`

Each event is persisted in its own `REQUIRES_NEW` transaction after the originating transaction commits, so a rollback on the primary action never produces a phantom activity record.

### API & Frontend

The activity feed is exposed via `GET /api/activity?orgId=<uuid>`, with an optional `eventTypes` query parameter for filtering by event type. It returns a paginated list in reverse-chronological order. In the frontend, the dashboard home page renders this feed as a real-time-feeling list of recent actions, giving managers an at-a-glance view of organizational activity without needing to navigate into individual record views.

---

## Notifications

PropMange delivers email notifications across three domains: lease lifecycle events, organization invites, and user account events. The `NotificationDispatcher` listens to domain events via `@TransactionalEventListener(phase = AFTER_COMMIT)` and coordinates delivery.

### Event Triggers

**Lease lifecycle** — notifications are sent to tenants, managers, or both depending on the event:

| Event | Recipients |
|---|---|
| Submitted for review | Tenants |
| Tenant signed | Manager (includes signing tenant name and remaining count) |
| All tenants signed | Manager |
| Activated | Tenants |
| Expiring soon | Tenants + Manager |
| Expired | Tenants + Manager |
| Terminated | Tenants |
| Evicted | Tenants |

**Invites** — an email is sent to the invitee when an org membership or lease invite is created or resent. On resend, any previous pending deliveries for the same invite are cancelled before a new one is created.

**User registration** — a welcome email (`ACCOUNT_CREATED`) is sent to the user on first login when their account is provisioned.

### Outbox Pattern

The dispatcher follows an outbox pattern to prevent lost notifications on JVM failure. For each recipient it first commits a `PENDING` delivery row in an isolated `REQUIRES_NEW` transaction, then enqueues the actual email send asynchronously. If the process crashes between those two steps, the `NotificationRetryScheduler` picks up any stale `PENDING` rows and retries them.

### User Preferences

Each user has a `UserNotificationPreference` record per organization, storing the set of notification types they have opted into. The delivery service respects these preferences before creating a delivery record.

### Delivery Tracking

Each outbound email is recorded as a `NotificationDelivery` row capturing the recipient, notification type, reference entity (`LEASE`, `INVITE`, or `USER`), timestamp, and status (`PENDING`, `SENT`, `FAILED`). This gives administrators a full audit trail of what was sent and a basis for retry logic on failures.

---

## Offline-First Architecture

The frontend is designed to remain functional during network outages. This is especially important for tenant users, who may need to reference their lease details in situations where connectivity is unreliable — on moving day, in a building with poor signal, or during a brief service disruption.

### IndexedDB Persistence

TanStack Query's cache is persisted to **IndexedDB** using Dexie. Each user gets their own isolated database, ensuring that one user's cached data is never visible to another user on the same device. Writes are throttled at 1 second to avoid excessive I/O. The cache is populated during normal online use and remains available when the user goes offline. Persistence is disabled in the dev environment by default and enabled via `VITE_PERSIST_OFFLINE=true`.

### Mutation Queuing

All mutations use `networkMode: 'online'`. When the user is offline, mutation calls are not dropped — they are paused and queued. When connectivity is restored, the queue is automatically drained and each mutation is replayed in order. Mutations in `paused`, `pending`, or `idle` state are persisted to IndexedDB, so the outbox survives page refreshes and browser restarts.

### Idempotency

Because queued mutations may be replayed after a network interruption, each mutation is accompanied by a stable `X-Request-Id` header — a hash derived from the mutation key and payload. This allows the backend to detect and safely ignore duplicate requests, ensuring that a mutation that was partially submitted before a connectivity drop does not produce duplicate records when replayed.

### Cache Scoping and Invalidation

When a user logs out, their query client and associated IndexedDB database are cleared. When a user switches the active organization, all queries are invalidated and re-fetched, ensuring the UI reflects the correct organizational context.

---

## Authentication & Security

### JWT-Based Auth

PropMange uses JWT-based authentication via Spring's OAuth2 Resource Server. The frontend includes the JWT as a `Bearer` token on every API request, and the backend validates the token's signature and expiry before processing the request.

After token validation, the `JwtAccessHydrationFilter` materializes the user's permissions into a list of `AccessEntry` records attached to the request. These drive all business-operation authorization via the `PermissionGuard` SpEL bean (see [Membership & Access Control](#membership--access-control)).

The JWT's `groups` claim is mapped to Spring Security `ROLE_` authorities solely for the global admin bypass — `ROLE_ADMIN` skips all permission checks. No other role is enforced by the backend.

### Development vs. Production

In the **development profile**, a local HS256 JWT is generated by the backend itself via a `POST /api/dev/login` endpoint. No external identity provider is required. The frontend stores the returned token in `localStorage` and the Axios client picks it up automatically on every request. The API base URL is configured via the `VITE_API_BASE_URL` environment variable (e.g. `http://localhost:8080`).

In **production**, authentication is delegated to **Logto**, a self-hosted OIDC provider. The frontend performs a PKCE authorization code flow using the `oidc-client-ts` library, configured via `VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`, and `VITE_OIDC_REDIRECT_URI` environment variables. The resulting JWT is issued by Logto, and the backend validates it against Logto's JWKS endpoint. This means the same codebase handles both environments with a profile switch, and no credentials are ever stored in the application.

### Rate Limiting & Audit Logging

Every inbound request passes through two filters before reaching a controller:

- **Rate Limiting**: A Resilience4j-backed filter enforces a cap of 100 requests per minute per IP address. Requests exceeding this limit receive a `429 Too Many Requests` response. Rate limiting is disabled in the dev profile.
- **Audit Logging**: A filter logs every request — including the timestamp, the authenticated user, the endpoint, and the response status code — to provide a complete access log for security review.

---

## Infrastructure & Deployment

### Production Stack

The production environment is managed via Docker Compose and consists of five services:

| Service | Role |
|---|---|
| **PostgreSQL** | Primary relational database (shared by the app and Logto) |
| **Spring Boot API** | Backend application server (port 8080, internal) |
| **Logto** | Self-hosted OIDC identity provider |
| **Caddy** | Reverse proxy, TLS termination, security headers |
| **Cloudflare Tunnel** | Exposes the stack without opening inbound firewall ports |

The frontend is hosted on **Cloudflare Pages**, which handles global CDN distribution and automatic deploys from the main branch.

### Request Flow

```
User → Cloudflare Pages (React SPA)
     ↓ (PKCE auth code flow)
User → Cloudflare Tunnel → Caddy → Logto (OIDC, issues JWT)
     ↓ (JWT in Authorization header)
User → Cloudflare Tunnel → Caddy (TLS termination, security headers)
     ↓
Spring Boot API (validates JWT against Logto JWKS at http://logto:3001/oidc/jwks)
     ↓
PostgreSQL
```

### Development Profile

In development, the full production stack is not required. The backend runs against an **H2 in-memory database** (no PostgreSQL needed), and authentication uses a local HS256 JWT via the dev login endpoint (no Logto needed). The frontend connects directly to the backend using `VITE_API_BASE_URL=http://localhost:8080`. Outbound emails are captured locally by **Mailpit** (available in the devcontainer at port 8025). This allows the full application to run on a single machine with a single `mvnw spring-boot:run` and `pnpm dev`.

### Database Migrations

Schema changes are managed by **Liquibase**. All migrations live in a single changelog file (`initial-schema.yaml`), keeping the full schema history in one place. In production, Liquibase runs automatically on startup with `ddl-auto: validate` — the application will refuse to start if the schema does not match. In development, schema creation is handled by Hibernate directly and Liquibase is disabled.

---

## Database Schema

All data models are stored in PostgreSQL (production) or H2 (development). Most user-facing entities extend `BaseEntity`, which provides `id` (UUID v7), `version` (optimistic locking), `created_at`, and `updated_at`. System-managed tables (`users`, `addresses`, `user_identities`, `invite`) manage their own timestamps and omit `version`.

| Entity | Relations |
|---|---|
| **Organization** | Has many properties, memberships, invites, and activity events. |
| **Property** (`Prop`) | Belongs to one organization and one owner (`User`). Has many units. Cannot be deleted while units exist. |
| **Unit** | Belongs to one property. Has many leases. Status driven automatically by lease activation/termination; `UNDER_MAINTENANCE` and `NOTICE_GIVEN` are set manually. |
| **Lease** | Belongs to one unit. Has many lease tenants. Optionally stamped from a template; rendered content stored on activation. |
| **LeaseTenant** | Join between a lease and a tenant via an invite. Carries role, signing status, signed date, and the lease version acknowledged. |
| **LeaseTemplate** | Belongs to one organization. Defines Markdown body, default financial terms, and custom template parameters. |
| **Tenant** | Belongs to one user. Can participate in many leases via LeaseTenant. |
| **Asset** | Belongs to a property and optionally a unit. Tracks equipment with make/model, serial number, and service dates. |
| **User** | Global (not org-scoped). Has many memberships. Identity linked via `UserIdentity` (issuer + sub). |
| **UserIdentity** | Links a `User` to an external OIDC identity (issuer + sub). One user can have multiple identities. |
| **Membership** | Join between a user and an organization. Has many policy assignments. |
| **PermissionPolicy** | Belongs to one organization (or system-wide if org is null). Defines domain → action permissions as JSON. |
| **PolicyAssignment** | Scopes a policy (or inline overrides) to a membership at ORG / PROPERTY / UNIT / ASSET level. |
| **Invite** | Targets either a `MEMBERSHIP` or a `LEASE`. Carries status (`PENDING`, `ACCEPTED`, `EXPIRED`), token, and expiry timestamp. |
| **ActivityEvent** | Belongs to one organization. Stores event type, subject type/ID, actor ID, and JSONB metadata. |
| **NotificationDelivery** | Tracks each outbound email: recipient, type, reference entity, status (`PENDING`, `SENT`, `FAILED`), and retry count. |
| **UserNotificationPreference** | Per user per notification type per channel. Controls whether a delivery record is created. |
