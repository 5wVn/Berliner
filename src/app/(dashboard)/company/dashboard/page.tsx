"use client"

import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { ApprenticesWidget } from "../_components/ApprenticesWidget"
import { ApprenticesAttendanceWidget } from "../_components/ApprenticesAttendanceWidget"
import { RecentGradesWidget } from "../_components/RecentGradesWidget"
import { DocumentsWidget } from "../_components/DocumentsWidget"
import { RequireAuth } from "@/shared/components/auth/RequireAuth"
import { useAuth } from "@/shared/providers/AuthProvider"

export default function CompanyDashboardPage() {
  const { profile, isAdmin, selectedRole } = useAuth()
  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Entreprise"
  const activeRole = isAdmin ? selectedRole ?? "company" : profile?.role ?? "company"

  return (
    <RequireAuth requiredRole="company">
      <DashboardLayout role={activeRole} userName={userName} showDashboardSwitcher={isAdmin}>
        <div className="space-y-6 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Espace Entreprise
            </h1>
            <p className="text-slate-500">
              Suivi de vos {3} apprentis en temps reel.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <ApprenticesWidget />
              <ApprenticesAttendanceWidget />
            </div>

            <div className="space-y-4">
              <RecentGradesWidget />
            </div>

            <div className="space-y-4">
              <DocumentsWidget />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  )
}
