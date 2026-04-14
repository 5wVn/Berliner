"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Apprentice, ApprenticeAttendance } from "@/shared/lib/companyData";

const filterControlClass =
  "h-11 rounded-xl border-2 border-border bg-card px-3 text-sm font-semibold text-foreground w-full sm:w-auto";

interface ApprenticesListProps {
  apprentices: Apprentice[];
  attendance: ApprenticeAttendance[];
}

export function ApprenticesList({ apprentices, attendance }: ApprenticesListProps) {
  const [query, setQuery] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("all");

  const rateById = useMemo(() => {
    const map = new Map<string, number>();
    attendance.forEach((a) => map.set(a.id, a.rate));
    return map;
  }, [attendance]);

  const programs = useMemo(() => {
    return Array.from(new Set(apprentices.map((a) => a.program).filter(Boolean)));
  }, [apprentices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apprentices.filter((a) => {
      if (programFilter !== "all" && a.program !== programFilter) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q);
    });
  }, [apprentices, query, programFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un apprenti..."
          className="h-11 flex-1 rounded-xl border-2 border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground md:text-sm"
        />
        <Select value={programFilter} onValueChange={setProgramFilter}>
          <SelectTrigger className={filterControlClass}>
            <SelectValue placeholder="Tous les programmes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les programmes</SelectItem>
            {programs.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun apprenti ne correspond à la recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((a) => {
            const rate = rateById.get(a.id);
            return (
              <Card key={a.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-sm font-bold text-primary-foreground">
                      {a.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-semibold text-foreground">{a.name}</p>
                      <p className="break-words text-sm text-muted-foreground">{a.program}</p>
                    </div>
                  </div>
                  {rate !== undefined ? (
                    <Badge variant={rate >= 75 ? "default" : "destructive"} className="w-fit sm:ml-auto">
                      {rate}%
                    </Badge>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
