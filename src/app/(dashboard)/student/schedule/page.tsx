import { redirect } from "next/navigation"
import {
  IconBook as BookOpen,
  IconCalendarClock as CalendarClock,
  IconClockHour3 as Clock3,
  IconMapPin as MapPin,
  IconUser as UserRound,
} from "@tabler/icons-react"
import { endOfWeek, format, startOfWeek } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout"
import { Badge } from "@/shared/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { createClient } from "@/shared/lib/supabase/server"
import { getStudentScheduleAction } from "@/actions/student"
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles"
import type { ScheduleSession } from "@/shared/lib/studentData"
import type { UserRole } from "@/shared/types/auth"

const MAX_SESSIONS = 40

type GroupedSessions = {
  key: string
  date: Date
  sessions: ScheduleSession[]
}

const formatDayLabel = (date: Date) => {
  const label = format(date, "EEEE d MMMM", { locale: fr })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const getSessionRange = (session: ScheduleSession) => {
  const start = new Date(session.start_time)
  const end = session.end_time ? new Date(session.end_time) : null

  if (Number.isNaN(start.getTime())) return "--:--"
  if (end && !Number.isNaN(end.getTime())) {
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`
  }
  return format(start, "HH:mm")
}

const getSessionDurationHours = (session: ScheduleSession) => {
  if (!session.end_time) return 0

  const start = new Date(session.start_time).getTime()
  const end = new Date(session.end_time).getTime()

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0

  return (end - start) / (1000 * 60 * 60)
}

export default async function StudentSchedulePage() {
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
  if (!canAccessRole(role, "student")) {
    redirect(roleToDashboardPath(role))
  }

  const userName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur"

  const result = await getStudentScheduleAction(MAX_SESSIONS)
  const sessions: ScheduleSession[] = result.ok ? result.data : []
  const error = result.ok ? null : result.error.message

  const groupedSessions: GroupedSessions[] = []
  const groupMap = new Map<string, GroupedSessions>()
  sessions.forEach((session) => {
    const sessionDate = new Date(session.start_time)
    if (Number.isNaN(sessionDate.getTime())) return
    const key = format(sessionDate, "yyyy-MM-dd")
    const current = groupMap.get(key)
    if (current) {
      current.sessions.push(session)
      return
    }
    const group = { key, date: sessionDate, sessions: [session] }
    groupMap.set(key, group)
    groupedSessions.push(group)
  })

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).getTime()
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).getTime()
  const sessionsThisWeek = sessions.filter((session) => {
    const start = new Date(session.start_time).getTime()
    return !Number.isNaN(start) && start >= weekStart && start <= weekEnd
  }).length

  const totalHours =
    Math.round(
      sessions.reduce(
        (total, session) => total + getSessionDurationHours(session),
        0
      ) * 10
    ) / 10

  const now = Date.now()
  const nextSession =
    sessions.find((session) => new Date(session.start_time).getTime() >= now) ?? null

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="indigo"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Mon planning</h1>
          <p className="text-muted-foreground">
            Consulte tes prochains cours et organise ta semaine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Cette semaine
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {sessionsThisWeek}
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
                <p className="text-sm text-muted-foreground">a venir</p>
              </div>
              <Clock3 className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prochain cours
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  {nextSession
                    ? format(new Date(nextSession.start_time), "dd MMM, HH:mm", {
                        locale: fr,
                      })
                    : "Aucun"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nextSession?.subject_name ?? "Pas de session planifiee"}
                </p>
              </div>
              <BookOpen className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Calendrier des sessions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : groupedSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun cours a venir pour le moment.
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
                              {session.subject_name}
                            </p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <UserRound className="h-4 w-4" />
                                {session.teacher_name ?? "Enseignant"}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {session.location ?? "Salle a definir"}
                              </span>
                            </p>
                          </div>
                          <Badge variant="secondary" className="w-fit">
                            {getSessionRange(session)}
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
