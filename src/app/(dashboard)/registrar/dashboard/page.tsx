import { redirect } from "next/navigation"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { PendingEnrollmentsWidget } from "../_components/PendingEnrollmentsWidget"
import { DocumentRequestsWidget } from "../_components/DocumentRequestsWidget"
import { AttendanceAlertsWidget } from "../_components/AttendanceAlertsWidget"
import { StatsWidget } from "../_components/StatsWidget"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getRegistrarAttendanceAlertsAction,
  getRegistrarDocumentRequestsAction,
  getRegistrarPendingEnrollmentsAction,
  getRegistrarStatsAction,
} from "@/actions/registrar"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

export default async function RegistrarDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError || !profile) redirect("/")

  const role = profile.role as UserRole
  if (!canAccessRole(role, "registrar")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur"

  const [statsResult, enrollmentsResult, requestsResult, alertsResult] = await Promise.all([
    getRegistrarStatsAction(),
    getRegistrarPendingEnrollmentsAction(5),
    getRegistrarDocumentRequestsAction(),
    getRegistrarAttendanceAlertsAction(5),
  ])

  const stats = statsResult.ok ? statsResult.data : null
  const statsError = statsResult.ok ? null : statsResult.error.message

  const enrollments = enrollmentsResult.ok ? enrollmentsResult.data : null
  const enrollmentsError = enrollmentsResult.ok ? null : enrollmentsResult.error.message

  const requests = requestsResult.ok ? requestsResult.data : null
  const requestsError = requestsResult.ok ? null : requestsResult.error.message

  const alerts = alertsResult.ok ? alertsResult.data : null
  const alertsError = alertsResult.ok ? null : alertsResult.error.message

  return (
    <DashboardLayout
      role="registrar"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-heading text-balance text-3xl font-bold text-foreground">
            Bonjour, <span className="break-words text-primary">{userName}</span>
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Apercu de l&apos;administration scolaire.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-6">
          <StatsWidget stats={stats} error={statsError} />
          <PendingEnrollmentsWidget enrollments={enrollments} error={enrollmentsError} />
          <DocumentRequestsWidget requests={requests} error={requestsError} />
          <AttendanceAlertsWidget alerts={alerts} error={alertsError} />
        </div>
      </div>
    </DashboardLayout>
  )
}
