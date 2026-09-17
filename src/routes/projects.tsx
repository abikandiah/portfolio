import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Banner } from '@abumble/design-system/components/Banner'
import { stringToBoolean } from '@abumble/design-system/utils'
import { useState } from 'react'
import { DisclaimerBody } from './disclaimer'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

const DISCLAIMER_DISMISSED_KEY = 'bee_disclaimer_dismissed'

function RouteComponent() {
	const [dismissed, setDismissed] = useState(
		stringToBoolean(localStorage.getItem(DISCLAIMER_DISMISSED_KEY)),
	)

	function onDisclaimerDismiss() {
		localStorage.setItem(DISCLAIMER_DISMISSED_KEY, true.toString())
		setDismissed(true)
	}

	return (
		<div className="flex flex-col center-page mt-8">
			{!dismissed && (
				<Banner
					className="mb-4"
					type="info"
					title="Portfolio Disclaimer"
					hideIcon
					onClose={onDisclaimerDismiss}
				>
					<DisclaimerBody />
				</Banner>
			)}

			<Outlet />
		</div>
	)
}
