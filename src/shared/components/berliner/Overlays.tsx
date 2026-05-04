"use client";

import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  bulkAddGradesAction,
  getNotificationsAction,
  markAttendanceAction,
  type NotifItem,
  type TeacherStudent,
  type TeacherSubject,
  updateMyProfileAction,
} from "@/actions/berliner";
import { useTheme } from "@/shared/design/ThemeProvider";
import { ditherGradient, type Palette } from "@/shared/design/tokens";
import { Mono, ScrollFade, hapticPing } from "@/shared/design/primitives";

// ─────────────────────────────────────────────────────────────────
// Read-state for notifications (client-only).
// ─────────────────────────────────────────────────────────────────
const NOTIF_READ_KEY = "berliner.notifs.read";

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(NOTIF_READ_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore quota
  }
}

export function useNotificationFeed() {
  const [items, setItems] = useState<NotifItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const r = await getNotificationsAction();
    if (r.ok) setItems(r.data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = items.filter((it) => !readIds.has(it.id)).length;

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      items.forEach((it) => next.add(it.id));
      saveReadIds(next);
      return next;
    });
  }, [items]);

  return { items, readIds, unreadCount, loaded, refresh, markRead, markAllRead };
}

// ─────────────────────────────────────────────────────────────────
// OverlayShell — full-screen panel base.
// ─────────────────────────────────────────────────────────────────
type OverlayShellProps = {
  p: Palette;
  title: ReactNode;
  kicker?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function OverlayShell({
  p,
  title,
  kicker,
  onClose,
  children,
  footer,
}: OverlayShellProps) {
  const solidBg = p.dark ? "#0E0E10" : "#FAFAF7";
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: solidBg,
        color: p.ink,
        fontFamily: p.font.sans,
        display: "flex",
        flexDirection: "column",
        zIndex: 60,
        animation: "berliner-slide-up 240ms ease-out",
        paddingTop: "max(env(safe-area-inset-top), 12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderBottom: `1px solid ${p.border}`,
        }}
      >
        <div
          onClick={onClose}
          style={{
            fontFamily: p.font.mono,
            fontSize: 12,
            color: p.ink3,
            cursor: "pointer",
            letterSpacing: 0.4,
            padding: "4px 0",
          }}
        >
          ← FERMER
        </div>
        <div style={{ flex: 1 }} />
        <Mono
          style={{
            fontSize: 11,
            color: p.ink3,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {kicker}
        </Mono>
      </div>
      <div style={{ padding: "14px 16px 6px" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: -0.4,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      </div>
      <ScrollFade style={{ padding: "6px 16px 24px" }} fadeSize={24}>
        {children}
      </ScrollFade>
      {footer && (
        <div
          style={{
            padding: "12px 16px calc(env(safe-area-inset-bottom) + 16px)",
            borderTop: `1px solid ${p.border}`,
            background: p.dark ? "rgba(14,14,16,0.85)" : "rgba(250,250,247,0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// NotificationsPanel
// ─────────────────────────────────────────────────────────────────
type NotificationsPanelProps = {
  onClose: () => void;
  onNav?: (target: "home" | "grades" | "planning" | "devoirs") => void;
};

export function NotificationsPanel({ onClose, onNav }: NotificationsPanelProps) {
  const { palette: p } = useTheme();
  const { items, readIds, unreadCount, markRead, markAllRead } =
    useNotificationFeed();

  const groupKind: Record<NotifItem["kind"], { icon: string; label: string; color: string }> = {
    grade: { icon: "●", label: "NOTE", color: p.accent },
    homework: { icon: "✓", label: "DEVOIR", color: p.sem.warn },
    live: { icon: "◐", label: "LIVE", color: p.sem.ok },
  };

  return (
    <OverlayShell
      p={p}
      kicker={`NOTIFS · ${items.length}`}
      title={
        unreadCount > 0 ? (
          <>
            {unreadCount}{" "}
            <span style={{ color: p.ink3, fontWeight: 500 }}>
              nouveau{unreadCount > 1 ? "x" : ""}
            </span>
          </>
        ) : (
          <>
            Tout est <span style={{ color: p.accent }}>à jour</span>
          </>
        )
      }
      onClose={onClose}
      footer={
        <div style={{ display: "flex", gap: 8 }}>
          <div
            onClick={markAllRead}
            style={{
              flex: 1,
              padding: "11px 0",
              textAlign: "center",
              background: p.dark ? p.surface2 : p.chip,
              border: `1px solid ${p.border}`,
              borderRadius: 9,
              fontFamily: p.font.mono,
              fontSize: 11,
              fontWeight: 600,
              color: p.ink2,
              letterSpacing: 0.4,
              cursor: "pointer",
            }}
          >
            TOUT MARQUER LU
          </div>
        </div>
      }
    >
      {items.length === 0 ? (
        <div
          style={{
            padding: 30,
            textAlign: "center",
            color: p.ink3,
            fontFamily: p.font.mono,
            fontSize: 11,
            letterSpacing: 0.4,
            border: `1px dashed ${p.border}`,
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          — AUCUNE NOTIFICATION —
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((n) => {
            const g = groupKind[n.kind] ?? { icon: "◯", label: "—", color: p.ink3 };
            const read = readIds.has(n.id);
            return (
              <div
                key={n.id}
                onClick={() => {
                  markRead(n.id);
                  if (n.nav && onNav) {
                    onClose();
                    onNav(n.nav);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 11,
                  padding: "11px 12px",
                  background: p.surface,
                  border: `1px solid ${p.border}`,
                  borderRadius: 11,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {!read && (
                  <div
                    style={{
                      position: "absolute",
                      top: 11,
                      left: -4,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      background: p.accent,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: g.color + "22",
                    color: g.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {g.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 2,
                    }}
                  >
                    <Mono
                      style={{
                        fontSize: 9.5,
                        color: g.color,
                        letterSpacing: 0.5,
                        padding: "1px 5px",
                        borderRadius: 3,
                        background: g.color + "20",
                        fontWeight: 600,
                      }}
                    >
                      {g.label}
                    </Mono>
                    <Mono
                      style={{
                        fontSize: 10,
                        color: p.ink4,
                        letterSpacing: 0.3,
                      }}
                    >
                      {n.ago}
                    </Mono>
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: read ? p.ink2 : p.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {n.title}
                  </div>
                  {n.meta && (
                    <Mono
                      style={{
                        fontSize: 10.5,
                        color: p.ink3,
                        marginTop: 2,
                        display: "block",
                      }}
                    >
                      {n.meta}
                    </Mono>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </OverlayShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// QRScanPanel — fake camera + manual code entry.
// ─────────────────────────────────────────────────────────────────
type QRScanPanelProps = {
  onClose: () => void;
  sessionId?: string;
  sessionTitle?: string;
};

export function QRScanPanel({ onClose, sessionId, sessionTitle }: QRScanPanelProps) {
  const { palette: p } = useTheme();
  const [phase, setPhase] = useState<"scanning" | "found" | "done" | "manual">("scanning");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Auto-trigger detection after 2.4s.
  useEffect(() => {
    if (phase !== "scanning") return;
    const t = window.setTimeout(() => setPhase("found"), 2400);
    return () => window.clearTimeout(t);
  }, [phase]);

  // After detection, persist attendance.
  useEffect(() => {
    if (phase !== "found") return;
    let cancelled = false;
    const t = window.setTimeout(async () => {
      if (cancelled) return;
      if (sessionId) {
        const r = await markAttendanceAction(sessionId, "present");
        if (!r.ok) {
          setError(r.error.message);
          setPhase("scanning");
          return;
        }
      }
      setPhase("done");
    }, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [phase, sessionId]);

  const token = sessionId ? sessionId.replace(/-/g, "").slice(-6).toUpperCase() : "——————";

  const submitManual = async () => {
    if (code.length !== 6) return;
    if (sessionId) {
      const r = await markAttendanceAction(sessionId, "present");
      if (!r.ok) {
        setError(r.error.message);
        return;
      }
    }
    setPhase("done");
  };

  return (
    <OverlayShell
      p={p}
      kicker="PRÉSENCE · QR"
      title={
        phase === "done" ? (
          <>
            Présence <span style={{ color: p.sem.ok }}>validée</span>
          </>
        ) : phase === "found" ? (
          <>QR détecté…</>
        ) : phase === "manual" ? (
          <>
            Saisie <span style={{ color: p.accent }}>manuelle</span>
          </>
        ) : (
          <>
            Scanner le QR{" "}
            <span style={{ color: p.ink3, fontWeight: 500, fontSize: 18 }}>
              du cours
            </span>
          </>
        )
      }
      onClose={onClose}
    >
      <Mono
        style={{
          fontSize: 11,
          color: p.ink3,
          letterSpacing: 0.4,
          display: "block",
          marginBottom: 14,
        }}
      >
        {sessionTitle ? sessionTitle.toUpperCase() : "CRÉNEAU EN COURS"} · TOKEN{" "}
        <span style={{ color: p.ink2 }}>{token}</span>
      </Mono>

      {phase !== "manual" && (
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            borderRadius: 16,
            background: p.dark ? "#0A0A0C" : "#1A1A1D",
            overflow: "hidden",
            border: `1px solid ${p.border}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...ditherGradient({ fg: "#fff", alpha: 0.08 }),
              backgroundColor: p.dark ? "#0A0A0C" : "#1A1A1D",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 30% 40%, ${p.accent}30 0%, transparent 60%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 70% 70%, ${p.sem.info}25 0%, transparent 50%)`,
            }}
          />

          <div style={{ position: "absolute", inset: "12% 12%" }}>
            {[
              { top: 0, left: 0, br: "tl" as const },
              { top: 0, right: 0, br: "tr" as const },
              { bottom: 0, left: 0, br: "bl" as const },
              { bottom: 0, right: 0, br: "br" as const },
            ].map((c, i) => {
              const success = phase === "found" || phase === "done";
              const color = success ? p.sem.ok : p.accent;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 30,
                    height: 30,
                    borderTop: c.top !== undefined ? `2.5px solid ${color}` : "none",
                    borderBottom:
                      c.bottom !== undefined ? `2.5px solid ${color}` : "none",
                    borderLeft: c.left !== undefined ? `2.5px solid ${color}` : "none",
                    borderRight:
                      c.right !== undefined ? `2.5px solid ${color}` : "none",
                    top: c.top,
                    bottom: c.bottom,
                    left: c.left,
                    right: c.right,
                    borderTopLeftRadius: c.br === "tl" ? 6 : 0,
                    borderTopRightRadius: c.br === "tr" ? 6 : 0,
                    borderBottomLeftRadius: c.br === "bl" ? 6 : 0,
                    borderBottomRightRadius: c.br === "br" ? 6 : 0,
                    transition: "border-color 200ms",
                  }}
                />
              );
            })}

            {phase === "scanning" && (
              <div
                style={{
                  position: "absolute",
                  left: "5%",
                  right: "5%",
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
                  boxShadow: `0 0 8px ${p.accent}`,
                  animation: "berliner-scan 1.6s ease-in-out infinite",
                }}
              />
            )}

            {(phase === "found" || phase === "done") && (
              <div
                style={{
                  position: "absolute",
                  inset: "20%",
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1.5,
                  animation: "berliner-slide-up 200ms ease-out",
                }}
              >
                {Array.from({ length: 49 }).map((_, i) => {
                  const corner =
                    (i < 21 && i % 7 < 3) ||
                    (i < 21 && i % 7 > 3) ||
                    (i > 27 && i % 7 < 3);
                  const tlBlock =
                    i < 3 || (i >= 7 && i < 10) || (i >= 14 && i < 17);
                  const trBlock =
                    (i >= 4 && i < 7) || (i >= 11 && i < 14) || (i >= 18 && i < 21);
                  const blBlock =
                    (i >= 28 && i < 31) || (i >= 35 && i < 38) || (i >= 42 && i < 45);
                  const filled =
                    tlBlock || trBlock || blBlock || (((i * 7) % 13) < 5 && !corner);
                  return (
                    <div
                      key={i}
                      style={{
                        aspectRatio: "1",
                        background: filled ? p.sem.ok : "transparent",
                        borderRadius: 1,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              padding: "8px 12px",
              borderRadius: 9,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: "#fff",
              fontFamily: p.font.mono,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 8,
              letterSpacing: 0.4,
            }}
          >
            {phase === "scanning" && (
              <>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: p.accent,
                    animation: "berliner-pulse 1.4s ease-out infinite",
                  }}
                />
                ALIGNER LE QR DANS LE CADRE
              </>
            )}
            {phase === "found" && (
              <>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: p.sem.warn,
                  }}
                />
                CODE DÉTECTÉ · VÉRIFICATION
              </>
            )}
            {phase === "done" && (
              <>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: p.sem.ok,
                  }}
                />
                ✓ PRÉSENCE ENREGISTRÉE
              </>
            )}
          </div>
        </div>
      )}

      {phase === "manual" && (
        <div
          style={{
            background: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: 14,
            padding: 16,
            marginTop: 4,
          }}
        >
          <Mono
            style={{
              fontSize: 10.5,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 8,
            }}
          >
            CODE COURS · 6 CARACTÈRES
          </Mono>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder={token}
            maxLength={6}
            style={{
              width: "100%",
              background: p.dark ? p.surface2 : p.chip,
              border: `1.5px solid ${p.border}`,
              borderRadius: 9,
              padding: "13px 14px",
              fontFamily: p.font.mono,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 6,
              color: p.ink,
              outline: "none",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          />
          <div
            onClick={submitManual}
            style={{
              marginTop: 12,
              padding: "11px 0",
              textAlign: "center",
              background: code.length === 6 ? p.accent : p.dark ? p.surface2 : p.chip,
              color: code.length === 6 ? (p.dark ? "#0E0E10" : "#FFF") : p.ink3,
              borderRadius: 9,
              fontFamily: p.font.mono,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: code.length === 6 ? "pointer" : "not-allowed",
              border: `1px solid ${code.length === 6 ? p.accent : p.border}`,
            }}
          >
            VALIDER CODE
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: "9px 11px",
            borderRadius: 8,
            background: p.sem.bad + "20",
            color: p.sem.bad,
            fontFamily: p.font.mono,
            fontSize: 11,
            letterSpacing: 0.3,
          }}
        >
          {error}
        </div>
      )}

      {phase !== "done" && phase !== "manual" && (
        <div
          onClick={() => setPhase("manual")}
          style={{
            marginTop: 14,
            padding: "10px 0",
            textAlign: "center",
            background: "transparent",
            border: `1px solid ${p.border}`,
            borderRadius: 9,
            fontFamily: p.font.mono,
            fontSize: 11,
            color: p.ink3,
            letterSpacing: 0.4,
            cursor: "pointer",
          }}
        >
          SAISIR LE CODE MANUELLEMENT
        </div>
      )}
      {phase === "manual" && (
        <div
          onClick={() => setPhase("scanning")}
          style={{
            marginTop: 14,
            padding: "10px 0",
            textAlign: "center",
            background: "transparent",
            border: `1px solid ${p.border}`,
            borderRadius: 9,
            fontFamily: p.font.mono,
            fontSize: 11,
            color: p.ink3,
            letterSpacing: 0.4,
            cursor: "pointer",
          }}
        >
          ← REVENIR AU SCAN
        </div>
      )}

      {phase === "done" && (
        <div
          onClick={onClose}
          style={{
            marginTop: 16,
            padding: "12px 0",
            textAlign: "center",
            background: p.accent,
            color: p.dark ? "#0E0E10" : "#FFF",
            borderRadius: 9,
            fontFamily: p.font.mono,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.5,
            cursor: "pointer",
          }}
        >
          OK
        </div>
      )}

      <style>{`
        @keyframes berliner-scan {
          0%   { top: 8%; opacity: 1; }
          50%  { top: 92%; opacity: 1; }
          100% { top: 8%; opacity: 1; }
        }
      `}</style>
    </OverlayShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// EditProfilePanel
// ─────────────────────────────────────────────────────────────────
type EditProfilePanelProps = {
  onClose: () => void;
  initial: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
  };
  onSaved?: () => void;
};

// The `profiles` DB table has no avatar column in this schema, so the
// avatar lives entirely in localStorage keyed per user (the user id is
// pulled in by the parent and merged into the initial state).
const AVATAR_KEY = "berliner.avatar.v1";

export function readLocalAvatar(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AVATAR_KEY);
  } catch {
    return null;
  }
}

function writeLocalAvatar(value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(AVATAR_KEY, value);
    else window.localStorage.removeItem(AVATAR_KEY);
  } catch {
    // ignore quota
  }
}

export function EditProfilePanel({ onClose, initial, onSaved }: EditProfilePanelProps) {
  const { palette: p } = useTheme();
  const [first, setFirst] = useState(initial.first_name);
  const [last, setLast] = useState(initial.last_name);
  const [avatar, setAvatar] = useState<string | null>(
    initial.avatar_url ?? readLocalAvatar()
  );
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1024 * 1024) {
      setMsg({ kind: "err", text: "Image trop lourde (max 1 Mo)." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") setAvatar(dataUrl);
    };
    reader.readAsDataURL(f);
  };

  const initials = (first?.[0] ?? "") + (last?.[0] ?? "");

  const save = () => {
    setMsg(null);
    startTransition(async () => {
      const r = await updateMyProfileAction({
        first_name: first,
        last_name: last,
      });
      if (!r.ok) {
        setMsg({ kind: "err", text: r.error.message });
        return;
      }
      writeLocalAvatar(avatar);
      setMsg({ kind: "ok", text: "Profil mis à jour" });
      onSaved?.();
      window.setTimeout(onClose, 700);
    });
  };

  return (
    <OverlayShell
      p={p}
      kicker="PROFIL · ÉDITION"
      title={
        <>
          Modifier mon <span style={{ color: p.accent }}>profil</span>
        </>
      }
      onClose={onClose}
      footer={
        <div style={{ display: "flex", gap: 8 }}>
          <div
            onClick={onClose}
            style={{
              padding: "11px 18px",
              background: p.dark ? p.surface2 : p.chip,
              border: `1px solid ${p.border}`,
              borderRadius: 9,
              fontFamily: p.font.mono,
              fontSize: 11,
              color: p.ink2,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: "pointer",
            }}
          >
            ANNULER
          </div>
          <div
            onClick={isPending ? undefined : save}
            style={{
              flex: 1,
              padding: "11px 0",
              textAlign: "center",
              background: isPending ? (p.dark ? p.surface2 : p.chip) : p.accent,
              color: isPending ? p.ink3 : p.dark ? "#0E0E10" : "#FFF",
              borderRadius: 9,
              fontFamily: p.font.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: isPending ? "wait" : "pointer",
              border: `1px solid ${isPending ? p.border : p.accent}`,
            }}
          >
            {isPending ? "ENREGISTREMENT…" : "ENREGISTRER"}
          </div>
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
          padding: 14,
          background: p.surface,
          border: `1px solid ${p.border}`,
          borderRadius: 14,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            flexShrink: 0,
            background: avatar ? "#000" : p.accentSoft,
            backgroundImage: avatar ? `url(${avatar})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: p.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: p.font.mono,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: -1,
            border: `1.5px solid ${p.border}`,
          }}
        >
          {!avatar && (initials.toUpperCase() || "?")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Photo</div>
          <Mono
            style={{
              fontSize: 10.5,
              color: p.ink3,
              letterSpacing: 0.4,
              display: "block",
              marginBottom: 8,
            }}
          >
            JPG / PNG · max 1 Mo
          </Mono>
          <div style={{ display: "flex", gap: 6 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                padding: "6px 10px",
                background: p.dark ? p.surface2 : p.chip,
                border: `1px solid ${p.border}`,
                borderRadius: 6,
                fontFamily: p.font.mono,
                fontSize: 10.5,
                fontWeight: 600,
                color: p.ink2,
                cursor: "pointer",
                letterSpacing: 0.4,
              }}
            >
              CHOISIR
            </div>
            {avatar && (
              <div
                onClick={() => setAvatar(null)}
                style={{
                  padding: "6px 10px",
                  background: "transparent",
                  border: `1px solid ${p.border}`,
                  borderRadius: 6,
                  fontFamily: p.font.mono,
                  fontSize: 10.5,
                  fontWeight: 500,
                  color: p.sem.bad,
                  cursor: "pointer",
                  letterSpacing: 0.4,
                }}
              >
                RETIRER
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <Field p={p} label="Prénom" value={first} onChange={setFirst} placeholder="Prénom" />
      <Field p={p} label="Nom" value={last} onChange={setLast} placeholder="Nom" />
      <Field
        p={p}
        label="Email contact"
        value={initial.email}
        onChange={() => {
          /* email change requires auth flow, locked here */
        }}
        type="email"
        placeholder="adresse@exemple.com"
        disabled
      />

      {msg && (
        <div
          style={{
            marginTop: 4,
            padding: "9px 11px",
            borderRadius: 8,
            background: msg.kind === "err" ? p.sem.bad + "20" : p.sem.ok + "20",
            color: msg.kind === "err" ? p.sem.bad : p.sem.ok,
            fontFamily: p.font.mono,
            fontSize: 11,
            letterSpacing: 0.3,
          }}
        >
          {msg.text}
        </div>
      )}
    </OverlayShell>
  );
}

function Field({
  p,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: {
  p: Palette;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <Mono
        style={{
          fontSize: 9.5,
          color: p.ink3,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </Mono>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          background: p.dark ? p.surface2 : p.surface,
          border: `1px solid ${p.border}`,
          borderRadius: 9,
          padding: "11px 12px",
          fontFamily: p.font.sans,
          fontSize: 14,
          color: disabled ? p.ink3 : p.ink,
          outline: "none",
          opacity: disabled ? 0.7 : 1,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BulkImportPanel — paste CSV, parse, preview, submit.
// ─────────────────────────────────────────────────────────────────
type BulkImportPanelProps = {
  onClose: () => void;
  subjects: TeacherSubject[];
  students: TeacherStudent[];
  onSaved?: (count: number) => void;
};

type ParsedRow = {
  line: number;
  name: string;
  note: number | null;
  max: number;
  studentId?: string;
  matchName?: string;
  error: string | null;
};

export function BulkImportPanel({
  onClose,
  subjects,
  students,
  onSaved,
}: BulkImportPanelProps) {
  const { palette: p } = useTheme();
  const [classSubjectId, setClassSubjectId] = useState<string | null>(
    subjects[0]?.classSubjectId ?? null
  );
  const [evalName, setEvalName] = useState("Évaluation");
  const [raw, setRaw] = useState(
    students
      .slice(0, 6)
      .map(
        (s) =>
          `${s.first_name} ${s.last_name},${(10 + Math.floor(Math.random() * 9)).toFixed(0)},20`
      )
      .join("\n")
  );
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Filter the student pool to only those enrolled in the chosen class.
  const allowedStudents = useMemo(() => {
    if (!classSubjectId) return students;
    const cs = subjects.find((s) => s.classSubjectId === classSubjectId);
    if (!cs) return students;
    return students.filter((s) => s.class_id === cs.classId);
  }, [classSubjectId, students, subjects]);

  const parsed = useMemo<ParsedRow[]>(() => {
    return raw
      .split("\n")
      .map((line, i): ParsedRow | null => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        const cols = trimmed.split(/[,;\t]/).map((c) => c.trim());
        if (cols.length < 2) {
          return {
            line: i + 1,
            name: cols[0] ?? "",
            note: null,
            max: 20,
            error: "note manquante",
          };
        }
        const name = cols[0];
        const note = parseFloat(cols[1].replace(",", "."));
        const max = cols[2] ? parseFloat(cols[2].replace(",", ".")) : 20;
        const lower = name.toLowerCase();
        const match = allowedStudents.find((s) => {
          const full = `${s.first_name} ${s.last_name}`.trim().toLowerCase();
          return (
            full === lower ||
            (s.last_name &&
              s.last_name.length > 2 &&
              lower.includes(s.last_name.toLowerCase()))
          );
        });
        let error: string | null = null;
        if (Number.isNaN(note)) error = "note invalide";
        else if (note < 0 || note > max) error = `hors [0, ${max}]`;
        else if (!match) error = "élève introuvable";
        return {
          line: i + 1,
          name,
          note: Number.isNaN(note) ? null : note,
          max,
          studentId: match?.id,
          matchName: match ? `${match.first_name} ${match.last_name}` : undefined,
          error,
        };
      })
      .filter((row): row is ParsedRow => row !== null);
  }, [raw, allowedStudents]);

  const valid = parsed.filter((r) => !r.error && r.note !== null);
  const errors = parsed.filter((r) => r.error);

  const submit = async () => {
    if (!classSubjectId || valid.length === 0) return;
    setBusy(true);
    setResult(null);
    const r = await bulkAddGradesAction({
      classSubjectId,
      evaluationName: evalName,
      coefficient: 1,
      rows: valid.map((v) => ({
        studentId: v.studentId!,
        score: v.note!,
        maxScore: v.max,
      })),
    });
    setBusy(false);
    if (!r.ok) {
      setResult({ kind: "err", text: r.error.message });
      return;
    }
    setResult({
      kind: "ok",
      text: `${r.data.count} note${r.data.count > 1 ? "s" : ""} publiée${r.data.count > 1 ? "s" : ""}`,
    });
    onSaved?.(r.data.count);
    window.setTimeout(onClose, 900);
  };

  return (
    <OverlayShell
      p={p}
      kicker="PROF · BULK CSV"
      title={
        <>
          Import <span style={{ color: p.accent }}>notes</span>
        </>
      }
      onClose={onClose}
      footer={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Mono style={{ fontSize: 10.5, color: p.ink3, letterSpacing: 0.3 }}>
            <span style={{ color: p.sem.ok, fontWeight: 600 }}>{valid.length}</span> ok
            <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
            <span style={{ color: p.sem.bad, fontWeight: 600 }}>{errors.length}</span> ko
          </Mono>
          <div style={{ flex: 1 }} />
          <div
            onClick={busy || valid.length === 0 ? undefined : submit}
            style={{
              padding: "11px 16px",
              textAlign: "center",
              background:
                busy || valid.length === 0 ? (p.dark ? p.surface2 : p.chip) : p.accent,
              color:
                busy || valid.length === 0 ? p.ink3 : p.dark ? "#0E0E10" : "#FFF",
              borderRadius: 9,
              fontFamily: p.font.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: busy || valid.length === 0 ? "not-allowed" : "pointer",
              border: `1px solid ${
                busy || valid.length === 0 ? p.border : p.accent
              }`,
            }}
          >
            {busy
              ? "PUBLICATION…"
              : `PUBLIER ${valid.length} NOTE${valid.length > 1 ? "S" : ""}`}
          </div>
        </div>
      }
    >
      <Mono
        style={{
          fontSize: 10.5,
          color: p.ink3,
          letterSpacing: 0.4,
          display: "block",
          marginBottom: 10,
        }}
      >
        FORMAT · une ligne par élève ·{" "}
        <span style={{ color: p.ink2 }}>nom prénom, note, max</span>
      </Mono>

      <Mono
        style={{
          fontSize: 9.5,
          color: p.ink3,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6,
        }}
      >
        Matière
      </Mono>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {subjects.map((s) => (
          <div
            key={s.classSubjectId}
            onClick={() => setClassSubjectId(s.classSubjectId)}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              fontSize: 11,
              background:
                classSubjectId === s.classSubjectId
                  ? p.accent
                  : p.dark
                  ? p.surface2
                  : p.chip,
              color:
                classSubjectId === s.classSubjectId
                  ? p.dark
                    ? "#0E0E10"
                    : "#FFF"
                  : p.ink2,
              fontFamily: p.font.mono,
              cursor: "pointer",
              letterSpacing: 0.3,
            }}
          >
            {s.subjectName} · {s.className}
          </div>
        ))}
      </div>

      <Mono
        style={{
          fontSize: 9.5,
          color: p.ink3,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6,
        }}
      >
        Nom de l&apos;évaluation
      </Mono>
      <input
        value={evalName}
        onChange={(e) => setEvalName(e.target.value)}
        placeholder="DS · contrôle · TP…"
        style={{
          width: "100%",
          background: p.dark ? p.surface2 : p.surface,
          border: `1px solid ${p.border}`,
          borderRadius: 9,
          padding: "9px 11px",
          fontFamily: p.font.sans,
          fontSize: 13,
          color: p.ink,
          outline: "none",
          marginBottom: 12,
        }}
      />

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={6}
        style={{
          width: "100%",
          background: p.dark ? p.surface2 : p.surface,
          border: `1px solid ${p.border}`,
          borderRadius: 9,
          padding: "10px 12px",
          fontFamily: p.font.mono,
          fontSize: 12,
          lineHeight: 1.5,
          color: p.ink,
          outline: "none",
          resize: "vertical",
        }}
      />

      <Mono
        style={{
          fontSize: 10,
          color: p.ink4,
          letterSpacing: 0.4,
          display: "block",
          margin: "12px 0 6px",
        }}
      >
        APERÇU · {parsed.length} LIGNE{parsed.length > 1 ? "S" : ""}
      </Mono>
      <div
        style={{
          background: p.surface,
          border: `1px solid ${p.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {parsed.length === 0 && (
          <div
            style={{
              padding: 14,
              color: p.ink4,
              fontFamily: p.font.mono,
              fontSize: 11,
              textAlign: "center",
            }}
          >
            — VIDE —
          </div>
        )}
        {parsed.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderBottom:
                i === parsed.length - 1 ? "none" : `1px solid ${p.border}`,
              background: r.error ? p.sem.bad + "0d" : "transparent",
            }}
          >
            <Mono style={{ fontSize: 10, color: p.ink4, width: 16 }}>{r.line}</Mono>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: r.error ? p.ink3 : p.ink,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.matchName ?? r.name}
              </div>
              {r.error && (
                <Mono style={{ fontSize: 10, color: p.sem.bad, letterSpacing: 0.3 }}>
                  ⚠ {r.error}
                </Mono>
              )}
            </div>
            {!r.error && r.note !== null && (
              <Mono
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: -0.3,
                  color:
                    r.note >= 14 ? p.sem.ok : r.note < 10 ? p.sem.bad : p.ink,
                }}
              >
                {r.note}
              </Mono>
            )}
            {!r.error && <Mono style={{ fontSize: 10, color: p.ink4 }}>/{r.max}</Mono>}
          </div>
        ))}
      </div>

      {result && (
        <div
          style={{
            marginTop: 12,
            padding: "9px 11px",
            borderRadius: 8,
            background: result.kind === "err" ? p.sem.bad + "20" : p.sem.ok + "20",
            color: result.kind === "err" ? p.sem.bad : p.sem.ok,
            fontFamily: p.font.mono,
            fontSize: 11,
            letterSpacing: 0.3,
          }}
        >
          {result.text}
        </div>
      )}
    </OverlayShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// Notification bell (used in page headers).
// ─────────────────────────────────────────────────────────────────
export function NotifBellPill({
  p,
  unread,
  onClick,
}: {
  p: Palette;
  unread: number;
  onClick: () => void;
}) {
  return (
    <span
      onClick={(e) => {
        hapticPing(e.currentTarget);
        onClick();
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px 5px 8px",
        background: unread > 0 ? p.accent : p.surface,
        color:
          unread > 0
            ? p.dark
              ? "#0E0E10"
              : "#FFFFFF"
            : p.ink2,
        border: `1px solid ${
          unread > 0 ? "transparent" : p.borderStrong || p.border
        }`,
        borderRadius: 999,
        fontFamily: p.font.mono,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.5,
        lineHeight: 1,
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        style={{ display: "block" }}
      >
        <path
          d="M8 1.5C5.79 1.5 4 3.29 4 5.5V8L2.75 10.5H13.25L12 8V5.5C12 3.29 10.21 1.5 8 1.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M6.5 12.5C6.5 13.33 7.17 14 8 14C8.83 14 9.5 13.33 9.5 12.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span>NOTIF</span>
      {unread > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 16,
            height: 16,
            padding: "0 5px",
            background: p.dark ? "#0E0E10" : "#FFFFFF",
            color: p.accent,
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: 0,
            marginLeft: 1,
            marginRight: -3,
          }}
        >
          {unread}
        </span>
      )}
    </span>
  );
}
