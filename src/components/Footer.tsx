import { NavLink } from "./misc";

function Footer() {
    return (
        <footer className="footer">
            <div className="mx-auto max-w-screen-xl px-8">
                <div className="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
                    <div>
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                <NavLink to="/" text={'Home'} />

                                <NavLink to="/projects" text={'Projects'} />
                            </div>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500">
                                ©
                                2025
                                Abilaesh Kandiah. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
