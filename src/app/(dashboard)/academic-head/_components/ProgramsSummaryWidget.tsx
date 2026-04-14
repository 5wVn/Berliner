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
      <CardHeader className="pb-4">
        <CardTitle>Programmes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun programme.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((program) => (
              <div key={program.id} className="flex flex-col gap-2 border-b-2 border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="break-words text-base font-bold text-foreground">{program.name}</p>
                  <p className="text-sm text-muted-foreground">{program.classes} classes ouvertes</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-xl border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-primary">
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
