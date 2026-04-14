"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { ApprenticeRecentGrade } from "@/shared/lib/companyData"

interface RecentGradesWidgetProps {
  grades?: ApprenticeRecentGrade[] | null
  error?: string | null
}

export function RecentGradesWidget({
  grades = null,
  error = null,
}: RecentGradesWidgetProps) {
  const items = grades ?? []

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Dernieres notes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune note recente.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((gradeItem) => {
              const gradeVal = Number(gradeItem.grade)
              let badgeClass = "border-2 border-border bg-muted text-foreground"
              if (gradeVal >= 15) badgeClass = "border-2 border-primary/40 bg-primary/15 text-primary"
              else if (gradeVal < 10) badgeClass = "border-2 border-destructive/40 bg-destructive/15 text-destructive"

              return (
                <div key={gradeItem.id} className="flex flex-col gap-3 border-b-2 border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex flex-col gap-1">
                    <p className="break-words text-base font-bold text-foreground">{gradeItem.subject}</p>
                    <p className="break-words text-sm font-medium text-muted-foreground">{gradeItem.apprentice_name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(gradeItem.date), "d MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${badgeClass}`}>
                    {gradeItem.grade}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/company/apprentices" />
      </CardFooter>
    </Card>
  )
}
