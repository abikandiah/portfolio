import type { ComponentType } from 'react'
import type { TTech } from './TechTypes'
import type { TProjectView } from '@/lib/projectView'
import { projectView } from '@/lib/projectView'
import { toUrl } from '@/lib/slug'

const projectType = {
	Work: 'Work',
	Personal: 'Personal',
} as const

type TProjectType = (typeof projectType)[keyof typeof projectType]

interface SectionHeading {
	title: string
	id: string
}

interface ProjectSectionProps {
	title?: string
	body: React.ComponentType
	pathname?: string
	/** `###` sub-headings with anchors — nested under the section in the TOC. */
	headings?: Array<SectionHeading> | undefined
}

interface ProjectProps {
	type: TProjectType
	name: string
	description: string
	startYear: number
	endYear?: number | undefined
	tech: Array<TTech>

	url?: string | undefined
	icon?: ComponentType<any> | undefined
	sections?: Array<ProjectSectionProps> | undefined
	caseStudy?: React.ComponentType | undefined

	/** e.g. "Solo", "Lead developer" — shown in the header's meta row. */
	role?: string | undefined
	/** Pathnames of closely connected projects, linked above the footer. */
	related?: Array<string> | undefined
	/** Per view, since a write-up and a case study differ in length. */
	readingMinutes?: ReadingMinutes | undefined
}

interface ReadingMinutes {
	engineering?: number | undefined
	caseStudy?: number | undefined
}

class ProjectSection implements ProjectSectionProps {
	title?: string
	pathname?: string
	body: React.ComponentType
	headings: Array<SectionHeading>

	constructor(props: ProjectSectionProps) {
		this.title = props.title
		this.body = props.body
		this.headings = props.headings ?? []

		if (this.title != null) {
			// No anchor (rather than id="") if the title has nothing to slug —
			// the section still renders, just without a TOC entry or link.
			this.pathname = toUrl(this.title) || undefined
		}
	}
}

class Project implements ProjectProps {
	type: TProjectType
	name: string
	description: string
	startYear: number
	endYear?: number | undefined

	tech: Array<TTech>
	pathname: string

	url?: string | undefined
	icon?: ComponentType<any> | undefined
	sections?: Array<ProjectSection> | undefined
	caseStudy?: React.ComponentType | undefined

	role?: string | undefined
	related: Array<string>
	readingMinutes: ReadingMinutes

	constructor(props: ProjectProps) {
		this.type = props.type
		this.name = props.name
		this.description = props.description
		this.startYear = props.startYear
		this.endYear = props.endYear

		this.tech = props.tech
		this.pathname = projectPathname(props)
		this.url = props.url
		this.caseStudy = props.caseStudy
		this.role = props.role
		this.related = props.related ?? []
		this.readingMinutes = props.readingMinutes ?? {}

		if (Array.isArray(props.sections)) {
			this.sections = props.sections.map(
				(section) => new ProjectSection(section),
			)

			// Titles like "A & B" and "A B" slug the same, and duplicate ids
			// would send the TOC and anchor links to the first match — so a
			// repeat loses its anchor. Logged rather than thrown so one bad
			// title can't take the whole site down; project.test.ts fails on
			// any of these errors, so they're caught before deploy.
			const seen = new Set<string>()
			for (const section of this.sections) {
				if (section.title != null && section.pathname == null) {
					console.error(
						`${this.name}: section "${section.title}" has no letters or digits to build an anchor from`,
					)
				} else if (section.pathname != null) {
					if (seen.has(section.pathname)) {
						console.error(
							`${this.name}: two sections share the anchor "${section.pathname}"`,
						)
						section.pathname = undefined
					} else {
						seen.add(section.pathname)
					}
				}
			}
		}
	}

	/** Display text derived from startYear/endYear, e.g. "2024", "2018 – 2025", "2026 – Present". */
	get duration(): string {
		if (this.endYear == null) {
			return `${this.startYear} – Present`
		}
		if (this.endYear === this.startYear) {
			return `${this.startYear}`
		}
		return `${this.startYear} – ${this.endYear}`
	}

	/** Sort key for reverse-chronological ordering — ongoing projects sort as most recent. */
	get sortYear(): number {
		return this.endYear ?? Infinity
	}
}

// The /projects/$projectKey key for a project. Takes the raw props so
// project files can link to each other without importing the registry
// (which imports them — a cycle).
function projectPathname(props: Pick<ProjectProps, 'name'>): string {
	return toUrl(props.name)
}

export { Project, ProjectSection, projectPathname, projectType, projectView }
export type {
	ProjectProps,
	ProjectSectionProps,
	ReadingMinutes,
	SectionHeading,
	TProjectType,
	TProjectView,
}
