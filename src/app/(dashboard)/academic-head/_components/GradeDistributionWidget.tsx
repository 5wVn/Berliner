"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { GradeDistributionBucket } from "@/shared/lib/academicHeadData"

interface GradeDistributionWidgetProps {
  distribution?: GradeDistributionBucket[] | null
  error?: string | null
}

export function GradeDistributionWidget({
  distribution = null,
  error = null,
}: GradeDistributionWidgetProps) {
  const items = distribution ?? []

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Distribution des Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Aucune note disponible.</p>
        ) : (
          <div className="space-y-6 pt-2">
            {items.map((item, index) => {
              let barColor = "bg-indigo-600"
              if (index === 0) barColor = "bg-teal-500" // Top: ≥16
              if (index === 1) barColor = "bg-indigo-500" // 14-16
              if (index === 2) barColor = "bg-indigo-500" // 12-14
              if (index === 3) barColor = "bg-amber-500" // 10-12
              if (index === 4) barColor = "bg-rose-500" // <10

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{item.range}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{item.count} étudiants ({item.percentage}%)</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/academic-head/analytics" />
      </CardFooter>
    </Card>
  )
}
