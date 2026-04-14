"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { Apprentice } from "@/shared/lib/companyData"

interface ApprenticesWidgetProps {
  loading?: boolean
  apprentices?: Apprentice[] | null
  error?: string | null
}

export function ApprenticesWidget({
  loading = false,
  apprentices = null,
  error = null,
}: ApprenticesWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="space-y-0 pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = apprentices ?? []

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Mes Apprentis</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucun apprenti rattaché.
          </p>
        ) : (
          <div className="space-y-6 pt-2">
            {items.map((apprentice) => (
              <div key={apprentice.id} className="flex items-center space-x-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-base font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                  {apprentice.initials}
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">{apprentice.name}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{apprentice.program}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/company/apprentices" />
      </CardFooter>
    </Card>
  )
}
