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
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Prochaines sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucune session à venir.
          </p>
        ) : (
          <div className="space-y-6">
            {items.map((session) => {
              const startDate = new Date(session.start_time)

              return (
                <div key={session.id} className="flex items-start space-x-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 w-16 shadow-sm border border-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                    <span className="text-lg">{format(startDate, "dd")}</span>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400">{format(startDate, "MMM", { locale: fr })}</span>
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold leading-none text-slate-900 dark:text-slate-50">
                        {session.class_name}
                      </p>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{format(startDate, "HH:mm")}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {session.subject} • <span className="font-semibold text-teal-600 dark:text-teal-400">{session.room}</span>
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
