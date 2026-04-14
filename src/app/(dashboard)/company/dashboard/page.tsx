import { redirect } from "next/navigation"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { ApprenticesWidget } from "../_components/ApprenticesWidget"
import { ApprenticesAttendanceWidget } from "../_components/ApprenticesAttendanceWidget"
import { RecentGradesWidget } from "../_components/RecentGradesWidget"
import { DocumentsWidget } from "../_components/DocumentsWidget"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getCompanyApprenticesAction,
  getCompanyApprenticesAttendanceAction,
  getCompanyDocumentsAction,
  getCompanyRecentGradesAction,
} from "@/actions/company"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

export default async function CompanyDashboardPage() {
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
  if (!canAccessRole(role, "company")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Entreprise"

  const [apprenticesResult, attendanceResult, gradesResult, documentsResult] = await Promise.all([
    getCompanyApprenticesAction(),
    getCompanyApprenticesAttendanceAction(),
    getCompanyRecentGradesAction(),
    getCompanyDocumentsAction(),
  ])

  const apprentices = apprenticesResult.ok ? apprenticesResult.data : null
  const apprenticesError = apprenticesResult.ok ? null : apprenticesResult.error.message

  const attendanceOverview = attendanceResult.ok ? attendanceResult.data : null
  const attendanceError = attendanceResult.ok ? null : attendanceResult.error.message

  const grades = gradesResult.ok ? gradesResult.data : null
  const gradesError = gradesResult.ok ? null : gradesResult.error.message

  const documents = documentsResult.ok ? documentsResult.data : null
  const documentsError = documentsResult.ok ? null : documentsResult.error.message

  const apprenticeCount = apprentices?.length ?? 0

  return (
    <DashboardLayout
      role="company"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-heading text-balance text-3xl font-bold text-foreground">
            Espace entreprise
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Suivi de vos {apprenticeCount} apprentis en temps reel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-6">
          <ApprenticesWidget apprentices={apprentices} error={apprenticesError} />
          <ApprenticesAttendanceWidget overview={attendanceOverview} error={attendanceError} />
          <RecentGradesWidget grades={grades} error={gradesError} />
          <DocumentsWidget documents={documents} error={documentsError} />
        </div>
      </div>
    </DashboardLayout>
  )
}
