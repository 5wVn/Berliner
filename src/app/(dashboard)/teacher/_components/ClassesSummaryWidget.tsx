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
      <CardHeader className="pb-4">
        <CardTitle>Mes classes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune classe assignee.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((cls) => (
              <div key={cls.id} className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-muted text-sm font-bold text-primary">
                    {cls.name.substring(0, 2)}
                  </div>
                  <span className="break-words text-base font-semibold text-foreground">{cls.name}</span>
                </div>
                <span className="shrink-0 rounded-full border-2 border-border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                  {cls.student_count} etu.
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
