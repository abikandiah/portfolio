import { ThemeToggle } from '@abumble/design-system/components/ThemeToggle'
import { cn } from '@abumble/design-system/utils'
import { BeeLogo } from '@abumble/design-system/components/BeeLogo'
import { Link } from '@tanstack/react-router'
import type { LinkComponentProps } from '@tanstack/react-router'

function Header() {
	return (
		<header className="header">
			<BeeLogo asChild>
				<Link to="/" />
			</BeeLogo>

			<div className="flex items-center gap-1">
				<ThemeToggle />

				{/* Shown at every width: two links fit a phone's header, and a
				    menu button would only hide them behind an extra tap. */}
				<nav className="flex items-center gap-1 ml-1">
					<RouteLinks className="flex items-center gap-1" />
				</nav>
			</div>
		</header>
	)
}

function RouteLinks({ className, ...props }: React.ComponentProps<'ul'>) {
	return (
		<ul className={cn('text-sm font-medium', className)} {...props}>
			<ListNavLink to="/" text="Home" exact />
			<ListNavLink to="/projects" text="Projects" />
		</ul>
	)
}

function ListNavLink(props: React.ComponentProps<typeof NavLink>) {
	return (
		<li>
			<NavLink {...props} />
		</li>
	)
}

function NavLink({
	text,
	exact,
	...props
}: { text: string; exact?: boolean } & LinkComponentProps) {
	return (
		<Link
			className="flex items-center px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/6 transition-colors outline-none"
			activeProps={{
				className: 'text-foreground bg-foreground/8 font-semibold',
			}}
			activeOptions={{ exact }}
			{...props}
		>
			{text}
		</Link>
	)
}

export default Header
