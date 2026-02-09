"use client"

import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockApprenticesAttendance } from "../_data/mock"
import { cn } from "@/shared/lib/utils"

export function ApprenticesAttendanceWidget() {
  const { global_rate, apprentices } = mockApprenticesAttendance

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Suivi Assiduité</CardTitle>
        <CheckCircle2 className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-3xl font-bold text-slate-900">{global_rate}%</span>
            <span className="text-xs text-slate-500">Moyenne globale</span>
          </div>
          
          <div className="space-y-3">
            {apprentices.map((apprentice) => {
              let colorClass = "bg-emerald-500"
              if (apprentice.rate < 90) colorClass = "bg-amber-500"
              if (apprentice.rate < 75) colorClass = "bg-red-500"

              return (
                <div key={apprentice.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{apprentice.name}</span>
                    <span className="text-slate-500">{apprentice.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className={cn("h-full rounded-full", colorClass)} 
                      style={{ width: `${apprentice.rate}%` }} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
