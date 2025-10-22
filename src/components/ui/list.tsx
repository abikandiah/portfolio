import { cn } from "@/lib/utils";

function UnorderedList({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn("list-square px-8 py-2 my-4 bg-background border-container rounded", className)}
            {...props} />
    )
}

export { UnorderedList };
