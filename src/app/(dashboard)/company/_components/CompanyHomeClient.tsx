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

export type ApprenticeStudent = {
  apprenticeshipId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  startDate: string;
  endDate: string | null;
  status: "active" | "ended" | "pending";
  className: string | null;
};

export type ApprenticeAttendance = {
  id: string;
  name: string;
  rate: number;
};

export type ApprenticesAttendanceOverview = {
  global_rate: number;
  apprentices: ApprenticeAttendance[];
};

export type ApprenticeRecentGrade = {
  id: string;
  apprentice_name: string;
  subject: string;
  grade: number;
  date: string;
};

export type CompanyDocument = {
  id: string;
  type: string;
  apprentice_name: string;
  date: string;
};

type Props = {
  userName: string;
  apprentices: ApprenticeStudent[] | null;
  apprenticesError: string | null;
  attendance: ApprenticesAttendanceOverview | null;
  attendanceError: string | null;
  grades: ApprenticeRecentGrade[] | null;
  gradesError: string | null;
  documents: CompanyDocument[] | null;
  documentsError: string | null;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

const initials = (a: ApprenticeStudent) =>
  `${a.firstName.charAt(0)}${a.lastName.charAt(0)}`.toUpperCase() || "?";

export function CompanyHomeClient({
  userName,
  apprentices,
  apprenticesError,
  attendance,
  attendanceError,
  grades,
  gradesError,
  documents,
  documentsError,
}: Props) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const firstName = userName.split(" ")[0] || "Entreprise";

  const list = apprentices ?? [];
  const globalRate = attendance?.global_rate ?? 0;

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
          <Mono
            style={{
              fontSize: 11,
              color: p.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 12,
            }}
          >
            BERLINER · ENTREPRISE
          </Mono>
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
              fontSize: 11.5,
              color: p.ink3,
              letterSpacing: 0.3,
            }}
          >
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {list.length}
              </Mono>{" "}
              apprentis
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {globalRate}%
              </Mono>{" "}
              prés.
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {documents?.length ?? 0}
              </Mono>{" "}
              docs
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* === Apprentis === */}
        <AppSectionLabel
          p={p}
          action="Tout voir"
          onAction={() => router.push("/company/apprentices")}
        >
          MES APPRENTIS
        </AppSectionLabel>
        {apprenticesError ? (
          <SectionEmpty p={p}>{apprenticesError}</SectionEmpty>
        ) : list.length === 0 ? (
          <SectionEmpty p={p}>AUCUN APPRENTI RATTACHÉ</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {list.slice(0, 5).map((a, i, arr) => (
              <div
                key={a.apprenticeshipId}
                onClick={() => router.push("/company/apprentices")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  cursor: "pointer",
                  borderBottom:
                    i === arr.length - 1
                      ? "none"
                      : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    background: p.accentSoft,
                    color: p.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: p.font.mono,
                    fontSize: 13,
                    fontWeight: 600,
                    border: `1px solid ${p.border}`,
                    flexShrink: 0,
                  }}
                >
                  {initials(a)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {a.firstName} {a.lastName}
                  </div>
                  <Mono
                    style={{
                      fontSize: 10.5,
                      color: p.ink3,
                      letterSpacing: 0.3,
                    }}
                  >
                    {a.className ?? "—"}
                  </Mono>
                </div>
                <span style={{ color: p.ink3, fontSize: 18 }}>›</span>
              </div>
            ))}
          </AppCard>
        )}

        {/* === Présence === */}
        <AppSectionLabel
          p={p}
          action="Détails"
          onAction={() => router.push("/company/apprentices")}
        >
          PRÉSENCE
        </AppSectionLabel>
        {attendanceError ? (
          <SectionEmpty p={p}>{attendanceError}</SectionEmpty>
        ) : !attendance ? (
          <SectionEmpty p={p}>—</SectionEmpty>
        ) : (
          <AppCard p={p} style={{ padding: "16px 18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Mono
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color:
                    globalRate >= 90
                      ? p.sem.ok
                      : globalRate >= 75
                      ? p.sem.warn
                      : p.sem.bad,
                  letterSpacing: -1,
                  lineHeight: 1,
                }}
              >
                {globalRate}
              </Mono>
              <Mono style={{ fontSize: 14, color: p.ink3 }}>%</Mono>
              <Mono
                style={{
                  fontSize: 10,
                  color: p.ink3,
                  marginLeft: 8,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Globale
              </Mono>
            </div>
            {attendance.apprentices.length === 0 ? (
              <Mono style={{ fontSize: 11, color: p.ink3 }}>
                Aucune donnée individuelle pour le moment.
              </Mono>
            ) : (
              attendance.apprentices.slice(0, 4).map((ap, i) => {
                const w = Math.min(100, Math.max(0, ap.rate));
                const c =
                  ap.rate >= 90
                    ? p.sem.ok
                    : ap.rate >= 75
                    ? p.sem.warn
                    : p.sem.bad;
                return (
                  <div
                    key={ap.id}
                    style={{ marginTop: i === 0 ? 0 : 10 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ fontSize: 12.5, color: p.ink2 }}>
                        {ap.name}
                      </div>
                      <Mono
                        style={{
                          fontSize: 11,
                          color: c,
                          fontWeight: 600,
                        }}
                      >
                        {ap.rate}%
                      </Mono>
                    </div>
                    <div
                      style={{
                        height: 5,
                        width: "100%",
                        background: p.dark ? p.surface2 : p.chip,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${w}%`,
                          background: c,
                          borderRadius: 3,
                          transition: "width 240ms ease-out",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </AppCard>
        )}

        {/* === Notes récentes === */}
        <AppSectionLabel p={p}>NOTES RÉCENTES</AppSectionLabel>
        {gradesError ? (
          <SectionEmpty p={p}>{gradesError}</SectionEmpty>
        ) : !grades || grades.length === 0 ? (
          <SectionEmpty p={p}>AUCUNE NOTE PUBLIÉE</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {grades.slice(0, 4).map((g, i, arr) => {
              const c =
                g.grade >= 14
                  ? p.sem.ok
                  : g.grade < 10
                  ? p.sem.bad
                  : p.ink;
              return (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderBottom:
                      i === arr.length - 1
                        ? "none"
                        : `1px solid ${p.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 26,
                      borderRadius: 2,
                      background: c,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {g.subject}
                    </div>
                    <Mono
                      style={{
                        fontSize: 10.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {g.apprentice_name} · {formatDate(g.date)}
                    </Mono>
                  </div>
                  <Mono
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: c,
                      letterSpacing: -0.3,
                    }}
                  >
                    {g.grade}
                  </Mono>
                  <Mono style={{ fontSize: 11, color: p.ink4 }}>/20</Mono>
                </div>
              );
            })}
          </AppCard>
        )}

        {/* === Documents === */}
        <AppSectionLabel
          p={p}
          action="Tout voir"
          onAction={() => router.push("/company/documents")}
        >
          DOCUMENTS RÉCENTS
        </AppSectionLabel>
        {documentsError ? (
          <SectionEmpty p={p}>{documentsError}</SectionEmpty>
        ) : !documents || documents.length === 0 ? (
          <SectionEmpty p={p}>AUCUN DOCUMENT DISPONIBLE</SectionEmpty>
        ) : (
          <AppCard p={p}>
            {documents.slice(0, 4).map((d, i, arr) => (
              <div
                key={d.id}
                onClick={() => router.push("/company/documents")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  cursor: "pointer",
                  borderBottom:
                    i === arr.length - 1
                      ? "none"
                      : `1px solid ${p.border}`,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 36,
                    borderRadius: 2,
                    background: p.sem.info,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {d.type}
                  </div>
                  <Mono
                    style={{
                      fontSize: 10.5,
                      color: p.ink3,
                      letterSpacing: 0.3,
                    }}
                  >
                    {d.apprentice_name} · {formatDate(d.date)}
                  </Mono>
                </div>
                <span style={{ color: p.ink3, fontSize: 18 }}>›</span>
              </div>
            ))}
          </AppCard>
        )}
      </ScrollFade>
    </PageShell>
  );
}
