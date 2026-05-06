"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/design/ThemeProvider";
import { useBerlinerState } from "./BerlinerStateContext";
import { PageShell, SectionEmpty } from "@/shared/components/berliner/Shell";
import {
  colorFor,
  ditherGradient,
  isoWeekNumber,
  localISO,
} from "@/shared/design/tokens";
import {
  GlobalAnimations,
  Mono,
  ScrollFade,
  hapticPing,
} from "@/shared/design/primitives";
import { QRScanPanel } from "@/shared/components/berliner/Overlays";

type StripDay = {
  iso: string;
  d: string; // single-letter weekday
  full: string;
  n: number;
  slots: number;
  today: boolean;
  weekend: boolean;
};

export function PlanningClient() {
  const state = useBerlinerState();
  const { palette: p } = useTheme();
  const router = useRouter();
  const today = localISO(new Date());
  const isStudent = state.profile.role === "student";

  const [day, setDay] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [qrSession, setQrSession] = useState<{
    sessionId: string;
    sessionTitle: string;
  } | null>(null);

  // 21-day strip (3 weeks centered on the active offset).
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

  // Sessions for the selected day, sorted chronologically.
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

  const liveColor = liveSlot ? colorFor(p, liveSlot.color) : p.accent;
  const minutesLeft = liveSlot
    ? Math.max(
        0,
        Math.round((new Date(liveSlot.end).getTime() - now) / 60000)
      )
    : null;

  const dayLabel = `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${dayObj.getDate()}`;
  const weekNo = isoWeekNumber(dayObj);

  // Auto-scroll the strip so the selected day stays in view.
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const el = itemRefs.current[day];
    const sc = scrollerRef.current;
    if (!el || !sc) return;
    sc.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [day]);

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      {/* Header */}
      <div style={{ padding: "12px 20px 6px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: p.font.mono,
              fontSize: 13,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            PLANNING
          </span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "stretch",
              border: `1px solid ${p.borderStrong || p.border}`,
              borderRadius: 8,
              overflow: "hidden",
              background: p.surface,
            }}
          >
            <div
              onClick={() => setWeekOffset((o) => o - 1)}
              style={{
                cursor: "pointer",
                padding: "6px 11px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: p.ink,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1,
                borderRight: `1px solid ${p.border}`,
              }}
            >
              ‹
            </div>
            <div
              style={{
                padding: "6px 12px",
                fontFamily: p.font.mono,
                fontSize: 12.5,
                fontWeight: 600,
                color: p.ink2,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRight: `1px solid ${p.border}`,
              }}
            >
              <span>SEM. {weekNo}</span>
              {weekOffset !== 0 && (
                <span
                  onClick={() => {
                    setWeekOffset(0);
                    setDay(today);
                  }}
                  style={{
                    cursor: "pointer",
                    color: p.accent,
                    fontWeight: 700,
                  }}
                >
                  · AUJ.
                </span>
              )}
            </div>
            <div
              onClick={() => setWeekOffset((o) => o + 1)}
              style={{
                cursor: "pointer",
                padding: "6px 11px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: p.ink,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              ›
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: -0.6,
              lineHeight: 1,
            }}
          >
            {dayLabel}
          </div>
          <div
            style={{
              fontSize: 16,
              color: p.ink3,
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {month} {dayObj.getFullYear()}
          </div>
        </div>
        <Mono
          style={{
            display: "block",
            marginTop: 6,
            fontSize: 13.5,
            color: p.ink3,
            letterSpacing: 0.3,
          }}
        >
          {slots.length === 0 ? "aucun cours" : `${slots.length} cours`}
          {isToday && slots.length > 0 && <span> · aujourd’hui</span>}
        </Mono>
      </div>

      {/* Day strip */}
      <div
        ref={scrollerRef}
        style={{
          display: "flex",
          gap: 6,
          padding: "14px 16px 10px",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: 16,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>{`
          div[data-strip="berliner"]::-webkit-scrollbar { display: none; }
        `}</style>
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
              style={{
                flex: "0 0 52px",
                padding: "8px 0",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                borderRadius: 10,
                background: on ? p.accent : "transparent",
                color: on
                  ? p.dark
                    ? "#0E0E10"
                    : "#FFFFFF"
                  : w.weekend
                  ? p.ink4
                  : p.ink2,
                transition: "background 160ms ease-out",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
              }}
            >
              <div
                style={{
                  fontFamily: p.font.mono,
                  fontSize: 11.5,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  opacity: on ? 0.85 : 0.6,
                }}
              >
                {w.full}
              </div>
              <Mono style={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>
                {w.n}
              </Mono>
              <div
                style={{
                  width: 14,
                  height: 2,
                  borderRadius: 1,
                  background: on
                    ? p.dark
                      ? "#0E0E10"
                      : "#FFFFFF"
                    : w.today
                    ? p.accent
                    : empty
                    ? "transparent"
                    : p.ink4,
                  opacity: on ? 0.6 : w.today ? 1 : 0.5,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Day content */}
      <ScrollFade key={day} style={{ padding: "6px 16px 24px" }}>
        {liveSlot && isToday && (
          <div
            style={{
              position: "relative",
              marginBottom: 14,
              background: p.surface,
              border: `1px solid ${liveColor}40`,
              borderRadius: 16,
              padding: "14px 16px",
              overflow: "hidden",
              animation: "berliner-fade-in 280ms ease-out",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: 110,
                ...ditherGradient({ fg: liveColor, alpha: 0.22 }),
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
                  fontSize: 12.5,
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
                  fontSize: 21,
                  fontWeight: 600,
                  letterSpacing: -0.3,
                  lineHeight: 1.15,
                }}
              >
                {liveSlot.subjectName}
              </div>
              <Mono
                style={{
                  fontSize: 13.5,
                  color: p.ink3,
                  marginTop: 4,
                  display: "block",
                }}
              >
                {timeOf(liveSlot.start)} → fin dans {minutesLeft} min
                {liveSlot.teacherName && ` · ${liveSlot.teacherName}`}
              </Mono>
              {isStudent &&
                (isPresent(liveSlot.id) ? (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: p.sem.ok + "18",
                      border: `1px solid ${p.sem.ok}40`,
                      fontFamily: p.font.mono,
                      fontSize: 13,
                      fontWeight: 600,
                      color: p.sem.ok,
                      letterSpacing: 0.5,
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}
                  >
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
                    style={{
                      marginTop: 12,
                      padding: "11px 14px",
                      background: liveColor,
                      color: p.dark ? "#0E0E10" : "#FFFFFF",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontFamily: p.font.mono,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}
                  >
                    SCANNER QR PRÉSENCE
                  </div>
                ))}
            </div>
          </div>
        )}

        {slots.length === 0 ? (
          <SectionEmpty p={p}>JOURNÉE LIBRE.</SectionEmpty>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {slots.map((s, i) => {
              if (s.id === liveSlot?.id && isToday) return null;
              const c = colorFor(p, s.color);
              const present = isPresent(s.id);
              const done = new Date(s.end).getTime() < now;
              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "stretch",
                    padding: "11px 12px 11px 0",
                    borderRadius: 12,
                    background: p.surface,
                    border: `1px solid ${p.border}`,
                    opacity: done ? 0.55 : 1,
                    animation: `berliner-fade-in 240ms ease-out ${i * 25}ms both`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      alignSelf: "stretch",
                      background: c,
                      flexShrink: 0,
                      marginRight: 2,
                    }}
                  />
                  <div
                    style={{
                      flex: "0 0 56px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      paddingLeft: 6,
                    }}
                  >
                    <Mono
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: p.ink,
                        lineHeight: 1.1,
                        letterSpacing: -0.2,
                      }}
                    >
                      {timeOf(s.start)}
                    </Mono>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink4,
                        letterSpacing: 0.3,
                        marginTop: 2,
                      }}
                    >
                      {durOf(s.start, s.end)}
                    </Mono>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16.5,
                        fontWeight: 500,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.subjectName}
                    </div>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                        marginTop: 2,
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <span>{s.room || "—"}</span>
                      {s.className && (
                        <>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{s.className}</span>
                        </>
                      )}
                      {s.teacherName && (
                        <>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{s.teacherName}</span>
                        </>
                      )}
                    </Mono>
                  </div>
                  <div
                    style={{
                      flex: "0 0 auto",
                      display: "flex",
                      alignItems: "center",
                      paddingRight: 4,
                    }}
                  >
                    {done && (
                      <Mono
                        style={{
                          fontSize: 12,
                          color: p.ink4,
                          letterSpacing: 0.4,
                        }}
                      >
                        TERMINÉ
                      </Mono>
                    )}
                    {!done && present && (
                      <Mono
                        style={{
                          fontSize: 12,
                          color: p.sem.ok,
                          fontWeight: 700,
                          letterSpacing: 0.4,
                        }}
                      >
                        ✓
                      </Mono>
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
    </PageShell>
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
