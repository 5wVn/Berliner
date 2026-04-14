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
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-3 border-b-2 border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl sm:w-20" />
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
      <CardHeader className="pb-4">
        <CardTitle>Inscriptions en attente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : items.length > 0 ? (
            items.map((enrollment) => (
              <div key={enrollment.id} className="flex flex-col gap-3 border-b-2 border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="break-words text-base font-bold text-foreground">
                    {enrollment.student_name}
                  </p>
                  <p className="break-words text-sm font-medium text-muted-foreground">
                    {enrollment.program} • {format(new Date(enrollment.request_date), "dd MMM", { locale: fr })}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-10 w-full rounded-xl px-4 text-sm sm:w-auto sm:min-w-[80px]">
                  Voir
                </Button>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-base font-medium text-muted-foreground">
              Aucune inscription en attente
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/registrar/students" />
      </CardFooter>
    </Card>
  )
}
