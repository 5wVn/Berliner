"use client";

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
  AttendanceOverview,
  GradeDistributionBucket,
} from "./AcademicHeadHomeClient";

type Props = {
  overview: AttendanceOverview | null;
  overviewError: string | null;
  distribution: GradeDistributionBucket[] | null;
  distributionError: string | null;
};

export function AcademicHeadAnalyticsClient({
  overview,
  overviewError,
  distribution,
  distributionError,
}: Props) {
  const { palette: p } = useTheme();

  const rate = overview?.rate ?? 0;
  const rateColor =
    rate >= 90 ? p.sem.ok : rate >= 80 ? p.sem.warn : p.sem.bad;

  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const dash = (Math.min(100, Math.max(0, rate)) / 100) * circ;

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
            BERLINER · ANALYTIQUE
          </Mono>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Analyse pédagogique
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "12px 16px 110px" }}>
        <AppSectionLabel p={p}>TAUX DE PRÉSENCE</AppSectionLabel>
        {overviewError ? (
          <SectionEmpty p={p}>{overviewError}</SectionEmpty>
        ) : !overview ? (
          <SectionEmpty p={p}>AUCUNE DONNÉE</SectionEmpty>
        ) : (
          <AppCard p={p} style={{ padding: "20px 18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <svg
                width={140}
                height={140}
                viewBox="0 0 140 140"
                style={{ flexShrink: 0 }}
              >
                <circle
                  cx={70}
                  cy={70}
                  r={radius}
                  fill="none"
                  stroke={p.dark ? p.surface2 : p.chip}
                  strokeWidth={10}
                />
                <circle
                  cx={70}
                  cy={70}
                  r={radius}
                  fill="none"
                  stroke={rateColor}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ}`}
                  transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dasharray 320ms ease-out" }}
                />
                <text
                  x={70}
                  y={70}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={p.ink}
                  fontFamily={p.font.mono}
                  fontSize={26}
                  fontWeight={600}
                  letterSpacing={-1}
                >
                  {rate.toFixed(1)}%
                </text>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Mono
                  style={{
                    fontSize: 10.5,
                    color: p.ink3,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Tendance
                </Mono>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color:
                      overview.trend === "up"
                        ? p.sem.ok
                        : overview.trend === "down"
                        ? p.sem.bad
                        : p.ink2,
                    marginTop: 4,
                    letterSpacing: -0.3,
                  }}
                >
                  {overview.trend === "stable"
                    ? "Stable"
                    : `${overview.trend === "up" ? "↑" : "↓"} ${overview.trend_value.toFixed(1)} pt`}
                </div>
                <Mono
                  style={{
                    fontSize: 11,
                    color: p.ink3,
                    marginTop: 4,
                    letterSpacing: 0.3,
                    display: "block",
                  }}
                >
                  vs. mois dernier
                </Mono>
              </div>
            </div>
          </AppCard>
        )}

        <AppSectionLabel p={p}>DISTRIBUTION DES NOTES</AppSectionLabel>
        {distributionError ? (
          <SectionEmpty p={p}>{distributionError}</SectionEmpty>
        ) : !distribution ||
          distribution.length === 0 ||
          distribution.every((b) => b.count === 0) ? (
          <SectionEmpty p={p}>PAS ENCORE ASSEZ DE NOTES</SectionEmpty>
        ) : (
          <AppCard p={p} style={{ padding: "16px 18px" }}>
            {distribution.map((b, i) => {
              const w = Math.min(100, Math.max(0, b.percentage));
              return (
                <div
                  key={b.range}
                  style={{ marginTop: i === 0 ? 0 : 14 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <Mono
                      style={{
                        fontSize: 12,
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
                      {b.count} note{b.count > 1 ? "s" : ""} · {b.percentage}%
                    </Mono>
                  </div>
                  <div
                    style={{
                      height: 8,
                      width: "100%",
                      background: p.dark ? p.surface2 : p.chip,
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${w}%`,
                        background: p.accent,
                        borderRadius: 4,
                        transition: "width 280ms ease-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}
