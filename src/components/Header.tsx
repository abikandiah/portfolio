import { NavLink } from "./misc";


function Header() {
    return (
        <header className="header">
            <div className="max-w-screen-xl mx-auto flex items-center justify-end px-8">
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

