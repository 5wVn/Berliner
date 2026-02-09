"use client"

import { FileText } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { mockDocumentRequests } from "../_data/mock"
import { Badge } from "@/shared/components/ui/Badge"

export function DocumentRequestsWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Demandes de documents</CardTitle>
        <FileText className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDocumentRequests.map((request) => (
            <div key={request.id} className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {request.document_type}
                </p>
                <p className="text-xs text-slate-500">
                  {request.student_name}
                </p>
                <p className="text-[10px] text-slate-400">
                   {format(new Date(request.request_date), "dd MMM à HH:mm", { locale: fr })}
                </p>
              </div>
              <Badge 
                variant={request.status === 'processing' ? 'info' : 'warning'} 
                className="text-[10px] capitalize"
              >
                {request.status === 'processing' ? 'En cours' : 'En attente'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
