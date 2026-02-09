"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockAttendanceAlerts } from "../_data/mock"
import { Badge } from "@/shared/components/ui/Badge"

export function AttendanceAlertsWidget() {
  return (
    <Card className="h-full border-red-100 bg-red-50/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-red-900">Alertes Assiduité</CardTitle>
        <AlertTriangle className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAttendanceAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between rounded-md bg-white p-2 shadow-sm border border-red-100">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-900">{alert.student_name}</p>
                <p className="text-xs text-slate-500">{alert.class_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="error" className="bg-red-100 text-red-700 hover:bg-red-100">
                  {alert.attendance_rate}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
