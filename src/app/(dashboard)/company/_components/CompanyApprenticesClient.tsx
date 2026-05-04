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
import type {
  ApprenticeStudent,
  ApprenticesAttendanceOverview,
} from "./CompanyHomeClient";

type Props = {
  apprentices: ApprenticeStudent[];
  attendance: ApprenticesAttendanceOverview;
  error: string | null;
};

const initials = (a: ApprenticeStudent) =>
  `${a.firstName.charAt(0)}${a.lastName.charAt(0)}`.toUpperCase() || "?";

export function CompanyApprenticesClient({
  apprentices,
  attendance,
  error,
}: Props) {
  const { palette: p } = useTheme();
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");

  const rateById = useMemo(() => {
    const m = new Map<string, number>();
    attendance.apprentices.forEach((a) => m.set(a.id, a.rate));
    return m;
  }, [attendance.apprentices]);

  const classes = useMemo(() => {
    const set = new Set<string>();
    apprentices.forEach((a) => {
      if (a.className) set.add(a.className);
    });
    return ["all", ...Array.from(set)];
  }, [apprentices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apprentices.filter((a) => {
      if (classFilter !== "all" && a.className !== classFilter) return false;
      if (!q) return true;
      const haystack = `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [apprentices, query, classFilter]);

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
            BERLINER · APPRENTIS
          </Mono>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Mes apprentis
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
                {apprentices.length}
              </Mono>{" "}
              total
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {attendance.global_rate}%
              </Mono>{" "}
              prés.
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "12px 16px 110px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un apprenti…"
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
          {classes.length > 1 && (
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
              {classes.map((c) => {
                const active = c === classFilter;
                return (
                  <span
                    key={c}
                    onClick={() => setClassFilter(c)}
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
                    {c === "all" ? "Tous" : c}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <AppSectionLabel p={p}>
          {filtered.length} APPRENTI{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>{error}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUN APPRENTI NE CORRESPOND</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((a, i) => {
              const rate = rateById.get(a.studentId);
              const c =
                rate == null
                  ? p.ink3
                  : rate >= 90
                  ? p.sem.ok
                  : rate >= 75
                  ? p.sem.warn
                  : p.sem.bad;
              return (
                <div
                  key={a.apprenticeshipId}
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
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      background: p.accentSoft,
                      color: p.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: p.font.mono,
                      fontSize: 13,
                      fontWeight: 600,
                      border: `1px solid ${p.border}`,
                      flexShrink: 0,
                    }}
                  >
                    {initials(a)}
                  </div>
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
                      {a.firstName} {a.lastName}
                    </div>
                    <Mono
                      style={{
                        fontSize: 10.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {a.className ?? "—"} · {a.email}
                    </Mono>
                  </div>
                  {rate != null && (
                    <Mono
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: c,
                        letterSpacing: -0.3,
                        flexShrink: 0,
                      }}
                    >
                      {rate}%
                    </Mono>
                  )}
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}
