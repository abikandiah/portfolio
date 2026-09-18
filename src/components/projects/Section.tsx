import { cn } from '@abumble/design-system/utils'
import type { ReactNode } from 'react'

function Section({
	title,
	id,
	className,
	headingClassName,
	children,
}: {
	title?: string
	id?: string
	className?: string
	headingClassName?: string
	children: ReactNode
}) {
	return (
		<section className={cn('space-y-2', className)}>
			{title && (
				<h2
					id={id}
					className={cn(
						'font-semibold text-lg text-foreground',
						headingClassName,
					)}
				>
					{title}
				</h2>
			)}

			{children}
		</section>
	)
}

export { Section }
