import { redirect } from "next/navigation"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { CardStack } from "@/shared/components/ui/CardStack"
import { TodayClassesWidget } from "../_components/TodayClassesWidget"
import { UpcomingSessionsWidget } from "../_components/UpcomingSessionsWidget"
import { ClassesSummaryWidget } from "../_components/ClassesSummaryWidget"
import { PendingAttendanceWidget } from "../_components/PendingAttendanceWidget"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getTeacherClassesAction,
  getTeacherPendingAttendanceAction,
  getTeacherTodayClassesAction,
  getTeacherUpcomingSessionsAction,
} from "@/actions/teacher"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

export default async function TeacherDashboardPage() {
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
  if (!canAccessRole(role, "teacher")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur"

  const [todayResult, upcomingResult, classesResult, pendingResult] = await Promise.all([
    getTeacherTodayClassesAction(),
    getTeacherUpcomingSessionsAction(5),
    getTeacherClassesAction(),
    getTeacherPendingAttendanceAction(),
  ])

  const todaySessions = todayResult.ok ? todayResult.data : null
  const todayError = todayResult.ok ? null : todayResult.error.message

  const upcomingSessions = upcomingResult.ok ? upcomingResult.data : null
  const upcomingError = upcomingResult.ok ? null : upcomingResult.error.message

  const classes = classesResult.ok ? classesResult.data : null
  const classesError = classesResult.ok ? null : classesResult.error.message

  const pending = pendingResult.ok ? pendingResult.data : null
  const pendingError = pendingResult.ok ? null : pendingResult.error.message

  return (
    <DashboardLayout
      role="teacher"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
    >
      <div className="space-y-6 pb-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-heading font-bold italic text-slate-900 dark:text-slate-50">
            Bonjour, <span className="text-indigo-600">{userName}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Prêt pour vos cours d&apos;aujourd&apos;hui ?
          </p>
        </div>

        <CardStack>
          <PendingAttendanceWidget pending={pending} error={pendingError} />
          <TodayClassesWidget sessions={todaySessions} error={todayError} />
          <UpcomingSessionsWidget sessions={upcomingSessions} error={upcomingError} />
          <ClassesSummaryWidget classes={classes} error={classesError} />
        </CardStack>
      </div>
    </DashboardLayout>
  )
}
