import { SocialLinks } from './SocialLinks'
import { TextLink } from './ui'

interface FooterProps {
	showLinks?: boolean
	showSocials?: boolean
}

function Footer({ showLinks = true, showSocials = showLinks }: FooterProps) {
	return (
		<footer className="mt-auto px-3">
			<div className="py-8 px-6 mt-18 flex flex-col md:flex-row items-center md:items-end justify-center gap-6">
				{showSocials && (
					<SocialLinks className="flex items-center gap-4" iconClassName="h-5 w-5" />
				)}

				<div className="flex flex-col md:items-end items-center gap-1 md:ml-auto">
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
