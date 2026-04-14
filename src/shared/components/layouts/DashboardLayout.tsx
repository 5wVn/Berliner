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

const DASHBOARD_STYLES: Record<DashboardBackground, { background: string }> = {
  slate: {
    background:
      "bg-slate-50 dark:bg-slate-950 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-slate-100 dark:md:from-slate-950 dark:md:via-slate-950 dark:md:to-slate-900",
  },
  indigo: {
    background:
      "bg-slate-50 dark:bg-slate-950 md:bg-gradient-to-br md:from-indigo-50 md:via-white md:to-slate-100 dark:md:from-slate-950 dark:md:via-slate-950 dark:md:to-indigo-950/40",
  },
  violet: {
    background:
      "bg-slate-50 dark:bg-slate-950 md:bg-gradient-to-br md:from-violet-50 md:via-white md:to-slate-100 dark:md:from-slate-950 dark:md:via-slate-950 dark:md:to-violet-950/40",
  },
  teal: {
    background:
      "bg-slate-50 dark:bg-slate-950 md:bg-gradient-to-br md:from-teal-50 md:via-white md:to-slate-100 dark:md:from-slate-950 dark:md:via-slate-950 dark:md:to-teal-950/40",
  },
  rose: {
    background:
      "bg-slate-50 dark:bg-slate-950 md:bg-gradient-to-br md:from-rose-50 md:via-white md:to-slate-100 dark:md:from-slate-950 dark:md:via-slate-950 dark:md:to-rose-950/40",
  },
  amber: {
    background:
      "bg-slate-50 dark:bg-slate-950 md:bg-gradient-to-br md:from-amber-50 md:via-white md:to-slate-100 dark:md:from-slate-950 dark:md:via-slate-950 dark:md:to-amber-950/40",
  },
}

interface DashboardLayoutProps {
  role: UserRole
  userName: string
  userAvatarUrl?: string
  showDashboardSwitcher?: boolean
  backgroundVariant?: DashboardBackground
  backgroundClassName?: string
  children: React.ReactNode
}

export function DashboardLayout({
  role,
  showDashboardSwitcher = false,
  backgroundVariant = "slate",
  backgroundClassName,
  children,
}: DashboardLayoutProps) {
  const selectedStyle = DASHBOARD_STYLES[backgroundVariant]
  return (
    <div
      className={cn(
        "min-h-screen pb-0 md:pb-28",
        selectedStyle.background,
        backgroundClassName
      )}
      data-skeleton-variant={backgroundVariant}
    >
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-4 pb-0 md:p-8 max-w-5xl">
        {showDashboardSwitcher ? (
          <div className="mb-6 flex justify-end">
            <Link
              href="/choose-dashboard"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Changer de dashboard
            </Link>
          </div>
        ) : null}
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav role={role} />
    </div>
  )
}
