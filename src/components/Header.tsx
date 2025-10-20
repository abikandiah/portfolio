import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";


function Header() {
    return (
        <header className="max-w-screen-xl mx-auto px-8 pb-12 z-50 sticky top-0">

            <div className="header-card">
                <Link to={"/"}>
                    <img
                        className="h-8 w-8"
                        src="/src/assets/bee.svg"
                        alt="Home Bee"
                    />
                </Link>

                <div className="md:hidden">
                    <Button />
                </div>

                <nav className="hidden md:block">
                    <ul className="flex rounded px-3 text-sm font-medium"
                    >
                        <li>
                            <NavLink to="/" text={'Home'} />
                        </li>
                        <li>
                            <NavLink to="/projects" text={'Projects'} />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

function NavLink({ to, text }: { to: string; text: string }) {
    return (
        <Link className="nav-link"
            to={to} data-text={text}
            activeProps={{ className: 'nav-link-active' }}
        >
            {({ isActive }: { isActive: boolean}) => {
                return (
                    <>
                        {isActive && (
                            <span className="absolute inset-x-1 -bottom-px h-px bg-linear-to-r from-gray-500/0 via-gray-500/40 to-gray-500/0
                                dark:from-gray-400/0 dark:via-gray-400/40 dark:to-gray-400/0"></span>
                        )}
                        {text}
                    </>
                )
            }}
        </Link>
    );
}



export default Header;

