"use client";

import { useMemo, useState } from "react";
import { Mail } from "lucide-react";
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
import type { RegistrarStudent } from "@/shared/lib/registrarData";

const filterControlClass =
  "h-11 rounded-xl border-2 border-border bg-card px-3 text-sm font-semibold text-foreground w-full sm:w-auto";

interface StudentsListProps {
  students: RegistrarStudent[];
}

const statusVariant = (status: string | null): "default" | "secondary" | "warning" | "outline" => {
  if (!status) return "outline";
  const s = status.toLowerCase();
  if (s === "active") return "default";
  if (s === "pending") return "warning";
  return "secondary";
};

const statusLabel = (status: string | null) => {
  if (!status) return "—";
  const s = status.toLowerCase();
  if (s === "active") return "Actif";
  if (s === "pending") return "En attente";
  if (s === "inactive") return "Inactif";
  return status;
};

export function StudentsList({ students }: StudentsListProps) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const classes = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((s) => {
      if (s.class_id && s.class_name) map.set(s.class_id, s.class_name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [students]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.enrollment_status) set.add(s.enrollment_status);
    });
    return Array.from(set);
  }, [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (classFilter !== "all" && s.class_id !== classFilter) return false;
      if (statusFilter !== "all" && s.enrollment_status !== statusFilter) return false;
      if (!q) return true;
      const haystack = `${s.first_name} ${s.last_name} ${s.email ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [students, query, classFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un étudiant, un email..."
          className="h-11 flex-1 rounded-xl border-2 border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground md:text-sm"
        />
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className={filterControlClass}>
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className={filterControlClass}>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} étudiant{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun étudiant ne correspond à ces critères.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => {
            const fullName = `${s.first_name} ${s.last_name}`.trim() || "Étudiant";
            return (
              <Card key={s.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-foreground">{fullName}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {s.email ? (
                        <span className="inline-flex items-center gap-1 break-all">
                          <Mail className="h-4 w-4 shrink-0" />
                          {s.email}
                        </span>
                      ) : null}
                      {s.class_name ? <span>Classe : {s.class_name}</span> : null}
                    </p>
                  </div>
                  <Badge variant={statusVariant(s.enrollment_status)} className="w-fit shrink-0">
                    {statusLabel(s.enrollment_status)}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
