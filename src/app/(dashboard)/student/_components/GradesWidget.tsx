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
        <CardHeader className="space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center pb-4 space-y-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="space-y-3">
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
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Notes récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : (
          <>
            <div className="flex flex-col items-center pb-6">
              <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                {globalAverage}
              </span>
              <span className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">
                Moyenne générale
              </span>
            </div>
            {displaySubjects.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Aucune note disponible.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {displaySubjects.map((grade, index) => {
                  const score = grade.average ?? 0
                  let colorClass = "text-slate-700 dark:text-slate-200"
                  if (score >= 15) colorClass = "text-teal-600 dark:text-teal-400"
                  else if (score >= 10) colorClass = "text-violet-600 dark:text-violet-400"
                  else colorClass = "text-rose-600 dark:text-rose-400"

                  return (
                    <div key={`${grade.id}-${index}`} className="flex items-center justify-between py-4">
                      <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        {grade.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold tabular-nums ${colorClass}`}>
                          {grade.average !== null && grade.average !== undefined
                            ? grade.average.toFixed(1)
                            : "--"}
                        </span>
                      </div>
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
