import { Card } from '@abumble/design-system/components/Card'
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

function TableOfContents({ entries }: { entries: Array<TocEntry> }) {
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
		// Hidden entirely below lg (no TOC on mobile) and, at lg+, split into
		// two layers: this outer div is a plain grid item that gets the grid's
		// default full-height stretch, giving the inner sticky div room to
		// track the whole way down a long content column — sticky only ever
		// moves within its containing block's height, so without this tall
		// outer wrapper it would un-stick after the first screen. The Card
		// one level in is what's actually visible, sized to its own content
		// rather than stretching to match the content column.
		<div className="hidden lg:block">
			<div className="lg:sticky lg:top-20">
				<Card>
					<nav aria-label="Table of contents">
						<div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							On this page
						</div>

						<ul className="space-y-1 text-sm">
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
				</Card>
			</div>
		</div>
	)
}

export { TableOfContents }
export type { TocEntry }
