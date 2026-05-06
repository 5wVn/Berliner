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
import type { SubjectWithGrades } from "@/shared/lib/studentData";

type Props = {
  subject: SubjectWithGrades | null;
  average: number | null;
  error: string | null;
};

export function StudentSubjectGradesClient({ subject, average, error }: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();

  const sortedGrades = subject
    ? [...subject.grades].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  const avgColor =
    average == null
      ? p.ink3
      : average >= 14
      ? p.sem.ok
      : average < 10
      ? p.sem.bad
      : p.ink;

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <AppHeader
        p={p}
        kicker={
          <span
            onClick={() => router.push("/student/grades")}
            style={{ cursor: "pointer" }}
          >
            ‹ NOTES
          </span>
        }
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title={subject?.name ?? "Matière"}
        subtitle={
          subject?.teacher ? (
            <span>
              <Mono style={{ color: p.ink3 }}>Enseignant : </Mono>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {subject.teacher}
              </Mono>
            </span>
          ) : undefined
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : !subject ? (
          <SectionEmpty p={p}>MATIÈRE INTROUVABLE</SectionEmpty>
        ) : (
          <>
            {/* Average card */}
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
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                  >
                    <Mono
                      style={{
                        fontSize: 44,
                        fontWeight: 600,
                        color: avgColor,
                        letterSpacing: -1,
                        lineHeight: 1,
                      }}
                    >
                      {average !== null ? average.toFixed(2) : "—"}
                    </Mono>
                    <Mono style={{ fontSize: 18, color: p.ink3 }}>/20</Mono>
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
                    Moyenne pondérée · {subject.grades.length} éval.
                  </Mono>
                </div>
              </div>
            </AppCard>

            <AppSectionLabel p={p}>HISTORIQUE</AppSectionLabel>

            {sortedGrades.length === 0 ? (
              <SectionEmpty p={p}>AUCUNE NOTE</SectionEmpty>
            ) : (
              <AppCard p={p}>
                {sortedGrades.map((g, i) => {
                  const note20 = (g.value / Math.max(g.max, 1)) * 20;
                  const color =
                    note20 >= 16
                      ? p.sem.ok
                      : note20 >= 10
                      ? p.ink
                      : p.sem.bad;
                  return (
                    <div
                      key={g.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        borderBottom:
                          i === sortedGrades.length - 1
                            ? "none"
                            : `1px solid ${p.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 3,
                          height: 30,
                          borderRadius: 2,
                          background: color,
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
                          {g.label}
                        </div>
                        <Mono
                          style={{
                            fontSize: 12.5,
                            color: p.ink3,
                            letterSpacing: 0.3,
                          }}
                        >
                          {new Date(g.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · coef. {g.coefficient}
                        </Mono>
                      </div>
                      <Mono
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          letterSpacing: -0.3,
                          color,
                        }}
                      >
                        {g.value}
                      </Mono>
                      <Mono style={{ fontSize: 13, color: p.ink4 }}>
                        /{g.max}
                      </Mono>
                    </div>
                  );
                })}
              </AppCard>
            )}
          </>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={(target) => {
            const map: Record<string, string> = {
              home: "/student",
              grades: "/student/grades",
              planning: "/student/schedule",
              devoirs: "/student/devoirs",
            };
            router.push(map[target] ?? "/student");
          }}
        />
      )}
    </PageShell>
  );
}
