import { Link } from "@tanstack/react-router";

import { BriefcaseBusiness, Contact, Drum, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
    return (
        <header className="shadow-sm bg-stone-50 mb-4">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                <h1 className="ml-4 text-xl font-semibold">
                    <Link className="flex items-center" to="/">
                        <img
                            src="/src/assets/bee.svg"
                            alt="Bee Logo"
                            className="h-10 w-10 mr-2"
                        />
                        Abi Kandiah
                    </Link>
                </h1>

                <div className="flex items-center divide-x-2 divide-stone-200">
                    <nav className="flex items-center justify-center gap-5 pr-6">

                        <NavLink to="/" Icon={Contact}>
                            Home
                        </NavLink>

                        <NavLink to="/projects" Icon={BriefcaseBusiness}>
                            Projects
                        </NavLink>

                        <NavLink to="/playground" Icon={Drum}>
                            Playground
                        </NavLink>
                    </nav>

                    <SendEmail />
                </div>
            </div>
        </header>
    );
}

function SendEmail() {
    return (
        <Button className="ml-6" variant={"ghost"}>
            <Mail size={24} />
            Send Email
        </Button>
    )
}

function NavLink({ to, children, Icon }: { to: string; children: React.ReactNode; Icon: React.ElementType }) {
    return (
        <Link to={to}
            className="flex items-center hover:opacity-75 gap-1"
            activeProps={{
                className: 'text-shadow-bold hover:opacity-100'
            }}
        >
            <Icon size={20} />
            {children}
        </Link>
    );
}

