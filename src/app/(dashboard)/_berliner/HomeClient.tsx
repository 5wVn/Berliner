"use client";

import { useMemo, useState } from "react";
import { type BerlinerState } from "@/actions/berliner-state";
import { computeGlobalAverage } from "@/shared/lib/berliner-stats";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { colorFor, ditherGradient, localISO, relDue } from "@/shared/design/tokens";
import { GlobalAnimations, Mono, ScrollFade, hapticPing } from "@/shared/design/primitives";
import {
  EditProfilePanel,
  NotifBellPill,
  NotificationsPanel,
  QRScanPanel,
  readLocalAvatar,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";
import { useRouter } from "next/navigation";

type HomeClientProps = {
  state: BerlinerState;
};

type OverlayState =
  | { type: "notifs" }
  | { type: "qr"; sessionId: string; sessionTitle: string }
  | { type: "editProfile" }
  | null;

export function HomeClient({ state }: HomeClientProps) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const { unreadCount } = useNotificationFeed();

  const isStudent = state.profile.role === "student";
  const today = localISO(new Date());
  const tomorrow = localISO(new Date(Date.now() + 86400000));

  // ── Today's slots ────────────────────────────────────────────
  const todaySlots = useMemo(
    () => state.sessions.filter((s) => s.start.startsWith(today)),
    [state.sessions, today]
  );
  const tomorrowSlots = useMemo(
    () => state.sessions.filter((s) => s.start.startsWith(tomorrow)),
    [state.sessions, tomorrow]
  );

  const now = Date.now();
  const liveSlot = todaySlots.find((s) => {
    const start = new Date(s.start).getTime();
    const end = new Date(s.end).getTime();
    return start <= now && now <= end;
  });
  const upcomingToday = todaySlots.filter(
    (s) => new Date(s.start).getTime() > now
  );

  // Combine today's remaining + tomorrow's first ones (3 max).
  type SlotWithWhen = BerlinerState["sessions"][number] & {
    when: "today" | "tomorrow";
  };
  const upcomingList = useMemo<SlotWithWhen[]>(() => {
    const list: SlotWithWhen[] = [];
    upcomingToday.forEach((s) => list.push({ ...s, when: "today" }));
    if (list.length < 3) {
      tomorrowSlots.slice(0, 3 - list.length).forEach((s) =>
        list.push({ ...s, when: "tomorrow" })
      );
    }
    return list.slice(0, 3);
  }, [upcomingToday, tomorrowSlots]);

  // ── Devoirs urgents (upcoming evaluations within 7 days) ─────
  const upcomingHomework = useMemo(() => {
    const todayDate = new Date(today + "T00:00");
    return state.evaluations
      .filter((ev) => {
        const d = new Date(ev.date + "T00:00");
        const diff = (d.getTime() - todayDate.getTime()) / 86400000;
        return diff >= 0 && diff <= 14;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [state.evaluations, today]);

  // ── Recent grades ────────────────────────────────────────────
  const recentGrades = state.grades
    .filter((g) => isStudent ? g.studentId === state.profile.id : true)
    .slice(0, 3);

  const globalAvg = computeGlobalAverage(state);
  const subjectColor = (subjectId: string) =>
    state.subjects.find((s) => s.id === subjectId)?.color ?? p.accent;

  const liveColor = liveSlot ? colorFor(p, liveSlot.color) : p.accent;

  const minutesLeft = liveSlot
    ? Math.max(
        0,
        Math.round((new Date(liveSlot.end).getTime() - now) / 60000)
      )
    : null;

  const firstName =
    state.profile.first_name ||
    (state.profile.email
      ? state.profile.email.split("@")[0].split(".")[0].replace(/^./, (c) => c.toUpperCase())
      : "toi");

  const headerKicker = isStudent
    ? `BERLINER · ${(state.profile.class_name || "ÉLÈVE").toUpperCase()}`
    : `BERLINER · PROF${state.profile.last_name ? " · " + state.profile.last_name.toUpperCase() : ""}`;

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      {/* Header */}
      <div style={{ padding: "14px 20px 8px", position: "relative", overflow: "hidden" }}>
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
              WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
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
              fontSize: 11,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <span>{headerKicker}</span>
            <NotifBellPill
              p={p}
              unread={unreadCount}
              onClick={() => setOverlay({ type: "notifs" })}
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
              fontSize: 11.5,
              color: p.ink3,
              letterSpacing: 0.3,
            }}
          >
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {todaySlots.length}
              </Mono>{" "}
              cours
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {upcomingHomework.length}
              </Mono>{" "}
              {isStudent ? "devoirs" : "évals."}
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
        {/* === LIVE card === */}
        {liveSlot && (
          <div
            style={{
              position: "relative",
              marginBottom: 12,
              marginTop: 4,
              background: p.surface,
              border: `1px solid ${liveColor}40`,
              borderRadius: 16,
              padding: "14px 16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: 100,
                ...ditherGradient({ fg: liveColor, alpha: 0.25 }),
                maskImage: "linear-gradient(to left, #000, transparent)",
                WebkitMaskImage: "linear-gradient(to left, #000, transparent)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                  fontFamily: p.font.mono,
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: liveColor,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: liveColor,
                    boxShadow: `0 0 0 4px ${liveColor}25`,
                    animation: "berliner-pulse 1.6s ease-in-out infinite",
                  }}
                />
                EN COURS · {liveSlot.room ?? "—"}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: -0.3,
                  lineHeight: 1.1,
                }}
              >
                {liveSlot.subjectName}
              </div>
              <Mono
                style={{
                  fontSize: 11.5,
                  color: p.ink3,
                  marginTop: 4,
                  display: "block",
                }}
              >
                {new Date(liveSlot.start).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                → fin dans {minutesLeft} min
              </Mono>
              {isStudent && (
                <div
                  onClick={(e) => {
                    hapticPing(e.currentTarget);
                    setOverlay({
                      type: "qr",
                      sessionId: liveSlot.id,
                      sessionTitle: liveSlot.subjectName,
                    });
                  }}
                  style={{
                    marginTop: 12,
                    padding: "11px 14px",
                    background: liveColor,
                    color: p.dark ? "#0E0E10" : "#FFFFFF",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: p.font.mono,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  SCANNER QR PRÉSENCE
                </div>
              )}
            </div>
          </div>
        )}

        {/* === Prochains cours === */}
        {!liveSlot && upcomingList.length > 0 && (
          <>
            <AppSectionLabel
              p={p}
              action="Planning"
              onAction={() =>
                router.push(isStudent ? "/student/schedule" : "/teacher/schedule")
              }
            >
              PROCHAINS COURS
            </AppSectionLabel>
            <AppCard p={p}>
              {upcomingList.map((slot, i) => {
                const c = colorFor(p, subjectColor(slot.subjectId));
                const isFirst = i === 0;
                const dayLabel =
                  slot.when === "tomorrow" ? "DEMAIN" : "AUJOURD’HUI";
                return (
                  <div
                    key={`${slot.id}-${i}`}
                    onClick={() =>
                      router.push(
                        isStudent ? "/student/schedule" : "/teacher/schedule"
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      cursor: "pointer",
                      borderBottom:
                        i === upcomingList.length - 1
                          ? "none"
                          : `1px solid ${p.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 38,
                        borderRadius: 2,
                        background: c,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: p.font.mono,
                          fontSize: 10,
                          color: isFirst
                            ? p.accent
                            : slot.when === "tomorrow"
                            ? p.accentSecondary
                            : p.ink3,
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                          marginBottom: 2,
                          fontWeight: isFirst || slot.when === "tomorrow" ? 600 : 400,
                        }}
                      >
                        {isFirst && slot.when === "today" ? "PROCHAIN" : dayLabel} ·{" "}
                        {new Date(slot.start).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div
                        style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.2 }}
                      >
                        {slot.subjectName}
                      </div>
                      <Mono style={{ fontSize: 11, color: p.ink3 }}>
                        {slot.room || "—"}{" "}
                        {slot.className ? `· ${slot.className}` : ""}
                      </Mono>
                    </div>
                    <span style={{ color: p.ink3, fontSize: 18 }}>›</span>
                  </div>
                );
              })}
            </AppCard>
          </>
        )}

        {/* === Devoirs urgents === */}
        {upcomingHomework.length > 0 && (
          <>
            <AppSectionLabel
              p={p}
              action="Tout voir"
              onAction={() =>
                router.push(isStudent ? "/student/devoirs" : "/teacher/devoirs")
              }
            >
              {isStudent ? "À RENDRE BIENTÔT" : "ÉVALUATIONS À VENIR"}
            </AppSectionLabel>
            <AppCard p={p}>
              {upcomingHomework.map((it, i) => {
                const c = colorFor(p, subjectColor(it.subjectId));
                return (
                  <div
                    key={it.id}
                    onClick={(e) => {
                      hapticPing(e.currentTarget);
                      router.push(
                        isStudent ? "/student/devoirs" : "/teacher/devoirs"
                      );
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      cursor: "pointer",
                      borderBottom:
                        i === upcomingHomework.length - 1
                          ? "none"
                          : `1px solid ${p.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: c,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}
                      >
                        {it.name}
                      </div>
                      <Mono
                        style={{ fontSize: 10.5, color: p.ink3, letterSpacing: 0.3 }}
                      >
                        {it.subjectName}
                      </Mono>
                    </div>
                    <Mono
                      style={{
                        fontSize: 10.5,
                        color: p.accentSecondaryInk,
                        background: p.accentSecondary,
                        fontWeight: 600,
                        letterSpacing: 0.4,
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {relDue(it.date)}
                    </Mono>
                  </div>
                );
              })}
            </AppCard>
          </>
        )}

        {/* === Notes récentes === */}
        {recentGrades.length > 0 && (
          <>
            <AppSectionLabel
              p={p}
              action="Tout voir"
              onAction={() =>
                router.push(isStudent ? "/student/grades" : "/teacher/grades")
              }
            >
              {isStudent ? "DERNIÈRES NOTES" : "DERNIÈRES PUBLIÉES"}
            </AppSectionLabel>
            <AppCard p={p}>
              {recentGrades.map((g, i) => {
                const c = colorFor(p, subjectColor(g.subjectId));
                const note20 = (g.score / Math.max(g.maxScore, 1)) * 20;
                return (
                  <div
                    key={g.id}
                    onClick={() =>
                      router.push(isStudent ? "/student/grades" : "/teacher/grades")
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      cursor: "pointer",
                      borderBottom:
                        i === recentGrades.length - 1
                          ? "none"
                          : `1px solid ${p.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 3,
                        height: 26,
                        borderRadius: 2,
                        background: c,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {g.subjectName}
                      </div>
                      <Mono
                        style={{
                          fontSize: 10.5,
                          color: p.ink3,
                          letterSpacing: 0.3,
                          textTransform: "uppercase",
                        }}
                      >
                        {g.evaluationName}
                      </Mono>
                    </div>
                    <Mono
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: -0.3,
                        color:
                          note20 >= 14
                            ? p.sem.ok
                            : note20 < 10
                            ? p.sem.bad
                            : p.ink,
                      }}
                    >
                      {g.score}
                    </Mono>
                    <Mono style={{ fontSize: 11, color: p.ink4 }}>/{g.maxScore}</Mono>
                  </div>
                );
              })}
            </AppCard>
          </>
        )}

        {/* === Empty state === */}
        {!liveSlot &&
          upcomingList.length === 0 &&
          upcomingHomework.length === 0 &&
          recentGrades.length === 0 && (
            <SectionEmpty p={p}>JOURNÉE LIBRE — PROFITE.</SectionEmpty>
          )}
      </ScrollFade>

      {overlay?.type === "notifs" && (
        <NotificationsPanel
          onClose={() => setOverlay(null)}
          onNav={(target) => {
            const base = isStudent ? "/student" : "/teacher";
            const map: Record<string, string> = {
              home: base,
              grades: `${base}/grades`,
              planning: `${base}/schedule`,
              devoirs: `${base}/devoirs`,
            };
            router.push(map[target] ?? base);
          }}
        />
      )}
      {overlay?.type === "qr" && (
        <QRScanPanel
          onClose={() => {
            setOverlay(null);
            router.refresh();
          }}
          sessionId={overlay.sessionId}
          sessionTitle={overlay.sessionTitle}
        />
      )}
      {overlay?.type === "editProfile" && (
        <EditProfilePanel
          onClose={() => {
            setOverlay(null);
            router.refresh();
          }}
          initial={{
            first_name: state.profile.first_name,
            last_name: state.profile.last_name,
            email: state.profile.email,
            avatar_url: state.profile.avatar_url ?? readLocalAvatar(),
          }}
          onSaved={() => router.refresh()}
        />
      )}
    </PageShell>
  );
}

