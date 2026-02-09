"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockApprentices } from "../_data/mock"

interface ApprenticesWidgetProps {
  loading?: boolean
}

export function ApprenticesWidget({ loading = false }: ApprenticesWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
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
        <CardTitle className="text-base font-medium">Mes Apprentis</CardTitle>
        <Users className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-2">
          {mockApprentices.map((apprentice) => (
            <div key={apprentice.id} className="flex items-center space-x-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {apprentice.initials}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-900">{apprentice.name}</p>
                <p className="text-xs text-slate-500">{apprentice.program}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
