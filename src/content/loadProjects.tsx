import type { CaseStudyContent, ProjectContent } from '@/content/types'
import type { ProjectProps } from '@/types/ProjectTypes'
import type { ReferencingProject } from '@/content/draftReferences'
import { WriteUpContent } from '@/components/projects/content/WriteUpContent'

/*
 * Every src/content/projects/<slug>/index.md is a project — adding one is
 * just adding the folder. The files are compiled at build time by
 * plugins/project-content.ts (which also rejects anything outside the
 * write-up format), so these imports are already-validated trees.
 */

const projectFiles = import.meta.glob<ProjectContent>('./projects/*/index.md', {
	eager: true,
	import: 'default',
})

const caseStudyFiles = import.meta.glob<CaseStudyContent>(
	'./projects/*/case-study.md',
	{ eager: true, import: 'default' },
)

interface ContentProject {
	props: ProjectProps
	/** Every /projects/<slug> link in the write-up, for the registry to check. */
	projectLinks: Array<string>
}

// Optional — most projects have no case study.
function caseStudyFor(indexPath: string): CaseStudyContent | undefined {
	return caseStudyFiles[indexPath.replace(/index\.md$/, 'case-study.md')]
}

/**
 * What every write-up — drafts included, in every mode — points at, for the
 * registry's draft check. Drafts only drop out of production builds, so
 * this is the one view of them that tests can see.
 */
function contentReferences(): Array<ReferencingProject> {
	return Object.entries(projectFiles).map(([path, content]) => ({
		slug: content.slug,
		draft: content.meta.draft === true,
		references: [
			...(content.meta.related ?? []),
			...content.projectLinks,
			...(caseStudyFor(path)?.projectLinks ?? []),
		],
	}))
}

function loadContentProjects(): Array<ContentProject> {
	const loaded: Array<ContentProject> = []

	for (const [path, content] of Object.entries(projectFiles)) {
		const { meta } = content

		// Drafts render in dev (and tests) for review, never in production.
		if (meta.draft === true && import.meta.env.PROD) {
			continue
		}

		const caseStudy = caseStudyFor(path)

		loaded.push({
			props: {
				type: meta.type,
				name: meta.name,
				description: meta.description,
				startYear: meta.startYear,
				endYear: meta.endYear,
				tech: meta.tech,
				url: meta.url,
				role: meta.role,
				related: meta.related,
				readingMinutes: {
					engineering:
						content.sections.length > 0 ? content.readingMinutes : undefined,
					caseStudy: caseStudy?.readingMinutes,
				},
				sections: content.sections.map((section) => ({
					title: section.title,
					headings: section.headings,
					body: () => <WriteUpContent tree={section.tree} />,
				})),
				caseStudy:
					caseStudy != null
						? () => <WriteUpContent tree={caseStudy.tree} />
						: undefined,
			},
			projectLinks: [
				...content.projectLinks,
				...(caseStudy?.projectLinks ?? []),
			],
		})
	}

	return loaded
}

export { contentReferences, loadContentProjects }
