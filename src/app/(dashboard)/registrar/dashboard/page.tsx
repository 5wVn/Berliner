"use client"

import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { PendingEnrollmentsWidget } from "../_components/PendingEnrollmentsWidget"
import { DocumentRequestsWidget } from "../_components/DocumentRequestsWidget"
import { AttendanceAlertsWidget } from "../_components/AttendanceAlertsWidget"
import { StatsWidget } from "../_components/StatsWidget"
import { RequireAuth } from "@/shared/components/auth/RequireAuth"
import { useAuth } from "@/shared/providers/AuthProvider"

export default function RegistrarDashboardPage() {
  const { profile, isAdmin, selectedRole } = useAuth()
  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Utilisateur"
  const activeRole = isAdmin ? selectedRole ?? "registrar" : profile?.role ?? "registrar"

  return (
    <RequireAuth requiredRole="registrar">
      <DashboardLayout role={activeRole} userName={userName} showDashboardSwitcher={isAdmin}>
        <div className="space-y-6 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Bonjour, {userName}
            </h1>
            <p className="text-slate-500">
              Apercu de l'administration scolaire.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <StatsWidget />
              <PendingEnrollmentsWidget />
            </div>

            <div className="space-y-4">
              <DocumentRequestsWidget />
            </div>

            <div className="space-y-4">
              <AttendanceAlertsWidget />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  )
}
