import { redirect } from "next/navigation"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
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
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-heading text-balance text-3xl font-bold text-foreground">
            Bonjour, <span className="break-words text-primary">{userName}</span>
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Pret pour vos cours d&apos;aujourd&apos;hui ?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-6">
          <PendingAttendanceWidget pending={pending} error={pendingError} />
          <TodayClassesWidget sessions={todaySessions} error={todayError} />
          <UpcomingSessionsWidget sessions={upcomingSessions} error={upcomingError} />
          <ClassesSummaryWidget classes={classes} error={classesError} />
        </div>
      </div>
    </DashboardLayout>
  )
}
