import { TextLink } from './ui'

interface FooterProps {
	showLinks?: boolean
}

function Footer({ showLinks = true }: FooterProps) {
	return (
		<footer className="mt-auto px-3">
			<div className="py-8 px-6 mt-18">
				<div className="flex flex-col md:items-end items-center gap-1">
					{showLinks && (
						<TextLink
							className="text-sm"
							to="/disclaimer"
							target="_blank"
							activeProps={{ className: 'hidden' }}
						>
							Disclaimer
						</TextLink>
					)}
					<span className="text-sm text-muted-foreground">
						© 2026 Abilaesh Kandiah
					</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
