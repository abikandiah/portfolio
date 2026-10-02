import type { ComponentType } from 'react'
import type { TTech } from './TechTypes'

const projectType = {
	Work: 'Work',
	Personal: 'Personal',
} as const

type TProjectType = (typeof projectType)[keyof typeof projectType]

const projectView = {
	CaseStudy: 'case-study',
	Engineering: 'engineering',
} as const

type TProjectView = (typeof projectView)[keyof typeof projectView]

interface ProjectSectionProps {
	title?: string
	body: React.ComponentType
	pathname?: string
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
}

class ProjectSection implements ProjectSectionProps {
	title?: string
	pathname?: string
	body: React.ComponentType

	constructor(props: ProjectSectionProps) {
		this.title = props.title
		this.body = props.body

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

	/** Display text derived from startYear/endYear, e.g. "2024", "2018 - 2025", "2026 - Present". */
	get duration(): string {
		if (this.endYear == null) {
			return `${this.startYear} - Present`
		}
		if (this.endYear === this.startYear) {
			return `${this.startYear}`
		}
		return `${this.startYear} - ${this.endYear}`
	}

	/** Sort key for reverse-chronological ordering — ongoing projects sort as most recent. */
	get sortYear(): number {
		return this.endYear ?? Infinity
	}
}

// Used for both project URLs and section anchors (which get shared as
// copied links), so strip anything that isn't a letter or digit —
// "Properties & Units" becomes `properties-units`, not `properties-&-units`.
// Returns '' if there's nothing left; callers decide what that means.
function toUrl(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

// The /projects/$projectKey key for a project. Takes the raw props so
// project files can link to each other without importing the registry
// (which imports them — a cycle).
function projectPathname(props: Pick<ProjectProps, 'name'>): string {
	return toUrl(props.name)
}

export { Project, ProjectSection, projectPathname, projectType, projectView }
export type { ProjectProps, ProjectSectionProps, TProjectType, TProjectView }
