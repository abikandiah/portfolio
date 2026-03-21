import { CodeDisplay } from '@abumble/design-system/components/CodeDisplay'
import { UnorderedList } from '@abumble/design-system/components/List'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@abumble/design-system/components/Table'
import type { ProjectProps } from '@/types/ProjectTypes'
import { projectType } from '@/types/ProjectTypes'
import { techType } from '@/types/TechTypes'

export const propMangeProject: ProjectProps = {
	type: projectType.Personal,
	name: 'PropMange',
	duration: '2025',
	url: 'https://prop-mange.akandiah.ca',
	description: `A full-stack property management system covering the complete rental lifecycle — from unit availability and lease agreements to tenant communication and multi-organization access control.`,
	tech: [
		techType.Java,
		techType.SpringBoot,
		techType.TypeScript,
		techType.React,
		techType.TanstackRouter,
		techType.TanstackQuery,
		techType.Axios,
		techType.PostgreSQL,
		techType.Liquibase,
		techType.Docker,
		techType.Caddy,
		techType.RestAPI,
		techType.JWT,
		techType.OIDC,
		techType.Logto,
	],

	sections: [
		{ title: 'Overview', body: Overview },
		{ title: 'Properties & Units', body: PropertiesAndUnits },
		{ title: 'Lease Management', body: LeaseManagement },
		{ title: 'Lease Templates', body: LeaseTemplates },
		{ title: 'Tenant Portal', body: TenantPortal },
		{ title: 'Organizations & Multi-Tenancy', body: MultiTenancy },
		{ title: 'Membership & Access Control', body: AccessControl },
		{ title: 'Invitations & Onboarding', body: Invitations },
		{ title: 'Activity & Audit Trail', body: ActivityAudit },
		{ title: 'Notifications', body: Notifications },
		{ title: 'Offline-First Architecture', body: OfflineFirst },
		{ title: 'Authentication & Security', body: AuthAndSecurity },
		{ title: 'Infrastructure & Deployment', body: Infrastructure },
		{ title: 'Database Schema', body: DatabaseSchema },
	],
}

function Overview() {
	return (
		<>
			<p>
				PropMange is a full-stack property management system built as a monorepo
				containing two sub-projects: a <strong>Spring Boot REST API</strong> and
				a <strong>React 19 frontend</strong>. It is designed to handle the
				complete operational lifecycle of rental properties, from unit
				availability and lease agreements through to tenant communication and
				organizational billing.
			</p>
			<p>The system is organized around several integrated modules:</p>
			<UnorderedList>
				<li>
					<strong>Properties & Units</strong> — The foundational inventory of
					buildings and rentable spaces.
				</li>
				<li>
					<strong>Lease Management</strong> — A structured, state-machine-driven
					lease lifecycle covering creation through expiry or termination.
				</li>
				<li>
					<strong>Tenant Portal</strong> — A read-only, offline-capable view for
					tenants to access their active lease details.
				</li>
				<li>
					<strong>Organizations & Multi-Tenancy</strong> — All data is scoped to
					an organization, enabling the same platform to serve multiple
					independent property managers.
				</li>
				<li>
					<strong>Membership & Access Control</strong> — A fine-grained
					permission system that controls what each member of an organization
					can see and do.
				</li>
				<li>
					<strong>Activity & Audit Trail</strong> — A persisted event log
					recording all significant domain actions for transparency and
					auditability.
				</li>
				<li>
					<strong>Notifications</strong> — Email notifications triggered by
					lease lifecycle events, configurable per user.
				</li>
			</UnorderedList>
		</>
	)
}

function PropertiesAndUnits() {
	return (
		<>
			<p>
				Properties and units form the foundational data layer of the system. A{' '}
				<strong>Property</strong> represents a physical building or land asset —
				it holds the legal name, address, and property type (e.g., residential,
				commercial). A <strong>Unit</strong> represents an individual rentable
				space within a property, with its own type, rent amount, and
				availability status.
			</p>
			<p>
				Properties and units form a strict parent-child hierarchy. A unit always
				belongs to exactly one property, and a property can have many units.
				Deleting a property with active units is rejected with a{' '}
				<code>422 Unprocessable Entity</code> response. Likewise, a unit with an
				active lease cannot be deleted.
			</p>
			<p>
				Units carry a <code>status</code> field with four possible values:{' '}
				<span className="font-semibold">VACANT</span>,{' '}
				<span className="font-semibold">OCCUPIED</span>,{' '}
				<span className="font-semibold">UNDER_MAINTENANCE</span>, and{' '}
				<span className="font-semibold">NOTICE_GIVEN</span>. The lease lifecycle
				drives the core transitions automatically: activating a lease sets the
				unit to <span className="font-semibold">OCCUPIED</span>; terminating or
				evicting sets it back to <span className="font-semibold">VACANT</span>.
				The <span className="font-semibold">UNDER_MAINTENANCE</span> and{' '}
				<span className="font-semibold">NOTICE_GIVEN</span> values are set
				manually by managers to reflect real-world conditions outside the lease
				lifecycle.
			</p>
			<p>
				Both properties and units have dedicated list and detail views in the
				manager UI, backed by TanStack Query with optimistic updates — creating
				or updating a record reflects in the UI immediately, before the server
				confirms the change.
			</p>
		</>
	)
}

function LeaseManagement() {
	return (
		<>
			<p>
				Lease management is the core workflow of PropMange. A{' '}
				<strong>Lease</strong> is the central agreement object tying together a
				unit, a set of tenants, financial terms, and a period of occupancy. It
				is implemented as a structured <strong>state machine</strong>, ensuring
				leases move through their lifecycle in a controlled, auditable sequence.
			</p>
			<p>
				A lease begins in <span className="font-semibold">DRAFT</span> status,
				where all fields can be freely edited. From there it progresses through{' '}
				<span className="font-semibold">REVIEW</span>,{' '}
				<span className="font-semibold">SIGNED</span>,{' '}
				<span className="font-semibold">ACTIVE</span>, and finally to a terminal
				state of <span className="font-semibold">EXPIRED</span>,{' '}
				<span className="font-semibold">TERMINATED</span>, or{' '}
				<span className="font-semibold">EVICTED</span>. State transitions are
				triggered by dedicated API endpoints and are validated server-side — a
				lease cannot skip states or transition backwards.{' '}
				<span className="font-semibold">REVIEW</span> and{' '}
				<span className="font-semibold">SIGNED</span> leases can be reverted to{' '}
				<span className="font-semibold">DRAFT</span> via a dedicated{' '}
				<code>/revert</code> endpoint.
			</p>
			<p>
				A lease can have multiple tenants, each assigned a role such as{' '}
				<code>PRIMARY</code> or <code>CO_APPLICANT</code>. Tenants join a lease
				through an invite flow — a <code>LeaseTenant</code> record is created
				when the invite is issued and linked to the tenant once accepted. The
				join entity tracks the tenant's role, invite status, signed date, and
				the lease version they acknowledged.
			</p>
			<p>
				Financial terms — monthly rent, rent due day, security deposit, late fee
				type and amount, and the start and end dates — are stamped at lease
				creation and do not change once the lease moves past{' '}
				<span className="font-semibold">DRAFT</span>. The rendered agreement
				text is stamped onto the lease at <strong>activation</strong>, not at
				creation, ensuring the executed document reflects the fully signed and
				agreed state.
			</p>
		</>
	)
}

function LeaseTemplates() {
	return (
		<>
			<p>
				Lease templates act as reusable blueprints for generating new leases.
				Rather than filling in lease terms from scratch each time, managers
				define a template once and stamp it onto a new lease during creation.
			</p>
			<p>
				A lease template contains a Markdown body with parameterized
				placeholders. The renderer supports built-in placeholders including{' '}
				<code>{'{{property_name}}'}</code>, <code>{'{{unit_number}}'}</code>,{' '}
				<code>{'{{start_date}}'}</code>, <code>{'{{end_date}}'}</code>,{' '}
				<code>{'{{rent_amount}}'}</code>, <code>{'{{rent_due_day}}'}</code>, and{' '}
				<code>{'{{security_deposit}}'}</code>. Templates can also define custom{' '}
				<code>templateParameters</code> stored as JSON, which are merged with
				the built-in values — lease-level overrides take highest priority.
			</p>
			<p>
				The rendered output is stored in the{' '}
				<code>executedContentMarkdown</code> field on the lease and is stamped
				at <strong>activation</strong> time, not at creation. This creates a
				standalone snapshot decoupled from the original template — modifying a
				template after leases have been generated does not affect those existing
				records.
			</p>
		</>
	)
}

function TenantPortal() {
	return (
		<>
			<p>
				The tenant portal is a dedicated, read-only interface that gives tenants
				a direct view of their active lease without exposing any manager
				functionality. It is designed around a single question:{' '}
				<em>"What am I currently signed up to?"</em>
			</p>
			<p>
				Rather than requiring the frontend to assemble tenant data from multiple
				API calls, the backend exposes a single aggregate endpoint —{' '}
				<code>GET /api/tenant/my-lease?orgId=&lt;uuid&gt;</code>. This endpoint
				reads the authenticated user's identity, finds their active{' '}
				<code>LeaseTenant</code> record, and returns a unified response
				containing the lease terms, unit details, property address, associated
				assets, co-tenants, and the caller's own signing status — all in one
				payload.
			</p>
			<p>
				The tenant portal query is cached aggressively in the frontend's
				IndexedDB store. The cache TTL is configurable via{' '}
				<code>VITE_QUERY_CACHE_MAX_AGE_HOURS</code> (default: 24 hours). This is
				a deliberate design decision: a tenant's lease details rarely change,
				but a tenant may need to access this information on moving day when
				network connectivity is unreliable.
			</p>
			<p>
				In the frontend, tenant portal routes are protected by a role-based
				layout guard that prevents navigation to any manager-only routes. On the
				backend, the endpoint requires only authentication — the response is
				naturally scoped to the caller's own active lease record, and there are
				no mutation endpoints exposed in the tenant portal.
			</p>
		</>
	)
}

function MultiTenancy() {
	return (
		<>
			<p>
				All data in PropMange is scoped to an <strong>Organization</strong>.
				Every entity in the system — properties, units, leases, tenants —
				belongs to exactly one organization and is never visible to members of
				another. Organization scoping is enforced at the service layer, and the
				active organization is derived from the authenticated user's JWT and
				their membership record.
			</p>
			<p>
				The frontend holds the active organization in a React context. The
				active <code>orgId</code> is reflected in the URL as a search parameter,
				making it bookmarkable and shareable. All API calls automatically
				include the <code>orgId</code> via an Axios request interceptor, so
				individual query and mutation hooks do not need to manage it explicitly.
			</p>
			<p>
				A single user can be a member of multiple organizations. The UI provides
				an <strong>organization switcher</strong> that updates the active{' '}
				<code>orgId</code> in the URL and invalidates all cached queries,
				ensuring the user immediately sees data for the newly selected
				organization.
			</p>
		</>
	)
}

function AccessControl() {
	return (
		<>
			<p>
				PropMange uses a{' '}
				<strong>hydration-based, hierarchy-aware permission model</strong>{' '}
				driven by Permission Policies and Policy Assignments. Spring roles play
				no part in business-operation authorization — the only role the backend
				enforces is <code>ROLE_ADMIN</code>, which bypasses all permission
				checks entirely.
			</p>
			<p>
				A <strong>PermissionPolicy</strong> is a named, reusable set of
				permissions stored as a JSON object mapping domain codes to action
				letters:
			</p>
			<CodeDisplay code={'{ "l": "cru", "m": "r", "p": "crud" }'} />
			<p>
				Domain codes include <code>l</code> (Leases), <code>m</code>{' '}
				(Maintenance), <code>f</code> (Finances), <code>c</code> (People),{' '}
				<code>o</code> (Organization), and <code>p</code> (Portfolio). Action
				letters are <code>r</code> (read), <code>c</code> (create),{' '}
				<code>u</code> (update), and <code>d</code> (delete). Policies can be
				system-wide templates or org-specific and are reusable across many
				members.
			</p>
			<p>
				A <strong>PolicyAssignment</strong> links a membership to a policy at a
				specific scope — <code>ORG</code>, <code>PROPERTY</code>,{' '}
				<code>UNIT</code>, or <code>ASSET</code> — identified by a resource ID.
				Assignments can carry per-assignment <code>overrides</code> that replace
				the linked policy's defaults for that scope. This means a member can
				have full CRUD on leases at organization scope but read-only access on
				maintenance at a specific property.
			</p>
			<p>
				At request time, the <code>JwtAccessHydrationFilter</code> materializes
				the user's effective permissions into a list of <code>AccessEntry</code>{' '}
				records — each carrying the org ID, scope type, scope ID, and a domain →
				action bitmask. Permission checks are hierarchy-aware: a grant at a
				parent scope covers all its children, resolving from most specific to
				least specific (<code>UNIT → PROPERTY → ORG</code>, first match wins).
				Enforcement uses Spring's <code>@PreAuthorize</code> with a{' '}
				<code>PermissionGuard</code> SpEL bean.
			</p>
			<p>
				The frontend reads the user's resolved access entries from the session
				and checks them before rendering action buttons or navigation items. If
				a user lacks update access on the Leases domain, the edit option is
				hidden entirely — not just disabled. The server enforces all permissions
				independently; UI-level hiding is ergonomic only, not a security
				boundary.
			</p>
		</>
	)
}

function Invitations() {
	return (
		<>
			<p>
				PropMange uses invites for two distinct flows:{' '}
				<strong>MEMBERSHIP</strong> invites bring a new user into an
				organization, and <strong>LEASE</strong> invites add a tenant to a
				lease. In both cases a manager specifies the recipient's email address,
				the system generates a time-limited token, and an email with a sign-up
				link is sent.
			</p>
			<p>
				Invites carry a status: <span className="font-semibold">PENDING</span>,{' '}
				<span className="font-semibold">ACCEPTED</span>, or{' '}
				<span className="font-semibold">EXPIRED</span>. Pending invites expire
				after 72 hours. If the recipient doesn't accept in time, the manager can
				resend the invite — subject to a 15-minute resend cooldown — which
				generates a new token and resets the expiry window.
			</p>
			<p>
				When a new user follows the invite link, they are directed to the
				identity provider to create their account. Upon first login, the backend
				matches their verified email against the pending invite record, creates
				their membership or lease tenant record with the configured role, and
				marks the invite as <span className="font-semibold">ACCEPTED</span> automatically.
			</p>
		</>
	)
}

function ActivityAudit() {
	return (
		<>
			<p>
				All significant domain events in PropMange are persisted to an{' '}
				<strong>activity event store</strong>. This provides a running audit
				trail of what happened, who did it, and when — useful both for
				administrative review and as the data source for the dashboard activity
				feed.
			</p>
			<p>
				The backend uses Spring's application event system to decouple event
				publishing from event handling. An <code>ActivityEventListener</code>{' '}
				consumes domain events using{' '}
				<code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> and
				persists each event in its own <code>REQUIRES_NEW</code> transaction —
				meaning activity records are only written after the originating
				transaction commits, and a rollback on the primary action never produces
				a phantom record.
			</p>
			<p>
				Each <code>ActivityEvent</code> captures the event type, the subject
				type and ID (the entity the event concerns), the actor ID, the
				organization, a timestamp, and a flexible <code>metadata</code> field
				stored as JSONB. The current tracked event types include:{' '}
				<code>LEASE_SUBMITTED_FOR_REVIEW</code>,{' '}
				<code>LEASE_TENANT_SIGNED</code>, <code>LEASE_ALL_TENANTS_SIGNED</code>,{' '}
				<code>LEASE_ACTIVATED</code>, <code>LEASE_EXPIRING_SOON</code>,{' '}
				<code>LEASE_EXPIRED</code>, <code>LEASE_TERMINATED</code>,{' '}
				<code>LEASE_EVICTED</code>, <code>ORGANIZATION_CREATED</code>, and{' '}
				<code>INVITE_ACCEPTED</code>.
			</p>
			<p>
				The activity feed is exposed via{' '}
				<code>GET /api/activity?orgId=&lt;uuid&gt;</code> with an optional{' '}
				<code>eventTypes</code> filter parameter, returning a paginated list in
				reverse-chronological order. The dashboard renders this feed as a
				paginated list of recent organizational actions.
			</p>
		</>
	)
}

function Notifications() {
	return (
		<>
			<p>
				PropMange delivers email notifications across three domains: lease
				lifecycle events, organization invites, and user account events. The{' '}
				<code>NotificationDispatcher</code> listens to domain events via{' '}
				<code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> and
				coordinates delivery.
			</p>
			<p>
				Lease lifecycle notifications are sent to tenants, managers, or both
				depending on the event:
			</p>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Event</TableHead>
						<TableHead>Recipients</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{[
						['Submitted for review', 'Tenants'],
						[
							'Tenant signed',
							'Manager (includes signing tenant name and remaining count)',
						],
						['All tenants signed', 'Manager'],
						['Activated', 'Tenants'],
						['Expiring soon', 'Tenants + Manager'],
						['Expired', 'Tenants + Manager'],
						['Terminated', 'Tenants'],
						['Evicted', 'Tenants'],
					].map(([event, recipients]) => (
						<TableRow key={event}>
							<TableCell className="whitespace-nowrap align-top">
								{event}
							</TableCell>
							<TableCell className="whitespace-normal">{recipients}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<p>
				Invite emails are sent to the recipient when a membership or lease
				invite is created or resent. Account registration triggers a welcome
				email on first login when the user's account is provisioned.
			</p>
			<p>
				The dispatcher follows an <strong>outbox pattern</strong> to prevent
				lost notifications on JVM failure. For each recipient it first commits a{' '}
				<code>PENDING</code> delivery row in an isolated{' '}
				<code>REQUIRES_NEW</code> transaction, then enqueues the actual email
				send asynchronously. If the process crashes between those two steps, the{' '}
				<code>NotificationRetryScheduler</code> picks up any stale{' '}
				<code>PENDING</code> rows and retries them.
			</p>
			<p>
				Each user has a <code>UserNotificationPreference</code> record per
				organization controlling which notification types they have opted into.
				The delivery service respects these preferences before creating a
				delivery record. Each outbound email is tracked as a{' '}
				<code>NotificationDelivery</code> row capturing the recipient,
				notification type, reference entity, timestamp, status, and retry count.
			</p>
		</>
	)
}

function OfflineFirst() {
	return (
		<>
			<p>
				The frontend is designed to remain functional during network outages.
				This is especially important for tenant users, who may need to reference
				their lease details in situations where connectivity is unreliable — on
				moving day, in a building with poor signal, or during a brief service
				disruption.
			</p>
			<p>
				TanStack Query's cache is persisted to <strong>IndexedDB</strong> using
				Dexie. Each user gets their own isolated database (
				<code>prop-manager-v1-db-&#123;userId&#125;</code>), ensuring one user's
				cached data is never visible to another on the same device. Writes are
				throttled at 1 second to avoid excessive I/O. Persistence is disabled in
				the dev environment by default and enabled via{' '}
				<code>VITE_PERSIST_OFFLINE=true</code>. The tenant portal query is
				cached aggressively — configurable via{' '}
				<code>VITE_QUERY_CACHE_MAX_AGE_HOURS</code> (default: 24 hours) — since
				a tenant's lease details rarely change but always need to be accessible.
			</p>
			<p>
				All mutations use <code>networkMode: 'online'</code>. When the user is
				offline, mutations are not dropped — they are paused and queued.
				Mutations in <code>paused</code>, <code>pending</code>, or{' '}
				<code>idle</code> state are persisted to IndexedDB, so the outbox
				survives page refreshes and browser restarts. When connectivity is
				restored, the queue drains automatically and each mutation is replayed
				in order.
			</p>
			<p>
				Because queued mutations may be replayed after a connectivity drop, each
				mutation is accompanied by a stable <strong>idempotency key</strong> —
				an <code>X-Request-Id</code> header derived from the mutation key and
				payload. This allows the backend to detect and safely ignore duplicate
				requests, ensuring a mutation that was partially submitted before an
				interruption does not produce duplicate records when replayed.
			</p>
			<p>
				When a user logs out, their query client and associated IndexedDB
				database are cleared. When a user switches the active organization, all
				queries are invalidated and re-fetched, ensuring the UI reflects the
				correct organizational context.
			</p>
		</>
	)
}

function AuthAndSecurity() {
	return (
		<>
			<p>
				PropMange uses JWT-based authentication via Spring's OAuth2 Resource
				Server. The frontend includes the JWT as a <code>Bearer</code> token on
				every API request, and the backend validates the token's signature and
				expiry before processing the request. After validation, the{' '}
				<code>JwtAccessHydrationFilter</code> materializes the user's
				permissions into a list of <code>AccessEntry</code> records attached to
				the request, which drive all business-operation authorization via the{' '}
				<code>PermissionGuard</code> SpEL bean.
			</p>
			<p>
				The JWT's <code>groups</code> claim is mapped to Spring Security{' '}
				<code>ROLE_</code> authorities solely for the global admin bypass —{' '}
				<code>ROLE_ADMIN</code> skips all permission checks. No other role is
				enforced by the backend; group values like <code>MANAGER</code> and{' '}
				<code>TENANT</code> are carried in the JWT for the frontend to use when
				controlling UI visibility only.
			</p>
			<p>
				In <strong>development</strong>, a local HS256 JWT is generated by the
				backend itself via a <code>POST /api/dev/login</code> endpoint — no
				external identity provider required. In <strong>production</strong>,
				authentication is delegated to <strong>Logto</strong>, a self-hosted
				OIDC provider. The frontend performs a PKCE authorization code flow, and
				the resulting JWT is validated against Logto's JWKS endpoint. The same
				codebase handles both environments with a profile switch.
			</p>
			<p>
				Every inbound request passes through two cross-cutting filters before
				reaching a controller:
			</p>
			<UnorderedList>
				<li>
					<strong>Rate Limiting</strong> — A Resilience4j-backed filter enforces
					a cap of 100 requests per minute per IP address. Requests exceeding
					this limit receive a <code>429 Too Many Requests</code> response. Rate
					limiting is disabled in the dev profile.
				</li>
				<li>
					<strong>Audit Logging</strong> — A filter logs every request including
					the timestamp, authenticated user, endpoint, and response status code,
					providing a complete access log for security review.
				</li>
			</UnorderedList>
		</>
	)
}

function Infrastructure() {
	return (
		<>
			<p>
				The production stack is managed via <strong>Docker Compose</strong> and
				consists of five services: a <strong>PostgreSQL</strong> database, the{' '}
				<strong>Spring Boot API</strong>, <strong>Logto</strong> as the
				self-hosted OIDC identity provider, <strong>Caddy</strong> as the
				reverse proxy handling TLS termination and security headers, and a{' '}
				<strong>Cloudflare Tunnel</strong> that exposes the stack publicly
				without opening inbound firewall ports.
			</p>
			<p>
				The frontend is hosted on <strong>Cloudflare Pages</strong>, which
				handles global CDN distribution and automatic deploys from the main
				branch. A request flows from the browser through Cloudflare Pages,
				initiates a PKCE authorization code flow with Logto to obtain a JWT, and
				then sends that JWT as a Bearer token through the Cloudflare Tunnel to
				Caddy, which terminates TLS and applies security headers before proxying
				to the Spring Boot API. The API validates the token against Logto's JWKS
				endpoint before processing the request.
			</p>
			<p>
				The development profile is intentionally lightweight. The backend runs
				against an <strong>H2 in-memory database</strong> — no PostgreSQL
				required — and authentication uses a locally-issued HS256 JWT via a{' '}
				<code>POST /api/dev/login</code> endpoint, bypassing Logto entirely.
				Outbound emails are captured locally by <strong>Mailpit</strong>. The
				full application runs on a single machine with one backend command and
				one frontend command, with no external dependencies.
			</p>
			<p>
				Schema changes are managed by <strong>Liquibase</strong>. All migrations
				live in a single changelog file, keeping the full schema history in one
				place. In production, Liquibase runs automatically on startup with{' '}
				<code>ddl-auto: validate</code> — the application refuses to start if
				the schema does not match. In development, schema creation is handled
				directly by Hibernate and Liquibase is disabled.
			</p>
		</>
	)
}

function DatabaseSchema() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Entity</TableHead>
					<TableHead>Relations</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[
					[
						'Organization',
						'Has many properties, memberships, invites, and activity events.',
					],
					[
						'Property',
						'Belongs to one organization and one owner (User). Has many units. Cannot be deleted while units exist.',
					],
					[
						'Unit',
						'Belongs to one property. Has many leases. Status driven automatically by lease activation/termination; UNDER_MAINTENANCE and NOTICE_GIVEN are set manually.',
					],
					[
						'Asset',
						'Belongs to a property and optionally a unit. Tracks equipment with make/model, serial number, and service dates.',
					],
					[
						'Lease',
						'Belongs to one unit. Has many lease tenants. Optionally stamped from a template; rendered content stored on activation.',
					],
					[
						'LeaseTenant',
						'Join between a lease and a tenant via an invite. Carries role, signing status, signed date, and the lease version acknowledged.',
					],
					[
						'LeaseTemplate',
						'Belongs to one organization. Defines Markdown body, default financial terms, and custom template parameters.',
					],
					[
						'Tenant',
						'Belongs to one user. Can participate in many leases via LeaseTenant.',
					],
					[
						'User',
						'Global (not org-scoped). Has many memberships. Identity linked via UserIdentity (issuer + sub).',
					],
					[
						'UserIdentity',
						'Links a User to an external OIDC identity (issuer + sub). One user can have multiple identities.',
					],
					[
						'Membership',
						'Join between a user and an organization. Has many policy assignments.',
					],
					[
						'PermissionPolicy',
						'Belongs to one organization, or system-wide if org is null. Defines domain → action permissions as JSON.',
					],
					[
						'PolicyAssignment',
						'Scopes a policy (or inline overrides) to a membership at ORG / PROPERTY / UNIT / ASSET level.',
					],
					[
						'Invite',
						'Targets either a MEMBERSHIP or a LEASE. Carries status (PENDING, ACCEPTED, EXPIRED), token, and expiry timestamp.',
					],
					[
						'ActivityEvent',
						'Belongs to one organization. Stores event type, subject type/ID, actor ID, and JSONB metadata.',
					],
					[
						'NotificationDelivery',
						'Tracks each outbound email: recipient, type, reference entity, status (PENDING, SENT, FAILED), and retry count.',
					],
					[
						'UserNotificationPreference',
						'Per user per notification type per channel. Controls whether a delivery record is created.',
					],
				].map(([entity, relations]) => (
					<TableRow key={entity}>
						<TableCell className="font-medium whitespace-nowrap align-top">
							{entity}
						</TableCell>
						<TableCell className="whitespace-normal">{relations}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
