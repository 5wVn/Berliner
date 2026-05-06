"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  type AccentName,
} from "@/shared/design/tokens";
import { GlobalAnimations, Mono, ScrollFade } from "@/shared/design/primitives";
import {
  EditProfilePanel,
  NotificationsPanel,
  readLocalAvatar,
  useNotificationFeed,
} from "@/shared/components/berliner/Overlays";
import type { UserRole } from "@/shared/types/auth";

const ROLE_LABEL: Record<UserRole, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  registrar: "Scolarité",
  academic_head: "Responsable pédagogique",
  company: "Entreprise",
  super_admin: "Super administrateur",
};

const ROLE_KICKER: Record<UserRole, string> = {
  student: "BERLINER · ÉLÈVE",
  teacher: "BERLINER · PROF",
  registrar: "BERLINER · SCOLARITÉ",
  academic_head: "BERLINER · DIRECTION",
  company: "BERLINER · ENTREPRISE",
  super_admin: "BERLINER · ADMIN",
};

const ROLE_HOME: Record<UserRole, string> = {
  student: "/student",
  teacher: "/teacher",
  registrar: "/registrar",
  academic_head: "/academic-head",
  company: "/company",
  super_admin: "/academic-head",
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

type Props = {
  role: UserRole;
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  establishmentName: string | null;
};

export function RoleProfileClient({ role, profile, establishmentName }: Props) {
  const { palette: p, theme, setTheme, accent, setAccent } = useTheme();
  const router = useRouter();
  const [overlay, setOverlay] = useState<null | "edit" | "notifs">(null);
  const [isPending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    setAvatarUrl(readLocalAvatar());
  }, [overlay]);
  const { unreadCount } = useNotificationFeed();

  const initials =
    ((profile.first_name?.[0] ?? "") + (profile.last_name?.[0] ?? "")).toUpperCase() ||
    "U";
  const displayName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "Mon compte";

  const onSignOut = () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Se déconnecter de Berliner ?")
    ) {
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
      <div
        style={{
          padding: "16px 20px 14px",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, transparent 100%)",
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
            <span>{ROLE_KICKER[role]}</span>
            <span>{ROLE_LABEL[role]}</span>
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
                backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none",
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
              {!avatarUrl && initials}
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
                {profile.email}
              </Mono>
              {establishmentName && (
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
                  {establishmentName}
                </Mono>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "0 16px 24px" }}>
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
            meta={profile.email}
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
            first_name: profile.first_name ?? "",
            last_name: profile.last_name ?? "",
            email: profile.email,
            avatar_url: avatarUrl,
          }}
          onSaved={() => router.refresh()}
        />
      )}
      {overlay === "notifs" && (
        <NotificationsPanel
          onClose={() => setOverlay(null)}
          onNav={() => router.push(ROLE_HOME[role])}
        />
      )}
    </PageShell>
  );
}
