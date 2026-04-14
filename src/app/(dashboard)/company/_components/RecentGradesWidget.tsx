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
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Dernières Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucune note récente.
          </p>
        ) : (
          <div className="space-y-6">
            {items.map((gradeItem) => {
              const gradeVal = Number(gradeItem.grade)
              let badgeColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              if (gradeVal >= 15) badgeColor = "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border border-teal-100 dark:border-teal-800"
              else if (gradeVal >= 10) badgeColor = "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
              else badgeColor = "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300 border border-rose-100 dark:border-rose-800"

              return (
                <div key={gradeItem.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-base font-bold text-slate-900 dark:text-slate-50">{gradeItem.subject}</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{gradeItem.apprentice_name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {format(new Date(gradeItem.date), "d MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${badgeColor}`}>
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
