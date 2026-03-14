import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@abumble/design-system/components/Popover'
import { ThemeSelector } from '@abumble/design-system/components/ThemeSelector'
import { ThemeToggle } from '@abumble/design-system/components/ThemeToggle'
import { cn } from '@abumble/design-system/utils'
import { BeeLogo } from '@abumble/design-system/components/BeeLogo'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { LinkComponentProps } from '@tanstack/react-router'
import type { onClickCallback } from '@abumble/design-system/types'

function Header() {
	return (
		<header className="header">
			<BeeLogo asChild>
				<Link to="/" />
			</BeeLogo>

			<div className="flex items-center gap-1">
				<ThemeToggle />
				<ThemeSelector />

				<nav className="hidden md:flex items-center gap-1 ml-1">
					<RouteLinks className="flex items-center gap-1" />
				</nav>

				<div className="md:hidden flex items-center ml-1">
					<HamburgerMenu />
				</div>
			</div>
		</header>
	)
}

function HamburgerMenu() {
	const [open, setOpen] = useState(false)

	function closeMenu() {
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-foreground/8 transition-colors outline-none">
				{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
			</PopoverTrigger>

			<PopoverContent
				align="end"
				className="w-44 p-1.5 mt-1 shadow-lg border border-border/60"
			>
				<RouteLinks onClose={closeMenu} />
			</PopoverContent>
		</Popover>
	)
}

interface RouteLinksProps extends React.ComponentProps<'ul'> {
	onClose?: onClickCallback<HTMLAnchorElement>
}

function RouteLinks({ className, onClose, ...props }: RouteLinksProps) {
	return (
		<ul className={cn('text-sm font-medium', className)} {...props}>
			<ListNavLink to="/" text="Home" exact onClick={onClose} />
			<ListNavLink to="/projects" text="Projects" onClick={onClose} />
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
