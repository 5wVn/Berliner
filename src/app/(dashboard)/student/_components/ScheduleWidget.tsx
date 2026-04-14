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
        <CardHeader className="space-y-0 pb-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 py-4">
                <Skeleton className="h-12 w-16 rounded-xl" />
                <div className="space-y-3 flex-1">
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
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Prochains cours</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucun cours à venir.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((session) => {
              const startDate = new Date(session.start_time)

              return (
                <div key={session.id} className="flex items-center space-x-4 py-4">
                  <div className="flex h-14 w-16 flex-col items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
                    <span className="text-lg font-bold leading-none">{format(startDate, "HH:mm")}</span>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 dark:text-indigo-400 mt-1">
                      {format(startDate, "dd MMM", { locale: fr })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-50">
                      {session.subject_name}
                    </p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {session.teacher_name ?? "Enseignant"} •{" "}
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {session.location ?? "Salle à définir"}
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
