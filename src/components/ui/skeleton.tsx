import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"


const variants = cva(
	"bg-accent rounded",
	{
		variants: {
			variant: {
				default: "animate-pulse",
				none: "",
			},
		},
		defaultVariants: {
			variant: "default"
		},
	}
)

function Skeleton({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof variants>) {
	return (
		<div
			data-slot="skeleton"
			className={cn(variants({ variant, className }))}
			{...props}
		/>
	)
}

export { Skeleton }
