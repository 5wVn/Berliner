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
    return null
  }

  return (
    <Card className="h-full border-destructive/40 bg-destructive/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-destructive">Alertes assiduite</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="divide-y-2 divide-destructive/20">
            {items.map((alert) => (
              <div key={alert.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="break-words text-base font-bold text-foreground">{alert.student_name}</p>
                  <p className="break-words text-sm font-medium text-muted-foreground">{alert.class_name}</p>
                </div>
                <Badge variant="error" className="w-fit">
                  {alert.attendance_rate}%
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/registrar/students" />
      </CardFooter>
    </Card>
  )
}
