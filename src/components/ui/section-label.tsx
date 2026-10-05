import * as React from 'react'

// A home-page section's label: small, muted and uppercase, matching the
// write-ups' "On this page" and "Related Projects" labels, so the
// sections' content — not their headers — is the loudest thing in them.
function SectionLabel({
	Icon,
	title,
}: {
	Icon: React.ElementType
	title: string
}) {
	return (
		<h2 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
			<Icon className="h-4 w-4" aria-hidden="true" />
			{title}
		</h2>
	)
}

export { SectionLabel }
