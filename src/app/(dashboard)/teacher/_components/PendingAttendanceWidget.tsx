"use client"

import { AlertCircle, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { Badge } from "@/shared/components/ui/Badge"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockPendingAttendance } from "../_data/mock"

interface PendingAttendanceWidgetProps {
  loading?: boolean
}

export function PendingAttendanceWidget({ loading = false }: PendingAttendanceWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full border-amber-200 bg-amber-50/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32 bg-amber-200" />
            <Skeleton className="h-5 w-8 rounded-full bg-amber-200" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full bg-amber-200" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
             {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-white p-2 shadow-sm border border-amber-100">
                  <div className="space-y-2 flex-1">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-9 w-9 rounded-md ml-2" />
                </div>
             ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const pendingCount = mockPendingAttendance.length

  if (pendingCount === 0) return null

  return (
    <Card className="h-full border-amber-200 bg-amber-50/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium text-amber-900">Appels en attente</CardTitle>
          <Badge variant="warning" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            {pendingCount}
          </Badge>
        </div>
        <AlertCircle className="h-4 w-4 text-amber-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockPendingAttendance.map((pending) => (
            <div key={pending.id} className="flex items-center justify-between rounded-md bg-white p-2 shadow-sm border border-amber-100">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-900">{pending.class_name}</p>
                <p className="text-[10px] text-slate-500">
                  {format(new Date(pending.date), "dd MMM à HH:mm", { locale: fr })}
                </p>
              </div>
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                <ArrowRight className="h-5 w-5" />
                <span className="sr-only">Faire l'appel</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
