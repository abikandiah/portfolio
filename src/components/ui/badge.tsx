import { cn } from '@abumble/design-system/utils'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { techColorMap } from '@/types/TechTypes'

function BadgeContainer({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('flex flex-wrap bg gap-2', className)} {...props} />
}

const techBadgeVariants = cva(
	'inline-flex items-center rounded border font-light',
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
	const techBadgeClass = techColorMap[value] || techColorMap.default

	return (
		<span className={cn(techBadgeVariants({ size }), techBadgeClass)}>
			{value}
		</span>
	)
}

export { BadgeContainer, TechBadge }
