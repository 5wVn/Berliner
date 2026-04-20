"use client"

import { IconDownload as Download } from "@tabler/icons-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { CompanyDocument } from "@/shared/lib/companyData"

interface DocumentsWidgetProps {
  loading?: boolean
  documents?: CompanyDocument[] | null
  error?: string | null
}

export function DocumentsWidget({
  loading = false,
  documents = null,
  error = null,
}: DocumentsWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="divide-y-2 divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-10 w-full rounded-md sm:w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = documents ?? []

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun document disponible.</p>
        ) : (
          <div className="divide-y-2 divide-border">
            {items.map((doc) => (
              <div key={doc.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="break-words text-base font-bold text-foreground">
                    {doc.type}
                  </p>
                  <p className="break-words text-sm font-medium text-muted-foreground">{doc.apprentice_name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ajoute le {format(new Date(doc.date), "d MMM yyyy", { locale: fr })}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-full rounded-xl text-muted-foreground hover:bg-muted hover:text-primary sm:w-10"
                >
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Telecharger</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/company/documents" />
      </CardFooter>
    </Card>
  )
}
