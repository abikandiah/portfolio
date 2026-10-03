import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@abumble/design-system/components/Collapsible'
import { cn } from '@abumble/design-system/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ExpandableRowProps {
	title: string
	subtitle: string
	duration: string
	logoSrc: string
	current?: boolean
	bullets?: Array<string>
	/** Starts open — for the row a skimming reader should see detail on. */
	defaultExpanded?: boolean
}

function ExpandableRow({
	title,
	subtitle,
	duration,
	logoSrc,
	current,
	bullets,
	defaultExpanded = false,
}: ExpandableRowProps) {
	const [expanded, setExpanded] = useState(defaultExpanded)
	const hasBullets = bullets != null && bullets.length > 0

	// Same structure as a Key Projects row — title and dates on one line,
	// detail beneath — so all three home cards line up.
	const body = (
		<div className="min-w-0 flex-auto">
			<div className="flex items-baseline gap-2">
				<span className="text-sm leading-6 font-medium text-foreground">
					{title}
				</span>
				{current && (
					<span className="rounded-full bg-primary/10 px-1.5 text-[0.625rem] leading-4 font-medium text-primary">
						Current
					</span>
				)}
				<span className="ml-auto shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
					{duration}
				</span>
			</div>
			<span className="block text-xs leading-5 text-muted-foreground">
				{subtitle}
			</span>
		</div>
	)

	if (!hasBullets) {
		return (
			<li className="home-row">
				<Logo src={logoSrc} title={title} />
				{body}
			</li>
		)
	}

	return (
		<Collapsible asChild open={expanded} onOpenChange={setExpanded}>
			<li>
				<CollapsibleTrigger
					aria-label={`${title}, ${subtitle}, ${duration}`}
					className="home-row -mx-3 w-[calc(100%+1.5rem)] cursor-pointer rounded-lg px-3 text-left transition-colors hover:bg-foreground/4 focus-visible:outline-2 focus-visible:outline-ring"
				>
					<Logo src={logoSrc} title={title} />
					<div className="contents" aria-hidden="true">
						{body}
					</div>
					<ChevronDown
						className={cn(
							'mt-1.5 h-4 w-4 flex-none text-muted-foreground transition-transform',
							expanded && 'rotate-180',
						)}
					/>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<ul className="mt-1 mb-2 ml-14 list-disc space-y-1 pl-4">
						{bullets.map((bullet, index) => (
							<li
								key={`${index}-${bullet}`}
								className="text-xs leading-5 text-muted-foreground"
							>
								{bullet}
							</li>
						))}
					</ul>
				</CollapsibleContent>
			</li>
		</Collapsible>
	)
}

// The circle is opaque and stacked above the timeline rail (see
// .home-timeline), so the rail runs between logos rather than through them.
// object-contain keeps any logo file undistorted, square or not.
function Logo({ src, title }: { src: string; title: string }) {
	return (
		<div className="relative z-10 mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-stone-800/5 ring-stone-900/5">
			<img
				className="h-7 w-7 object-contain"
				src={src}
				alt={`${title} Logo`}
				loading="lazy"
				decoding="async"
			/>
		</div>
	)
}

export { ExpandableRow }
