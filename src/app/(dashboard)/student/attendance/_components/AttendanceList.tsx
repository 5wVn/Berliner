"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/shared/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StudentAttendanceRecord } from "@/shared/lib/studentData";

const filterControlClass =
  "h-11 rounded-xl border-2 border-border bg-card px-3 text-sm font-semibold text-foreground w-full sm:w-auto";

type StatusFilter = "all" | "present" | "absent" | "late" | "excused" | "pending_justification";
type PeriodFilter = "30" | "semester" | "all";

interface AttendanceListProps {
  records: StudentAttendanceRecord[];
}

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Tous les statuts" },
  { value: "present", label: "Présent" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Retard" },
  { value: "excused", label: "Excusé" },
  { value: "pending_justification", label: "À justifier" },
];

const PERIOD_OPTIONS: Array<{ value: PeriodFilter; label: string }> = [
  { value: "30", label: "30 derniers jours" },
  { value: "semester", label: "Semestre en cours" },
  { value: "all", label: "Tout l'historique" },
];

const statusVariant = (status: string): "default" | "destructive" | "warning" | "secondary" | "outline" => {
  const s = status.toLowerCase();
  if (s.includes("absent")) return "destructive";
  if (s.includes("late")) return "warning";
  if (s.includes("pending")) return "warning";
  if (s.includes("excuse")) return "secondary";
  if (s.includes("present")) return "default";
  return "outline";
};

const statusLabel = (status: string) => {
  const s = status.toLowerCase();
  if (s === "present") return "Présent";
  if (s === "absent") return "Absent";
  if (s === "late") return "Retard";
  if (s === "excused") return "Excusé";
  if (s === "pending_justification") return "À justifier";
  return status;
};

export function AttendanceList({ records }: AttendanceListProps) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("all");

  const filtered = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const semesterStart = new Date();
    semesterStart.setMonth(semesterStart.getMonth() < 6 ? 0 : 6, 1);
    semesterStart.setHours(0, 0, 0, 0);

    return records.filter((record) => {
      if (status !== "all" && record.status.toLowerCase() !== status) return false;
      if (period === "30") {
        const t = new Date(record.date).getTime();
        if (Number.isNaN(t) || now - t > thirtyDays) return false;
      } else if (period === "semester") {
        const t = new Date(record.date).getTime();
        if (Number.isNaN(t) || t < semesterStart.getTime()) return false;
      }
      return true;
    });
  }, [records, status, period]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className={filterControlClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
          <SelectTrigger className={filterControlClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun enregistrement ne correspond à ces filtres.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((record) => {
            const date = new Date(record.date);
            const dateValid = !Number.isNaN(date.getTime());
            return (
              <div
                key={record.id}
                className="rounded-xl border-2 border-border bg-muted p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-foreground">
                      {record.subject_name}
                      {record.class_name ? (
                        <span className="ml-2 inline break-words text-sm font-normal text-muted-foreground">
                          — {record.class_name}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        {dateValid
                          ? format(date, "EEEE d MMMM yyyy", { locale: fr })
                          : "Date inconnue"}
                      </span>
                      {record.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4 shrink-0" />
                          {record.location}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <Badge variant={statusVariant(record.status)} className="w-fit">
                    {statusLabel(record.status)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
