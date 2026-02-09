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
  Briefcase
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
