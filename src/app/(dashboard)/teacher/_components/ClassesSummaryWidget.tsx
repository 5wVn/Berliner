"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockClassesSummary } from "../_data/mock"

export function ClassesSummaryWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Mes Classes</CardTitle>
        <Users className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockClassesSummary.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                  {cls.name.substring(0, 2)}
                </div>
                <span className="text-sm font-medium text-slate-700">{cls.name}</span>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {cls.student_count} étu.
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
