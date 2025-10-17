import { Link } from "@tanstack/react-router";
import { NavLink } from "./misc";


function Header() {
    return (
        <header className="header">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                <Link className="flex items-center" to="/">
                    <span className="text-xl font-semibold">
                        A
                    </span>
                    <img
                        src="/src/assets/bee.svg"
                        alt="Bee Logo"
                        className="h-10 w-10 mr"
                    />
                    <span className="text-xl font-semibold">
                        's Portfolio
                    </span>
                </Link>

                <div className="flex items-center divide-x-2 divide-stone-200">
                    <nav className="flex items-center justify-center gap-4">

                        <NavLink to="/" text={'Home'} />

                        <NavLink to="/projects" text={'Projects'} />
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;

