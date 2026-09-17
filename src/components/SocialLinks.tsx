import { cn } from '@abumble/design-system/utils'
import { Mail } from 'lucide-react'
import { ExternalSite } from './ui'
import github from '@/assets/github.svg'
import linkedin from '@/assets/linkedin.svg'
import { LINKS, PERSONAL } from '@/constants'

interface SendEmailProps {
	email: string
	showText?: boolean
	iconClassName?: string
}

function SendEmail({ email, showText, iconClassName }: SendEmailProps) {
	return (
		<a
			className="flex items-center action-hover"
			title="Send me an email"
			href={`mailto:${email}?subject=Hello!&body=I wanted to reach out to you regarding...`}
		>
			<Mail className={iconClassName} />
			{showText && <span className="ml-2 font-medium">{email}</span>}
		</a>
	)
}

interface SocialLinksProps {
	className?: string
	iconClassName?: string
}

function SocialLinks({ className, iconClassName }: SocialLinksProps) {
	return (
		<div className={className}>
			<SendEmail email={PERSONAL.email} iconClassName={iconClassName} />

			<ExternalSite
				url={LINKS.github}
				src={github}
				alt="GitHub Logo"
				aria-label="Github Profile"
				title="Visit my Github"
				imgClassName={cn(iconClassName, 'dark:invert')}
			/>

			<ExternalSite
				url={LINKS.linkedinUrl}
				src={linkedin}
				alt="LinkedIn Logo"
				aria-label="LinkedIn Profile"
				title="Check out my LinkedIn"
				imgClassName={iconClassName}
			/>
		</div>
	)
}

export { SendEmail, SocialLinks }
