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
import type { ProgramSummary } from "./AcademicHeadHomeClient";

type Props = {
  programs: ProgramSummary[];
  error: string | null;
};

export function AcademicHeadReportsClient({ programs, error }: Props) {
  const { palette: p } = useTheme();

  const totalStudents = programs.reduce((sum, x) => sum + x.students, 0);
  const totalClasses = programs.reduce((sum, x) => sum + x.classes, 0);

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
            BERLINER · RAPPORTS
          </Mono>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Synthèse pédagogique
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
                {programs.length}
              </Mono>{" "}
              progr.
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
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "12px 16px 110px" }}>
        <AppSectionLabel p={p}>DÉTAIL PAR PROGRAMME</AppSectionLabel>
        {error ? (
          <SectionEmpty p={p}>{error}</SectionEmpty>
        ) : programs.length === 0 ? (
          <SectionEmpty p={p}>AUCUN PROGRAMME ACTIF</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {programs.map((pr, i) => (
              <div
                key={pr.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderBottom:
                    i === programs.length - 1
                      ? "none"
                      : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 44,
                    borderRadius: 2,
                    background: p.accent,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      letterSpacing: -0.2,
                    }}
                  >
                    {pr.name}
                  </div>
                  <Mono
                    style={{
                      fontSize: 11,
                      color: p.ink3,
                      letterSpacing: 0.3,
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {pr.classes} classe{pr.classes > 1 ? "s" : ""} · {pr.students} élève
                    {pr.students > 1 ? "s" : ""}
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
                  {pr.students}
                </Mono>
              </div>
            ))}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}
