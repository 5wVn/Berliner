"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { TeacherClassSummary } from "@/shared/lib/teacherData"

interface ClassesSummaryWidgetProps {
  classes?: TeacherClassSummary[] | null
  error?: string | null
}

export function ClassesSummaryWidget({
  classes = null,
  error = null,
}: ClassesSummaryWidgetProps) {
  const items = classes ?? []

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Mes Classes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucune classe assignée.
          </p>
        ) : (
          <div className="space-y-6">
            {items.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200 shadow-sm">
                    {cls.name.substring(0, 2)}
                  </div>
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200">{cls.name}</span>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {cls.student_count} étu.
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/teacher/classes" />
      </CardFooter>
    </Card>
  )
}
