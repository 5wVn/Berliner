"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { ProgramSummary } from "@/shared/lib/academicHeadData"

interface ProgramsSummaryWidgetProps {
  programs?: ProgramSummary[] | null
  error?: string | null
}

export function ProgramsSummaryWidget({
  programs = null,
  error = null,
}: ProgramsSummaryWidgetProps) {
  const items = programs ?? []

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Programmes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Aucun programme.</p>
        ) : (
          <div className="space-y-6">
            {items.map((program) => (
              <div key={program.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">{program.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{program.classes} classes ouvertes</p>
                </div>
                <span className="inline-flex items-center rounded-xl bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-900/20 dark:text-violet-300 border border-violet-100 dark:border-violet-800">
                  {program.students} inscrits
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/academic-head/reports" />
      </CardFooter>
    </Card>
  )
}
