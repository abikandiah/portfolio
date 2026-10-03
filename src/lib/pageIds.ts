import { projectView } from './projectView.ts'
import type { TProjectView } from './projectView.ts'

/*
 * Fixed element ids on a project page. Write-up headings get ids from their
 * titles, so a section named after one of these ("## Related Projects")
 * would collide with the page's own element — the content plugin rejects
 * any heading whose anchor is in RESERVED_PAGE_IDS. Components take their
 * ids from here, so the list can't drift from what's on the page.
 *
 * Import-free apart from projectView, for the plugin's sake (it runs
 * outside Vite's `@/` alias).
 */

/** The React root in index.html. */
export const APP_ROOT_ID = 'app'

/** The project title — where "back to top" lands. */
export const PAGE_TOP_ID = 'project-title'

export const RELATED_PROJECTS_ID = 'related-projects'

// The view toggle follows the WAI-ARIA tabs pattern: the active view's
// content is a role="tabpanel" with this id, labelled by the selected tab.
export const VIEW_PANEL_ID = 'project-view-panel'

export function viewTabId(view: TProjectView) {
	return `project-view-tab-${view}`
}

export const RESERVED_PAGE_IDS: ReadonlySet<string> = new Set([
	APP_ROOT_ID,
	PAGE_TOP_ID,
	RELATED_PROJECTS_ID,
	VIEW_PANEL_ID,
	...Object.values(projectView).map(viewTabId),
])
