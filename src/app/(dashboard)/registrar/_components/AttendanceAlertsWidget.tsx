"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Badge } from "@/shared/components/ui/Badge"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { AttendanceAlert } from "@/shared/lib/registrarData"

interface AttendanceAlertsWidgetProps {
  alerts?: AttendanceAlert[] | null
  error?: string | null
}

export function AttendanceAlertsWidget({
  alerts = null,
  error = null,
}: AttendanceAlertsWidgetProps) {
  const items = alerts ?? []

  if (!error && items.length === 0) {
    // Healthy: nothing to alert on. Hide the card entirely (matches the
    // pre-existing behavior of the teacher pending-attendance widget).
    return null
  }

  return (
    <Card className="h-full border-rose-200 bg-rose-50/70 dark:border-rose-500/30 dark:bg-rose-500/10 shadow-none">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic text-rose-800 dark:text-rose-200">Alertes Assiduité</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
        ) : (
          <div className="divide-y divide-rose-200/60 dark:divide-rose-500/20">
            {items.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">{alert.student_name}</p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{alert.class_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="error" className="bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30">
                    {alert.attendance_rate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink
          href="/registrar/students"
          className="border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/20"
        />
      </CardFooter>
    </Card>
  )
}
