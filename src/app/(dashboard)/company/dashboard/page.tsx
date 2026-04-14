import { redirect } from "next/navigation"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { CardStack } from "@/shared/components/ui/CardStack"
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
      <div className="space-y-6 pb-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-heading font-bold italic text-slate-900 dark:text-slate-50">
            Espace Entreprise
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Suivi de vos {apprenticeCount} apprentis en temps réel.
          </p>
        </div>

        <CardStack>
          <ApprenticesWidget apprentices={apprentices} error={apprenticesError} />
          <ApprenticesAttendanceWidget overview={attendanceOverview} error={attendanceError} />
          <RecentGradesWidget grades={grades} error={gradesError} />
          <DocumentsWidget documents={documents} error={documentsError} />
        </CardStack>
      </div>
    </DashboardLayout>
  )
}
