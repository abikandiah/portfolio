import { CodeDisplay } from '@abumble/design-system/components/CodeDisplay'
import { Skeleton } from '@abumble/design-system/components/Skeleton'
import { useEffect, useId, useState, useSyncExternalStore } from 'react'

// The design system's ThemeProvider toggles `dark` on <html>; diagrams are
// rendered to SVG with baked-in colors, so they re-render when it flips.
function subscribeToTheme(onChange: () => void) {
	const observer = new MutationObserver(onChange)
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class'],
	})
	return () => observer.disconnect()
}

function useIsDark() {
	return useSyncExternalStore(
		subscribeToTheme,
		() => document.documentElement.classList.contains('dark'),
		() => false,
	)
}

/**
 * A Mermaid diagram from a ```mermaid block. Mermaid is large, so it's
 * loaded on demand — only pages that actually have a diagram pay for it.
 */
function Diagram({ code = '', caption }: { code?: string; caption?: string }) {
	const isDark = useIsDark()
	const renderId = `diagram-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
	// Results are keyed by the code they were drawn from. A theme change keeps
	// showing the current drawing until its re-render lands (no flash back to
	// the placeholder); only new code invalidates it. Failure is per code too
	// — a syntax error fails in every theme.
	const [rendered, setRendered] = useState<{ code: string; svg: string }>()
	const [failedCode, setFailedCode] = useState<string>()
	const svg = rendered?.code === code ? rendered.svg : undefined
	const failed = failedCode === code

	useEffect(() => {
		let cancelled = false

		import('mermaid')
			.then(async ({ default: mermaid }) => {
				mermaid.initialize({
					startOnLoad: false,
					securityLevel: 'strict',
					// Throw on bad syntax instead of drawing Mermaid's own error
					// graphic — the fallback below shows the source instead.
					suppressErrorRendering: true,
					theme: isDark ? 'dark' : 'neutral',
					fontFamily: "'Inter Variable', sans-serif",
				})
				const result = await mermaid.render(renderId, code)
				if (!cancelled) {
					setRendered({ code, svg: result.svg })
				}
			})
			.catch(() => {
				if (!cancelled) {
					setFailedCode(code)
				}
			})

		return () => {
			cancelled = true
		}
	}, [code, isDark, renderId])

	return (
		<figure className="my-6">
			{failed ? (
				// Still worth showing: Mermaid source reads well enough as text.
				<CodeDisplay code={code} />
			) : svg == null ? (
				<Skeleton className="h-48 w-full" />
			) : (
				<div
					// With a caption, the figcaption names the figure and the
					// drawing is left out of the accessibility tree rather than
					// announced as a second copy of the caption.
					{...(caption != null
						? { 'aria-hidden': true }
						: { role: 'img', 'aria-label': 'Diagram' })}
					className="flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
					dangerouslySetInnerHTML={{ __html: svg }}
				/>
			)}

			{caption != null && (
				<figcaption className="mt-2 text-center font-sans text-sm text-muted-foreground">
					{caption}
				</figcaption>
			)}
		</figure>
	)
}

export { Diagram }
