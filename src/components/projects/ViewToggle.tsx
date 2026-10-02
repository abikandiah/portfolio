import { cn } from '@abumble/design-system/utils'
import { useRef } from 'react'
import type { TProjectView } from '@/types/ProjectTypes'
import { projectView } from '@/types/ProjectTypes'

const VIEW_LABELS: Record<TProjectView, string> = {
	[projectView.CaseStudy]: 'Case Study',
	[projectView.Engineering]: 'Design',
}

// Order they appear in the toggle. Add a new view here and to VIEW_LABELS
// above to support a third one — nothing else needs to change.
const ALL_VIEWS: Array<TProjectView> = [
	projectView.CaseStudy,
	projectView.Engineering,
]

// The toggle follows the WAI-ARIA tabs pattern: the page renders the active
// view's content in a role="tabpanel" with this id, labelled by the
// selected tab.
const VIEW_PANEL_ID = 'project-view-panel'

function viewTabId(view: TProjectView) {
	return `project-view-tab-${view}`
}

interface ViewToggleProps {
	availableViews: Array<TProjectView>
	activeView: TProjectView
	onSelect: (view: TProjectView) => void
}

function ViewToggle({ availableViews, activeView, onSelect }: ViewToggleProps) {
	const tabRefs = useRef(new Map<TProjectView, HTMLButtonElement>())

	// With only one view there's nothing to switch between — a lone chip
	// would look like a button that does nothing.
	if (availableViews.length <= 1) {
		return null
	}

	// Arrow keys move between tabs and select as they go (switching views is
	// instant, so "automatic activation" is the right fit); Home/End jump to
	// the ends. Only the selected tab is in the Tab order (roving tabindex).
	function onKeyDown(event: React.KeyboardEvent) {
		const index = availableViews.indexOf(activeView)
		const last = availableViews.length - 1
		const nextIndex =
			event.key === 'ArrowRight'
				? (index + 1) % availableViews.length
				: event.key === 'ArrowLeft'
					? (index - 1 + availableViews.length) % availableViews.length
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? last
							: undefined

		if (nextIndex == null) {
			return
		}

		event.preventDefault()
		const view = availableViews[nextIndex]
		onSelect(view)
		tabRefs.current.get(view)?.focus()
	}

	return (
		<div
			role="tablist"
			aria-label="Project view"
			onKeyDown={onKeyDown}
			className="inline-flex gap-1 self-start rounded border p-1"
		>
			{availableViews.map((view) => (
				<ViewToggleButton
					key={view}
					ref={(el) => {
						if (el == null) {
							tabRefs.current.delete(view)
						} else {
							tabRefs.current.set(view, el)
						}
					}}
					view={view}
					active={activeView === view}
					onSelect={onSelect}
				/>
			))}
		</div>
	)
}

function ViewToggleButton({
	ref,
	view,
	active,
	onSelect,
}: {
	ref: React.Ref<HTMLButtonElement>
	view: TProjectView
	active: boolean
	onSelect: (view: TProjectView) => void
}) {
	return (
		<button
			ref={ref}
			type="button"
			role="tab"
			id={viewTabId(view)}
			aria-selected={active}
			aria-controls={VIEW_PANEL_ID}
			tabIndex={active ? 0 : -1}
			onClick={() => onSelect(view)}
			className={cn(
				'rounded px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:outline-ring',
				active
					? 'bg-foreground/8 text-foreground'
					: 'text-muted-foreground hover:bg-foreground/6 hover:text-foreground',
			)}
		>
			{VIEW_LABELS[view]}
		</button>
	)
}

export { ALL_VIEWS, VIEW_PANEL_ID, ViewToggle, viewTabId }
