"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { ditherGradient } from "@/shared/design/tokens";
import { GlobalAnimations, Mono, ScrollFade } from "@/shared/design/primitives";
import type { RegistrarStudent } from "@/types/api";

type Props = {
  students: RegistrarStudent[];
  error: string | null;
};

const statusLabel = (status: string | null) => {
  if (!status) return "—";
  const s = status.toLowerCase();
  if (s === "active") return "Actif";
  if (s === "pending") return "En attente";
  if (s === "inactive") return "Inactif";
  return status;
};

export function RegistrarStudentsClient({ students, error }: Props) {
  const { palette: p } = useTheme();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const statuses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.enrollmentStatus) set.add(s.enrollmentStatus);
    });
    return ["all", ...Array.from(set)];
  }, [students]);

  const activeCount = students.filter((s) => s.enrollmentStatus === "active").length;
  const pendingCount = students.filter((s) => s.enrollmentStatus === "pending").length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (statusFilter !== "all" && s.enrollmentStatus !== statusFilter)
        return false;
      if (!q) return true;
      const haystack = `${s.firstName} ${s.lastName} ${s.email ?? ""} ${s.className ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [students, query, statusFilter]);

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <div
        style={{
          padding: "14px 20px 8px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!p.dark && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 160,
              ...ditherGradient({ fg: p.accent, alpha: 0.4 }),
              maskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        )}
        <div style={{ position: "relative" }}>
          <Mono
            style={{
              fontSize: 11,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 10,
            }}
          >
            BERLINER · ANNUAIRE
          </Mono>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Étudiants
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 14,
              fontFamily: p.font.mono,
              fontSize: 11.5,
              color: p.ink3,
              letterSpacing: 0.3,
            }}
          >
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {students.length}
              </Mono>{" "}
              total
            </span>
            <span>
              <Mono style={{ color: p.sem.ok, fontWeight: 600 }}>
                {activeCount}
              </Mono>{" "}
              actifs
            </span>
            <span>
              <Mono style={{ color: p.sem.warn, fontWeight: 600 }}>
                {pendingCount}
              </Mono>{" "}
              en attente
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "12px 16px 110px" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            flexDirection: "column",
          }}
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un nom, un email…"
            style={{
              padding: "11px 14px",
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              color: p.ink,
              fontFamily: p.font.sans,
              fontSize: 14,
              outline: "none",
              width: "100%",
            }}
          />
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {statuses.map((s) => {
              const active = s === statusFilter;
              return (
                <span
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: active ? p.accent : p.surface,
                    color: active ? (p.dark ? "#0E0E10" : "#FFF") : p.ink2,
                    border: `1px solid ${active ? p.accent : p.border}`,
                    fontFamily: p.font.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {s === "all" ? "Tous" : statusLabel(s)}
                </span>
              );
            })}
          </div>
        </div>

        <AppSectionLabel p={p}>
          {filtered.length} ÉLÈVE{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>{error}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUN ÉLÈVE NE CORRESPOND</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((s, i) => {
              const fullName =
                `${s.firstName} ${s.lastName}`.trim() || "Étudiant";
              const status = (s.enrollmentStatus ?? "").toLowerCase();
              const statusColor =
                status === "active"
                  ? p.sem.ok
                  : status === "pending"
                  ? p.sem.warn
                  : p.ink3;
              return (
                <div
                  key={s.id}
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
                      height: 38,
                      borderRadius: 2,
                      background: statusColor,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {fullName}
                    </div>
                    <Mono
                      style={{
                        fontSize: 10.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {s.email ?? "—"}
                      {s.className ? ` · ${s.className}` : ""}
                    </Mono>
                  </div>
                  <Mono
                    style={{
                      fontSize: 10,
                      color: statusColor,
                      fontWeight: 600,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {statusLabel(s.enrollmentStatus)}
                  </Mono>
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}
