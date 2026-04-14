import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-slate-200 dark:focus:ring-offset-slate-950",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white hover:bg-indigo-600/90 shadow-glow-indigo-soft",
        secondary:
          "border-transparent bg-indigo-50 text-indigo-900 hover:bg-indigo-100 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700",
        destructive:
          "border-transparent bg-rose-600 text-white hover:bg-rose-500 dark:bg-rose-900 dark:text-rose-50 dark:hover:bg-rose-900/80",
        outline: "text-slate-700 border-slate-300 dark:text-slate-50 dark:border-slate-700",
        // Custom variants requested
        success: "border-transparent bg-teal-500 text-white hover:bg-teal-500/80 shadow-sm",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-500/80 shadow-sm",
        error: "border-transparent bg-rose-500 text-white hover:bg-rose-500/80 shadow-sm",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-500/80 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
