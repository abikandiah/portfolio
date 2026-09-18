import { cn } from '@abumble/design-system/utils'
import { Check, Link as LinkIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { scrollToHash } from '@/components/projects/scrollToHash'

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
						'group/heading scroll-mt-20 flex items-center gap-1.5 font-semibold text-lg text-foreground',
						headingClassName,
					)}
				>
					{title}

					{id && <SectionAnchor id={id} title={title} />}
				</h2>
			)}

			{children}
		</section>
	)
}

function SectionAnchor({ id, title }: { id: string; title: string }) {
	const [copied, setCopied] = useState(false)
	const timeoutRef = useRef<number | undefined>(undefined)

	useEffect(() => {
		return () => window.clearTimeout(timeoutRef.current)
	}, [])

	async function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
		const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`

		scrollToHash(event, id)

		try {
			await navigator.clipboard.writeText(url)
			setCopied(true)
			window.clearTimeout(timeoutRef.current)
			timeoutRef.current = window.setTimeout(() => setCopied(false), 1500)
		} catch {
			// Clipboard access can be denied (permissions, insecure context) —
			// the section link above still works regardless, so this just
			// skips the "Copied" confirmation.
		}
	}

	return (
		<a
			href={`#${id}`}
			onClick={onClick}
			aria-label={`Copy link to ${title} section`}
			className="relative text-muted-foreground opacity-0 outline-none transition-opacity hover:text-foreground focus-visible:opacity-100 focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring group-hover/heading:opacity-100"
		>
			{copied ? (
				<Check className="h-4 w-4" />
			) : (
				<LinkIcon className="h-4 w-4" />
			)}

			{copied && (
				<span className="pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-background">
					Copied
				</span>
			)}
		</a>
	)
}

export { Section }
