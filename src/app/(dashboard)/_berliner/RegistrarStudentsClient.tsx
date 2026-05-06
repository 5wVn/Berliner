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
import type { RegistrarStudent } from "@/types/api";

type Status = "all" | "active" | "pending" | "inactive";

type Props = {
  students: RegistrarStudent[];
  error: string | null;
};

export function RegistrarStudentsClient({ students, error }: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<Status>("all");

  const classes = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (classFilter !== "all" && s.className !== classFilter) return false;
      if (statusFilter !== "all" && s.enrollmentStatus !== statusFilter)
        return false;
      if (!q) return true;
      const haystack = `${s.firstName} ${s.lastName} ${s.email ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [students, query, classFilter, statusFilter]);

  const activeCount = students.filter((s) => s.enrollmentStatus === "active").length;
  const pendingCount = students.filter((s) => s.enrollmentStatus === "pending").length;

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <AppHeader
        p={p}
        kicker="BERLINER · ÉTUDIANTS"
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title={
          <>
            <span style={{ color: p.accent }}>{students.length}</span> étudiants
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
                {pendingCount}
              </Mono>{" "}
              en attente
            </span>
          </>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* Search input */}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un étudiant, un email..."
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

        {/* Filter chips */}
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
            active={statusFilter === "inactive"}
            onClick={() => setStatusFilter("inactive")}
          >
            Inactifs
          </Chip>
        </div>

        {/* Class filter chips */}
        {classes.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              marginTop: 8,
              paddingBottom: 4,
            }}
          >
            <Chip
              p={p}
              active={classFilter === "all"}
              onClick={() => setClassFilter("all")}
            >
              Toutes classes
            </Chip>
            {classes.map((c) => (
              <Chip
                key={c}
                p={p}
                active={classFilter === c}
                onClick={() => setClassFilter(c)}
              >
                {c}
              </Chip>
            ))}
          </div>
        )}

        <AppSectionLabel p={p}>
          {filtered.length} RÉSULTAT{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUN ÉTUDIANT</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((s, i) => {
              const fullName = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "Étudiant";
              const initials =
                ((s.firstName?.[0] ?? "") + (s.lastName?.[0] ?? "")).toUpperCase() ||
                "?";
              const status = (s.enrollmentStatus ?? "").toLowerCase();
              const statusColor =
                status === "active"
                  ? p.sem.ok
                  : status === "pending"
                  ? p.sem.warn
                  : p.ink3;
              const statusLabel =
                status === "active"
                  ? "ACTIF"
                  : status === "pending"
                  ? "EN ATTENTE"
                  : status === "inactive"
                  ? "INACTIF"
                  : "—";
              return (
                <div
                  key={s.id}
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {s.className ?? "Sans classe"} · {s.email}
                    </Mono>
                  </div>
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
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={() => router.push("/registrar")}
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
