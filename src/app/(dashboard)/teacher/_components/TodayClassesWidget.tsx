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
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="divide-y-2 divide-border">
            {[1, 2].map((i) => (
              <div key={i} className="py-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="mt-2 h-4 w-24" />
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
        <CardTitle>Cours du jour</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length > 0 ? (
          <div className="divide-y-2 divide-border">
            {items.map((session) => {
              const startDate = new Date(session.start_time)
              const endDate = new Date(session.end_time)

              return (
                <div key={session.id} className="py-4">
                  <div className="mb-3 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                    <span className="inline-flex w-fit items-center rounded-lg border-2 border-border bg-muted px-2.5 py-1 text-sm font-bold text-primary">
                      {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                    </span>
                    <span className="break-words text-sm font-semibold text-muted-foreground">
                      {session.room}
                    </span>
                  </div>
                  <div className="min-w-0 flex flex-col gap-1.5">
                    <p className="break-words text-lg font-bold text-foreground">{session.class_name}</p>
                    <p className="break-words text-base text-muted-foreground">{session.subject}</p>
                    {typeof session.student_count === "number" ? (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>{session.student_count} etudiants</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-base font-medium text-muted-foreground">
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
