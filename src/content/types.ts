import type { Root } from 'hast'
import type { TTech } from '../types/TechTypes.ts'

// The shape the content plugin (plugins/project-content.ts) compiles each
// Markdown file into. Shared by the plugin (Node, at build time) and the app
// (browser, at runtime), so it must stay type-only and alias-free.

interface ContentHeading {
	title: string
	id: string
}

interface ContentSection {
	title: string
	/** The section's `###` sub-headings, in order — the nested TOC entries. */
	headings: Array<ContentHeading>
	tree: Root
}

interface ProjectMeta {
	name: string
	type: 'Work' | 'Personal'
	startYear: number
	/** Omitted for ongoing projects (`endYear: present` in the frontmatter). */
	endYear?: number
	description: string
	tech: Array<TTech>
	url?: string
	role?: string
	related?: Array<string>
	draft?: boolean
}

interface ProjectContent {
	/** The project's folder name — always equal to the slug of its name. */
	slug: string
	meta: ProjectMeta
	sections: Array<ContentSection>
	readingMinutes: number
	/** Slugs of every `/projects/<slug>` link in the body, checked at load. */
	projectLinks: Array<string>
}

interface CaseStudyContent {
	tree: Root
	readingMinutes: number
	projectLinks: Array<string>
}

export type {
	CaseStudyContent,
	ContentHeading,
	ContentSection,
	ProjectContent,
	ProjectMeta,
}
