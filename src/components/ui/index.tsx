import { cn } from "@/lib/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";

export function TextLink({ className, ...props }: LinkComponentProps) {
    return (
        <Link
            {...props}
            className={cn("text-link", className)} />
    )
}


interface ExternalSiteProps {
    url: string;
    src: string;
    alt: string;
}

export function ExternalSite({ url, src, alt, ...rest }: ExternalSiteProps & React.ComponentProps<"a">) {
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
