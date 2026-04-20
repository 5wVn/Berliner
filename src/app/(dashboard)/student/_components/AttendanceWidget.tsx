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
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex w-full flex-col gap-3">
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

  let barClass = "bg-destructive"
  let textClass = "text-destructive"

  if (rate >= 90) {
    barClass = "bg-primary"
    textClass = "text-primary"
  } else if (rate >= 75) {
    barClass = "bg-warning"
    textClass = "text-warning"
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Assiduité</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex flex-col items-center justify-center">
              <span className={cn("text-6xl font-black tracking-tight", textClass)}>{rate}%</span>
              <span className="mt-1 text-base font-medium text-muted-foreground">
                Présence globale
              </span>
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Présence</span>
                <span>
                  {present}/{total} séances
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full transition-all duration-500 ease-in-out", barClass)}
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
