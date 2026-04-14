"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { TeacherSession } from "@/shared/lib/teacherData"

interface UpcomingSessionsWidgetProps {
  sessions?: TeacherSession[] | null
  error?: string | null
}

export function UpcomingSessionsWidget({
  sessions = null,
  error = null,
}: UpcomingSessionsWidgetProps) {
  const items = sessions ?? []

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Prochaines sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune session a venir.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((session) => {
              const startDate = new Date(session.start_time)

              return (
                <div key={session.id} className="flex items-start gap-4 border-b-2 border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-border bg-muted px-3 py-2 text-sm font-bold text-foreground">
                    <span className="text-lg">{format(startDate, "dd")}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {format(startDate, "MMM", { locale: fr })}
                    </span>
                  </div>
                  <div className="min-w-0 flex flex-1 flex-col gap-1">
                    <div className="flex flex-col gap-1 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                      <p className="break-words text-base font-bold text-foreground">
                        {session.class_name}
                      </p>
                      <span className="shrink-0 text-sm font-medium text-muted-foreground">
                        {format(startDate, "HH:mm")}
                      </span>
                    </div>
                    <p className="break-words text-sm text-muted-foreground">
                      {session.subject} • <span className="font-semibold text-primary">{session.room}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/teacher/schedule" />
      </CardFooter>
    </Card>
  )
}
