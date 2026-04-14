"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
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
  let trendColor = "text-slate-500 dark:text-slate-400"

  if (trend === "up") {
    TrendIcon = TrendingUp
    trendColor = "text-teal-600 dark:text-teal-400"
  } else if (trend === "down") {
    TrendIcon = TrendingDown
    trendColor = "text-rose-600 dark:text-rose-400"
  }

  let rateColor = "text-teal-600 dark:text-teal-400"
  if (rate < 90) rateColor = "text-amber-600 dark:text-amber-400"
  if (rate < 80) rateColor = "text-rose-600 dark:text-rose-400"

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Assiduité Globale</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="relative flex items-center justify-center h-40 w-40">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-slate-100 dark:text-slate-800"
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

            <div className="flex items-center gap-1.5 text-sm bg-slate-50 px-3 py-1.5 rounded-full dark:bg-slate-800">
              <TrendIcon className={cn("h-4 w-4", trendColor)} />
              <span className={cn("font-bold", trendColor)}>
                {trendValue}%
              </span>
              <span className="text-slate-500 font-medium dark:text-slate-400">vs mois dernier</span>
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
