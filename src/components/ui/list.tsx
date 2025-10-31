import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";


const variants = cva(
    "list-disc pl-8 pr-2 py-2 rounded",
    {
        variants: {
            variant: {
                default: "bg-background border-container my-4",
                clear: "my-2"
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);
function UnorderedList({ variant, className, ...props }: React.ComponentProps<"ul"> & VariantProps<typeof variants>) {
    return (
        <ul
            className={cn(variants({ variant, className }))}
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

