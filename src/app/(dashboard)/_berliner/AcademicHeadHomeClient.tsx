"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { ditherGradient } from "@/shared/design/tokens";
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
  AcademicHeadKPIs,
  AttendanceOverview,
  GradeDistributionBucket,
  ProgramSummary,
} from "@/shared/lib/academicHeadData";

type AcademicHeadHomeClientProps = {
  firstName: string;
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
  firstName,
  kpis,
  kpisError,
  overview,
  overviewError,
  distribution,
  distributionError,
  programs,
  programsError,
}: AcademicHeadHomeClientProps) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();

  const totalStudents = kpis?.total_students ?? 0;
  const totalTeachers = kpis?.total_teachers ?? 0;
  const totalClasses = kpis?.total_classes ?? 0;
  const globalAvg = kpis?.global_average ?? null;

  const distList = (distribution ?? []).slice();
  const programList = (programs ?? []).slice(0, 5);

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      {/* Header */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: p.font.mono,
              fontSize: 13,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <span>BERLINER · DIRECTION</span>
            <NotifBellPill
              p={p}
              unread={unreadCount}
              onClick={() => setShowNotifs(true)}
            />
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Salut <span style={{ color: p.accent }}>{firstName}</span>.
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 14,
              fontFamily: p.font.mono,
              fontSize: 13.5,
              color: p.ink3,
              letterSpacing: 0.3,
              flexWrap: "wrap",
            }}
          >
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {totalStudents}
              </Mono>{" "}
              élèves
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {totalTeachers}
              </Mono>{" "}
              profs
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {globalAvg != null ? globalAvg.toFixed(1) : "—"}
              </Mono>
              /20
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* === KPI tiles === */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          <KpiTile
            label="ÉLÈVES"
            value={String(totalStudents)}
            sub="inscrits"
            accent={p.accent}
            p={p}
          />
          <KpiTile
            label="ENSEIGNANTS"
            value={String(totalTeachers)}
            sub="actifs"
            accent={p.sem.info}
            p={p}
          />
          <KpiTile
            label="CLASSES"
            value={String(totalClasses)}
            sub="ouvertes"
            accent={p.sem.warn}
            p={p}
          />
          <KpiTile
            label="MOYENNE"
            value={globalAvg != null ? globalAvg.toFixed(1) : "—"}
            sub="globale /20"
            accent={
              globalAvg == null
                ? p.ink3
                : globalAvg >= 14
                ? p.sem.ok
                : globalAvg < 10
                ? p.sem.bad
                : p.accent
            }
            p={p}
          />
        </div>

        {kpisError && (
          <SectionEmpty p={p}>KPI · {kpisError.toUpperCase()}</SectionEmpty>
        )}

        {/* === Assiduité globale === */}
        {(overview || overviewError) && (
          <>
            <AppSectionLabel
              p={p}
              action="Analytique"
              onAction={() => router.push("/academic-head/analytics")}
            >
              ASSIDUITÉ GLOBALE
            </AppSectionLabel>
            {overviewError ? (
              <SectionEmpty p={p}>
                ERREUR · {overviewError.toUpperCase()}
              </SectionEmpty>
            ) : overview ? (
              <AppCard p={p}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Mono
                      style={{
                        fontSize: 32,
                        fontWeight: 600,
                        color:
                          overview.rate >= 85
                            ? p.sem.ok
                            : overview.rate >= 70
                            ? p.ink
                            : p.sem.bad,
                        letterSpacing: -0.6,
                        lineHeight: 1,
                        display: "block",
                      }}
                    >
                      {overview.rate.toFixed(1)}%
                    </Mono>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        marginTop: 6,
                        letterSpacing: 0.4,
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      Taux de présence
                    </Mono>
                  </div>
                  <TrendBadge
                    trend={overview.trend}
                    value={overview.trend_value}
                    p={p}
                  />
                </div>
              </AppCard>
            ) : null}
          </>
        )}

        {/* === Distribution des notes === */}
        {(distList.length > 0 || distributionError) && (
          <>
            <AppSectionLabel p={p}>DISTRIBUTION DES NOTES</AppSectionLabel>
            {distributionError ? (
              <SectionEmpty p={p}>
                ERREUR · {distributionError.toUpperCase()}
              </SectionEmpty>
            ) : (
              <AppCard p={p}>
                {distList.map((b, i) => {
                  const color = bucketColor(b.range, p);
                  return (
                    <div
                      key={b.range}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        borderBottom:
                          i === distList.length - 1
                            ? "none"
                            : `1px solid ${p.border}`,
                      }}
                    >
                      <Mono
                        style={{
                          fontSize: 13,
                          color: p.ink2,
                          letterSpacing: 0.4,
                          width: 56,
                          fontWeight: 600,
                        }}
                      >
                        {b.range}
                      </Mono>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: p.chip,
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(b.percentage, 2)}%`,
                            height: "100%",
                            background: color,
                            borderRadius: 4,
                          }}
                        />
                      </div>
                      <Mono
                        style={{
                          fontSize: 13,
                          color: p.ink2,
                          width: 44,
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {b.percentage}%
                      </Mono>
                    </div>
                  );
                })}
              </AppCard>
            )}
          </>
        )}

        {/* === Programmes === */}
        {(programList.length > 0 || programsError) && (
          <>
            <AppSectionLabel
              p={p}
              action="Rapports"
              onAction={() => router.push("/academic-head/reports")}
            >
              PROGRAMMES
            </AppSectionLabel>
            {programsError ? (
              <SectionEmpty p={p}>
                ERREUR · {programsError.toUpperCase()}
              </SectionEmpty>
            ) : (
              <AppCard p={p}>
                {programList.map((it, i) => (
                  <div
                    key={it.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      borderBottom:
                        i === programList.length - 1
                          ? "none"
                          : `1px solid ${p.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 32,
                        borderRadius: 2,
                        background: p.accent,
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
                        {it.name}
                      </div>
                      <Mono
                        style={{
                          fontSize: 12.5,
                          color: p.ink3,
                          letterSpacing: 0.3,
                        }}
                      >
                        {it.classes} classe{it.classes > 1 ? "s" : ""}
                      </Mono>
                    </div>
                    <Mono
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: p.ink,
                        letterSpacing: -0.3,
                      }}
                    >
                      {it.students}
                    </Mono>
                    <Mono style={{ fontSize: 12, color: p.ink4 }}>élv.</Mono>
                  </div>
                ))}
              </AppCard>
            )}
          </>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={() => router.push("/academic-head")}
        />
      )}
    </PageShell>
  );
}

function bucketColor(
  range: string,
  p: ReturnType<typeof useTheme>["palette"]
): string {
  if (range.startsWith("≥") || range === "14-16") return p.sem.ok;
  if (range === "12-14" || range === "10-12") return p.accent;
  return p.sem.bad;
}

function TrendBadge({
  trend,
  value,
  p,
}: {
  trend: "up" | "down" | "stable";
  value: number;
  p: ReturnType<typeof useTheme>["palette"];
}) {
  const color =
    trend === "up" ? p.sem.ok : trend === "down" ? p.sem.bad : p.ink3;
  const symbol = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        background: p.chip,
        border: `1px solid ${p.border}`,
        borderRadius: 999,
        color,
      }}
    >
      <Mono style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.4 }}>
        {symbol} {value.toFixed(1)} pt
      </Mono>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  accent,
  p,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  p: ReturnType<typeof useTheme>["palette"];
}) {
  return (
    <div
      style={{
        background: p.surface,
        border: `1px solid ${p.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 24,
          height: 3,
          borderRadius: 2,
          background: accent,
          marginBottom: 10,
        }}
      />
      <Mono
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: p.ink,
          letterSpacing: -0.5,
          lineHeight: 1,
          display: "block",
        }}
      >
        {value}
      </Mono>
      <div
        style={{
          fontFamily: p.font.mono,
          fontSize: 11.5,
          color: p.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginTop: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12.5, color: p.ink4, marginTop: 1 }}>{sub}</div>
    </div>
  );
}
