"use client"

import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockAttendance } from "../_data/mock"
import { cn } from "@/shared/lib/utils"

interface AttendanceWidgetProps {
  loading?: boolean
}

export function AttendanceWidget({ loading = false }: AttendanceWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative flex flex-col items-center justify-center space-y-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { rate, total, present } = mockAttendance
  
  // Color logic: vert ≥90%, orange ≥75%, rouge <75%
  let colorClass = "bg-red-500"
  let textColorClass = "text-red-600"
  
  if (rate >= 90) {
    colorClass = "bg-emerald-500"
    textColorClass = "text-emerald-600"
  } else if (rate >= 75) {
    colorClass = "bg-amber-500"
    textColorClass = "text-amber-600"
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Assiduité</CardTitle>
        <CheckCircle2 className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold", textColorClass)}>{rate}%</span>
            <span className="text-xs text-slate-500">Présence globale</span>
          </div>
          
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Présence</span>
              <span>{present}/{total} séances</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div 
                className={cn("h-full transition-all duration-500 ease-in-out", colorClass)} 
                style={{ width: `${rate}%` }} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
