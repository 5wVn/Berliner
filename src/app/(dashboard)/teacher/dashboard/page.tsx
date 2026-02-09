"use client"

import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { TodayClassesWidget } from "../_components/TodayClassesWidget"
import { UpcomingSessionsWidget } from "../_components/UpcomingSessionsWidget"
import { ClassesSummaryWidget } from "../_components/ClassesSummaryWidget"
import { PendingAttendanceWidget } from "../_components/PendingAttendanceWidget"
import { RequireAuth } from "@/shared/components/auth/RequireAuth"
import { useAuth } from "@/shared/providers/AuthProvider"

export default function TeacherDashboardPage() {
  const { profile, isAdmin, selectedRole } = useAuth()
  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Utilisateur"
  const activeRole = isAdmin ? selectedRole ?? "teacher" : profile?.role ?? "teacher"

  return (
    <RequireAuth requiredRole="teacher">
      <DashboardLayout role={activeRole} userName={userName} showDashboardSwitcher={isAdmin}>
        <div className="space-y-6 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Bonjour, {userName}
            </h1>
            <p className="text-slate-500">
              Pret pour vos cours d'aujourd'hui ?
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <PendingAttendanceWidget />
              <div className="grid gap-4 md:grid-cols-2">
                <TodayClassesWidget />
                <UpcomingSessionsWidget />
              </div>
            </div>

            <div className="space-y-4">
              <ClassesSummaryWidget />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  )
}
