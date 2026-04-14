import { redirect } from "next/navigation"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { KPIsWidget } from "../_components/KPIsWidget"
import { AttendanceOverviewWidget } from "../_components/AttendanceOverviewWidget"
import { GradeDistributionWidget } from "../_components/GradeDistributionWidget"
import { ProgramsSummaryWidget } from "../_components/ProgramsSummaryWidget"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getAcademicHeadAttendanceOverviewAction,
  getAcademicHeadGradeDistributionAction,
  getAcademicHeadKPIsAction,
  getAcademicHeadProgramsSummaryAction,
} from "@/actions/academicHead"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

export default async function AcademicHeadDashboardPage() {
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
  if (!canAccessRole(role, "academic_head")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur"

  const [kpisResult, overviewResult, distributionResult, programsResult] = await Promise.all([
    getAcademicHeadKPIsAction(),
    getAcademicHeadAttendanceOverviewAction(),
    getAcademicHeadGradeDistributionAction(),
    getAcademicHeadProgramsSummaryAction(),
  ])

  const kpis = kpisResult.ok ? kpisResult.data : null
  const kpisError = kpisResult.ok ? null : kpisResult.error.message

  const overview = overviewResult.ok ? overviewResult.data : null
  const overviewError = overviewResult.ok ? null : overviewResult.error.message

  const distribution = distributionResult.ok ? distributionResult.data : null
  const distributionError = distributionResult.ok ? null : distributionResult.error.message

  const programs = programsResult.ok ? programsResult.data : null
  const programsError = programsResult.ok ? null : programsResult.error.message

  return (
    <DashboardLayout
      role="academic_head"
      userName={userName}
      showDashboardSwitcher
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-heading text-balance text-3xl font-bold text-foreground">
            Bonjour, <span className="break-words text-primary">{userName}</span>
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Pilotage pedagogique de l&apos;etablissement.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-6">
          <KPIsWidget kpis={kpis} error={kpisError} />
          <AttendanceOverviewWidget overview={overview} error={overviewError} />
          <GradeDistributionWidget distribution={distribution} error={distributionError} />
          <ProgramsSummaryWidget programs={programs} error={programsError} />
        </div>
      </div>
    </DashboardLayout>
  )
}
