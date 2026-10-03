import { cn } from '@abumble/design-system/utils'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PAGE_TOP_ID } from '@/lib/pageIds'

// Lands on the project title for focus as well as scroll, so the next Tab
// starts from the top of the page rather than from the button just pressed.
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 'auto'
			: 'smooth',
	})
	// preventScroll leaves the smooth scroll above in charge.
	document.getElementById(PAGE_TOP_ID)?.focus({ preventScroll: true })
}

/** A plain-text "Back to top" control, for the end of the page and the TOC. */
function BackToTopLink({ className }: { className?: string }) {
	return (
		<button
			type="button"
			onClick={scrollToTop}
			className={cn(
				'text-link inline-flex cursor-pointer items-center gap-1 rounded text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
				className,
			)}
		>
			<ArrowUp className="h-4 w-4" />
			Back to top
		</button>
	)
}

/**
 * A round button pinned to the bottom-right corner. It only appears once
 * the reader is a screen or more down the page — near the top there's
 * nothing to go back to, and it would sit over the intro.
 */
function FloatingBackToTop() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		let frame = 0

		function update() {
			frame = 0
			setVisible(window.scrollY > window.innerHeight)
		}

		// Throttled to one check per frame; scroll fires far more often.
		function onScroll() {
			if (frame === 0) {
				frame = window.requestAnimationFrame(update)
			}
		}

		update()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => {
			window.cancelAnimationFrame(frame)
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
		}
	}, [])

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Back to top"
			// Hidden, it's also out of the tab order and the accessibility
			// tree — not just transparent.
			aria-hidden={!visible}
			tabIndex={visible ? 0 : -1}
			className={cn(
				'fixed right-4 z-40 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-[opacity,transform] duration-200 outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none sm:right-6',
				// Clear of the iPhone home indicator.
				'bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6',
				visible
					? 'translate-y-0 opacity-100'
					: 'pointer-events-none translate-y-2 opacity-0',
			)}
		>
			<ArrowUp className="h-4 w-4" />
		</button>
	)
}

export { BackToTopLink, FloatingBackToTop, PAGE_TOP_ID }
