"use client"

import { Download } from "lucide-react"
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
        <CardHeader className="space-y-0 pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-10 w-10 rounded-md ml-2" />
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
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucun document disponible.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[220px] dark:text-slate-50">
                    {doc.type}
                  </p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{doc.apprentice_name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Ajouté le {format(new Date(doc.date), "d MMM yyyy", { locale: fr })}
                  </p>
                </div>
                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20">
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Télécharger</span>
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
