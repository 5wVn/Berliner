"use client";

import { useState } from "react";
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
  AttendanceOverview,
  GradeDistributionBucket,
} from "@/shared/lib/academicHeadData";

type Props = {
  attendance: AttendanceOverview | null;
  attendanceError: string | null;
  distribution: GradeDistributionBucket[] | null;
  distributionError: string | null;
};

export function AcademicHeadAnalyticsClient({
  attendance,
  attendanceError,
  distribution,
  distributionError,
}: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();

  const distList = distribution ?? [];
  const totalGrades = distList.reduce((s, b) => s + b.count, 0);

  const trend = attendance?.trend ?? "stable";
  const trendValue = attendance?.trend_value ?? 0;
  const trendColor =
    trend === "up" ? p.sem.ok : trend === "down" ? p.sem.bad : p.ink3;
  const trendSymbol = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <AppHeader
        p={p}
        kicker="BERLINER · ANALYTIQUE"
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title="Analytique"
        subtitle={
          <span style={{ color: p.ink3 }}>
            Vue d&apos;ensemble présence & performance.
          </span>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* Attendance card */}
        <AppSectionLabel p={p}>TAUX DE PRÉSENCE GLOBAL</AppSectionLabel>
        {attendanceError ? (
          <SectionEmpty p={p}>
            ERREUR · {attendanceError.toUpperCase()}
          </SectionEmpty>
        ) : attendance ? (
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
                      color:
                        attendance.rate >= 85
                          ? p.sem.ok
                          : attendance.rate >= 70
                          ? p.ink
                          : p.sem.bad,
                      letterSpacing: -1,
                      lineHeight: 1,
                    }}
                  >
                    {attendance.rate.toFixed(1)}
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
                  Présence cumulée
                </Mono>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  background: p.chip,
                  border: `1px solid ${p.border}`,
                  borderRadius: 999,
                  color: trendColor,
                }}
              >
                <Mono
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                  }}
                >
                  {trendSymbol} {trendValue.toFixed(1)} pt
                </Mono>
              </div>
            </div>
          </AppCard>
        ) : (
          <SectionEmpty p={p}>AUCUNE DONNÉE</SectionEmpty>
        )}

        {/* Distribution */}
        <AppSectionLabel p={p}>
          DISTRIBUTION DES NOTES{" "}
          {totalGrades > 0 ? `· ${totalGrades} note${totalGrades > 1 ? "s" : ""}` : ""}
        </AppSectionLabel>
        {distributionError ? (
          <SectionEmpty p={p}>
            ERREUR · {distributionError.toUpperCase()}
          </SectionEmpty>
        ) : totalGrades === 0 ? (
          <SectionEmpty p={p}>PAS ASSEZ DE NOTES POUR L’INSTANT</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {distList.map((b, i) => {
              const color = bucketColor(b.range, p);
              return (
                <div
                  key={b.range}
                  style={{
                    padding: "12px 14px",
                    borderBottom:
                      i === distList.length - 1
                        ? "none"
                        : `1px solid ${p.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Mono
                      style={{
                        fontSize: 13.5,
                        color: p.ink2,
                        letterSpacing: 0.4,
                        fontWeight: 700,
                      }}
                    >
                      {b.range}
                    </Mono>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {b.count} · {b.percentage}%
                    </Mono>
                  </div>
                  <div
                    style={{
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
                </div>
              );
            })}
          </AppCard>
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
