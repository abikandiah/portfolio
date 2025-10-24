import { cn } from "@/lib/utils";

function UnorderedList({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn("list-disc pl-8 pr-2 py-2 my-4 bg-background border-container rounded", className)}
            {...props}
        />
    )
}

function InnerUnorderedList({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn("list-circle pl-8 pr-2 mb-2", className)}
            {...props}
        />
    )
}

export { InnerUnorderedList, UnorderedList };

