import { cn } from "@/lib/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";

export function TextLink({ className, ...props }: LinkComponentProps) {
    return (
        <Link
            {...props}
            className={cn("text-blue-600 hover:text-blue-800 visited:text-blue-900", className)} />
    )
}
