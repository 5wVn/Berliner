"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppHeader,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import {
  GlobalAnimations,
  Mono,
  ScrollFade,
} from "@/shared/design/primitives";
import {
  NotifBellPill,
  NotificationsPanel,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";
import type {
  AttendanceSummary,
  StudentAttendanceRecord,
} from "@/shared/lib/studentData";

type StatusKey =
  | "all"
  | "present"
  | "absent"
  | "late"
  | "excused"
  | "pending_justification";
type PeriodKey = "30" | "semester" | "all";

type Props = {
  summary: AttendanceSummary;
  records: StudentAttendanceRecord[];
  error: string | null;
};

const STATUS_LABELS: Record<Exclude<StatusKey, "all">, string> = {
  present: "Présent",
  absent: "Absent",
  late: "Retard",
  excused: "Excusé",
  pending_justification: "À justifier",
};

export function StudentAttendanceClient({ summary, records, error }: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();
  const [status, setStatus] = useState<StatusKey>("all");
  const [period, setPeriod] = useState<PeriodKey>("all");

  const filtered = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const semesterStart = new Date();
    semesterStart.setMonth(semesterStart.getMonth() < 6 ? 0 : 6, 1);
    semesterStart.setHours(0, 0, 0, 0);
    return records.filter((r) => {
      if (status !== "all" && r.status.toLowerCase() !== status) return false;
      if (period === "30") {
        const t = new Date(r.date).getTime();
        if (Number.isNaN(t) || now - t > thirtyDays) return false;
      } else if (period === "semester") {
        const t = new Date(r.date).getTime();
        if (Number.isNaN(t) || t < semesterStart.getTime()) return false;
      }
      return true;
    });
  }, [records, status, period]);

  const absences = summary.total - summary.present;
  const rateColor =
    summary.rate >= 85 ? p.sem.ok : summary.rate >= 70 ? p.ink : p.sem.bad;

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <AppHeader
        p={p}
        kicker="BERLINER · ASSIDUITÉ"
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title={
          <>
            Mon <span style={{ color: p.accent }}>assiduité</span>
          </>
        }
        subtitle={
          <>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {summary.present}
              </Mono>{" "}
              présences
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>{absences}</Mono>{" "}
              absences
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {summary.total}
              </Mono>{" "}
              séances
            </span>
          </>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* Big rate card */}
        <AppCard p={p}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 18px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <Mono
                  style={{
                    fontSize: 44,
                    fontWeight: 600,
                    color: rateColor,
                    letterSpacing: -1,
                    lineHeight: 1,
                  }}
                >
                  {summary.rate}
                </Mono>
                <Mono style={{ fontSize: 18, color: p.ink3 }}>%</Mono>
              </div>
              <Mono
                style={{
                  fontSize: 12.5,
                  color: p.ink3,
                  marginTop: 8,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  display: "block",
                }}
              >
                Taux de présence
              </Mono>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                flexShrink: 0,
              }}
            >
              <Tile p={p} label="OK" value={summary.present} accent={p.sem.ok} />
              <Tile p={p} label="ABS" value={absences} accent={p.sem.bad} />
            </div>
          </div>
        </AppCard>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            marginTop: 12,
            paddingBottom: 4,
          }}
        >
          <Chip
            p={p}
            active={status === "all"}
            onClick={() => setStatus("all")}
          >
            Tous
          </Chip>
          {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map(
            (k) => (
              <Chip
                key={k}
                p={p}
                active={status === k}
                onClick={() => setStatus(k as StatusKey)}
              >
                {STATUS_LABELS[k]}
              </Chip>
            )
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            marginTop: 8,
            paddingBottom: 4,
          }}
        >
          {(["30", "semester", "all"] as PeriodKey[]).map((k) => (
            <Chip
              key={k}
              p={p}
              active={period === k}
              onClick={() => setPeriod(k)}
            >
              {k === "30" ? "30 jours" : k === "semester" ? "Semestre" : "Tout"}
            </Chip>
          ))}
        </div>

        <AppSectionLabel p={p}>
          {filtered.length} SÉANCE{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUNE SÉANCE</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((r, i) => {
              const date = new Date(r.date);
              const dateValid = !Number.isNaN(date.getTime());
              const s = r.status.toLowerCase();
              const color =
                s.includes("present")
                  ? p.sem.ok
                  : s.includes("absent")
                  ? p.sem.bad
                  : s.includes("late") || s.includes("pending")
                  ? p.sem.warn
                  : p.ink3;
              const label =
                STATUS_LABELS[s as keyof typeof STATUS_LABELS] ?? r.status;
              return (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderBottom:
                      i === filtered.length - 1
                        ? "none"
                        : `1px solid ${p.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 36,
                      borderRadius: 2,
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      {r.subject_name}
                    </div>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {dateValid
                        ? date.toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          })
                        : "—"}
                      {r.location ? ` · ${r.location}` : ""}
                      {r.class_name ? ` · ${r.class_name}` : ""}
                    </Mono>
                  </div>
                  <Mono
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color,
                      letterSpacing: 0.5,
                      flexShrink: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </Mono>
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={(target) => {
            const map: Record<string, string> = {
              home: "/student",
              grades: "/student/grades",
              planning: "/student/schedule",
              devoirs: "/student/devoirs",
            };
            router.push(map[target] ?? "/student");
          }}
        />
      )}
    </PageShell>
  );
}

function Chip({
  p,
  active,
  onClick,
  children,
}: {
  p: ReturnType<typeof useTheme>["palette"];
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 12px",
        borderRadius: 999,
        background: active ? p.accent : p.surface,
        border: `1px solid ${active ? "transparent" : p.border}`,
        color: active ? (p.dark ? "#0E0E10" : "#FFFFFF") : p.ink2,
        fontFamily: p.font.mono,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function Tile({
  p,
  label,
  value,
  accent,
}: {
  p: ReturnType<typeof useTheme>["palette"];
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      style={{
        background: p.chip,
        border: `1px solid ${p.border}`,
        borderRadius: 10,
        padding: "8px 12px",
        minWidth: 64,
        textAlign: "center",
      }}
    >
      <Mono
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: accent,
          letterSpacing: -0.3,
          display: "block",
          lineHeight: 1,
        }}
      >
        {value}
      </Mono>
      <Mono
        style={{
          fontSize: 10.5,
          color: p.ink3,
          letterSpacing: 0.5,
          marginTop: 4,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Mono>
    </div>
  );
}
