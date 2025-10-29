import { projects } from "@/constants/project";
import { cn } from "@/lib/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";


function Header() {
    return (
        <>
            <header className="z-50 fixed w-full max-w-screen-xl top-0">
                <div className="header-card h-10">
                    <Link to={"/"}>
                        <img
                            className="h-8 w-8"
                            src="/src/assets/bee.svg"
                            alt="Home Bee"
                        />
                    </Link>

                    <div className="md:hidden flex my-1.5">
                        <HamburgerMenu />
                    </div>

                    <nav className="hidden md:block">
                        <RouteLinks className="flex" />
                    </nav>
                </div>
            </header>
        </>
    );
}

function HamburgerMenu() {
    const [open, setOpen] = useState(false);

    function closeMenu() {
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="mx-3">
                <Menu />
            </PopoverTrigger>

            <PopoverContent className="mx-3 w-64 p-0 mt-2">
                <ul className="rounded text-sm font-medium">
                    <ListNavLink to="/" text={'Home'} onClick={closeMenu} />
                    <ListNavLink to="/goals" text={'Goals'} onClick={closeMenu} />

                    <li className="mb-1">
                        <Separator className="mb-3" />
                        <HamburgerMenuSubLabel text="Projects" />
                    </li>

                    {projects.map((proj) => (
                        <ListNavLink key={proj.name} to="/projects/$projectKey" onClick={closeMenu}
                            params={{ projectKey: proj.pathname }} text={proj.name} />
                    ))}
                </ul>
            </PopoverContent >
        </Popover>
    )
}

function HamburgerMenuSubLabel({ text }: { text: string }) {
    return (
        <span className="text-sidebar-foreground/70 px-3 text-xs font-medium">{text}</span>
    )
}

function RouteLinks({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn("rounded px-3 text-sm font-medium", className)}
            {...props}
        >
            <ListNavLink to="/" text={'Home'} />
            <ListNavLink to="/goals" text={'Goals'} />
            <ListNavLink to="/projects" text={'Projects'} />
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

function NavLink({ text, ...props }: { text: string } & LinkComponentProps) {
    return (
        <Link className="nav-link"
            activeProps={{ className: 'nav-link-active' }}
            {...props}
        >
            {({ isActive }: { isActive: boolean }) => {
                return (
                    <>
                        {isActive && (
                            <span className="absolute inset-x-1 -bottom-px h-px bg-linear-to-r from-gray-500/0 via-gray-500/60 to-gray-500/10
                                dark:from-gray-400/0 dark:via-gray-400/60 dark:to-gray-400/0"></span>
                        )}
                        {text}
                    </>
                )
            }}
        </Link>
    );
}



export default Header;

