"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { ditherGradient } from "@/shared/design/tokens";
import { GlobalAnimations, Mono, ScrollFade } from "@/shared/design/primitives";

export type RegistrarStats = {
  total_students: number;
  new_enrollments_month: number;
  global_attendance_rate: number;
  pending_document_requests: number;
};

export type RegistrarPendingEnrollment = {
  id: string;
  student_name: string;
  program: string;
  request_date: string;
};

export type RegistrarDocumentRequest = {
  id: string;
  student_name: string;
  document_type: string;
  request_date: string;
  status: "pending" | "processing";
};

export type RegistrarAttendanceAlert = {
  id: string;
  student_name: string;
  class_name: string;
  attendance_rate: number;
};

type RegistrarHomeClientProps = {
  userName: string;
  stats: RegistrarStats | null;
  statsError: string | null;
  enrollments: RegistrarPendingEnrollment[] | null;
  enrollmentsError: string | null;
  requests: RegistrarDocumentRequest[] | null;
  requestsError: string | null;
  alerts: RegistrarAttendanceAlert[] | null;
  alertsError: string | null;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

export function RegistrarHomeClient({
  userName,
  stats,
  statsError,
  enrollments,
  enrollmentsError,
  requests,
  requestsError,
  alerts,
  alertsError,
}: RegistrarHomeClientProps) {
  const { palette: p } = useTheme();
  const router = useRouter();

  const firstName = userName.split(" ")[0] || "toi";

  return (
    <PageShell p={p}>
      <GlobalAnimations />

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
              fontFamily: p.font.mono,
              fontSize: 11,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            BERLINER · SCOLARITÉ
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            Bonjour <span style={{ color: p.accent }}>{firstName}</span>.
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
                {stats?.total_students ?? "—"}
              </Mono>{" "}
              élèves
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {stats?.pending_document_requests ?? "—"}
              </Mono>{" "}
              demandes
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {stats?.global_attendance_rate != null
                  ? `${stats.global_attendance_rate}%`
                  : "—"}
              </Mono>{" "}
              prés.
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* === Stats grid === */}
        <AppSectionLabel p={p}>VUE D&apos;ENSEMBLE</AppSectionLabel>
        {statsError ? (
          <SectionEmpty p={p}>{statsError}</SectionEmpty>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <StatTile
              p={p}
              label="Élèves"
              value={stats?.total_students ?? 0}
              sub="inscrits"
              accent
            />
            <StatTile
              p={p}
              label="Inscriptions"
              value={stats?.new_enrollments_month ?? 0}
              sub="ce mois"
            />
            <StatTile
              p={p}
              label="Présence"
              value={`${stats?.global_attendance_rate ?? 0}%`}
              sub="globale"
            />
            <StatTile
              p={p}
              label="Demandes"
              value={stats?.pending_document_requests ?? 0}
              sub="en attente"
            />
          </div>
        )}

        {/* === Pending enrollments === */}
        <AppSectionLabel
          p={p}
          action="Tout voir"
          onAction={() => router.push("/registrar/students")}
        >
          INSCRIPTIONS EN ATTENTE
        </AppSectionLabel>
        {enrollmentsError ? (
          <SectionEmpty p={p}>{enrollmentsError}</SectionEmpty>
        ) : !enrollments || enrollments.length === 0 ? (
          <SectionEmpty p={p}>AUCUNE INSCRIPTION EN ATTENTE</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {enrollments.map((e, i) => (
              <div
                key={e.id}
                onClick={() => router.push("/registrar/students")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  cursor: "pointer",
                  borderBottom:
                    i === enrollments.length - 1
                      ? "none"
                      : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 36,
                    borderRadius: 2,
                    background: p.accent,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>
                    {e.student_name}
                  </div>
                  <Mono
                    style={{
                      fontSize: 10.5,
                      color: p.ink3,
                      letterSpacing: 0.3,
                      textTransform: "uppercase",
                    }}
                  >
                    {e.program}
                  </Mono>
                </div>
                <Mono
                  style={{
                    fontSize: 10.5,
                    color: p.accent,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                  }}
                >
                  {formatDate(e.request_date)}
                </Mono>
              </div>
            ))}
          </AppCard>
        )}

        {/* === Document requests === */}
        <AppSectionLabel
          p={p}
          action="Tout voir"
          onAction={() => router.push("/registrar/documents")}
        >
          DEMANDES DE DOCUMENTS
        </AppSectionLabel>
        {requestsError ? (
          <SectionEmpty p={p}>{requestsError}</SectionEmpty>
        ) : !requests || requests.length === 0 ? (
          <SectionEmpty p={p}>AUCUNE DEMANDE EN COURS</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {requests.slice(0, 5).map((r, i, arr) => (
              <div
                key={r.id}
                onClick={() => router.push("/registrar/documents")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  cursor: "pointer",
                  borderBottom:
                    i === arr.length - 1 ? "none" : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 36,
                    borderRadius: 2,
                    background: r.status === "processing" ? p.sem.warn : p.sem.info,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>
                    {r.document_type}
                  </div>
                  <Mono
                    style={{
                      fontSize: 10.5,
                      color: p.ink3,
                      letterSpacing: 0.3,
                    }}
                  >
                    {r.student_name} · {formatDate(r.request_date)}
                  </Mono>
                </div>
                <Mono
                  style={{
                    fontSize: 10,
                    color: r.status === "processing" ? p.sem.warn : p.sem.info,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {r.status === "processing" ? "En cours" : "À traiter"}
                </Mono>
              </div>
            ))}
          </AppCard>
        )}

        {/* === Attendance alerts === */}
        <AppSectionLabel
          p={p}
          action="Tout voir"
          onAction={() => router.push("/registrar/students")}
        >
          ALERTES PRÉSENCE
        </AppSectionLabel>
        {alertsError ? (
          <SectionEmpty p={p}>{alertsError}</SectionEmpty>
        ) : !alerts || alerts.length === 0 ? (
          <SectionEmpty p={p}>AUCUNE ALERTE — TOUT VA BIEN</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {alerts.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderBottom:
                    i === alerts.length - 1 ? "none" : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 36,
                    borderRadius: 2,
                    background: p.sem.bad,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>
                    {a.student_name}
                  </div>
                  <Mono
                    style={{
                      fontSize: 10.5,
                      color: p.ink3,
                      letterSpacing: 0.3,
                      textTransform: "uppercase",
                    }}
                  >
                    {a.class_name}
                  </Mono>
                </div>
                <Mono
                  style={{
                    fontSize: 16,
                    color: p.sem.bad,
                    fontWeight: 600,
                    letterSpacing: -0.3,
                  }}
                >
                  {a.attendance_rate}%
                </Mono>
              </div>
            ))}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}

function StatTile({
  p,
  label,
  value,
  sub,
  accent,
}: {
  p: ReturnType<typeof useTheme>["palette"];
  label: string;
  value: string | number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: accent ? p.accentSoft : p.surface,
        border: `1px solid ${accent ? p.accent : p.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Mono
        style={{
          fontSize: 9.5,
          color: p.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 600,
        }}
      >
        {label}
      </Mono>
      <Mono
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: accent ? p.accent : p.ink,
          letterSpacing: -0.5,
          lineHeight: 1,
          display: "block",
          marginTop: 6,
        }}
      >
        {value}
      </Mono>
      <div
        style={{
          fontSize: 10.5,
          color: p.ink4,
          marginTop: 4,
        }}
      >
        {sub}
      </div>
    </div>
  );
}
