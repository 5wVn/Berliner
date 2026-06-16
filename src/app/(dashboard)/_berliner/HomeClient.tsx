"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type BerlinerState } from "@/actions/berliner-state";
import { computeGlobalAverage } from "@/shared/lib/berliner-stats";
import { useTheme } from "@/shared/design/ThemeProvider";
import { subjectColor, ditherGradient, localISO, relDue } from "@/shared/design/tokens";
import { hapticPing } from "@/shared/design/primitives";
import {
  EditProfilePanel,
  NotifBellPill,
  NotificationsPanel,
  QRScanPanel,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";

type HomeClientProps = {
  state: BerlinerState;
};

type OverlayState =
  | { type: "notifs" }
  | { type: "qr"; sessionId: string; sessionTitle: string }
  | { type: "editProfile" }
  | null;

// Petit libellé de section (mono, majuscules) avec action optionnelle à droite.
function SectionLabel({
  children,
  action,
  onAction,
}: {
  children: ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mt-[18px] mb-2 flex items-center justify-between px-1">
      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.6px] text-ink-3">
        {children}
      </span>
      {action && (
        <span
          onClick={onAction}
          className="cursor-pointer font-mono text-[10.5px] font-semibold uppercase tracking-[0.4px] text-primary"
        >
          {action} ›
        </span>
      )}
    </div>
  );
}

// Carte générique qui contient une pile de lignes.
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 overflow-hidden rounded-[12px] border border-border bg-surface">
      {children}
    </div>
  );
}

export function HomeClient({ state }: HomeClientProps) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const { unreadCount } = useNotificationFeed();

  const isStudent = state.profile.role === "student";
  const today = localISO(new Date());
  const tomorrow = localISO(new Date(Date.now() + 86400000));

  // ── Cours du jour ────────────────────────────────────────────
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
  const upcomingToday = todaySlots.filter((s) => new Date(s.start).getTime() > now);

  // Combine les cours restants aujourd'hui + les premiers de demain (3 max).
  type SlotWithWhen = BerlinerState["sessions"][number] & {
    when: "today" | "tomorrow";
  };
  const upcomingList = useMemo<SlotWithWhen[]>(() => {
    const list: SlotWithWhen[] = [];
    upcomingToday.forEach((s) => list.push({ ...s, when: "today" }));
    if (list.length < 3) {
      tomorrowSlots
        .slice(0, 3 - list.length)
        .forEach((s) => list.push({ ...s, when: "tomorrow" }));
    }
    return list.slice(0, 3);
  }, [upcomingToday, tomorrowSlots]);

  // ── Devoirs / évaluations à venir (sous 14 jours) ────────────
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

  // ── Notes récentes ────────────────────────────────────────────
  const recentGrades = state.grades
    .filter((g) => (isStudent ? g.studentId === state.profile.id : true))
    .slice(0, 3);

  const globalAvg = computeGlobalAverage(state);
  const subjectColorById = (subjectId: string) =>
    subjectColor(state.subjects.find((s) => s.id === subjectId)?.color);

  const liveColor = liveSlot ? subjectColor(liveSlot.color) : subjectColor("green");

  const minutesLeft = liveSlot
    ? Math.max(0, Math.round((new Date(liveSlot.end).getTime() - now) / 60000))
    : null;

  const firstName =
    state.profile.first_name ||
    (state.profile.email
      ? state.profile.email
          .split("@")[0]
          .split(".")[0]
          .replace(/^./, (c) => c.toUpperCase())
      : "toi");

  const headerKicker = isStudent
    ? `BERLINER · ${(state.profile.class_name || "ÉLÈVE").toUpperCase()}`
    : `BERLINER · PROF${
        state.profile.last_name ? " · " + state.profile.last_name.toUpperCase() : ""
      }`;

  const timeOf = (iso: string) =>
    new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col text-ink">
      {/* En-tête */}
      <div className="relative overflow-hidden px-5 pb-2 pt-3.5">
        {/* Dégradé dither (clair uniquement) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 dark:hidden"
          style={{
            ...ditherGradient({ fg: subjectColor("red"), alpha: 0.4 }),
            maskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
          }}
        />
        <div className="relative">
          <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
            <span>{headerKicker}</span>
            <NotifBellPill
              p={p}
              unread={unreadCount}
              onClick={() => setOverlay({ type: "notifs" })}
            />
          </div>
          <div className="text-[26px] font-semibold leading-[1.15] tracking-[-0.4px]">
            Salut <span className="text-primary">{firstName}</span>.
          </div>
          <div className="mt-2 flex gap-3.5 font-mono text-[11.5px] tracking-[0.3px] text-ink-3">
            <span>
              <span className="font-semibold tabular-nums text-ink-2">
                {todaySlots.length}
              </span>{" "}
              cours
            </span>
            <span>
              <span className="font-semibold tabular-nums text-ink-2">
                {upcomingHomework.length}
              </span>{" "}
              {isStudent ? "devoirs" : "évals."}
            </span>
            <span>
              <span className="font-semibold tabular-nums text-ink-2">
                {globalAvg != null ? globalAvg.toFixed(1) : "—"}
              </span>
              /20
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-[110px] pt-1">
        {/* === Carte EN COURS === */}
        {liveSlot && (
          <div
            className="relative mb-3 mt-1 overflow-hidden rounded-2xl bg-surface p-4"
            style={{ border: `1px solid ${liveColor}40` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-[100px]"
              style={{
                ...ditherGradient({ fg: liveColor, alpha: 0.25 }),
                maskImage: "linear-gradient(to left, #000, transparent)",
                WebkitMaskImage: "linear-gradient(to left, #000, transparent)",
              }}
            />
            <div className="relative">
              <div
                className="mb-1.5 flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.5px]"
                style={{ color: liveColor }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-berliner-pulse"
                  style={{ background: liveColor, boxShadow: `0 0 0 4px ${liveColor}25` }}
                />
                EN COURS · {liveSlot.room ?? "—"}
              </div>
              <div className="text-[22px] font-semibold leading-[1.1] tracking-[-0.3px]">
                {liveSlot.subjectName}
              </div>
              <span className="mt-1 block font-mono text-[11.5px] tabular-nums text-ink-3">
                {timeOf(liveSlot.start)} → fin dans {minutesLeft} min
              </span>
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
                  className="mt-3 cursor-pointer rounded-[10px] py-[11px] text-center font-mono text-xs font-bold uppercase tracking-[0.6px] text-white dark:text-[#0E0E10]"
                  style={{ background: liveColor }}
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
            <SectionLabel
              action="Planning"
              onAction={() =>
                router.push(isStudent ? "/student/schedule" : "/teacher/schedule")
              }
            >
              PROCHAINS COURS
            </SectionLabel>
            <Card>
              {upcomingList.map((slot, i) => {
                const c = subjectColorById(slot.subjectId);
                const isFirst = i === 0;
                const dayLabel = slot.when === "tomorrow" ? "DEMAIN" : "AUJOURD’HUI";
                return (
                  <div
                    key={`${slot.id}-${i}`}
                    onClick={() =>
                      router.push(isStudent ? "/student/schedule" : "/teacher/schedule")
                    }
                    className={`flex cursor-pointer items-center gap-3 px-3.5 py-3 ${
                      i === upcomingList.length - 1 ? "" : "border-b border-border"
                    }`}
                  >
                    <div
                      className="h-[38px] w-1 shrink-0 rounded-[2px]"
                      style={{ background: c }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`mb-0.5 font-mono text-[10px] uppercase tracking-[0.5px] ${
                          isFirst ? "font-semibold text-primary" : "text-ink-3"
                        }`}
                      >
                        {isFirst && slot.when === "today" ? "PROCHAIN" : dayLabel} ·{" "}
                        {timeOf(slot.start)}
                      </div>
                      <div className="text-[15px] font-medium leading-[1.2]">
                        {slot.subjectName}
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-ink-3">
                        {slot.room || "—"} {slot.className ? `· ${slot.className}` : ""}
                      </span>
                    </div>
                    <span className="text-[18px] text-ink-3">›</span>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* === Devoirs / évaluations à venir === */}
        {upcomingHomework.length > 0 && (
          <>
            <SectionLabel
              action="Tout voir"
              onAction={() =>
                router.push(isStudent ? "/student/devoirs" : "/teacher/devoirs")
              }
            >
              {isStudent ? "À RENDRE BIENTÔT" : "ÉVALUATIONS À VENIR"}
            </SectionLabel>
            <Card>
              {upcomingHomework.map((it, i) => {
                const c = subjectColorById(it.subjectId);
                return (
                  <div
                    key={it.id}
                    onClick={(e) => {
                      hapticPing(e.currentTarget);
                      router.push(isStudent ? "/student/devoirs" : "/teacher/devoirs");
                    }}
                    className={`flex cursor-pointer items-center gap-3 px-3.5 py-[11px] ${
                      i === upcomingHomework.length - 1 ? "" : "border-b border-border"
                    }`}
                  >
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: c }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium leading-[1.2]">
                        {it.name}
                      </div>
                      <span className="font-mono text-[10.5px] tracking-[0.3px] text-ink-3">
                        {it.subjectName}
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] font-semibold tracking-[0.4px] text-primary">
                      {relDue(it.date)}
                    </span>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* === Notes récentes === */}
        {recentGrades.length > 0 && (
          <>
            <SectionLabel
              action="Tout voir"
              onAction={() =>
                router.push(isStudent ? "/student/grades" : "/teacher/grades")
              }
            >
              {isStudent ? "DERNIÈRES NOTES" : "DERNIÈRES PUBLIÉES"}
            </SectionLabel>
            <Card>
              {recentGrades.map((g, i) => {
                const c = subjectColorById(g.subjectId);
                const note20 = (g.score / Math.max(g.maxScore, 1)) * 20;
                const scoreColor =
                  note20 >= 14
                    ? "text-sem-ok"
                    : note20 < 10
                    ? "text-sem-bad"
                    : "text-ink";
                return (
                  <div
                    key={g.id}
                    onClick={() =>
                      router.push(isStudent ? "/student/grades" : "/teacher/grades")
                    }
                    className={`flex cursor-pointer items-center gap-3 px-3.5 py-[11px] ${
                      i === recentGrades.length - 1 ? "" : "border-b border-border"
                    }`}
                  >
                    <div
                      className="h-[26px] w-[3px] shrink-0 rounded-[2px]"
                      style={{ background: c }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium">{g.subjectName}</div>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.3px] text-ink-3">
                        {g.evaluationName}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[18px] font-semibold tabular-nums tracking-[-0.3px] ${scoreColor}`}
                    >
                      {g.score}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-ink-4">
                      /{g.maxScore}
                    </span>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* === État vide === */}
        {!liveSlot &&
          upcomingList.length === 0 &&
          upcomingHomework.length === 0 &&
          recentGrades.length === 0 && (
            <div className="mb-2 rounded-[12px] border border-dashed border-border p-[18px] text-center font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
              JOURNÉE LIBRE — PROFITE.
            </div>
          )}
      </div>

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
            avatar_url: state.profile.avatar_url,
          }}
          onSaved={() => router.refresh()}
        />
      )}
    </div>
  );
}
