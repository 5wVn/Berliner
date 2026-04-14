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
      <CardHeader className="pb-4">
        <CardTitle>Demandes de documents</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <div className="py-4 text-center text-base font-medium text-muted-foreground">
            Aucune demande en attente
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((request) => (
              <div key={request.id} className="flex flex-col gap-3 border-b-2 border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="break-words text-base font-bold text-foreground">
                    {request.document_type}
                  </p>
                  <p className="break-words text-sm font-medium text-muted-foreground">
                    {request.student_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(request.request_date), "dd MMM a HH:mm", { locale: fr })}
                  </p>
                </div>
                <Badge variant={request.status === "processing" ? "info" : "warning"} className="w-fit">
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
