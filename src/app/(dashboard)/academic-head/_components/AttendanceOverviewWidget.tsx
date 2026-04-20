"use client"

import {
  IconMinus as Minus,
  IconTrendingDown as TrendingDown,
  IconTrendingUp as TrendingUp,
} from "@tabler/icons-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { cn } from "@/shared/lib/utils"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { AttendanceOverview } from "@/shared/lib/academicHeadData"

interface AttendanceOverviewWidgetProps {
  overview?: AttendanceOverview | null
  error?: string | null
}

export function AttendanceOverviewWidget({
  overview = null,
  error = null,
}: AttendanceOverviewWidgetProps) {
  const rate = overview?.rate ?? 0
  const trend = overview?.trend ?? "stable"
  const trendValue = overview?.trend_value ?? 0

  let TrendIcon = Minus
  let trendColor = "text-muted-foreground"

  if (trend === "up") {
    TrendIcon = TrendingUp
    trendColor = "text-primary"
  } else if (trend === "down") {
    TrendIcon = TrendingDown
    trendColor = "text-destructive"
  }

  let rateColor = "text-primary"
  if (rate < 90) rateColor = "text-warning"
  if (rate < 80) rateColor = "text-destructive"

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Assiduite globale</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-muted"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={rateColor}
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * rate) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className={cn("text-4xl font-black tracking-tight", rateColor)}>{rate}%</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border-2 border-border bg-muted px-3 py-1.5 text-center text-sm">
              <TrendIcon className={cn("h-4 w-4 shrink-0", trendColor)} />
              <span className={cn("font-bold", trendColor)}>{trendValue}%</span>
              <span className="font-medium text-muted-foreground">vs mois dernier</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/academic-head/analytics" />
      </CardFooter>
    </Card>
  )
}
