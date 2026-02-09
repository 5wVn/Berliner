"use client"

import { UserPlus } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockPendingEnrollments } from "../_data/mock"

interface PendingEnrollmentsWidgetProps {
  loading?: boolean
}

export function PendingEnrollmentsWidget({ loading = false }: PendingEnrollmentsWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-9 w-16 rounded-md ml-4" />
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
        <CardTitle className="text-base font-medium">Inscriptions en attente</CardTitle>
        <UserPlus className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPendingEnrollments.length > 0 ? (
            mockPendingEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    {enrollment.student_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {enrollment.program} • {format(new Date(enrollment.request_date), "dd MMM", { locale: fr })}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-9 text-xs px-3 min-w-[60px]">
                  Voir
                </Button>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500">Aucune inscription en attente</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
