"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  GraduationCap,
  User,
  Users,
  FileText,
  BarChart,
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { UserRole } from "@/shared/types/auth"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Accueil", href: "/student", icon: Home },
    { label: "Planning", href: "/student/schedule", icon: Calendar },
    { label: "Notes", href: "/student/grades", icon: GraduationCap },
    { label: "Profil", href: "/student/profile", icon: User },
  ],
  teacher: [
    { label: "Accueil", href: "/teacher", icon: Home },
    { label: "Planning", href: "/teacher/schedule", icon: Calendar },
    { label: "Classes", href: "/teacher/classes", icon: Users },
    { label: "Profil", href: "/teacher/profile", icon: User },
  ],
  registrar: [
    { label: "Accueil", href: "/registrar", icon: Home },
    { label: "Étudiants", href: "/registrar/students", icon: Users },
    { label: "Documents", href: "/registrar/documents", icon: FileText },
    { label: "Profil", href: "/registrar/profile", icon: User },
  ],
  academic_head: [
    { label: "Accueil", href: "/academic-head", icon: Home },
    { label: "Analytique", href: "/academic-head/analytics", icon: BarChart },
    { label: "Rapports", href: "/academic-head/reports", icon: FileText },
    { label: "Profil", href: "/academic-head/profile", icon: User },
  ],
  company: [
    { label: "Accueil", href: "/company", icon: Home },
    { label: "Apprentis", href: "/company/apprentices", icon: Users },
    { label: "Documents", href: "/company/documents", icon: FileText },
    { label: "Profil", href: "/company/profile", icon: User },
  ],
}

interface BottomNavProps {
  role: UserRole
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname()
  const items = NAV_CONFIG[role] || []
  const activeHref =
    items
      .map((item) => item.href)
      .filter(
        (href) => pathname === href || pathname.startsWith(`${href}/`)
      )
      .sort((a, b) => b.length - a.length)[0] || ""

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900/90 shadow-2xl">
      <div className="flex h-20 items-center justify-around px-4">
        {items.map((item) => {
          const isActive = item.href === activeHref
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col items-center justify-center space-y-1 rounded-2xl px-4 py-2 transition-all duration-300",
                isActive
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 scale-105"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Icon 
                className={cn("h-7 w-7 transition-all duration-300", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} 
              />
              <span className={cn("text-[11px] font-bold", isActive ? "opacity-100" : "opacity-80")}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
