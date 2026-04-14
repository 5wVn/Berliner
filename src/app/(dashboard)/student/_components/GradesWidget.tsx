"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { GradesSummary } from "@/shared/lib/studentData"

interface GradesWidgetProps {
  loading?: boolean
  summary?: GradesSummary | null
  error?: string | null
}

export function GradesWidget({
  loading = false,
  summary = null,
  error = null,
}: GradesWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 pb-4">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displaySubjects = summary?.subjects.slice(0, 3) ?? []

  const globalAverage =
    summary?.globalAverage !== null && summary?.globalAverage !== undefined
      ? summary.globalAverage.toFixed(1)
      : "N/A"

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Notes recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <div className="flex flex-col items-center pb-6">
              <span className="text-5xl font-black tracking-tight text-primary sm:text-6xl">
                {globalAverage}
              </span>
              <span className="mt-1 text-base font-medium text-muted-foreground">
                Moyenne generale
              </span>
            </div>
            {displaySubjects.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Aucune note disponible.
              </p>
            ) : (
              <div className="divide-y-2 divide-border">
                {displaySubjects.map((grade, index) => {
                  const score = grade.average ?? 0
                  let colorClass = "text-foreground"
                  if (score >= 15) colorClass = "text-primary"
                  else if (score < 10) colorClass = "text-destructive"

                  return (
                    <div key={`${grade.id}-${index}`} className="flex items-center justify-between gap-3 py-4">
                      <span className="min-w-0 break-words text-base font-semibold text-foreground">
                        {grade.name}
                      </span>
                      <span className={`shrink-0 text-lg font-bold tabular-nums ${colorClass}`}>
                        {grade.average !== null && grade.average !== undefined
                          ? grade.average.toFixed(1)
                          : "--"}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/student/grades" />
      </CardFooter>
    </Card>
  )
}
