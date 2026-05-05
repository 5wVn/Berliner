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
  hapticPing,
} from "@/shared/design/primitives";
import {
  NotifBellPill,
  NotificationsPanel,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";
import type { ApprenticeStudent } from "@/types/api";
import type {
  ApprenticeAttendance,
  ApprenticesAttendanceOverview,
} from "@/shared/lib/companyData";

type Props = {
  apprentices: ApprenticeStudent[];
  attendance: ApprenticesAttendanceOverview;
  error: string | null;
};

type StatusKey = "all" | "active" | "pending" | "ended";

export function CompanyApprenticesClient({
  apprentices,
  attendance,
  error,
}: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");

  const rateById = useMemo(() => {
    const m = new Map<string, number>();
    attendance.apprentices.forEach((a: ApprenticeAttendance) => m.set(a.id, a.rate));
    return m;
  }, [attendance]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apprentices.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = `${a.firstName} ${a.lastName} ${a.email ?? ""} ${a.className ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [apprentices, query, statusFilter]);

  const activeCount = apprentices.filter((a) => a.status === "active").length;

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <AppHeader
        p={p}
        kicker="BERLINER · APPRENTIS"
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title={
          <>
            <span style={{ color: p.accent }}>{apprentices.length}</span>{" "}
            apprentis
          </>
        }
        subtitle={
          <>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {activeCount}
              </Mono>{" "}
              actifs
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {attendance.global_rate}%
              </Mono>{" "}
              présence
            </span>
          </>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un apprenti..."
          style={{
            width: "100%",
            height: 44,
            background: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: 12,
            padding: "0 14px",
            fontSize: 15,
            fontFamily: p.font.sans,
            color: p.ink,
            outline: "none",
            marginTop: 4,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            marginTop: 10,
            paddingBottom: 4,
          }}
        >
          <Chip
            p={p}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            Tous
          </Chip>
          <Chip
            p={p}
            active={statusFilter === "active"}
            onClick={() => setStatusFilter("active")}
          >
            Actifs
          </Chip>
          <Chip
            p={p}
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          >
            En attente
          </Chip>
          <Chip
            p={p}
            active={statusFilter === "ended"}
            onClick={() => setStatusFilter("ended")}
          >
            Terminés
          </Chip>
        </div>

        <AppSectionLabel p={p}>
          {filtered.length} RÉSULTAT{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUN APPRENTI</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((a, i) => {
              const fullName = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() || "Apprenti";
              const initials =
                ((a.firstName?.[0] ?? "") + (a.lastName?.[0] ?? "")).toUpperCase() ||
                "?";
              const rate = rateById.get(a.studentId);
              const statusColor =
                a.status === "active"
                  ? p.sem.ok
                  : a.status === "pending"
                  ? p.sem.warn
                  : p.ink3;
              const statusLabel =
                a.status === "active"
                  ? "ACTIF"
                  : a.status === "pending"
                  ? "EN ATTENTE"
                  : "TERMINÉ";
              return (
                <div
                  key={a.apprenticeshipId}
                  onClick={(e) => hapticPing(e.currentTarget)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    cursor: "pointer",
                    borderBottom:
                      i === filtered.length - 1
                        ? "none"
                        : `1px solid ${p.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: p.accentSoft,
                      color: p.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: p.font.mono,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: -0.3,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      {fullName}
                    </div>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {a.className ?? "—"}
                    </Mono>
                  </div>
                  {rate !== undefined ? (
                    <Mono
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color:
                          rate >= 85
                            ? p.sem.ok
                            : rate >= 70
                            ? p.ink
                            : p.sem.bad,
                        letterSpacing: -0.3,
                        flexShrink: 0,
                      }}
                    >
                      {rate}%
                    </Mono>
                  ) : (
                    <Mono
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: statusColor,
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      {statusLabel}
                    </Mono>
                  )}
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={() => router.push("/company")}
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
