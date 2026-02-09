"use client"

import { CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockAttendanceOverview } from "../_data/mock"
import { cn } from "@/shared/lib/utils"

export function AttendanceOverviewWidget() {
  const { rate, trend, trend_value } = mockAttendanceOverview
  
  let TrendIcon = Minus
  let trendColor = "text-slate-500"
  
  if (trend === 'up') {
    TrendIcon = TrendingUp
    trendColor = "text-emerald-600"
  } else if (trend === 'down') {
    TrendIcon = TrendingDown
    trendColor = "text-red-600"
  }

  // Color logic for the main rate
  let rateColor = "text-emerald-600"
  if (rate < 90) rateColor = "text-amber-600"
  if (rate < 80) rateColor = "text-red-600"

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Assiduité Globale</CardTitle>
        <CheckCircle2 className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
          <div className="relative flex items-center justify-center h-32 w-32">
             {/* Simple SVG circle for visual flair */}
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
               <circle
                className="text-slate-100"
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
              <span className={cn("text-3xl font-bold", rateColor)}>{rate}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm">
            <TrendIcon className={cn("h-4 w-4", trendColor)} />
            <span className={cn("font-medium", trendColor)}>
              {trend_value}%
            </span>
            <span className="text-slate-500">vs mois dernier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
