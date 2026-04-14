import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { buttonVariants } from "@/shared/components/ui/Button"
import { cn } from "@/shared/lib/utils"

type DashboardCardLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "href"
> & {
  href: string
}

export function DashboardCardLink({
  href,
  className,
  children,
  ...props
}: DashboardCardLinkProps) {
  return (
    <Link
      href={href}
      data-card-link
      data-href={href}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "dashboard-card-link group gap-2",
        className
      )}
      {...props}
    >
      <span>{children ?? "Voir plus"}</span>
      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  )
}
