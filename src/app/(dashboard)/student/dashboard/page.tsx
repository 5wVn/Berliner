"use client"

import { Calendar, FileText, GraduationCap } from "lucide-react"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { Button } from "@/shared/components/ui/Button"
import { ScheduleWidget } from "../_components/ScheduleWidget"
import { GradesWidget } from "../_components/GradesWidget"
import { AttendanceWidget } from "../_components/AttendanceWidget"
import { RequireAuth } from "@/shared/components/auth/RequireAuth"
import { useAuth } from "@/shared/providers/AuthProvider"

export default function StudentDashboardPage() {
  const { profile, isAdmin, selectedRole } = useAuth()
  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Utilisateur"
  const activeRole = isAdmin ? selectedRole ?? "student" : profile?.role ?? "student"

  return (
    <RequireAuth requiredRole="student">
      <DashboardLayout role={activeRole} userName={userName} showDashboardSwitcher={isAdmin}>
        <div className="space-y-6 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Bonjour, {userName.split(" ")[0]}
            </h1>
            <p className="text-slate-500">
              Voici un apercu de votre activite aujourd'hui.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Button variant="outline" className="flex h-auto flex-col gap-2 py-4 text-xs sm:text-sm">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              <span>Planning</span>
            </Button>
            <Button variant="outline" className="flex h-auto flex-col gap-2 py-4 text-xs sm:text-sm">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              <span>Notes</span>
            </Button>
            <Button variant="outline" className="flex h-auto flex-col gap-2 py-4 text-xs sm:text-sm">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              <span>Documents</span>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ScheduleWidget />
            </div>
            <div className="lg:col-span-1">
              <GradesWidget />
            </div>
            <div className="lg:col-span-1">
              <AttendanceWidget />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  )
}
