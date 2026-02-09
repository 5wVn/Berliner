import Link from "next/link"
import { UserRole } from "@/shared/types/auth"
import { BottomNav } from "./BottomNav"

interface DashboardLayoutProps {
  role: UserRole
  userName: string
  userAvatarUrl?: string
  showDashboardSwitcher?: boolean
  children: React.ReactNode
}

export function DashboardLayout({
  role,
  userName,
  userAvatarUrl,
  showDashboardSwitcher = false,
  children,
}: DashboardLayoutProps) {
  // Get initials for avatar fallback
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              B
            </div>
            <span className="font-semibold text-slate-900">Berliner</span>
          </div>
          
          <div className="flex items-center gap-3">
            {showDashboardSwitcher ? (
              <Link
                href="/choose-dashboard"
                className="hidden text-xs font-medium text-slate-500 hover:text-slate-700 sm:inline-block"
              >
                Changer de dashboard
              </Link>
            ) : null}
            <span className="hidden text-sm font-medium text-slate-700 sm:inline-block">
              {userName}
            </span>
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
              {userAvatarUrl ? (
                <img 
                  src={userAvatarUrl} 
                  alt={userName} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-xs font-medium text-indigo-700">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav role={role} />
    </div>
  )
}
