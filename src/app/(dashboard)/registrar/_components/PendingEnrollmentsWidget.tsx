"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { PendingEnrollment } from "@/shared/lib/registrarData"

interface PendingEnrollmentsWidgetProps {
  loading?: boolean
  enrollments?: PendingEnrollment[] | null
  error?: string | null
}

export function PendingEnrollmentsWidget({
  loading = false,
  enrollments = null,
  error = null,
}: PendingEnrollmentsWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="space-y-0 pb-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-20 rounded-xl ml-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = enrollments ?? []

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Inscriptions en attente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error ? (
            <p className="text-sm text-rose-500">{error}</p>
          ) : items.length > 0 ? (
            items.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="text-base font-bold leading-none text-slate-900 dark:text-slate-50">
                    {enrollment.student_name}
                  </p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {enrollment.program} • {format(new Date(enrollment.request_date), "dd MMM", { locale: fr })}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-10 text-sm px-4 min-w-[80px] rounded-xl hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200">
                  Voir
                </Button>
              </div>
            ))
          ) : (
            <div className="text-base text-slate-600 dark:text-slate-400 font-medium text-center py-4">Aucune inscription en attente</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/registrar/students" />
      </CardFooter>
    </Card>
  )
}
