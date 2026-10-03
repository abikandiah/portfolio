// The two ways a project page can be read. Lives on its own, free of
// imports, so the build-time content plugin can use it too (see pageIds).
export const projectView = {
	CaseStudy: 'case-study',
	Engineering: 'engineering',
} as const

export type TProjectView = (typeof projectView)[keyof typeof projectView]
