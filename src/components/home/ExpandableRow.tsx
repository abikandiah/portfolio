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
}

const ROW_CLASS =
	'flex w-full items-start gap-4 rounded-lg p-3 -mx-3 text-left transition-all hover:-translate-y-0.5 hover:bg-foreground/4 hover:shadow-md'

function ExpandableRow({
	title,
	subtitle,
	duration,
	logoSrc,
	current,
	bullets,
}: ExpandableRowProps) {
	const [expanded, setExpanded] = useState(false)
	const hasBullets = bullets != null && bullets.length > 0

	const avatar = (
		<div
			className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full
                shadow-md ring-1 shadow-stone-800/5 ring-stone-900/5"
		>
			<img
				className="h-7 w-7"
				src={logoSrc}
				alt={`${title} Logo`}
				loading="lazy"
				decoding="async"
				data-nimg="1"
			/>
		</div>
	)

	const durationSpan = (
		<span
			className={cn(
				'ml-auto text-xs leading-5',
				current ? 'font-medium text-foreground' : 'text-muted-foreground',
			)}
		>
			{duration}
		</span>
	)

	if (!hasBullets) {
		return (
			<li className={ROW_CLASS}>
				{avatar}

				<div className="flex flex-auto flex-wrap gap-x-2">
					<span className="w-full flex-none text-sm font-medium leading-6 text-foreground">
						{title}
					</span>
					<span className="text-xs leading-5 text-muted-foreground">
						{subtitle}
					</span>
					{durationSpan}
				</div>
			</li>
		)
	}

	return (
		<Collapsible asChild open={expanded} onOpenChange={setExpanded}>
			<li>
				<CollapsibleTrigger
					aria-label={`${title}, ${subtitle}, ${duration}`}
					className={cn(
						ROW_CLASS,
						'focus-visible:outline-2 focus-visible:outline-ring',
					)}
				>
					{avatar}

					<div className="flex flex-auto flex-wrap gap-x-2" aria-hidden="true">
						<span className="w-full flex-none text-sm font-medium leading-6 text-foreground">
							{title}
						</span>
						<span className="text-xs leading-5 text-muted-foreground">
							{subtitle}
						</span>
						{durationSpan}
					</div>

					<ChevronDown
						className={cn(
							'mt-1.5 h-4 w-4 flex-none text-muted-foreground transition-transform',
							expanded && 'rotate-180',
						)}
					/>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<ul className="ml-14 mt-1 mb-2 list-disc space-y-1 pl-4">
						{bullets.map((bullet) => (
							<li key={bullet} className="text-xs leading-5 text-muted-foreground">
								{bullet}
							</li>
						))}
					</ul>
				</CollapsibleContent>
			</li>
		</Collapsible>
	)
}

export { ExpandableRow }
