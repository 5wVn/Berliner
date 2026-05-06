import { redirect } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getRegistrarAttendanceAlertsAction,
  getRegistrarPendingEnrollmentsAction,
  getRegistrarStatsAction,
} from "@/actions/registrar"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"
import { MobileLayout } from "../../_berliner/MobileLayout"
import { RegistrarHomeClient } from "../../_berliner/RegistrarHomeClient"

export default async function RegistrarDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, email")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError || !profile) redirect("/")

  const role = profile.role as UserRole
  if (!canAccessRole(role, "registrar")) {
    redirect(roleToDashboardPath(role))
  }

  const firstName =
    profile.first_name ||
    (profile.email
      ? profile.email.split("@")[0].split(".")[0].replace(/^./, (c: string) => c.toUpperCase())
      : "toi")

  const [statsResult, enrollmentsResult, alertsResult] = await Promise.all([
    getRegistrarStatsAction(),
    getRegistrarPendingEnrollmentsAction(5),
    getRegistrarAttendanceAlertsAction(5),
  ])

  return (
    <MobileLayout role="registrar">
      <RegistrarHomeClient
        firstName={firstName}
        stats={statsResult.ok ? statsResult.data : null}
        statsError={statsResult.ok ? null : statsResult.error.message}
        enrollments={enrollmentsResult.ok ? enrollmentsResult.data : null}
        enrollmentsError={enrollmentsResult.ok ? null : enrollmentsResult.error.message}
        alerts={alertsResult.ok ? alertsResult.data : null}
        alertsError={alertsResult.ok ? null : alertsResult.error.message}
      />
    </MobileLayout>
  )
}
