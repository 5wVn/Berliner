import { cn } from "@/shared/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-base animate-pulse rounded-xl", className)}
      {...props}
    />
  )
}

export { Skeleton }
