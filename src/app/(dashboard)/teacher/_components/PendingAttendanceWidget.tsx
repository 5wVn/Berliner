"use client"

import { ArrowRight } from "lucide-react"
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
      <Card className="h-full border-rose-200 bg-rose-50/70 dark:border-rose-500/30 dark:bg-rose-500/10">
        <CardHeader className="space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-rose-200/60 dark:divide-rose-500/20">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-md ml-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full border-rose-200 bg-rose-50/70 dark:border-rose-500/30 dark:bg-rose-500/10 shadow-none">
        <CardHeader className="space-y-0 pb-4">
          <CardTitle className="text-xl font-bold italic text-rose-800 dark:text-rose-200">Appels en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const items = pending ?? []
  if (items.length === 0) return null

  return (
    <Card className="h-full border-rose-200 bg-rose-50/70 dark:border-rose-500/30 dark:bg-rose-500/10 shadow-none">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-xl font-bold italic text-rose-800 dark:text-rose-200">Appels en attente</CardTitle>
          <Badge variant="error" className="bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30">
            {items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-rose-200/60 dark:divide-rose-500/20">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-900 dark:text-slate-50">{item.class_name}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {format(new Date(item.date), "dd MMM à HH:mm", { locale: fr })}
                </p>
              </div>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:text-rose-300 dark:hover:text-rose-200 dark:hover:bg-rose-500/20">
                <ArrowRight className="h-5 w-5" />
                <span className="sr-only">Faire l&apos;appel</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink
          href="/teacher/classes"
          className="border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/20"
        />
      </CardFooter>
    </Card>
  )
}
