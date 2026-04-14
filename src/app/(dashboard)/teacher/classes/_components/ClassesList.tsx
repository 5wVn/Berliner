"use client";

import { useMemo, useState } from "react";
import { BookOpen, CalendarClock, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import type { TeacherClassSummary } from "@/shared/lib/teacherData";

interface ClassesListProps {
  classes: TeacherClassSummary[];
}

export function ClassesList({ classes }: ClassesListProps) {
  const [query, setQuery] = useState("");
  const [onlyUpcoming, setOnlyUpcoming] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes.filter((c) => {
      if (onlyUpcoming && !c.next_session_at) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q);
    });
  }, [classes, query, onlyUpcoming]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une classe..."
          className="h-11 flex-1 rounded-xl border-2 border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <label className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-border bg-card px-3 text-sm font-semibold text-foreground">
          <input
            type="checkbox"
            checked={onlyUpcoming}
            onChange={(e) => setOnlyUpcoming(e.target.checked)}
            className="h-4 w-4"
          />
          Avec prochain cours
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune classe ne correspond à la recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((c) => {
            const next = c.next_session_at ? new Date(c.next_session_at) : null;
            const nextValid = next && !Number.isNaN(next.getTime());
            return (
              <Card key={c.id} className="h-full">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 break-words text-lg font-bold text-foreground">
                      {c.name}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {c.student_count} étudiant{c.student_count > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {c.student_count} inscrits
                    </span>
                    {c.subject_count !== undefined ? (
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {c.subject_count} matière{c.subject_count > 1 ? "s" : ""}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-4 w-4" />
                      {nextValid
                        ? format(next, "dd MMM, HH:mm", { locale: fr })
                        : "Aucun cours planifié"}
                    </span>
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
