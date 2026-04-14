"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import type { DocumentRequest } from "@/shared/lib/registrarData";

interface DocumentsListProps {
  requests: DocumentRequest[];
}

const statusVariant = (status: DocumentRequest["status"]): "default" | "warning" | "secondary" => {
  if (status === "processing") return "default";
  return "warning";
};

const statusLabel = (status: DocumentRequest["status"]) => {
  if (status === "pending") return "En attente";
  if (status === "processing") return "En cours";
  return status;
};

export function DocumentsList({ requests }: DocumentsListProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = `${r.student_name} ${r.document_type}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [requests, query, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par étudiant ou type..."
          className="h-11 flex-1 rounded-xl border-2 border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-xl border-2 border-border bg-card px-3 text-sm font-semibold text-foreground"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune demande ne correspond à la recherche.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => {
            const date = new Date(r.request_date);
            const dateValid = !Number.isNaN(date.getTime());
            return (
              <Card key={r.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-foreground">
                        {r.document_type}
                      </p>
                      <p className="break-words text-sm text-muted-foreground">
                        Demandé par {r.student_name}
                        {dateValid
                          ? ` — ${format(date, "d MMM yyyy", { locale: fr })}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <Badge variant={statusVariant(r.status)} className="w-fit">
                      {statusLabel(r.status)}
                    </Badge>
                    <Button size="sm" variant="outline" disabled className="w-full sm:w-auto">
                      Traiter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
