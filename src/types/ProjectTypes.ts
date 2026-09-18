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
			this.pathname = toUrl(this.title)
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
		this.pathname = toUrl(this.name)
		this.url = props.url
		this.caseStudy = props.caseStudy

		if (Array.isArray(props.sections)) {
			this.sections = props.sections.map(
				(section) => new ProjectSection(section),
			)
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

function toUrl(str: string): string {
	return str.toLowerCase().replaceAll(' ', '-')
}

export { Project, ProjectSection, projectType, projectView, toUrl }
export type { ProjectProps, ProjectSectionProps, TProjectType, TProjectView }
