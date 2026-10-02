import { cn } from '@abumble/design-system/utils'
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

interface ViewToggleProps {
	hasCaseStudy: boolean
	hasEngineering: boolean
	activeView: TProjectView
	onSelect: (view: TProjectView) => void
}

function ViewToggle({
	hasCaseStudy,
	hasEngineering,
	activeView,
	onSelect,
}: ViewToggleProps) {
	const availability: Record<TProjectView, boolean> = {
		[projectView.CaseStudy]: hasCaseStudy,
		[projectView.Engineering]: hasEngineering,
	}
	const availableViews = ALL_VIEWS.filter((view) => availability[view])

	// With only one view there's nothing to switch between — a lone chip
	// would look like a button that does nothing.
	if (availableViews.length <= 1) {
		return null
	}

	return (
		<div
			role="tablist"
			aria-label="Project view"
			className="inline-flex gap-1 self-start rounded border p-1"
		>
			{availableViews.map((view) => (
				<ViewToggleButton
					key={view}
					view={view}
					active={activeView === view}
					onSelect={onSelect}
				/>
			))}
		</div>
	)
}

function ViewToggleButton({
	view,
	active,
	onSelect,
}: {
	view: TProjectView
	active: boolean
	onSelect: (view: TProjectView) => void
}) {
	return (
		<button
			type="button"
			role="tab"
			aria-selected={active}
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

export { ViewToggle }
