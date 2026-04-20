import Link from "next/link"
import { redirect } from "next/navigation"
import {
  IconCalendar as Calendar,
  IconFileText as FileText,
  IconSchool as GraduationCap,
} from "@tabler/icons-react"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
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

  const quickLinks = [
    { href: "/student/schedule", label: "Planning", icon: Calendar },
    { href: "/student/grades", label: "Notes", icon: GraduationCap },
    { href: "/student/attendance", label: "Assiduite", icon: FileText },
  ]

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-heading text-balance text-3xl font-bold text-foreground">
            Bonjour, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Voici un apercu de votre activite aujourd&apos;hui.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-3 md:gap-6">
          {quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="card-accent flex min-h-28 flex-col items-center justify-center gap-3 px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="rounded-full border-2 border-primary-foreground/20 bg-primary-foreground/10 p-3">
                  <Icon aria-hidden="true" className="h-8 w-8" />
                </div>
                <span className="text-center text-base font-semibold">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          <ScheduleWidget sessions={sessions} error={scheduleError} />
          <GradesWidget summary={gradesSummary} error={gradesError} />
          <AttendanceWidget summary={attendanceSummary} error={attendanceError} />
        </div>
      </div>
    </DashboardLayout>
  )
}
