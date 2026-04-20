"use client"

import { IconArrowRight as ArrowRight } from "@tabler/icons-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { Badge } from "@/shared/components/ui/Badge"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { PendingAttendanceSession } from "@/shared/lib/teacherData"

interface PendingAttendanceWidgetProps {
  loading?: boolean
  pending?: PendingAttendanceSession[] | null
  error?: string | null
}

export function PendingAttendanceWidget({
  loading = false,
  pending = null,
  error = null,
}: PendingAttendanceWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full border-destructive/40 bg-destructive/10">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y-2 divide-destructive/20">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-full rounded-md sm:w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full border-destructive/40 bg-destructive/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-destructive">Appels en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const items = pending ?? []
  if (items.length === 0) return null

  return (
    <Card className="h-full border-destructive/40 bg-destructive/10">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-destructive">Appels en attente</CardTitle>
          <Badge variant="error">{items.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y-2 divide-destructive/20">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex flex-col gap-1">
                <p className="break-words text-base font-bold text-foreground">{item.class_name}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {format(new Date(item.date), "dd MMM a HH:mm", { locale: fr })}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-full rounded-xl text-destructive hover:bg-destructive/20 sm:w-10"
              >
                <ArrowRight className="h-5 w-5" />
                <span className="sr-only">Faire l&apos;appel</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/teacher/classes" />
      </CardFooter>
    </Card>
  )
}
