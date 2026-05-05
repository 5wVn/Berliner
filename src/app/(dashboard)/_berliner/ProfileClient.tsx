"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type BerlinerState } from "@/actions/berliner-state";
import { computeGlobalAverage } from "@/shared/lib/berliner-stats";
import { logoutAction } from "@/actions/auth";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppRow,
  AppSectionLabel,
  PageShell,
} from "@/shared/components/berliner/Shell";
import {
  ACCENTS,
  APP_BUILD,
  APP_VERSION,
  ditherGradient,
  termFromDate,
  type AccentName,
} from "@/shared/design/tokens";
import { GlobalAnimations, Mono, ScrollFade } from "@/shared/design/primitives";
import {
  EditProfilePanel,
  NotificationsPanel,
  readLocalAvatar,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";
import { useEffect } from "react";

const ROLE_LABEL: Record<string, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  registrar: "Scolarité",
  academic_head: "Responsable pédagogique",
  company: "Entreprise",
  super_admin: "Super administrateur",
};

const ACCENT_C: Record<AccentName, string> = {
  green: "oklch(0.72 0.16 145)",
  blue: "oklch(0.66 0.18 250)",
  orange: "oklch(0.72 0.18 50)",
  violet: "oklch(0.66 0.20 305)",
  lemon: "oklch(0.86 0.18 105)",
  slate: "#c3cdff",
  red: "oklch(0.66 0.22 15)",
};

export function ProfileClient({ state }: { state: BerlinerState }) {
  const { palette: p, theme, setTheme, accent, setAccent } = useTheme();
  const router = useRouter();
  const isStudent = state.profile.role === "student";
  const [overlay, setOverlay] = useState<null | "edit" | "notifs">(null);
  const [isPending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    // Re-read after the edit overlay closes so a freshly-picked avatar
    // shows up without a full page refresh.
    setAvatarUrl(readLocalAvatar());
  }, [overlay]);
  const { unreadCount } = useNotificationFeed();

  const grades = isStudent
    ? state.grades.filter((g) => g.studentId === state.profile.id)
    : state.grades;

  // Stats
  const totalAttendance = state.attendance.length;
  const presentish = state.attendance.filter((a) => {
    const v = (a.status || "").toLowerCase();
    return (
      v.includes("present") || v.includes("late") || v.includes("excuse")
    );
  }).length;
  const presencePct =
    totalAttendance > 0 ? Math.round((presentish / totalAttendance) * 100) : 0;

  const totalEvals = state.evaluations.length;
  const completedEvals = isStudent
    ? state.grades.filter((g) => g.studentId === state.profile.id).length
    : state.grades.length;

  const globalAvg = computeGlobalAverage({
    subjects: state.subjects,
    grades,
  });

  // T1 → T2 delta
  const t1 = grades.filter((g) => termFromDate(g.evaluationDate) === "T1");
  const t2 = grades.filter((g) => termFromDate(g.evaluationDate) === "T2");
  const avgT1 =
    t1.length > 0
      ? t1.reduce((a, g) => a + (g.score / Math.max(g.maxScore, 1)) * 20, 0) /
        t1.length
      : null;
  const avgT2 =
    t2.length > 0
      ? t2.reduce((a, g) => a + (g.score / Math.max(g.maxScore, 1)) * 20, 0) /
        t2.length
      : null;
  const noteDelta = avgT1 != null && avgT2 != null ? avgT2 - avgT1 : null;

  const stats = [
    { l: "Présence", v: `${presencePct}%`, sub: "globale", delta: null as number | null },
    {
      l: "Moyenne",
      v: globalAvg != null ? globalAvg.toFixed(1) : "—",
      sub: "globale",
      delta: noteDelta,
    },
    {
      l: isStudent ? "Devoirs" : "Notes",
      v: `${completedEvals}/${totalEvals}`,
      sub: isStudent ? "rendus" : "publiées",
      delta: null as number | null,
    },
  ];

  const initials =
    (state.profile.first_name?.[0] ?? "") +
    (state.profile.last_name?.[0] ?? "");
  const displayName =
    [state.profile.first_name, state.profile.last_name].filter(Boolean).join(" ") ||
    "Mon compte";

  const onSignOut = () => {
    if (typeof window !== "undefined" && !window.confirm("Se déconnecter de Berliner ?")) {
      return;
    }
    startTransition(async () => {
      await logoutAction();
      router.push("/");
      router.refresh();
    });
  };

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      {/* Header */}
      <div style={{ padding: "16px 20px 14px", position: "relative", overflow: "hidden" }}>
        {!p.dark && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 180,
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
              fontSize: 13,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            <span>PROFIL</span>
            <span>{ROLE_LABEL[state.profile.role] ?? "Compte"}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              onClick={() => setOverlay("edit")}
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                flexShrink: 0,
                background: avatarUrl ? "#000" : p.accentSoft,
                backgroundImage: avatarUrl
                  ? `url(${avatarUrl})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: p.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: p.font.mono,
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: -1,
                border: `1.5px solid ${p.border}`,
                cursor: "pointer",
              }}
            >
              {!avatarUrl && initials.toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: -0.4,
                  lineHeight: 1.1,
                }}
              >
                {displayName}
              </div>
              <Mono
                style={{
                  fontSize: 13,
                  color: p.ink3,
                  marginTop: 4,
                  letterSpacing: 0.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {state.profile.email}
              </Mono>
              {state.profile.class_name && (
                <Mono
                  style={{
                    fontSize: 12.5,
                    color: p.accent,
                    marginTop: 4,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    display: "block",
                    fontWeight: 600,
                  }}
                >
                  {state.profile.class_name}
                </Mono>
              )}
              {state.establishmentName && !state.profile.class_name && (
                <Mono
                  style={{
                    fontSize: 12.5,
                    color: p.ink3,
                    marginTop: 4,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    display: "block",
                  }}
                >
                  {state.establishmentName}
                </Mono>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "0 16px 24px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {stats.map((s) => (
            <div
              key={s.l}
              style={{
                flex: 1,
                background: p.surface,
                border: `1px solid ${p.border}`,
                borderRadius: 12,
                padding: "11px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <Mono
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: p.ink,
                    letterSpacing: -0.5,
                    lineHeight: 1,
                  }}
                >
                  {s.v}
                </Mono>
                {s.delta != null && (
                  <Mono
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: s.delta >= 0 ? p.sem.ok : p.sem.bad,
                    }}
                  >
                    {s.delta >= 0 ? "↑" : "↓"}
                    {Math.abs(s.delta).toFixed(1)}
                  </Mono>
                )}
              </div>
              <div
                style={{
                  fontFamily: p.font.mono,
                  fontSize: 11.5,
                  color: p.ink3,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginTop: 6,
                }}
              >
                {s.l}
              </div>
              <div style={{ fontSize: 12.5, color: p.ink4, marginTop: 1 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        <AppSectionLabel p={p}>COMPTE</AppSectionLabel>
        <AppCard p={p}>
          <AppRow
            p={p}
            iconBg={p.accent}
            title="Modifier mon profil"
            kind="compte"
            meta="nom, photo"
            onClick={() => setOverlay("edit")}
          />
          <AppRow
            p={p}
            iconBg={p.sem.warn}
            title="Notifications"
            kind="flux"
            meta={`${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
            onClick={() => setOverlay("notifs")}
            last
          />
        </AppCard>

        <AppSectionLabel p={p}>APPARENCE</AppSectionLabel>
        <div
          style={{
            background: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Mono
              style={{
                fontSize: 13,
                color: p.ink2,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Thème
            </Mono>
            <div
              style={{
                display: "flex",
                background: p.dark ? p.surface2 : p.chip,
                border: `1px solid ${p.border}`,
                borderRadius: 7,
                padding: 2,
              }}
            >
              {(["light", "dark"] as const).map((t) => (
                <span
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 5,
                    background: theme === t ? p.surface : "transparent",
                    color: theme === t ? p.ink : p.ink3,
                    fontFamily: p.font.mono,
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    border:
                      theme === t
                        ? `1px solid ${p.border}`
                        : "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Mono
              style={{
                fontSize: 13,
                color: p.ink2,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Accent
            </Mono>
            <div style={{ display: "flex", gap: 6 }}>
              {ACCENTS.map((name) => {
                const active = name === accent;
                return (
                  <span
                    key={name}
                    onClick={() => setAccent(name)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      background: ACCENT_C[name],
                      cursor: "pointer",
                      border: active
                        ? `2px solid ${p.ink}`
                        : `1px solid ${p.border}`,
                      transition: "all 150ms",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <AppSectionLabel p={p}>SESSION</AppSectionLabel>
        <AppCard p={p}>
          <AppRow
            p={p}
            iconBg={p.sem.bad}
            title={isPending ? "Déconnexion…" : "Se déconnecter"}
            kind="session"
            meta={state.profile.email}
            onClick={isPending ? undefined : onSignOut}
            right={
              <Mono
                style={{
                  fontSize: 12,
                  color: p.sem.bad,
                  letterSpacing: 0.4,
                }}
              >
                EXIT
              </Mono>
            }
            last
          />
        </AppCard>

        <div style={{ height: 24 }} />
        <div
          style={{
            fontFamily: p.font.mono,
            fontSize: 12.5,
            color: p.ink4,
            textAlign: "center",
            letterSpacing: 0.4,
            padding: "0 16px",
            cursor: "default",
            userSelect: "none",
          }}
        >
          BERLINER · {APP_VERSION} · build {APP_BUILD}
        </div>
      </ScrollFade>

      {overlay === "edit" && (
        <EditProfilePanel
          onClose={() => {
            setOverlay(null);
            router.refresh();
          }}
          initial={{
            first_name: state.profile.first_name,
            last_name: state.profile.last_name,
            email: state.profile.email,
            avatar_url: avatarUrl,
          }}
          onSaved={() => router.refresh()}
        />
      )}
      {overlay === "notifs" && (
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
    </PageShell>
  );
}
