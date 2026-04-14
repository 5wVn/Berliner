"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { ScheduleSession } from "@/shared/lib/studentData"

interface ScheduleWidgetProps {
  loading?: boolean
  sessions?: ScheduleSession[] | null
  error?: string | null
}

export function ScheduleWidget({
  loading = false,
  sessions = null,
  error = null,
}: ScheduleWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="divide-y-2 divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 py-4">
                <Skeleton className="h-12 w-16 rounded-xl" />
                <div className="flex flex-1 flex-col gap-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = sessions ?? []

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Prochains cours</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun cours a venir.</p>
        ) : (
          <div className="divide-y-2 divide-border">
            {items.map((session) => {
              const startDate = new Date(session.start_time)

              return (
                <div key={session.id} className="flex items-start gap-4 py-4">
                  <div className="flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-border bg-muted text-foreground">
                    <span className="text-lg font-bold leading-none">{format(startDate, "HH:mm")}</span>
                    <span className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">
                      {format(startDate, "dd MMM", { locale: fr })}
                    </span>
                  </div>
                  <div className="min-w-0 flex flex-1 flex-col gap-1">
                    <p className="break-words text-base font-semibold leading-tight text-foreground">
                      {session.subject_name}
                    </p>
                    <p className="break-words text-sm font-medium text-muted-foreground">
                      {session.teacher_name ?? "Enseignant"} •{" "}
                      <span className="text-primary">
                        {session.location ?? "Salle a definir"}
                      </span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/student/schedule" />
      </CardFooter>
    </Card>
  )
}
