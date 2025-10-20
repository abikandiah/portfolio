import { cn } from "@/lib/utils";
import { techColorMap } from "@/types/TechTypes";


function BadgeContainer({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-wrap gap-2", className)}
            {...props}
        />
    )
}

function TechBadge({ value }: { value: string }) {
    const techBadgeClass = techColorMap[value] || techColorMap.default;

    return (
        <span className={cn("inline-flex items-center rounded-full border px-3 py-0.5 text-sm font-medium", techBadgeClass)}>
            {value}
        </span>
    )
}

export { BadgeContainer, TechBadge };
