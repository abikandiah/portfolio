import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export function SendEmail({ email, showText }: { email: string; showText?: boolean }) {
    return (
        <a
            className="flex items-center action-hover"
            title="Send me an email"
            href={`mailto:${email}?subject=Hello From Your Website!&body=I wanted to reach out to you regarding...`}
        >
            <Mail />
            {showText && <span className="ml-2 font-medium">{email}</span>}
        </a>
    )
}

interface ExternalSiteProps {
    url: string;
    src: string;
    alt: string;
}
export function ExternalSite({ url, src, alt, ...rest }: ExternalSiteProps & Record<string, any>) {
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

export function NavLink({ to, text }: { to: string; text: string }) {
    return (
        <Link className="nav-link"
            to={to} data-text={text}
            activeProps={{className: 'nav-link-active'}}
        >
            {text}
        </Link>
    );
}

