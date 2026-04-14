"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { cn } from "@/shared/lib/utils"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { ApprenticesAttendanceOverview } from "@/shared/lib/companyData"

interface ApprenticesAttendanceWidgetProps {
  overview?: ApprenticesAttendanceOverview | null
  error?: string | null
}

export function ApprenticesAttendanceWidget({
  overview = null,
  error = null,
}: ApprenticesAttendanceWidgetProps) {
  const globalRate = overview?.global_rate ?? 0
  const apprentices = overview?.apprentices ?? []

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Suivi assiduite</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : apprentices.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune donnee d&apos;assiduite disponible.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center py-2">
              <span className="text-5xl font-black tracking-tight text-foreground">{globalRate}%</span>
              <span className="mt-1 text-sm font-medium text-muted-foreground">Moyenne globale</span>
            </div>

            <div className="flex flex-col gap-4">
              {apprentices.map((apprentice) => {
                let colorClass = "bg-primary"
                if (apprentice.rate < 90) colorClass = "bg-warning"
                if (apprentice.rate < 75) colorClass = "bg-destructive"

                return (
                  <div key={apprentice.id} className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="min-w-0 break-words font-semibold text-foreground">{apprentice.name}</span>
                      <span className="shrink-0 font-bold text-muted-foreground">{apprentice.rate}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all duration-300", colorClass)}
                        style={{ width: `${apprentice.rate}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/company/apprentices" />
      </CardFooter>
    </Card>
  )
}
