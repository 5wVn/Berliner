import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

// Radix UI Slot is not in package.json, so I will implement a basic Button first.
// If Slot is needed for polymorphism (asChild), I'd need to install @radix-ui/react-slot.
// For now, I'll stick to a standard button implementation without Slot unless requested or if I see it's commonly used in this project's style (shadcn/ui uses it).
// Wait, I don't see @radix-ui/react-slot in package.json. I will remove it and just use a standard button.

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-white transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-200",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-glow-indigo-soft dark:shadow-glow-indigo border border-indigo-500/50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 border border-red-500/40 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/90 dark:border-red-800",
        outline:
          "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-transparent dark:text-slate-50 dark:hover:bg-slate-800",
        link: "text-indigo-600 underline-offset-4 hover:underline hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300",
      },
      size: {
        default: "h-12 px-6 py-3", // Bigger default (48px)
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-2xl px-10 text-lg", // Very big (56px)
        icon: "h-12 w-12",
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
    void asChild
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
