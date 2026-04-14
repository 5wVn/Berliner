"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyDocument } from "@/shared/lib/companyData";

const filterControlClass =
  "h-11 rounded-xl border-2 border-border bg-card px-3 text-sm font-semibold text-foreground w-full sm:w-auto";

interface DocumentsListProps {
  documents: CompanyDocument[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const types = useMemo(() => {
    return Array.from(new Set(documents.map((d) => d.type).filter(Boolean)));
  }, [documents]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((d) => {
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (!q) return true;
      return `${d.apprentice_name} ${d.type}`.toLowerCase().includes(q);
    });
  }, [documents, query, typeFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par apprenti ou type..."
          className="h-11 flex-1 rounded-xl border-2 border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground md:text-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className={filterControlClass}>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun document ne correspond à la recherche.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((d) => {
            const date = new Date(d.date);
            const dateValid = !Number.isNaN(date.getTime());
            return (
              <Card key={d.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-foreground">
                        {d.apprentice_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dateValid
                          ? format(date, "d MMM yyyy", { locale: fr })
                          : "Date inconnue"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <Badge variant="secondary" className="w-fit">
                      {d.type}
                    </Badge>
                    <Button size="sm" variant="outline" disabled className="w-full sm:w-auto">
                      Voir
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
