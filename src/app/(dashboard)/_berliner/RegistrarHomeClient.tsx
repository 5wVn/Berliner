"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { ditherGradient } from "@/shared/design/tokens";
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
import type {
  AttendanceAlert,
  PendingEnrollment,
  RegistrarStats,
} from "@/shared/lib/registrarData";

type RegistrarHomeClientProps = {
  firstName: string;
  stats: RegistrarStats | null;
  statsError: string | null;
  enrollments: PendingEnrollment[] | null;
  enrollmentsError: string | null;
  alerts: AttendanceAlert[] | null;
  alertsError: string | null;
};

export function RegistrarHomeClient({
  firstName,
  stats,
  statsError,
  enrollments,
  enrollmentsError,
  alerts,
  alertsError,
}: RegistrarHomeClientProps) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();

  const totalStudents = stats?.total_students ?? 0;
  const newEnrollments = stats?.new_enrollments_month ?? 0;
  const attendanceRate = stats?.global_attendance_rate ?? 0;

  const enrollmentList = enrollments ?? [];
  const alertList = alerts ?? [];

  const isEmpty =
    !stats &&
    enrollmentList.length === 0 &&
    alertList.length === 0 &&
    !statsError &&
    !enrollmentsError &&
    !alertsError;

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      {/* Header */}
      <div
        style={{
          padding: "14px 20px 8px",
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
              height: 160,
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
              marginBottom: 12,
            }}
          >
            <span>BERLINER · SCOLARITÉ</span>
            <NotifBellPill
              p={p}
              unread={unreadCount}
              onClick={() => setShowNotifs(true)}
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
              fontSize: 13.5,
              color: p.ink3,
              letterSpacing: 0.3,
              flexWrap: "wrap",
            }}
          >
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {totalStudents}
              </Mono>{" "}
              élèves
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {newEnrollments}
              </Mono>{" "}
              ce mois
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {attendanceRate}%
              </Mono>{" "}
              présence
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* === KPI tiles === */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          <KpiTile
            label="ÉLÈVES"
            value={String(totalStudents)}
            sub="inscrits"
            accent={p.accent}
            p={p}
          />
          <KpiTile
            label="MOIS"
            value={String(newEnrollments)}
            sub="inscriptions"
            accent={p.sem.info}
            p={p}
          />
          <KpiTile
            label="PRÉSENCE"
            value={`${attendanceRate}%`}
            sub="globale"
            accent={
              attendanceRate >= 85
                ? p.sem.ok
                : attendanceRate >= 70
                ? p.sem.warn
                : p.sem.bad
            }
            p={p}
          />
          <KpiTile
            label="DEMANDES"
            value={String(stats?.pending_document_requests ?? 0)}
            sub="documents"
            accent={p.sem.warn}
            p={p}
          />
        </div>

        {statsError && (
          <SectionEmpty p={p}>STATS · {statsError.toUpperCase()}</SectionEmpty>
        )}

        {/* === Inscriptions en attente === */}
        {(enrollmentList.length > 0 || enrollmentsError) && (
          <>
            <AppSectionLabel
              p={p}
              action="Étudiants"
              onAction={() => router.push("/registrar/students")}
            >
              INSCRIPTIONS EN ATTENTE
            </AppSectionLabel>
            {enrollmentsError ? (
              <SectionEmpty p={p}>
                ERREUR · {enrollmentsError.toUpperCase()}
              </SectionEmpty>
            ) : (
              <AppCard p={p}>
                {enrollmentList.map((it, i) => (
                  <div
                    key={it.id}
                    onClick={(e) => {
                      hapticPing(e.currentTarget);
                      router.push("/registrar/students");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      cursor: "pointer",
                      borderBottom:
                        i === enrollmentList.length - 1
                          ? "none"
                          : `1px solid ${p.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 32,
                        borderRadius: 2,
                        background: p.accent,
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
                        {it.student_name}
                      </div>
                      <Mono
                        style={{
                          fontSize: 12.5,
                          color: p.ink3,
                          letterSpacing: 0.3,
                        }}
                      >
                        {it.program} ·{" "}
                        {new Date(it.request_date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </Mono>
                    </div>
                    <span style={{ color: p.ink3, fontSize: 20 }}>›</span>
                  </div>
                ))}
              </AppCard>
            )}
          </>
        )}

        {/* === Alertes assiduité === */}
        {(alertList.length > 0 || alertsError) && (
          <>
            <AppSectionLabel
              p={p}
              action="Voir tout"
              onAction={() => router.push("/registrar/students")}
            >
              ALERTES ASSIDUITÉ
            </AppSectionLabel>
            {alertsError ? (
              <SectionEmpty p={p}>
                ERREUR · {alertsError.toUpperCase()}
              </SectionEmpty>
            ) : (
              <AppCard p={p}>
                {alertList.map((it, i) => {
                  const color =
                    it.attendance_rate < 50
                      ? p.sem.bad
                      : it.attendance_rate < 65
                      ? p.sem.warn
                      : p.accent;
                  return (
                    <div
                      key={it.id}
                      onClick={(e) => {
                        hapticPing(e.currentTarget);
                        router.push("/registrar/students");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        cursor: "pointer",
                        borderBottom:
                          i === alertList.length - 1
                            ? "none"
                            : `1px solid ${p.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          background: color,
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
                          {it.student_name}
                        </div>
                        <Mono
                          style={{
                            fontSize: 12.5,
                            color: p.ink3,
                            letterSpacing: 0.3,
                          }}
                        >
                          {it.class_name || "—"}
                        </Mono>
                      </div>
                      <Mono
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          letterSpacing: -0.3,
                          color,
                        }}
                      >
                        {it.attendance_rate}%
                      </Mono>
                    </div>
                  );
                })}
              </AppCard>
            )}
          </>
        )}

        {/* === Empty state === */}
        {isEmpty && <SectionEmpty p={p}>RIEN EN ATTENTE — RAS.</SectionEmpty>}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={() => router.push("/registrar")}
        />
      )}
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// KPI tile — tighter than AppCard, two per row.
// ─────────────────────────────────────────────────────────────────
function KpiTile({
  label,
  value,
  sub,
  accent,
  p,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  p: ReturnType<typeof useTheme>["palette"];
}) {
  return (
    <div
      style={{
        background: p.surface,
        border: `1px solid ${p.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 24,
          height: 3,
          borderRadius: 2,
          background: accent,
          marginBottom: 10,
        }}
      />
      <Mono
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: p.ink,
          letterSpacing: -0.5,
          lineHeight: 1,
          display: "block",
        }}
      >
        {value}
      </Mono>
      <div
        style={{
          fontFamily: p.font.mono,
          fontSize: 11.5,
          color: p.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginTop: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12.5, color: p.ink4, marginTop: 1 }}>{sub}</div>
    </div>
  );
}
