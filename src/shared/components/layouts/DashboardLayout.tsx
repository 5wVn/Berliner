import Link from "next/link"
import { UserRole } from "@/shared/types/auth"
import { cn } from "@/shared/lib/utils"
import { BottomNav } from "./BottomNav"

export type DashboardBackground =
  | "slate"
  | "indigo"
  | "violet"
  | "teal"
  | "rose"
  | "amber"

interface DashboardLayoutProps {
  role: UserRole
  userName: string
  userAvatarUrl?: string
  showDashboardSwitcher?: boolean
  /** Kept for API compatibility — no longer affects the visual chrome (mono theme). */
  backgroundVariant?: DashboardBackground
  backgroundClassName?: string
  children: React.ReactNode
}

export function DashboardLayout({
  role,
  showDashboardSwitcher = false,
  backgroundClassName,
  children,
}: DashboardLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-dvh overflow-x-hidden border-t-4 border-primary bg-background pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+1rem)] md:min-h-screen md:pb-28",
        backgroundClassName
      )}
    >
      <main className="container mx-auto max-w-5xl px-4 pt-4 pb-6 md:p-8">
        {showDashboardSwitcher ? (
          <div className="mb-6 flex justify-end">
            <Link
              href="/choose-dashboard"
              className="inline-flex items-center rounded-xl border-2 border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Changer de dashboard
            </Link>
          </div>
        ) : null}
        {children}
      </main>

      <BottomNav role={role} />
    </div>
  )
}
