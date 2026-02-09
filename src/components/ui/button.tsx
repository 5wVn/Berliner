import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Make sure to install class-variance-authority and clsx/tailwind-merge if not already there
// For now assuming a standard shadcn-like setup or manual implementation

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-indigo-600 text-slate-50 hover:bg-indigo-700/90",
                destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
                outline:
                    "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
                secondary:
                    "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
                ghost: "hover:bg-slate-100 hover:text-slate-900",
                link: "text-indigo-600 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-4 py-2", // Touch target friendly > 44px
                sm: "h-9 rounded-lg px-3",
                lg: "h-12 rounded-xl px-8",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
