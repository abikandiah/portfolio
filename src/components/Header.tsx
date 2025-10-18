import { Link } from "@tanstack/react-router";


function Header() {
    return (
        <header className="relative top-0 z-50 h-32">
            <div className="relative top-0 z-10 h-16 pt-12">

                <div className="flex flex-1 justify-end md:justify-center">
                    <div className="md:hidden">
                        HAMBURGER FOR SMALL PHONE!
                    </div>

                    <nav className="hidden md:block">
                        <ul className="
                            flex rounded-full bg-card px-3 text-sm font-medium text-gray-800 
                            shadow-md ring-1 shadow-stone-800/5 ring-stone-900/5 backdrop-blur-sm"
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
            </div>
        </header>
    );
}

function NavLink({ to, text }: { to: string; text: string }) {
    // MAKE ACTIVE TEXT COLOR!?!
    return (
        <Link className="relative block px-3 py-2 transition hover:text-teal-500"
            to={to} data-text={text}
            activeProps={{ className: 'nav-link-active' }}
        >
            {text}
        </Link>
    );
}

export default Header;

