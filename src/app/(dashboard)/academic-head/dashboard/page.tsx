"use client"

import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { KPIsWidget } from "../_components/KPIsWidget"
import { AttendanceOverviewWidget } from "../_components/AttendanceOverviewWidget"
import { GradeDistributionWidget } from "../_components/GradeDistributionWidget"
import { ProgramsSummaryWidget } from "../_components/ProgramsSummaryWidget"
import { RequireAuth } from "@/shared/components/auth/RequireAuth"
import { useAuth } from "@/shared/providers/AuthProvider"

export default function AcademicHeadDashboardPage() {
  const { profile, isAdmin, selectedRole } = useAuth()
  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Utilisateur"
  const activeRole = isAdmin
    ? selectedRole ?? "academic_head"
    : profile?.role ?? "academic_head"

  return (
    <RequireAuth requiredRole="academic_head">
      <DashboardLayout role={activeRole} userName={userName} showDashboardSwitcher={isAdmin}>
        <div className="space-y-6 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Bonjour, {userName}
            </h1>
            <p className="text-slate-500">
              Pilotage pedagogique de l'etablissement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2 space-y-4">
              <KPIsWidget />
            </div>
            <div className="lg:col-span-1">
              <AttendanceOverviewWidget />
            </div>
            <div className="lg:col-span-1">
              <ProgramsSummaryWidget />
            </div>

            <div className="lg:col-span-2">
              <GradeDistributionWidget />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  )
}
