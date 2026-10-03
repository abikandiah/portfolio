import type { ProjectProps } from '@/types/ProjectTypes'
import { Project } from '@/types/ProjectTypes'
import { findDraftReferences } from '@/content/draftReferences'
import { contentReferences, loadContentProjects } from '@/content/loadProjects'
import { chip8EmulatorProject } from '@/projects/Chip8Emulator'
import { propMangeProject } from '@/projects/PropMange'

const projectsMap: Map<string, Project> = new Map()

function addProject(props: ProjectProps): Project {
	const proj = new Project(props)
	// Logged rather than thrown so one bad name can't take the whole site
	// down — the project just isn't routable. project.test.ts fails on these.
	if (proj.pathname === '') {
		console.error(`"${proj.name}" has no letters or digits to build a URL from`)
	} else if (projectsMap.has(proj.pathname)) {
		console.error(`Two projects share the URL "${proj.pathname}"`)
	} else {
		projectsMap.set(proj.pathname, proj)
	}
	return proj
}

// Write-ups in src/content/projects/ register themselves. The two TSX
// projects predate the Markdown format and are due to be regenerated into it.
addProject(propMangeProject)
addProject(chip8EmulatorProject)

const contentProjects = loadContentProjects()
for (const { props } of contentProjects) {
	addProject(props)
}

// Cross-references are only known once every project is registered.
// Logged rather than thrown, like the slug checks above; project.test.ts
// fails on any of these.
for (const proj of projectsMap.values()) {
	for (const related of proj.related) {
		if (related === proj.pathname) {
			console.error(`${proj.name}: lists itself as a related project`)
		} else if (!projectsMap.has(related)) {
			console.error(`${proj.name}: related project "${related}" doesn't exist`)
		}
	}
}
for (const { props, projectLinks } of contentProjects) {
	for (const link of projectLinks) {
		if (!projectsMap.has(link)) {
			console.error(
				`${props.name}: links to missing project "/projects/${link}"`,
			)
		}
	}
}

// Reverse-chronological: most recently active projects first. This is the
// canonical browsing order (the /projects grid, projectsByType below). See
// featuredProjects further down for the separately curated home page list.
const projects = Array.from(projectsMap.values()).sort(
	(a, b) => b.sortYear - a.sortYear || b.startYear - a.startYear,
)

interface ProjectMap {
	[key: string]: Array<Project> | undefined
}

const projectsByType: ProjectMap = projects.reduce((prev, curr) => {
	if (prev[curr.type] == null) {
		prev[curr.type] = []
	}
	prev[curr.type]!.push(curr)
	return prev
}, {} as ProjectMap)

// Key Projects, hand-picked and in display order — deliberately independent
// of the reverse-chronological `projects` sort above. "Key" means important,
// not "most recent." Listed by pathname (the content folder name); a missing
// one is logged, which project.test.ts turns into a failure, so a rename
// can't silently drop a project from the home page.
const featuredPathnames = [
	'propmange',
	'java-to-react-form-builder',
	'third-party-services-framework',
]

const featuredProjects: Array<Project> = featuredPathnames.flatMap(
	(pathname) => {
		const proj = projectsMap.get(pathname)
		if (proj == null) {
			console.error(`Featured project "${pathname}" doesn't exist`)
			return []
		}
		return [proj]
	},
)

// Nothing published may point at a draft — not a write-up, and not the home
// page. Drafts only drop out of production builds, where a dangling link
// would 404 (or a featured project silently vanish); checking the
// references directly catches it in dev and tests too.
for (const message of findDraftReferences([
	...contentReferences(),
	{
		slug: 'featured projects (src/constants/project.ts)',
		draft: false,
		references: featuredPathnames,
	},
])) {
	console.error(message)
}

export { featuredProjects, projects, projectsByType, projectsMap }
