"use client"

import { FileText, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { mockDocuments } from "../_data/mock"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface DocumentsWidgetProps {
  loading?: boolean
}

export function DocumentsWidget({ loading = false }: DocumentsWidgetProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-slate-100 p-2">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md ml-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Documents</CardTitle>
        <FileText className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-md border border-slate-100 p-2">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px] sm:max-w-[200px]">
                  {doc.type}
                </p>
                <p className="text-xs text-slate-500">{doc.apprentice_name}</p>
                <p className="text-[10px] text-slate-400">
                  Ajouté le {format(new Date(doc.date), "d MMM yyyy", { locale: fr })}
                </p>
              </div>
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-slate-500 hover:text-indigo-600">
                <Download className="h-5 w-5" />
                <span className="sr-only">Télécharger</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
