import { email, githubUrl, linkedinUrl } from "@/constants";
import { Link } from "@tanstack/react-router";
import { SendEmail } from "./misc";


export function Header() {
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
                    <nav className="flex items-center justify-center gap-5 pr-6">

                        <NavLink to="/">
                            Home
                        </NavLink>

                        <NavLink to="/projects">
                            Projects
                        </NavLink>

                        <NavLink to="/playground">
                            Playground
                        </NavLink>
                    </nav>

                    <div className="flex items-center justify-center gap-3 pl-6">
                        <ExternalSite
                            url={linkedinUrl}
                            src="/src/assets/linkedin.svg"
                            alt="LinkedIn Logo"
                            aria-label="LinkedIn Profile"
                        />

                        <ExternalSite
                            url={githubUrl}
                            src="/src/assets/github.svg"
                            alt="GitHub Logo"
                            aria-label="Github Profile"
                        />

                        <SendEmail email={email} />
                    </div>
                </div>
            </div>
        </header>
    );
}


interface ExternalSiteProps {
    url: string;
    src: string;
    alt: string;
}

function ExternalSite({ url, src, alt, ...rest }: ExternalSiteProps & Record<string, any>) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" {...rest}>
            <img
                src={src}
                alt={alt}
                className="h-6 w-6"
            />
        </a>
    )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <Link to={to}
            className="flex items-center action-hover gap-1"
            activeProps={{
                className: 'text-gray-900'
            }}
        >
            {children}
        </Link>
    );
}

