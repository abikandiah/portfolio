# Projects Page Refactor — Blueprint

Status: phases 1-2 done, phase 3 not started
Owner: Abi

## Why

The `/projects` section currently uses a docs-style, always-fixed sidebar
(`src/routes/projects.tsx`) to navigate between project pages. That pattern
was built for a handful of projects and is already showing problems:

- The sidebar is `position: fixed` inside the design system's `Sidebar`
  component, so it always occupies the same screen region for as long as
  you're on any `/projects/*` route — including once you've scrolled past
  the project content into the site's global footer. Several attempts to
  patch this with CSS (`sticky` positioning, z-index layering) each fixed
  one symptom while breaking something else (premature disappearing on
  long pages, broken collapse animation, footer covering the sidebar's own
  content). The conflict is structural, not a styling bug — a persistent
  fixed-position nav and a page that has more content below it don't
  compose cleanly.
- A flat sidebar list doesn't scale. This site currently has ~10 projects
  and is meant to hold 20-30+ over the rest of a career. A directory-style
  sidebar gets worse, not better, as the count grows — it needs heavy
  grouping/collapsing to stay usable, and that's exactly the interaction
  (jumping between many pages while cross-referencing) that a portfolio
  doesn't need. People read one project case study at a time, then go back
  to browse others.
- Every project is currently written from a single engineering-design POV.
  There's no way to present the same project as a short, skimmable
  business/case-study story for a recruiter or PM, alongside the deep
  technical write-up for an engineer.

## Goals

1. Replace the sidebar with a filterable grid overview, in line with how
   most portfolio/case-study sites at this scale actually work (Behance,
   Dribbble, most senior engineers' project archives).
2. Let each project be viewed through two lenses — **Case Study** and
   **Engineering** — without duplicating it into two separate cards/entries.
   One project, one card, one URL, a toggle to switch lens.
3. Make the data model and page structure hold up for 20-30+ projects and
   for photos/video down the line (as supporting media inside whichever
   view fits, not as a separate content "kind").

## Non-goals (explicitly deferred)

- Redesigning the *visual* layout of the existing engineering write-up
  template (prose/tables/code blocks). That template stays as-is content-
  wise; only its wrapper/toggle changes. Revisit later.
- Building out full faceted filtering (tech stack chips, year, etc.) on the
  grid. Start with category + search; add more facets once there's enough
  content to need them.
- A command palette / ⌘K jump-to. Worth considering once the catalog is
  large, not now.

## Data model

`src/types/ProjectTypes.ts` currently has one `sections` list per project
(what is now the "Engineering" view). Add an optional, separately-shaped
`caseStudy` field:

```ts
interface CaseStudyMedia {
	type: 'image' | 'video'
	src: string
	caption?: string
}

interface CaseStudy {
	summary: string
	problem: string
	approach: string
	outcome: string
	metrics?: Array<{ label: string; value: string }>
	media?: Array<CaseStudyMedia>
}

interface ProjectProps {
	// ...existing fields unchanged...
	sections?: Array<ProjectSectionProps> // renamed in spirit to "the engineering view's content"; no data migration needed
	caseStudy?: CaseStudy
}
```

Notes:

- `sections` (engineering content) is untouched — every existing project's
  content maps directly, no rewrite.
- `caseStudy` is optional and added per project, incrementally, as it's
  written. A project can have either, both, or (temporarily) neither.
- Photos/video live inside `caseStudy.media` — there is no separate
  "photo project" or "video project" kind.
- Naming for the two views in the UI: **"Case Study"** and **"Engineering."**

## Project detail page (`/projects/$projectKey`)

- Add a `view` search param: `?view=case-study | engineering`, validated
  via TanStack Router's search param schema (invalid/missing falls back to
  the default below).
- Default view: `case-study` if the project has one, else `engineering`.
- Indicator, always visible near the header:
  - Both views exist → a real segmented toggle ("Case Study" / "Engineering").
  - Only one exists → a small static (non-interactive) label naming which
    view you're on, so it's never ambiguous.
- Two rendering branches under the shared header (name, description, tech
  badges, external link):
  - **Engineering view** — today's `ProjectBody`/`ProjectBodySection`
    rendering, unchanged.
  - **Case Study view** — a new, more visual-first template: summary,
    problem → approach → outcome narrative, optional metrics callout,
    optional media gallery. Not a list of prose sections.

## `/projects` index → filterable grid

- Replace the current redirect-to-first-project behavior with a real grid
  of project cards (name, short description, tech badges, category),
  similar in spirit to the home page's "Key Projects" cards.
- Filters to start: category (Work/Personal) and a text search box over
  name/description. Defer tech-stack chip filtering until the catalog
  actually needs it.
- The disclaimer banner currently shown by the sidebar layout
  (`src/routes/projects.tsx`) needs a new home — likely at the top of the
  grid page, same dismiss-and-remember-via-localStorage behavior as today.

## Migration / rollout phasing

1. **Data model + toggle UI. ✅ Done.** Added the optional `caseStudy`
   shape, the toggle, and the two view templates on `$projectKey`. Web
   Portfolio has a real case study as the first example; every other
   project still shows Engineering only, non-breaking.
2. **Grid replaces the sidebar. ✅ Done.** `/projects/index.tsx` is a real
   filterable grid (category + search); `projects.tsx` dropped the
   `Sidebar` layout entirely. Detail pages got a back-to-grid link instead
   of prev/next (prev/next was tried and removed — it implied a curated
   order that doesn't exist). Along the way: `duration` became a derived
   `startYear`/`endYear` pair, `projects` sorts reverse-chronologically for
   browsing, and the home page's Key Projects became a separately curated
   `featuredProjects` list (see the Projects Data section below) rather
   than "first N by recency" — recency and importance aren't the same
   thing.
3. **Content.** Write Case Study copy per project, incrementally — start
   with a couple of flagship projects, not all at once.
4. **(Later, separate effort)** Revisit the Engineering view's visual
   design/layout.

## Open questions

- Exact wording/order of metrics callout in the Case Study template —
  settle once the first real case study is being written.
- Whether grid cards should hint which view(s) a project has (e.g. a small
  "Case Study" badge) — nice-to-have, not blocking.
