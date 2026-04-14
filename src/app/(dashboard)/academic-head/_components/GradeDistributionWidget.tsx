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
      <CardHeader className="pb-4">
        <CardTitle>Distribution des notes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune note disponible.</p>
        ) : (
          <div className="flex flex-col gap-6 pt-2">
            {items.map((item, index) => {
              let barColor = "bg-primary"
              if (index === 3) barColor = "bg-warning"
              if (index === 4) barColor = "bg-destructive"

              return (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-foreground">{item.range}</span>
                    <span className="font-medium text-muted-foreground">
                      {item.count} etudiants ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
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
