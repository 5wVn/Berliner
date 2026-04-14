"use client"

import { Users } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { TeacherSession } from "@/shared/lib/teacherData"

interface TodayClassesWidgetProps {
  loading?: boolean
  sessions?: TeacherSession[] | null
  error?: string | null
}

export function TodayClassesWidget({
  loading = false,
  sessions = null,
  error = null,
}: TodayClassesWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="space-y-0 pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2].map((i) => (
              <div key={i} className="py-4">
                <div className="flex justify-between items-start mb-3">
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-24 mt-2" />
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
        <CardTitle className="text-xl font-bold italic">Cours du jour</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((session) => {
              const startDate = new Date(session.start_time)
              const endDate = new Date(session.end_time)

              return (
                <div key={session.id} className="py-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-bold text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-400/30">
                      {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                    </span>
                    <span className="text-sm text-slate-500 font-semibold dark:text-slate-400">{session.room}</span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-50">{session.class_name}</p>
                    <p className="text-base text-slate-600 dark:text-slate-400">{session.subject}</p>
                    {typeof session.student_count === "number" ? (
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-2 dark:text-slate-400">
                        <Users className="h-4 w-4" />
                        <span>{session.student_count} étudiants</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-base text-slate-500 dark:text-slate-400 font-medium">
            Aucun cours aujourd&apos;hui
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/teacher/classes" />
      </CardFooter>
    </Card>
  )
}
