"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type BerlinerState } from "@/actions/berliner-state";
import { computeGlobalAverage } from "@/shared/lib/berliner-stats";
import { logoutAction } from "@/actions/auth";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  APP_BUILD,
  APP_VERSION,
  ditherGradient,
  subjectColor,
  termFromDate,
} from "@/shared/design/tokens";
import { ScrollFade } from "@/shared/design/primitives";
import {
  EditProfilePanel,
  NotificationsPanel,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";

const ROLE_LABEL: Record<string, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  registrar: "Scolarité",
  academic_head: "Responsable pédagogique",
  company: "Entreprise",
  super_admin: "Super administrateur",
};

// Petit libellé de section (mono, majuscules).
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[18px] mb-2 px-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.6px] text-ink-3">
      {children}
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

// Ligne d'action avec barre de couleur, libellé, méta et slot à droite.
function Row({
  barColor,
  kind,
  title,
  meta,
  right,
  onClick,
  last,
}: {
  barColor: string;
  kind: string;
  title: string;
  meta: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  last?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-[11px] ${
        onClick ? "cursor-pointer" : ""
      } ${last ? "" : "border-b border-border"}`}
    >
      <div
        className="h-7 w-1 shrink-0 rounded-[2px]"
        style={{ background: barColor }}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.5px] text-ink-3">
          {kind}
        </div>
        <div className="text-[14px] font-medium leading-[1.2]">{title}</div>
        <div className="font-mono text-[10.5px] tracking-[0.3px] text-ink-3">
          {meta}
        </div>
      </div>
      {right ?? <span className="text-[18px] text-ink-3">›</span>}
    </div>
  );
}

export function ProfileClient({ state }: { state: BerlinerState }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const isStudent = state.profile.role === "student";
  const [overlay, setOverlay] = useState<null | "edit" | "notifs">(null);
  const [isPending, startTransition] = useTransition();
  const { unreadCount } = useNotificationFeed();

  const grades = isStudent
    ? state.grades.filter((g) => g.studentId === state.profile.id)
    : state.grades;

  // Présence
  const totalAttendance = state.attendance.length;
  const presentish = state.attendance.filter((a) => {
    const v = (a.status || "").toLowerCase();
    return v.includes("present") || v.includes("late") || v.includes("excuse");
  }).length;
  const presencePct =
    totalAttendance > 0 ? Math.round((presentish / totalAttendance) * 100) : 0;

  const totalEvals = state.evaluations.length;
  const completedEvals = isStudent
    ? state.grades.filter((g) => g.studentId === state.profile.id).length
    : state.grades.length;

  const globalAvg = computeGlobalAverage({ subjects: state.subjects, grades });

  // Évolution T1 → T2
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
    (state.profile.first_name?.[0] ?? "") + (state.profile.last_name?.[0] ?? "");
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
    <div className="relative flex min-h-[100dvh] w-full flex-col text-ink">
      {/* En-tête */}
      <div className="relative overflow-hidden px-5 pb-3.5 pt-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[180px] dark:hidden"
          style={{
            ...ditherGradient({ fg: subjectColor("red"), alpha: 0.4 }),
            maskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
          }}
        />
        <div className="relative">
          <div className="mb-3.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
            <span>PROFIL</span>
            <span>{ROLE_LABEL[state.profile.role] ?? "Compte"}</span>
          </div>

          <div className="flex items-center gap-4">
            <div
              onClick={() => setOverlay("edit")}
              className="flex h-[88px] w-[88px] shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-border bg-primary/15 font-mono text-[32px] font-semibold tracking-[-1px] text-primary"
            >
              {initials.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[24px] font-semibold leading-[1.1] tracking-[-0.4px]">
                {displayName}
              </div>
              <div className="mt-1 block truncate font-mono text-[11px] tracking-[0.3px] text-ink-3">
                {state.profile.email}
              </div>
              {state.profile.class_name ? (
                <div className="mt-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.4px] text-primary">
                  {state.profile.class_name}
                </div>
              ) : (
                state.establishmentName && (
                  <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.4px] text-ink-3">
                    {state.establishmentName}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "0 16px 24px" }}>
        {/* Stats */}
        <div className="mb-1 flex gap-2">
          {stats.map((s) => (
            <div
              key={s.l}
              className="flex-1 rounded-[12px] border border-border bg-surface px-3 py-[11px]"
            >
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-[22px] font-semibold leading-none tracking-[-0.5px] tabular-nums">
                  {s.v}
                </span>
                {s.delta != null && (
                  <span
                    className={`font-mono text-[9.5px] font-semibold ${
                      s.delta >= 0 ? "text-sem-ok" : "text-sem-bad"
                    }`}
                  >
                    {s.delta >= 0 ? "↑" : "↓"}
                    {Math.abs(s.delta).toFixed(1)}
                  </span>
                )}
              </div>
              <div className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.5px] text-ink-3">
                {s.l}
              </div>
              <div className="mt-px text-[10.5px] text-ink-4">{s.sub}</div>
            </div>
          ))}
        </div>

        <SectionLabel>COMPTE</SectionLabel>
        <Card>
          <Row
            barColor="var(--primary)"
            kind="compte"
            title="Modifier mon profil"
            meta="nom, photo"
            onClick={() => setOverlay("edit")}
          />
          <Row
            barColor="var(--sem-warn)"
            kind="flux"
            title="Notifications"
            meta={`${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
            onClick={() => setOverlay("notifs")}
            last
          />
        </Card>

        <SectionLabel>APPARENCE</SectionLabel>
        <div className="mb-2 rounded-[14px] border border-border bg-surface px-3.5 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.4px] text-ink-2">
              Thème
            </span>
            <div className="flex rounded-[7px] border border-border bg-chip p-0.5">
              {(["light", "dark"] as const).map((t) => (
                <span
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`cursor-pointer rounded-[5px] border px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.4px] ${
                    theme === t
                      ? "border-border bg-surface text-ink"
                      : "border-transparent text-ink-3"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <SectionLabel>SESSION</SectionLabel>
        <Card>
          <Row
            barColor="var(--sem-bad)"
            kind="session"
            title={isPending ? "Déconnexion…" : "Se déconnecter"}
            meta={state.profile.email}
            onClick={isPending ? undefined : onSignOut}
            right={
              <span className="font-mono text-[10px] tracking-[0.4px] text-sem-bad">
                EXIT
              </span>
            }
            last
          />
        </Card>

        <div className="h-6" />
        <div className="select-none px-4 text-center font-mono text-[10.5px] tracking-[0.4px] text-ink-4">
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
            avatar_url: state.profile.avatar_url,
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
    </div>
  );
}
