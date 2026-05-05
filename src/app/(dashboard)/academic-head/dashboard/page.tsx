import { redirect } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getAcademicHeadAttendanceOverviewAction,
  getAcademicHeadGradeDistributionAction,
  getAcademicHeadKPIsAction,
  getAcademicHeadProgramsSummaryAction,
} from "@/actions/academicHead"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"
import { MobileLayout } from "../../_berliner/MobileLayout"
import { AcademicHeadHomeClient } from "../../_berliner/AcademicHeadHomeClient"

export default async function AcademicHeadDashboardPage() {
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
  if (!canAccessRole(role, "academic_head")) {
    redirect(roleToDashboardPath(role))
  }

  const firstName =
    profile.first_name ||
    (profile.email
      ? profile.email.split("@")[0].split(".")[0].replace(/^./, (c: string) => c.toUpperCase())
      : "toi")

  const [kpisResult, overviewResult, distributionResult, programsResult] = await Promise.all([
    getAcademicHeadKPIsAction(),
    getAcademicHeadAttendanceOverviewAction(),
    getAcademicHeadGradeDistributionAction(),
    getAcademicHeadProgramsSummaryAction(),
  ])

  return (
    <MobileLayout role="academic_head">
      <AcademicHeadHomeClient
        firstName={firstName}
        kpis={kpisResult.ok ? kpisResult.data : null}
        kpisError={kpisResult.ok ? null : kpisResult.error.message}
        overview={overviewResult.ok ? overviewResult.data : null}
        overviewError={overviewResult.ok ? null : overviewResult.error.message}
        distribution={distributionResult.ok ? distributionResult.data : null}
        distributionError={distributionResult.ok ? null : distributionResult.error.message}
        programs={programsResult.ok ? programsResult.data : null}
        programsError={programsResult.ok ? null : programsResult.error.message}
      />
    </MobileLayout>
  )
}
