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
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 border-b-2 border-border pb-4 last:border-0 last:pb-0">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
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
      <CardHeader className="pb-4">
        <CardTitle>Mes apprentis</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun apprenti rattache.</p>
        ) : (
          <div className="flex flex-col gap-6 pt-2">
            {items.map((apprentice) => (
              <div key={apprentice.id} className="flex items-center gap-4 border-b-2 border-border pb-4 last:border-0 last:pb-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-muted text-base font-bold text-primary">
                  {apprentice.initials}
                </div>
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="break-words text-base font-bold text-foreground">{apprentice.name}</p>
                  <p className="break-words text-sm font-medium text-muted-foreground">{apprentice.program}</p>
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
