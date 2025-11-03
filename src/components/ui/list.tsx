import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";


const ulVariants = cva(
    "list-disc pl-8 pr-2 my-4 rounded",
    {
        variants: {
            variant: {
                default: "bg-background border-container py-2",
                clear: ""
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);
function UnorderedList({ variant, className, ...props }: React.ComponentProps<"ul"> & VariantProps<typeof ulVariants>) {
    return (
        <ul
            className={cn(ulVariants({ variant, className }))}
            {...props}
        />
    )
}

const olVariants = cva(
    "list-decimal pl-8 pr-2 my-4 rounded",
    {
        variants: {
            variant: {
                default: "bg-background border-container py-2",
                clear: ""
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);
function OrderedList({ variant, className, ...props }: React.ComponentProps<"ol"> & VariantProps<typeof olVariants>) {
    return (
        <ol
            className={cn(olVariants({ variant, className }))}
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

export { InnerUnorderedList, OrderedList, UnorderedList };

