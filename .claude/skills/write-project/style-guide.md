# Style guide

These rules come from the hand-written write-ups on the site. When a rule and the
reference write-ups seem to disagree, the write-ups win. Imitate them.

## The register in one paragraph

A write-up explains **what a system is made of, how its parts work together, and why it
was designed that way**, at the level you'd use to walk a new senior teammate through it at
a whiteboard. It names concepts, not code. It's specific about behaviour ("templates can be
modified without affecting notices already in use") and quiet about implementation ("the
`executedContentMarkdown` field is stamped at activation"). The reader should come away
able to sketch the architecture, not find their way around the codebase.

## Voice

- **Work projects use "we"** for the team's decisions ("we found a clear, repeated pattern
  of boilerplate…", "we brought in several key optimizations"), and otherwise describe the
  system in the third person ("The framework standardizes…").
- **Personal projects** describe the system in the third person. First-person "I" belongs
  only in a case study.
- **Never name the employer, clients or internal products.** Use the names the existing
  pages use: "the automation platform", "the workflow automation platform", "the web
  application", "the management console". The brief lists any other names to avoid.
- **Start from the problem when there is one.** Third-Party Services opens with the
  repeated boilerplate the framework removed. Data Upload opens with what users could now
  do without manual file placement.
- Plain, confident, slightly formal. No marketing ("powerful", "seamless", "cutting-edge"),
  no hedging, no exclamation marks. An occasional light touch is fine ("This is the final
  piece of the puzzle", "found its golden place").
- Spell out an acronym the first time if a non-specialist might not know it: "CRUD
  (Create, Read, Update, Delete)", "OIDC (OpenID Connect)".

## Abstraction

This is where generated write-ups go wrong, so it's the rule to hold hardest.

**Describe concepts and behaviour.** Name the components a designer would name (Notice
Template, Data Repository, Third-Party Session), say what each is responsible for, how they
relate, and what rules govern them.

**Leave out the implementation.** None of these belong on the page:

- Class, field, method, variable or function names (`LeaseTenant`, `chip8_step()`, `orgId`)
- Endpoint paths and HTTP verbs (`GET /api/tenant/my-lease`), HTTP status codes (`422`)
- Enum values and status constants (`VACANT`, `CO_APPLICANT`). Describe the states in words instead.
- Environment variables, config keys, file names and paths
- Library internals: interceptors, hooks, middleware, ORM annotations
- Exhaustive lists of fields, placeholders or parameters

**Unless it's major.** Code-level detail earns a place when it _is_ the interesting
decision, and then it gets explained, not just named:

- Data Upload: Java ByteBuffers with larger buffers, and separate read and write threads.
  It's why the uploader reaches 500 Mb/s.
- Third-Party Services: polymorphic serialization with GSON, plus one JSON column for
  type-specific fields. It's what lets every integration share one table.
- The form builder's annotations and reflection. It's literally what the project is.

The test: _would the author bring this up unprompted in an interview?_ If yes, explain it
in a sentence or two. If it only matters to someone editing the code, cut it. The
follow-up questions in the questionnaire exist to settle the borderline cases.

**Inline code** is for names a user would see: workflow operations (`Set Vault Matter`),
options (`create if doesn't exist`). It isn't for source identifiers.

**Code blocks** are rare. The two pages that use them (Platform Web Application, the form
builder) are about developer-facing frameworks, where the shape of the interface is the
subject. Even then, they show a stripped-down sketch, not real code.

### Counterexamples (the old AI-generated pages)

> Deleting a property with active units is rejected with a `422 Unprocessable Entity`
> response. … Units carry a `status` field with four possible values: **VACANT**,
> **OCCUPIED**, **UNDER_MAINTENANCE**, and **NOTICE_GIVEN**.

Better: _A unit's availability follows its lease: activating a lease marks the unit
occupied, and ending one frees it again. Managers can also flag a unit as under maintenance
or as having notice given, for the cases the lease lifecycle can't see. Properties and
units with active leases can't be deleted._

> the backend exposes a single aggregate endpoint —
> `GET /api/tenant/my-lease?orgId=<uuid>`. This endpoint reads the authenticated user's
> identity, finds their active `LeaseTenant` record, and returns a unified response …
> The cache TTL is configurable via `VITE_QUERY_CACHE_MAX_AGE_HOURS` (default: 24 hours).

Better: _The portal is answered by a single request that gathers everything a tenant needs
(lease terms, unit, property, co-tenants and their own signing status) so the page never
assembles it piecemeal. It's cached on the device for a day by default. A lease rarely
changes, and tenants often need it on moving day, when connectivity is at its worst._

Note what survived: the design decision (one aggregate response, aggressive caching) and
the _reason_ for it. What went: the path, the entity name, the variable.

## Structure

**Sections (`##`)**. Pick the shape that fits the project:

| Shape                         | Sections                                  | Example                                |
| ----------------------------- | ----------------------------------------- | -------------------------------------- |
| Feature or tool               | `Overview` + `Deep Dive`                  | Data Upload, Google Vault              |
| Framework                     | `Overview` + `The Framework` (+ one more) | Third-Party Services, Platform Web App |
| Product with separate modules | `Overview` + one section per module       | Legal Hold Notifications (7 sections)  |
| Small                         | `Overview` alone, with `###` sub-headings | Automated Translations                 |

Always open with `## Overview`. Most pages have 2–3 sections. Seven is the most any page
has, and only because Legal Hold's modules are genuinely separate. When in doubt, use
fewer sections and more `###` sub-headings. The table of contents nests them, so a long
Deep Dive stays easy to navigate.

**The Overview**:

1. Opens with what the project is and why it exists: the problem, the users, the
   outcome. The first paragraph is styled as the page's intro, so make it count.
2. Then, usually, the components: "built as a combination of integrated, modular
   components:" followed by a `:::terms` list, one line each.
3. Then any headline numbers or the one-sentence **Goal**, if the page has them.

**The rest of the page follows the Overview's components.** Each term in the Overview's
`:::terms` list typically becomes a `###` sub-heading (or a `##` section, for a product)
that explains it in more depth. The Overview is the map, and the sections are the
territory.

**Within a sub-heading**: one to four short paragraphs. Lead with what the thing is
responsible for, then how it behaves, then any rules or constraints.

**Length**: 350–1,400 words. Legal Hold and Third-Party Services, the longest, are both around 1,400.
Length should come from the project's breadth, not from detail.

## Blocks: when to reach for each

- **`:::terms`** for a section's anchoring component list, or any list where every item is
  "Named thing: what it does". Prefer it to a bulleted list of bold-led items.
- **`:::steps`** for a process or lifecycle where the order matters: resuming an upload,
  a hold's lifecycle, a test's setup and teardown. A list that merely happens to be
  numbered stays a plain list.
- **Banners** are asides, and should be rare: at most one per `###` sub-heading, and never
  two in a row (the lint flags it). `info` qualifies ("optional", "read-only", "never
  exposed", "only the original user can resume"). `note` flags a prerequisite or easy-to-miss
  clarification. If a page needs many, most of them belong in the prose.
- **Diagram**: at most one or two per page, at the level of the Overview's components.
  Worth it when the connections are the point (a pipeline, a request flow, how a framework's
  pieces fit together). Not worth it for a single component, or as decoration.
- **Tables** for relationships between things ("Component / Relations"). Never for
  database columns.
- **`::redacted`** only when the author withholds a detail but the paragraph around it
  needs to stay intact.

## Frontmatter

- **description**: one sentence, under ~220 characters, saying what the project is
  ("A full-stack framework to build integrations to third-party services."). It's shown on
  the project card, so it should make sense without the page.
- **tech**: the technologies a reader would recognize, most important first. These are
  badges, not a dependency list: 4–8 is typical.
- **related**: projects the page builds on or pairs with, which the reader would want next.

## Review checklist

Run through this in the critic pass. Every "no" is a fix.

- [ ] Does the Overview's first paragraph say what the project is and why it exists, in plain language?
- [ ] Is every `##` justified? Could any be a `###` instead?
- [ ] Does each Overview component get explained further down the page?
- [ ] Is the page free of identifiers, endpoints, status codes, enum values, env vars and file names, apart from deliberate, explained exceptions?
- [ ] Is every piece of implementation detail that remains something the author would bring up unprompted?
- [ ] Does each section explain _why_, not just _what_?
- [ ] Is the voice right for the type ("we" for Work, no "I" outside a case study), with no names from the do-not-name list?
- [ ] Are banners rare and never adjacent? Does each `:::steps` describe a real sequence?
- [ ] Does it read like the reference write-ups? Read one, then read the draft. Does the draft sound like the same author?
- [ ] Are there no claims the brief or code doesn't support? Never invent numbers, users or outcomes.
