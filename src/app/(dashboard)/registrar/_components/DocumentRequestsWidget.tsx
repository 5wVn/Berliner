"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Badge } from "@/shared/components/ui/Badge"
import { DashboardCardLink } from "@/shared/components/ui/DashboardCardLink"
import type { DocumentRequest } from "@/shared/lib/registrarData"

interface DocumentRequestsWidgetProps {
  requests?: DocumentRequest[] | null
  error?: string | null
}

export function DocumentRequestsWidget({
  requests = null,
  error = null,
}: DocumentRequestsWidgetProps) {
  const items = requests ?? []

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-xl font-bold italic">Demandes de documents</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : items.length === 0 ? (
          <div className="text-base text-slate-600 dark:text-slate-400 font-medium text-center py-4">
            Aucune demande en attente
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((request) => (
              <div key={request.id} className="flex items-start justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">
                    {request.document_type}
                  </p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {request.student_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {format(new Date(request.request_date), "dd MMM à HH:mm", { locale: fr })}
                  </p>
                </div>
                <Badge
                  variant={request.status === "processing" ? "info" : "warning"}
                  className="capitalize"
                >
                  {request.status === "processing" ? "En cours" : "En attente"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <DashboardCardLink href="/registrar/documents" />
      </CardFooter>
    </Card>
  )
}
