import { NavLink } from "./misc";

function Footer() {
    return (
        <footer className="flex-none mt-32 py-1 px-8 backdrop-blur-md">
            <div className="mx-auto max-w-screen-xl px-8">
                <div className="pt-10 pb-16">
                    <div>
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
                                <NavLink to="/" text={'Home'} />

                                <NavLink to="/projects" text={'Projects'} />
                            </div>
                            <p className="text-sm text-gray-500">
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
