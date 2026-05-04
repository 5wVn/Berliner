"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { ditherGradient } from "@/shared/design/tokens";
import { GlobalAnimations, Mono, ScrollFade } from "@/shared/design/primitives";

export type AcademicHeadKPIs = {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  global_average: number | null;
};

export type AttendanceOverview = {
  rate: number;
  trend: "up" | "down" | "stable";
  trend_value: number;
};

export type GradeDistributionBucket = {
  range: string;
  count: number;
  percentage: number;
};

export type ProgramSummary = {
  id: string;
  name: string;
  students: number;
  classes: number;
};

type Props = {
  userName: string;
  kpis: AcademicHeadKPIs | null;
  kpisError: string | null;
  overview: AttendanceOverview | null;
  overviewError: string | null;
  distribution: GradeDistributionBucket[] | null;
  distributionError: string | null;
  programs: ProgramSummary[] | null;
  programsError: string | null;
};

export function AcademicHeadHomeClient({
  userName,
  kpis,
  kpisError,
  overview,
  overviewError,
  distribution,
  distributionError,
  programs,
  programsError,
}: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const firstName = userName.split(" ")[0] || "toi";

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
              marginBottom: 12,
            }}
          >
            BERLINER · PILOTAGE
          </Mono>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Bonjour <span style={{ color: p.accent }}>{firstName}</span>.
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
                {kpis?.total_students ?? "—"}
              </Mono>{" "}
              élèves
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {kpis?.total_teachers ?? "—"}
              </Mono>{" "}
              profs
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {kpis?.global_average != null
                  ? kpis.global_average.toFixed(1)
                  : "—"}
              </Mono>
              /20
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        <AppSectionLabel p={p}>INDICATEURS CLÉS</AppSectionLabel>
        {kpisError ? (
          <SectionEmpty p={p}>{kpisError}</SectionEmpty>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Tile p={p} label="Élèves" value={kpis?.total_students ?? 0} sub="inscrits" />
            <Tile p={p} label="Profs" value={kpis?.total_teachers ?? 0} sub="actifs" />
            <Tile p={p} label="Classes" value={kpis?.total_classes ?? 0} sub="ouvertes" />
            <Tile
              p={p}
              label="Moyenne"
              value={kpis?.global_average != null ? kpis.global_average.toFixed(1) : "—"}
              sub="globale /20"
              accent
            />
          </div>
        )}

        <AppSectionLabel
          p={p}
          action="Détails"
          onAction={() => router.push("/academic-head/analytics")}
        >
          PRÉSENCE GLOBALE
        </AppSectionLabel>
        {overviewError ? (
          <SectionEmpty p={p}>{overviewError}</SectionEmpty>
        ) : !overview ? (
          <SectionEmpty p={p}>—</SectionEmpty>
        ) : (
          <AppCard
            p={p}
            style={{ padding: "16px 18px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              <Mono
                style={{
                  fontSize: 38,
                  fontWeight: 600,
                  color:
                    overview.rate >= 90
                      ? p.sem.ok
                      : overview.rate >= 80
                      ? p.sem.warn
                      : p.sem.bad,
                  letterSpacing: -1,
                  lineHeight: 1,
                }}
              >
                {overview.rate.toFixed(1)}
              </Mono>
              <Mono style={{ fontSize: 16, color: p.ink3 }}>%</Mono>
            </div>
            <Mono
              style={{
                fontSize: 11,
                color:
                  overview.trend === "up"
                    ? p.sem.ok
                    : overview.trend === "down"
                    ? p.sem.bad
                    : p.ink3,
                letterSpacing: 0.4,
                marginTop: 8,
                display: "block",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {overview.trend === "stable"
                ? "Stable vs mois dernier"
                : `${overview.trend === "up" ? "↑" : "↓"} ${overview.trend_value.toFixed(1)} pt vs mois dernier`}
            </Mono>
          </AppCard>
        )}

        <AppSectionLabel
          p={p}
          action="Analytique"
          onAction={() => router.push("/academic-head/analytics")}
        >
          DISTRIBUTION DES NOTES
        </AppSectionLabel>
        {distributionError ? (
          <SectionEmpty p={p}>{distributionError}</SectionEmpty>
        ) : !distribution ||
          distribution.length === 0 ||
          distribution.every((b) => b.count === 0) ? (
          <SectionEmpty p={p}>PAS ENCORE ASSEZ DE NOTES</SectionEmpty>
        ) : (
          <AppCard p={p} style={{ padding: "14px 16px" }}>
            {distribution.map((b, i) => {
              const w = Math.min(100, Math.max(0, b.percentage));
              return (
                <div
                  key={b.range}
                  style={{
                    marginTop: i === 0 ? 0 : 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Mono
                      style={{
                        fontSize: 11,
                        color: p.ink2,
                        fontWeight: 600,
                        letterSpacing: 0.4,
                      }}
                    >
                      {b.range}
                    </Mono>
                    <Mono
                      style={{
                        fontSize: 11,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {b.count} · {b.percentage}%
                    </Mono>
                  </div>
                  <div
                    style={{
                      height: 6,
                      width: "100%",
                      background: p.dark ? p.surface2 : p.chip,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${w}%`,
                        background: p.accent,
                        borderRadius: 3,
                        transition: "width 240ms ease-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </AppCard>
        )}

        <AppSectionLabel
          p={p}
          action="Rapports"
          onAction={() => router.push("/academic-head/reports")}
        >
          PROGRAMMES
        </AppSectionLabel>
        {programsError ? (
          <SectionEmpty p={p}>{programsError}</SectionEmpty>
        ) : !programs || programs.length === 0 ? (
          <SectionEmpty p={p}>AUCUN PROGRAMME ACTIF</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {programs.slice(0, 6).map((pr, i, arr) => (
              <div
                key={pr.id}
                onClick={() => router.push("/academic-head/reports")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  cursor: "pointer",
                  borderBottom:
                    i === arr.length - 1
                      ? "none"
                      : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 36,
                    borderRadius: 2,
                    background: p.accent,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {pr.name}
                  </div>
                  <Mono
                    style={{
                      fontSize: 10.5,
                      color: p.ink3,
                      letterSpacing: 0.3,
                    }}
                  >
                    {pr.classes} classe{pr.classes > 1 ? "s" : ""} · {pr.students} élève
                    {pr.students > 1 ? "s" : ""}
                  </Mono>
                </div>
                <span style={{ color: p.ink3, fontSize: 18 }}>›</span>
              </div>
            ))}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}

function Tile({
  p,
  label,
  value,
  sub,
  accent,
}: {
  p: ReturnType<typeof useTheme>["palette"];
  label: string;
  value: string | number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: accent ? p.accentSoft : p.surface,
        border: `1px solid ${accent ? p.accent : p.border}`,
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <Mono
        style={{
          fontSize: 9.5,
          color: p.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 600,
        }}
      >
        {label}
      </Mono>
      <Mono
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: accent ? p.accent : p.ink,
          letterSpacing: -0.5,
          lineHeight: 1,
          display: "block",
          marginTop: 6,
        }}
      >
        {value}
      </Mono>
      <div style={{ fontSize: 10.5, color: p.ink4, marginTop: 4 }}>{sub}</div>
    </div>
  );
}
