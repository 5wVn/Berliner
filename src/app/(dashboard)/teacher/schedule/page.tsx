import { redirect } from "next/navigation"
import {
  IconCalendarClock as CalendarClock,
  IconClockHour3 as Clock3,
  IconMapPin as MapPin,
  IconUsersGroup as Users,
} from "@tabler/icons-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { Badge } from "@/shared/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { createClient } from "@/shared/lib/supabase/server"
import {
  getTeacherTodayClassesAction,
  getTeacherUpcomingSessionsAction,
} from "@/actions/teacher"
import type { TeacherSession } from "@/shared/lib/teacherData"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { UserRole } from "@/shared/types/auth"

type GroupedSchedule = {
  key: string
  date: Date
  sessions: TeacherSession[]
}

const formatDayLabel = (date: Date) => {
  const label = format(date, "EEEE d MMMM", { locale: fr })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const getTimeRange = (session: TeacherSession) => {
  const start = new Date(session.start_time)
  const end = session.end_time ? new Date(session.end_time) : null

  if (Number.isNaN(start.getTime())) return "--:--"
  if (end && !Number.isNaN(end.getTime())) {
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`
  }
  return format(start, "HH:mm")
}

const getDurationHours = (session: TeacherSession) => {
  if (!session.end_time) return 0
  const start = new Date(session.start_time).getTime()
  const end = new Date(session.end_time).getTime()
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0
  return (end - start) / (1000 * 60 * 60)
}

export default async function TeacherSchedulePage() {
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

  const [todayResult, upcomingResult] = await Promise.all([
    getTeacherTodayClassesAction(),
    getTeacherUpcomingSessionsAction(20),
  ])

  const todaySessions = todayResult.ok ? todayResult.data : []
  const upcomingSessions = upcomingResult.ok ? upcomingResult.data : []
  const error = !todayResult.ok
    ? todayResult.error.message
    : !upcomingResult.ok
      ? upcomingResult.error.message
      : null

  const allSessions = [...todaySessions, ...upcomingSessions].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )

  const groupMap = new Map<string, GroupedSchedule>()
  const groupedSessions: GroupedSchedule[] = []
  allSessions.forEach((session) => {
    const sessionDate = new Date(session.start_time)
    if (Number.isNaN(sessionDate.getTime())) return
    const key = format(sessionDate, "yyyy-MM-dd")
    const existing = groupMap.get(key)
    if (existing) {
      existing.sessions.push(session)
      return
    }
    const group = { key, date: sessionDate, sessions: [session] }
    groupMap.set(key, group)
    groupedSessions.push(group)
  })

  const totalStudentsToday = todaySessions.reduce(
    (total, session) => total + (session.student_count ?? 0),
    0
  )

  const totalHours =
    Math.round(
      allSessions.reduce(
        (total, session) => total + getDurationHours(session),
        0
      ) * 10
    ) / 10

  return (
    <DashboardLayout
      role="teacher"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="indigo"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            Planning enseignant
          </h1>
          <p className="text-muted-foreground">
            Vue globale de vos cours et prochaines sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Aujourd hui
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {todaySessions.length}
                </p>
                <p className="text-sm text-muted-foreground">cours</p>
              </div>
              <CalendarClock className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Charge
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {totalHours.toFixed(1)}h
                </p>
                <p className="text-sm text-muted-foreground">sur le planning</p>
              </div>
              <Clock3 className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Etudiants du jour
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {totalStudentsToday}
                </p>
                <p className="text-sm text-muted-foreground">presences prevues</p>
              </div>
              <Users className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Timeline des sessions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : groupedSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun cours planifie pour le moment.
              </p>
            ) : (
              groupedSessions.map((group) => (
                <section key={group.key} className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {formatDayLabel(group.date)}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {group.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="rounded-xl border-2 border-border bg-muted p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-foreground">
                              {session.class_name}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {session.subject}
                            </p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {session.room}
                              </span>
                              {typeof session.student_count === "number" ? (
                                <span className="inline-flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {session.student_count} etudiants
                                </span>
                              ) : null}
                            </p>
                          </div>
                          <Badge variant="secondary" className="w-fit">
                            {getTimeRange(session)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
