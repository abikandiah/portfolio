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

