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
import type { TeacherClassSummary } from "@/shared/lib/teacherData";

type Props = {
  classes: TeacherClassSummary[];
  error: string | null;
};

export function TeacherClassesClient({ classes, error }: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();
  const [query, setQuery] = useState("");
  const [onlyUpcoming, setOnlyUpcoming] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes.filter((c) => {
      if (onlyUpcoming && !c.next_session_at) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q);
    });
  }, [classes, query, onlyUpcoming]);

  const totalStudents = classes.reduce((s, c) => s + c.student_count, 0);

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <AppHeader
        p={p}
        kicker="BERLINER · CLASSES"
        kickerRight={
          <NotifBellPill
            p={p}
            unread={unreadCount}
            onClick={() => setShowNotifs(true)}
          />
        }
        title={
          <>
            Mes <span style={{ color: p.accent }}>classes</span>
          </>
        }
        subtitle={
          <>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {classes.length}
              </Mono>{" "}
              groupes
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {totalStudents}
              </Mono>{" "}
              élèves suivis
            </span>
          </>
        }
      />

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une classe..."
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
            active={!onlyUpcoming}
            onClick={() => setOnlyUpcoming(false)}
          >
            Toutes
          </Chip>
          <Chip
            p={p}
            active={onlyUpcoming}
            onClick={() => setOnlyUpcoming(true)}
          >
            Avec prochain cours
          </Chip>
        </div>

        <AppSectionLabel
          p={p}
          action="Planning"
          onAction={() => router.push("/teacher/schedule")}
        >
          {filtered.length} CLASSE{filtered.length > 1 ? "S" : ""}
        </AppSectionLabel>

        {error ? (
          <SectionEmpty p={p}>ERREUR · {error.toUpperCase()}</SectionEmpty>
        ) : filtered.length === 0 ? (
          <SectionEmpty p={p}>AUCUNE CLASSE</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {filtered.map((c, i) => {
              const next = c.next_session_at ? new Date(c.next_session_at) : null;
              const nextValid = next && !Number.isNaN(next.getTime());
              return (
                <div
                  key={c.id}
                  onClick={(e) => {
                    hapticPing(e.currentTarget);
                    router.push("/teacher/schedule");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    cursor: "pointer",
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
                      background: nextValid ? p.accent : p.ink4,
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
                      {c.name}
                    </div>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {c.student_count} élève{c.student_count > 1 ? "s" : ""}
                      {c.subject_count !== undefined
                        ? ` · ${c.subject_count} matière${c.subject_count > 1 ? "s" : ""}`
                        : ""}
                      {nextValid
                        ? ` · ${next!.toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          })} ${next!.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : " · pas de prochain cours"}
                    </Mono>
                  </div>
                  <span style={{ color: p.ink3, fontSize: 20 }}>›</span>
                </div>
              );
            })}
          </AppCard>
        )}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={(target) => {
            const map: Record<string, string> = {
              home: "/teacher",
              grades: "/teacher/grades",
              planning: "/teacher/schedule",
              devoirs: "/teacher/devoirs",
            };
            router.push(map[target] ?? "/teacher");
          }}
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
