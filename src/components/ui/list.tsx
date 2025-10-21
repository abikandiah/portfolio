import { cn } from "@/lib/utils";

function UnorderedList({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn("list-square ml-8 my-4", className)}
            {...props} />
    )
}

export { UnorderedList };
