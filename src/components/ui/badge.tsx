import { cn } from '@abumble/design-system/utils'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { techColorMap } from '@/types/TechTypes'

function BadgeContainer({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('flex flex-wrap bg gap-2', className)} {...props} />
}

const techBadgeVariants = cva(
	'tech-tag inline-flex items-center gap-1.5 rounded border font-medium text-foreground',
	{
		variants: {
			size: {
				default: 'px-3 py-1 text-sm',
				sm: 'px-2 py-0.5 text-xs',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	},
)

function TechBadge({
	value,
	size,
}: { value: string } & VariantProps<typeof techBadgeVariants>) {
	const dotClass = techColorMap[value] || techColorMap.default

	return (
		<span className={cn(techBadgeVariants({ size }))}>
			<span className={cn('tech-dot', dotClass)} aria-hidden="true" />
			{value}
		</span>
	)
}

interface TechBadgeListProps extends VariantProps<typeof techBadgeVariants> {
	tech: Array<string>
	max?: number
	className?: string
}

/** Capped tech badge list with a "+N more" overflow, e.g. for compact rows/cards. */
function TechBadgeList({ tech, max = 4, size, className }: TechBadgeListProps) {
	const visible = tech.slice(0, max)
	const remaining = tech.length - visible.length

	return (
		<div className={cn('flex flex-wrap items-center gap-1.5', className)}>
			{visible.map((value) => (
				<TechBadge key={value} value={value} size={size} />
			))}
			{remaining > 0 && (
				<span className="text-xs text-muted-foreground">+{remaining} more</span>
			)}
		</div>
	)
}

export { BadgeContainer, TechBadge, TechBadgeList }
