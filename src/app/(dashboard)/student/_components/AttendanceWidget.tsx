"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { cn } from "@/shared/lib/utils"
import type { AttendanceSummary } from "@/shared/lib/studentData"

interface AttendanceWidgetProps {
  loading?: boolean
  summary?: AttendanceSummary | null
  error?: string | null
}

export function AttendanceWidget({
  loading = false,
  summary = null,
  error = null,
}: AttendanceWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="space-y-0 pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative flex flex-col items-center justify-center space-y-2">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="w-full space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { rate, total, present } = summary ?? { rate: 0, total: 0, present: 0 }

  // Color logic: vert ≥90%, orange ≥75%, rouge <75%
  let colorClass = "bg-rose-500"
  let textColorClass = "text-rose-600 dark:text-rose-400"

  if (rate >= 90) {
    colorClass = "bg-teal-500"
    textColorClass = "text-teal-600 dark:text-teal-400"
  } else if (rate >= 75) {
    colorClass = "bg-amber-500"
    textColorClass = "text-amber-600 dark:text-amber-400"
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Assiduité</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative flex flex-col items-center justify-center">
              <span className={cn("text-6xl font-black tracking-tight", textColorClass)}>{rate}%</span>
              <span className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">
                Présence globale
              </span>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                <span>Présence</span>
                <span>
                  {present}/{total} séances
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={cn("h-full transition-all duration-500 ease-in-out shadow-sm", colorClass)}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/student/attendance" />
      </CardFooter>
    </Card>
  )
}
