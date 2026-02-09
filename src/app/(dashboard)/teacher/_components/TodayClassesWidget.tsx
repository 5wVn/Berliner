"use client"

import { School, Users } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockTodayClasses } from "../_data/mock"

interface TodayClassesWidgetProps {
  loading?: boolean
}

export function TodayClassesWidget({ loading = false }: TodayClassesWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-24 mt-2" />
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
        <CardTitle className="text-base font-medium">Cours du jour</CardTitle>
        <School className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        {mockTodayClasses.length > 0 ? (
          <div className="space-y-4">
            {mockTodayClasses.map((session) => {
              const startDate = new Date(session.start_time)
              const endDate = new Date(session.end_time)
              
              return (
                <div key={session.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <div className="flex justify-between items-start mb-2">
                     <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{session.room}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{session.class_name}</p>
                    <p className="text-sm text-slate-600">{session.subject}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                      <Users className="h-3 w-3" />
                      <span>{session.student_count} étudiants</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-slate-500">
            Aucun cours aujourd'hui
          </div>
        )}
      </CardContent>
    </Card>
  )
}
