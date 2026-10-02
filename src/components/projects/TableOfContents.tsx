import { cn } from '@abumble/design-system/utils'
import { useEffect, useState } from 'react'
import { scrollToHash } from '@/components/projects/scrollToHash'

interface TocEntry {
	title: string
	pathname: string
}

// How far from the top of the viewport a heading counts as "reached" —
// matches the headings' scroll-mt-20 (80px, clearing the fixed header) plus
// a little breathing room.
const READING_LINE_PX = 100

interface TableOfContentsProps {
	entries: Array<TocEntry>
	className?: string
}

function TableOfContents({ entries, className }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string | undefined>(
		entries[0]?.pathname,
	)
	const entryKey = entries.map((entry) => entry.pathname).join(',')

	useEffect(() => {
		const headings = entries
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
		function updateActive() {
			let current = headings[0]
			for (const heading of headings) {
				if (heading.getBoundingClientRect().top <= READING_LINE_PX) {
					current = heading
				}
			}
			setActiveId(current.id)
		}

		updateActive()
		window.addEventListener('scroll', updateActive, { passive: true })
		window.addEventListener('resize', updateActive)
		return () => {
			window.removeEventListener('scroll', updateActive)
			window.removeEventListener('resize', updateActive)
		}
	}, [entryKey])

	return (
		// Hidden below xl — the TOC sits in the page's right margin, and
		// only from xl is that margin wide enough to hold it beside the 3xl
		// reading column. At xl+ it's split into two layers: this outer div
		// is sized by the caller to the full height of the content it sits
		// beside, giving the inner sticky div room to track the whole way
		// down — sticky only ever moves within its containing block's
		// height, so without this tall wrapper it would un-stick after the
		// first screen. The nav itself is sized to its own content rather
		// than stretching to match.
		<div className={cn('hidden xl:block', className)}>
			<div className="sticky top-20">
				<nav aria-label="Table of contents">
					<div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
						On this page
					</div>

					<ul className="space-y-1 border-l border-foreground/15 text-sm">
						{entries.map((entry) => (
							<li key={entry.pathname}>
								<a
									href={`#${entry.pathname}`}
									onClick={(event) => scrollToHash(event, entry.pathname)}
									aria-current={
										activeId === entry.pathname ? 'location' : undefined
									}
									className={cn(
										'-ml-px block border-l-2 py-1 pl-3 transition-colors',
										activeId === entry.pathname
											? 'border-foreground font-medium text-foreground'
											: 'border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
									)}
								>
									{entry.title}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</div>
	)
}

export { TableOfContents }
export type { TocEntry }
