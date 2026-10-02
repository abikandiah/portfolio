import { Banner } from '@abumble/design-system/components/Banner'
import { stringToBoolean } from '@abumble/design-system/utils'
import { useState } from 'react'
import { TextLink } from '@/components/ui'

const DISCLAIMER_DISMISSED_KEY = 'bee_disclaimer_dismissed'

// Rendered by each projects page inside its own content column (rather than
// once in the /projects layout) so the banner lines up with the page below
// it — the list and the narrower write-up pages have different widths.
function ProjectsDisclaimer({ className }: { className?: string }) {
	const [dismissed, setDismissed] = useState(
		stringToBoolean(localStorage.getItem(DISCLAIMER_DISMISSED_KEY)),
	)

	if (dismissed) {
		return null
	}

	function onDismiss() {
		localStorage.setItem(DISCLAIMER_DISMISSED_KEY, true.toString())
		setDismissed(true)
	}

	return (
		<Banner
			className={className}
			type="info"
			title="Portfolio Disclaimer"
			hideIcon
			onClose={onDismiss}
		>
			<p className="text-sm text-muted-foreground">
				The content within this portfolio is intended solely to showcase my
				product design vision, problem-solving process, and conceptual
				abilities.{' '}
				<TextLink to="/disclaimer" target="_blank">
					Read the full disclaimer
				</TextLink>
				.
			</p>
		</Banner>
	)
}

export { ProjectsDisclaimer }
