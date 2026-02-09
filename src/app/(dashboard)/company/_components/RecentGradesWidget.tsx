"use client"

import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockRecentGrades } from "../_data/mock"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function RecentGradesWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Dernières Notes</CardTitle>
        <TrendingUp className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentGrades.map((gradeItem) => (
            <div key={gradeItem.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-900">{gradeItem.subject}</p>
                <p className="text-xs text-slate-500">{gradeItem.apprentice_name}</p>
                <p className="text-[10px] text-slate-400">
                  {format(new Date(gradeItem.date), "d MMM yyyy", { locale: fr })}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-900">
                {gradeItem.grade}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
