"use client"

import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockSessions } from "../_data/mock"

interface ScheduleWidgetProps {
  loading?: boolean
}

export function ScheduleWidget({ loading = false }: ScheduleWidgetProps) {
  // Use mock data directly since it's hardcoded for this task
  const sessions = mockSessions.slice(0, 3)

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <Skeleton className="h-10 w-14 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Prochains cours</CardTitle>
        <Calendar className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => {
            const startDate = new Date(session.start_time)
            
            return (
              <div key={session.id} className="flex items-start space-x-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col items-center justify-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 w-14 min-h-[40px]">
                  <span>{format(startDate, "HH:mm")}</span>
                  <span className="text-[10px] text-indigo-500">{format(startDate, "dd/MM")}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    {session.subject_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.teacher_name} • {session.location}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
