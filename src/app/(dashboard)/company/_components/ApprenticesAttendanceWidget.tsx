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
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Suivi Assiduité</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : apprentices.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucune donnée d&apos;assiduité disponible.
          </p>
        ) : (
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center justify-center py-2">
              <span className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{globalRate}%</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Moyenne globale</span>
            </div>

            <div className="space-y-4">
              {apprentices.map((apprentice) => {
                let colorClass = "bg-teal-500"
                if (apprentice.rate < 90) colorClass = "bg-amber-500"
                if (apprentice.rate < 75) colorClass = "bg-rose-500"

                return (
                  <div key={apprentice.id} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{apprentice.name}</span>
                      <span className="font-bold text-slate-600 dark:text-slate-400">{apprentice.rate}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
