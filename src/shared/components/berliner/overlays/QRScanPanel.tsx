"use client";

import { useEffect, useState } from "react";
import { markAttendanceAction } from "@/actions/berliner";
import { useTheme } from "@/shared/design/ThemeProvider";
import { ditherGradient } from "@/shared/design/tokens";
import { Mono } from "@/shared/design/primitives";
import { OverlayShell } from "./OverlayShell";

// QRScanPanel — fake camera + manual code entry.
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
            Saisie <span className="text-primary">manuelle</span>
          </>
        ) : (
          <>
            Scanner le QR{" "}
            <span className="text-[18px] font-medium text-ink-3">du cours</span>
          </>
        )
      }
      onClose={onClose}
    >
      <Mono className="mb-3.5 block text-[11px] tracking-[0.4px] text-ink-3">
        {sessionTitle ? sessionTitle.toUpperCase() : "CRÉNEAU EN COURS"} · TOKEN{" "}
        <span className="text-ink-2">{token}</span>
      </Mono>

      {phase !== "manual" && (
        <div
          className="relative overflow-hidden rounded-2xl border border-border"
          style={{
            aspectRatio: "1 / 1",
            background: p.dark ? "#0A0A0C" : "#1A1A1D",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              ...ditherGradient({ fg: "#fff", alpha: 0.08 }),
              backgroundColor: p.dark ? "#0A0A0C" : "#1A1A1D",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 40%, ${p.accent}30 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 70% 70%, ${p.sem.info}25 0%, transparent 50%)`,
            }}
          />

          <div className="absolute" style={{ inset: "12% 12%" }}>
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
                className="absolute grid animate-berliner-slide-up"
                style={{
                  inset: "20%",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1.5,
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
            className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-[9px] px-3 py-2 font-mono text-[11px] tracking-[0.4px] text-white"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {phase === "scanning" && (
              <>
                <span
                  className="h-2 w-2 rounded-full animate-berliner-pulse"
                  style={{ background: p.accent }}
                />
                ALIGNER LE QR DANS LE CADRE
              </>
            )}
            {phase === "found" && (
              <>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: p.sem.warn }}
                />
                CODE DÉTECTÉ · VÉRIFICATION
              </>
            )}
            {phase === "done" && (
              <>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: p.sem.ok }}
                />
                ✓ PRÉSENCE ENREGISTRÉE
              </>
            )}
          </div>
        </div>
      )}

      {phase === "manual" && (
        <div className="mt-1 rounded-[14px] border border-border bg-surface p-4">
          <Mono className="mb-2 block text-[10.5px] uppercase tracking-[0.5px] text-ink-3">
            CODE COURS · 6 CARACTÈRES
          </Mono>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder={token}
            maxLength={6}
            className="w-full rounded-[9px] border-[1.5px] border-border bg-chip px-3.5 py-[13px] text-center font-mono text-[22px] font-semibold uppercase tracking-[6px] text-ink outline-none dark:bg-surface-2"
          />
          <div
            onClick={submitManual}
            className="mt-3 rounded-[9px] py-[11px] text-center font-mono text-xs font-semibold tracking-[0.5px]"
            style={{
              background: code.length === 6 ? p.accent : p.dark ? p.surface2 : p.chip,
              color: code.length === 6 ? (p.dark ? "#0E0E10" : "#FFF") : p.ink3,
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
          className="mt-3 rounded-lg px-[11px] py-[9px] font-mono text-[11px] tracking-[0.3px]"
          style={{ background: p.sem.bad + "20", color: p.sem.bad }}
        >
          {error}
        </div>
      )}

      {phase !== "done" && phase !== "manual" && (
        <div
          onClick={() => setPhase("manual")}
          className="mt-3.5 cursor-pointer rounded-[9px] border border-border bg-transparent py-2.5 text-center font-mono text-[11px] tracking-[0.4px] text-ink-3"
        >
          SAISIR LE CODE MANUELLEMENT
        </div>
      )}
      {phase === "manual" && (
        <div
          onClick={() => setPhase("scanning")}
          className="mt-3.5 cursor-pointer rounded-[9px] border border-border bg-transparent py-2.5 text-center font-mono text-[11px] tracking-[0.4px] text-ink-3"
        >
          ← REVENIR AU SCAN
        </div>
      )}

      {phase === "done" && (
        <div
          onClick={onClose}
          className="mt-4 cursor-pointer rounded-[9px] py-3 text-center font-mono text-xs font-semibold tracking-[0.5px]"
          style={{ background: p.accent, color: p.dark ? "#0E0E10" : "#FFF" }}
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
