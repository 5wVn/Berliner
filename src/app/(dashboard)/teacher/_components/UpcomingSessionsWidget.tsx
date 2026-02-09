"use client"

import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockUpcomingSessions } from "../_data/mock"

export function UpcomingSessionsWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Prochaines sessions</CardTitle>
        <Calendar className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUpcomingSessions.map((session) => {
            const startDate = new Date(session.start_time)
            
            return (
              <div key={session.id} className="flex items-start space-x-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col items-center justify-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 w-14">
                  <span>{format(startDate, "dd")}</span>
                  <span className="text-[10px] uppercase">{format(startDate, "MMM", { locale: fr })}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                     <p className="text-sm font-medium leading-none text-slate-900">
                      {session.class_name}
                    </p>
                    <span className="text-xs text-slate-500">{format(startDate, "HH:mm")}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {session.subject} • {session.room}
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
