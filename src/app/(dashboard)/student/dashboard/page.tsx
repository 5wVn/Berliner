import { redirect } from "next/navigation"
import { Calendar, FileText, GraduationCap } from "lucide-react"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { Button } from "@/shared/components/ui/Button"
import { CardStack } from "@/shared/components/ui/CardStack"
import { ScheduleWidget } from "../_components/ScheduleWidget"
import { GradesWidget } from "../_components/GradesWidget"
import { AttendanceWidget } from "../_components/AttendanceWidget"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getStudentAttendanceAction,
  getStudentGradesAction,
  getStudentScheduleAction,
} from "@/actions/student"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

// This page is a Server Component. Auth is enforced via:
//   1. middleware.ts (edge) — bounces unauthenticated users to /
//   2. The profile lookup below — checks role and redirects mismatched users
//
// All three widget data sources are fetched in parallel server-side and
// passed down as initial props, eliminating the previous three-way
// client-side waterfall.
export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError || !profile) {
    redirect("/")
  }

  // Academic heads use the role switcher to view this page; everyone else
  // must be a real student.
  const role = profile.role as UserRole
  if (!canAccessRole(role, "student")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur"
  const firstName = userName.split(" ")[0]

  const [scheduleResult, gradesResult, attendanceResult] = await Promise.all([
    getStudentScheduleAction(),
    getStudentGradesAction(),
    getStudentAttendanceAction(),
  ])

  const sessions = scheduleResult.ok ? scheduleResult.data : null
  const scheduleError = scheduleResult.ok ? null : scheduleResult.error.message

  const gradesSummary = gradesResult.ok ? gradesResult.data : null
  const gradesError = gradesResult.ok ? null : gradesResult.error.message

  const attendanceSummary = attendanceResult.ok ? attendanceResult.data : null
  const attendanceError = attendanceResult.ok ? null : attendanceResult.error.message

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
    >
      <div className="space-y-6 pb-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-heading font-bold italic text-slate-900 dark:text-slate-50">
            Bonjour, <span className="text-indigo-600">{firstName}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Voici un aperçu de votre activité aujourd&apos;hui.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-6 pb-24 md:pb-0">
          <Button variant="outline" className="flex h-auto flex-col gap-3 py-6 rounded-2xl border-slate-200 bg-white/60 backdrop-blur-md hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-800 dark:text-slate-50">
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-1">
              <Calendar className="h-8 w-8" />
            </div>
            <span className="font-semibold text-base">Planning</span>
          </Button>
          <Button variant="outline" className="flex h-auto flex-col gap-3 py-6 rounded-2xl border-slate-200 bg-white/60 backdrop-blur-md hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-800 dark:text-slate-50">
            <div className="p-3 rounded-full bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 mb-1">
              <GraduationCap className="h-8 w-8" />
            </div>
            <span className="font-semibold text-base">Notes</span>
          </Button>
          <Button variant="outline" className="flex h-auto flex-col gap-3 py-6 rounded-2xl border-slate-200 bg-white/60 backdrop-blur-md hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-800 dark:text-slate-50">
            <div className="p-3 rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 mb-1">
              <FileText className="h-8 w-8" />
            </div>
            <span className="font-semibold text-base">Documents</span>
          </Button>
        </div>

        <CardStack className="mt-8 md:mt-0">
          <ScheduleWidget sessions={sessions} error={scheduleError} />
          <GradesWidget summary={gradesSummary} error={gradesError} />
          <AttendanceWidget summary={attendanceSummary} error={attendanceError} />
        </CardStack>
      </div>
    </DashboardLayout>
  )
}
