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
import type { ProgramSummary } from "@/shared/lib/academicHeadData";

type Props = {
  programs: ProgramSummary[];
  error: string | null;
};

export function AcademicHeadReportsClient({ programs, error }: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();

  const totalStudents = programs.reduce((s, prog) => s + prog.students, 0);
  const totalClasses = programs.reduce((s, prog) => s + prog.classes, 0);
  const maxStudents = programs.reduce((m, prog) => Math.max(m, prog.students), 0);

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <AppHeader
        p={p}
        kicker="BERLINER · RAPPORTS"
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title="Rapports"
        subtitle={
          <>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {programs.length}
              </Mono>{" "}
              programmes
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {totalClasses}
              </Mono>{" "}
              classes
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {totalStudents}
              </Mono>{" "}
              élèves
            </span>
          </>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        <AppSectionLabel p={p}>DÉTAIL PAR PROGRAMME</AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : programs.length === 0 ? (
          <SectionEmpty p={p}>AUCUN PROGRAMME ACTIF</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {programs.map((prog, i) => {
              const ratio = maxStudents > 0 ? (prog.students / maxStudents) * 100 : 0;
              return (
                <div
                  key={prog.id}
                  style={{
                    padding: "13px 14px",
                    borderBottom:
                      i === programs.length - 1
                        ? "none"
                        : `1px solid ${p.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          lineHeight: 1.2,
                        }}
                      >
                        {prog.name}
                      </div>
                      <Mono
                        style={{
                          fontSize: 12.5,
                          color: p.ink3,
                          letterSpacing: 0.3,
                        }}
                      >
                        {prog.classes} classe{prog.classes > 1 ? "s" : ""}
                      </Mono>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <Mono
                        style={{
                          fontSize: 22,
                          fontWeight: 600,
                          color: p.ink,
                          letterSpacing: -0.4,
                        }}
                      >
                        {prog.students}
                      </Mono>
                      <Mono style={{ fontSize: 12.5, color: p.ink4 }}>élv.</Mono>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: p.chip,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(ratio, 3)}%`,
                        height: "100%",
                        background: p.accent,
                        borderRadius: 3,
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
