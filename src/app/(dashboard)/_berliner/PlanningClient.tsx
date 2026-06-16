"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type BerlinerState } from "@/actions/berliner-state";
import { subjectColor, ditherGradient, isoWeekNumber, localISO } from "@/shared/design/tokens";
import { ScrollFade, hapticPing } from "@/shared/design/primitives";
import { QRScanPanel } from "@/shared/components/berliner/Overlays";

type PlanningClientProps = { state: BerlinerState };

type StripDay = {
  iso: string;
  d: string;
  full: string;
  n: number;
  slots: number;
  today: boolean;
  weekend: boolean;
};

export function PlanningClient({ state }: PlanningClientProps) {
  const router = useRouter();
  const today = localISO(new Date());
  const isStudent = state.profile.role === "student";

  const [day, setDay] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [qrSession, setQrSession] = useState<{
    sessionId: string;
    sessionTitle: string;
  } | null>(null);

  // Bande de 21 jours (3 semaines centrées sur le décalage actif).
  const stripDays = useMemo<StripDay[]>(() => {
    const ref = new Date(today + "T00:00");
    const monday = new Date(ref);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + (weekOffset - 1) * 7);
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = localISO(d);
      const dow = (d.getDay() + 6) % 7;
      const slots = state.sessions.filter((s) => s.start.startsWith(iso)).length;
      return {
        iso,
        d: ["L", "M", "M", "J", "V", "S", "D"][dow],
        full: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][dow],
        n: d.getDate(),
        slots,
        today: iso === today,
        weekend: dow >= 5,
      };
    });
  }, [today, weekOffset, state.sessions]);

  const slots = useMemo(() => {
    return [...state.sessions]
      .filter((s) => s.start.startsWith(day))
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [state.sessions, day]);

  const now = Date.now();
  const liveSlot = slots.find((s) => {
    const start = new Date(s.start).getTime();
    const end = new Date(s.end).getTime();
    return start <= now && now <= end;
  });

  const dayObj = new Date(day + "T00:00");
  const weekday = dayObj.toLocaleString("fr-FR", { weekday: "long" });
  const month = dayObj.toLocaleString("fr-FR", { month: "long" });
  const isToday = day === today;

  const isPresent = (sessionId: string) => {
    const a = state.attendance.find((a) => a.sessionId === sessionId);
    return a?.status === "present" || a?.status === "late";
  };

  const liveColor = liveSlot ? subjectColor(liveSlot.color) : subjectColor("red");
  const minutesLeft = liveSlot
    ? Math.max(0, Math.round((new Date(liveSlot.end).getTime() - now) / 60000))
    : null;

  const dayLabel = `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${dayObj.getDate()}`;
  const weekNo = isoWeekNumber(dayObj);

  // Garde le jour sélectionné visible dans la bande.
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const el = itemRefs.current[day];
    const sc = scrollerRef.current;
    if (!el || !sc) return;
    sc.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [day]);

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col text-ink">
      {/* En-tête */}
      <div className="px-5 pb-1.5 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
            PLANNING
          </span>
          <div className="inline-flex items-stretch overflow-hidden rounded-[8px] border border-border-strong bg-surface">
            <div
              onClick={() => setWeekOffset((o) => o - 1)}
              className="inline-flex cursor-pointer items-center justify-center border-r border-border px-[11px] py-1.5 text-[14px] font-semibold leading-none text-ink"
            >
              ‹
            </div>
            <div className="inline-flex items-center gap-1.5 border-r border-border px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.5px] text-ink-2">
              <span>SEM. {weekNo}</span>
              {weekOffset !== 0 && (
                <span
                  onClick={() => {
                    setWeekOffset(0);
                    setDay(today);
                  }}
                  className="cursor-pointer font-bold text-primary"
                >
                  · AUJ.
                </span>
              )}
            </div>
            <div
              onClick={() => setWeekOffset((o) => o + 1)}
              className="inline-flex cursor-pointer items-center justify-center px-[11px] py-1.5 text-[14px] font-semibold leading-none text-ink"
            >
              ›
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-2.5">
          <div className="text-[30px] font-semibold leading-none tracking-[-0.6px]">
            {dayLabel}
          </div>
          <div className="text-[14px] font-medium capitalize text-ink-3">
            {month} {dayObj.getFullYear()}
          </div>
        </div>
        <span className="mt-1.5 block font-mono text-[11.5px] tracking-[0.3px] text-ink-3">
          {slots.length === 0 ? "aucun cours" : `${slots.length} cours`}
          {isToday && slots.length > 0 && <span> · aujourd’hui</span>}
        </span>
      </div>

      {/* Bande des jours */}
      <div
        ref={scrollerRef}
        className="flex gap-1.5 overflow-x-auto overflow-y-hidden px-4 pb-2.5 pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: 16 }}
      >
        {stripDays.map((w) => {
          const on = w.iso === day;
          const empty = w.slots === 0;
          return (
            <div
              key={w.iso}
              ref={(el) => {
                itemRefs.current[w.iso] = el;
              }}
              onClick={() => setDay(w.iso)}
              className={`flex flex-[0_0_52px] cursor-pointer flex-col items-center gap-[5px] rounded-[10px] py-2 transition-colors duration-150 ${
                on
                  ? "bg-primary text-white dark:text-[#0E0E10]"
                  : w.weekend
                  ? "text-ink-4"
                  : "text-ink-2"
              }`}
              style={{ scrollSnapAlign: "start" }}
            >
              <div
                className={`font-mono text-[9.5px] uppercase tracking-[0.6px] ${
                  on ? "opacity-85" : "opacity-60"
                }`}
              >
                {w.full}
              </div>
              <span className="font-mono text-[18px] font-semibold leading-none tabular-nums">
                {w.n}
              </span>
              <div
                className="h-0.5 w-3.5 rounded-[1px]"
                style={{
                  background: on
                    ? "currentColor"
                    : w.today
                    ? "var(--primary)"
                    : empty
                    ? "transparent"
                    : "var(--ink-4)",
                  opacity: on ? 0.6 : w.today ? 1 : 0.5,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Contenu du jour */}
      <ScrollFade key={day} style={{ padding: "6px 16px 24px" }}>
        {liveSlot && isToday && (
          <div
            className="relative mb-3.5 animate-berliner-fade-in overflow-hidden rounded-2xl bg-surface p-4"
            style={{ border: `1px solid ${liveColor}40` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-[110px]"
              style={{
                ...ditherGradient({ fg: liveColor, alpha: 0.22 }),
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
              <div className="text-[21px] font-semibold leading-[1.15] tracking-[-0.3px]">
                {liveSlot.subjectName}
              </div>
              <span className="mt-1 block font-mono text-[11.5px] tabular-nums text-ink-3">
                {timeOf(liveSlot.start)} → fin dans {minutesLeft} min
                {liveSlot.teacherName && ` · ${liveSlot.teacherName}`}
              </span>
              {isStudent &&
                (isPresent(liveSlot.id) ? (
                  <div className="mt-3 rounded-[10px] border border-sem-ok/40 bg-sem-ok/10 px-3.5 py-2.5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.5px] text-sem-ok">
                    ✓ PRÉSENCE ENREGISTRÉE
                  </div>
                ) : (
                  <div
                    onClick={(e) => {
                      hapticPing(e.currentTarget);
                      setQrSession({
                        sessionId: liveSlot.id,
                        sessionTitle: liveSlot.subjectName,
                      });
                    }}
                    className="mt-3 cursor-pointer rounded-[10px] px-3.5 py-[11px] text-center font-mono text-xs font-bold uppercase tracking-[0.6px] text-white dark:text-[#0E0E10]"
                    style={{ background: liveColor }}
                  >
                    SCANNER QR PRÉSENCE
                  </div>
                ))}
            </div>
          </div>
        )}

        {slots.length === 0 ? (
          <div className="mb-2 rounded-[12px] border border-dashed border-border p-[18px] text-center font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
            JOURNÉE LIBRE.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {slots.map((s, i) => {
              if (s.id === liveSlot?.id && isToday) return null;
              const c = subjectColor(s.color);
              const present = isPresent(s.id);
              const finished = new Date(s.end).getTime() < now;
              return (
                <div
                  key={s.id}
                  className="relative flex items-stretch gap-2.5 overflow-hidden rounded-[12px] border border-border bg-surface py-[11px] pr-3"
                  style={{
                    opacity: finished ? 0.55 : 1,
                    animation: `berliner-fade-in 240ms ease-out ${i * 25}ms both`,
                  }}
                >
                  <div className="w-[3px] shrink-0" style={{ background: c }} />
                  <div className="flex flex-[0_0_56px] flex-col justify-center pl-1.5">
                    <span className="font-mono text-[14px] font-semibold leading-[1.1] tracking-[-0.2px] tabular-nums text-ink">
                      {timeOf(s.start)}
                    </span>
                    <span className="mt-0.5 font-mono text-[10.5px] tracking-[0.3px] tabular-nums text-ink-4">
                      {durOf(s.start, s.end)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="truncate text-[14.5px] font-medium leading-[1.2]">
                      {s.subjectName}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.3px] text-ink-3">
                      <span>{s.room || "—"}</span>
                      {s.className && (
                        <>
                          <span className="opacity-40">·</span>
                          <span>{s.className}</span>
                        </>
                      )}
                      {s.teacherName && (
                        <>
                          <span className="opacity-40">·</span>
                          <span>{s.teacherName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center pr-1">
                    {finished && (
                      <span className="font-mono text-[10px] tracking-[0.4px] text-ink-4">
                        TERMINÉ
                      </span>
                    )}
                    {!finished && present && (
                      <span className="font-mono text-[10px] font-bold tracking-[0.4px] text-sem-ok">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollFade>

      {qrSession && (
        <QRScanPanel
          onClose={() => {
            setQrSession(null);
            router.refresh();
          }}
          sessionId={qrSession.sessionId}
          sessionTitle={qrSession.sessionTitle}
        />
      )}
    </div>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function durOf(startIso: string, endIso: string): string {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h${String(m).padStart(2, "0")}`;
}
