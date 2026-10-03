import { cn } from '@abumble/design-system/utils'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { isPlainClick, scrollToHash } from '@/components/projects/scrollToHash'

interface TocEntry {
	title: string
	pathname: string
	/** Sub-headings, listed indented under their section. */
	children?: Array<TocEntry>
}

function flattenEntries(entries: Array<TocEntry>): Array<TocEntry> {
	return entries.flatMap((entry) => [
		entry,
		...flattenEntries(entry.children ?? []),
	])
}

// How far from the top of the viewport a heading counts as "reached" —
// matches the headings' scroll-mt-20 (80px, clearing the fixed header) plus
// a little breathing room.
const READING_LINE_PX = 100

// Must match the `xl` breakpoint the sidebar is shown at below.
const SIDEBAR_MEDIA_QUERY = '(min-width: 1280px)'

interface TableOfContentsProps {
	entries: Array<TocEntry>
	className?: string
}

function TableOfContents({ entries, className }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string | undefined>(
		entries[0]?.pathname,
	)
	const entryKey = flattenEntries(entries)
		.map((entry) => entry.pathname)
		.join(',')

	useEffect(() => {
		// Sections and sub-headings alike — whichever heading was passed last
		// is the active entry, at any depth.
		const headings = flattenEntries(entries)
			.map((entry) => document.getElementById(entry.pathname))
			.filter((el): el is HTMLElement => el != null)

		if (headings.length === 0) {
			return
		}

		// The active entry is whichever heading is the last one to have
		// scrolled past the reading line — this stays correct even once
		// you've scrolled past the final section, unlike an
		// IntersectionObserver "currently visible" set (which goes empty
		// once nothing is left to intersect and never updates again).
		//
		// Once the page is scrolled to the bottom, the last heading wins: a
		// short final section can never scroll up to the reading line, and
		// would otherwise never be marked active.
		function updateActive() {
			const scrolledToBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 2
			if (scrolledToBottom) {
				setActiveId(headings[headings.length - 1].id)
				return
			}

			let current = headings[0]
			for (const heading of headings) {
				if (heading.getBoundingClientRect().top <= READING_LINE_PX) {
					current = heading
				}
			}
			setActiveId(current.id)
		}

		// Below xl the sidebar is display:none (InlineTableOfContents takes
		// over), so only listen while it's actually visible — otherwise every
		// scroll would measure every heading for a TOC nobody can see.
		const media = window.matchMedia(SIDEBAR_MEDIA_QUERY)

		function attach() {
			updateActive()
			window.addEventListener('scroll', updateActive, { passive: true })
			window.addEventListener('resize', updateActive)
		}

		function detach() {
			window.removeEventListener('scroll', updateActive)
			window.removeEventListener('resize', updateActive)
		}

		function onMediaChange() {
			if (media.matches) {
				attach()
			} else {
				detach()
			}
		}

		onMediaChange()
		media.addEventListener('change', onMediaChange)
		return () => {
			media.removeEventListener('change', onMediaChange)
			detach()
		}
	}, [entryKey])

	return (
		// Hidden below xl — the TOC sits in the page's right margin, and
		// only from xl is that margin wide enough to hold it beside the 2xl
		// reading column (narrower screens get InlineTableOfContents instead).
		// At xl+ it's split into two layers: this outer div is sized by the
		// caller to the full height of the content it sits beside, giving the
		// inner sticky div room to track the whole way down — sticky only ever
		// moves within its containing block's height, so without this tall
		// wrapper it would un-stick after the first screen. The nav itself is
		// sized to its own content rather than stretching to match.
		<div className={cn('hidden xl:block', className)}>
			{/* Capped to the viewport (less the top-20 offset and a little
			    bottom room) so a long TOC on a short screen scrolls instead of
			    pinning its last entries off-screen. */}
			<div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
				<nav aria-label="Table of contents">
					<div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
						On this page
					</div>

					<TocList entries={entries} activeId={activeId} />
				</nav>
			</div>
		</div>
	)
}

// The below-xl counterpart to TableOfContents: a collapsed "On this page"
// disclosure above the content, so long write-ups stay navigable on
// laptops, tablets, and phones where there's no margin to hang a sidebar.
function InlineTableOfContents({ entries, className }: TableOfContentsProps) {
	const detailsRef = useRef<HTMLDetailsElement>(null)

	// Collapse before the scroll starts — the list sits above the content,
	// so closing it afterwards would shift the target out from under the
	// smooth scroll.
	function onNavigate() {
		if (detailsRef.current != null) {
			detailsRef.current.open = false
		}
	}

	return (
		<details
			ref={detailsRef}
			className={cn('group rounded border xl:hidden', className)}
		>
			<summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
				<span>
					On this page
					<span className="ml-1.5 text-muted-foreground">
						({flattenEntries(entries).length})
					</span>
				</span>

				<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
			</summary>

			<nav aria-label="Table of contents" className="px-4 pb-4">
				<TocList entries={entries} onNavigate={onNavigate} />
			</nav>
		</details>
	)
}

function TocList({
	entries,
	activeId,
	onNavigate,
	nested = false,
}: {
	entries: Array<TocEntry>
	activeId?: string
	onNavigate?: () => void
	nested?: boolean
}) {
	return (
		<ul
			className={cn(
				'space-y-1 text-sm',
				// The rail is drawn once, by the top-level list; nested lists sit
				// inside it and only indent.
				nested ? 'mt-1' : 'border-l border-foreground/15',
			)}
		>
			{entries.map((entry) => (
				<li key={entry.pathname}>
					<a
						href={`#${entry.pathname}`}
						onClick={(event) => {
							// Must run before scrollToHash (see onNavigate). Modified
							// clicks open a new tab, so the list stays open for those.
							if (isPlainClick(event)) {
								onNavigate?.()
							}
							scrollToHash(event, entry.pathname)
						}}
						aria-current={activeId === entry.pathname ? 'location' : undefined}
						className={cn(
							'-ml-px block border-l-2 py-1 transition-colors',
							nested ? 'pl-6 text-[0.8125rem]' : 'pl-3',
							activeId === entry.pathname
								? 'border-foreground font-medium text-foreground'
								: 'border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
						)}
					>
						{entry.title}
					</a>

					{entry.children != null && entry.children.length > 0 && (
						<TocList
							entries={entry.children}
							activeId={activeId}
							onNavigate={onNavigate}
							nested
						/>
					)}
				</li>
			))}
		</ul>
	)
}

export { flattenEntries, InlineTableOfContents, TableOfContents }
export type { TocEntry }
