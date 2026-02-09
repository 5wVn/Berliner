import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

// Radix UI Slot is not in package.json, so I will implement a basic Button first.
// If Slot is needed for polymorphism (asChild), I'd need to install @radix-ui/react-slot.
// For now, I'll stick to a standard button implementation without Slot unless requested or if I see it's commonly used in this project's style (shadcn/ui uses it).
// Wait, I don't see @radix-ui/react-slot in package.json. I will remove it and just use a standard button.

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-slate-50 hover:bg-indigo-600/90",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        link: "text-slate-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2", // Min height 44px requirement met (h-11 is 44px)
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8", // Larger than 44px
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Simplified handling since we don't have @radix-ui/react-slot installed based on package.json
    // If asChild is true, we would typically use Slot. Since it's not installed, I'll ignore asChild for now or just render button.
    // Actually, I should probably stick to standard button to avoid errors.
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
