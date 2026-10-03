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

/**
 * Whether the top of the page — the project title — has scrolled out of
 * view: the moment there's a "top" to go back to. Before that a control
 * would only sit beside the intro.
 */
function useScrolledPastTitle() {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		let frame = 0

		function update() {
			frame = 0
			const title = document.getElementById(PAGE_TOP_ID)
			setScrolled(
				title != null
					? title.getBoundingClientRect().bottom < 0
					: window.scrollY > window.innerHeight / 2,
			)
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

	return scrolled
}

/**
 * The page's back-to-top control: a round button that rides the bottom of
 * the screen while the write-up is in view. It's sticky within the write-up
 * rather than fixed to the screen, so at the end of the text it comes to
 * rest there instead of following the reader down into the page's footer.
 *
 * Place it as the last child of the element wrapping the write-up — that
 * element is what it sticks within.
 */
function FloatingBackToTop() {
	const visible = useScrolledPastTitle()

	return (
		// Below lg the button sits over the text column, so it gets its own
		// slot after the text to come to rest in, rather than resting on the
		// last lines. From lg it rests in the margin beside them instead, so
		// the slot collapses to zero height and the button hangs up out of it.
		<div className="sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mt-4 flex h-10 justify-end sm:bottom-6 lg:mt-0 lg:block lg:h-0">
			<button
				type="button"
				onClick={scrollToTop}
				aria-label="Back to top"
				// Hidden, it's also out of the tab order and the accessibility
				// tree — not just transparent.
				aria-hidden={!visible}
				tabIndex={visible ? 0 : -1}
				className={cn(
					'grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-md backdrop-blur outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
					// From lg the margin is wide enough to hold it, so it moves
					// out beside the text, with room to spare, rather than
					// sitting over the ends of its lines — under the TOC, at xl.
					'lg:absolute lg:bottom-0 lg:left-full lg:ml-12',
					'transition-[opacity,transform] duration-200 motion-reduce:transition-none',
					visible
						? 'translate-y-0 opacity-100'
						: 'pointer-events-none translate-y-2 opacity-0',
				)}
			>
				<ArrowUp className="h-4 w-4" />
			</button>
		</div>
	)
}

export { FloatingBackToTop, PAGE_TOP_ID }
