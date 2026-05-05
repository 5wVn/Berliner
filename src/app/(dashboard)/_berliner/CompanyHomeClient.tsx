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
import type { ApprenticeStudent } from "@/types/api";
import type {
  ApprenticeRecentGrade,
  ApprenticesAttendanceOverview,
  CompanyDocument,
} from "@/shared/lib/companyData";

type CompanyHomeClientProps = {
  firstName: string;
  apprentices: ApprenticeStudent[] | null;
  apprenticesError: string | null;
  attendance: ApprenticesAttendanceOverview | null;
  attendanceError: string | null;
  grades: ApprenticeRecentGrade[] | null;
  gradesError: string | null;
  documents: CompanyDocument[] | null;
  documentsError: string | null;
};

export function CompanyHomeClient({
  firstName,
  apprentices,
  apprenticesError,
  attendance,
  attendanceError,
  grades,
  gradesError,
  documents,
  documentsError,
}: CompanyHomeClientProps) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotificationFeed();

  const apprenticeList = apprentices ?? [];
  const activeCount = apprenticeList.filter((a) => a.status === "active").length;
  const visibleApprentices = apprenticeList.slice(0, 3);
  const gradeList = (grades ?? []).slice(0, 3);
  const docList = (documents ?? []).slice(0, 3);

  const isEmpty =
    apprenticeList.length === 0 &&
    gradeList.length === 0 &&
    docList.length === 0 &&
    !attendance &&
    !apprenticesError &&
    !attendanceError &&
    !gradesError &&
    !documentsError;

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
            <span>BERLINER · ENTREPRISE</span>
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
                {apprenticeList.length}
              </Mono>{" "}
              apprentis
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {activeCount}
              </Mono>{" "}
              actifs
            </span>
            <span>
              <Mono style={{ color: p.ink2, fontWeight: 600 }}>
                {attendance ? `${attendance.global_rate}%` : "—"}
              </Mono>{" "}
              présence
            </span>
          </div>
        </div>
      </div>

      <ScrollFade style={{ padding: "4px 16px 110px" }}>
        {/* === Attendance card === */}
        {(attendance || attendanceError) && (
          <>
            <AppSectionLabel p={p}>ASSIDUITÉ APPRENTIS</AppSectionLabel>
            {attendanceError ? (
              <SectionEmpty p={p}>
                ERREUR · {attendanceError.toUpperCase()}
              </SectionEmpty>
            ) : attendance && attendance.global_rate > 0 ? (
              <AppCard p={p}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Mono
                      style={{
                        fontSize: 32,
                        fontWeight: 600,
                        color:
                          attendance.global_rate >= 85
                            ? p.sem.ok
                            : attendance.global_rate >= 70
                            ? p.ink
                            : p.sem.bad,
                        letterSpacing: -0.6,
                        lineHeight: 1,
                        display: "block",
                      }}
                    >
                      {attendance.global_rate}%
                    </Mono>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        marginTop: 6,
                        letterSpacing: 0.4,
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      Taux moyen
                    </Mono>
                  </div>
                </div>
              </AppCard>
            ) : (
              <SectionEmpty p={p}>DONNÉES BIENTÔT DISPONIBLES</SectionEmpty>
            )}
          </>
        )}

        {/* === Apprentis === */}
        <AppSectionLabel
          p={p}
          action="Tous"
          onAction={() => router.push("/company/apprentices")}
        >
          MES APPRENTIS
        </AppSectionLabel>
        {apprenticesError ? (
          <SectionEmpty p={p}>
            ERREUR · {apprenticesError.toUpperCase()}
          </SectionEmpty>
        ) : visibleApprentices.length > 0 ? (
          <AppCard p={p}>
            {visibleApprentices.map((a, i) => {
              const fullName = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();
              const initials =
                ((a.firstName?.[0] ?? "") + (a.lastName?.[0] ?? "")).toUpperCase() ||
                "—";
              const statusColor =
                a.status === "active"
                  ? p.sem.ok
                  : a.status === "pending"
                  ? p.sem.warn
                  : p.ink3;
              const statusLabel =
                a.status === "active"
                  ? "ACTIF"
                  : a.status === "pending"
                  ? "EN ATTENTE"
                  : "TERMINÉ";
              return (
                <div
                  key={a.apprenticeshipId}
                  onClick={(e) => {
                    hapticPing(e.currentTarget);
                    router.push("/company/apprentices");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    cursor: "pointer",
                    borderBottom:
                      i === visibleApprentices.length - 1
                        ? "none"
                        : `1px solid ${p.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: p.accentSoft,
                      color: p.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: p.font.mono,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: -0.3,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      {fullName || "Apprenti"}
                    </div>
                    <Mono
                      style={{
                        fontSize: 12.5,
                        color: p.ink3,
                        letterSpacing: 0.3,
                      }}
                    >
                      {a.className ?? "—"}
                    </Mono>
                  </div>
                  <Mono
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: statusColor,
                      letterSpacing: 0.5,
                    }}
                  >
                    {statusLabel}
                  </Mono>
                </div>
              );
            })}
          </AppCard>
        ) : (
          <SectionEmpty p={p}>AUCUN APPRENTI</SectionEmpty>
        )}

        {/* === Notes récentes === */}
        {(gradeList.length > 0 || gradesError) && (
          <>
            <AppSectionLabel p={p}>DERNIÈRES NOTES</AppSectionLabel>
            {gradesError ? (
              <SectionEmpty p={p}>
                ERREUR · {gradesError.toUpperCase()}
              </SectionEmpty>
            ) : (
              <AppCard p={p}>
                {gradeList.map((g, i) => {
                  const note20 = g.grade;
                  return (
                    <div
                      key={g.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        borderBottom:
                          i === gradeList.length - 1
                            ? "none"
                            : `1px solid ${p.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 3,
                          height: 26,
                          borderRadius: 2,
                          background: p.accent,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 500 }}>
                          {g.apprentice_name}
                        </div>
                        <Mono
                          style={{
                            fontSize: 12.5,
                            color: p.ink3,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                          }}
                        >
                          {g.subject}
                        </Mono>
                      </div>
                      <Mono
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          letterSpacing: -0.3,
                          color:
                            note20 >= 14
                              ? p.sem.ok
                              : note20 < 10
                              ? p.sem.bad
                              : p.ink,
                        }}
                      >
                        {note20}
                      </Mono>
                      <Mono style={{ fontSize: 13, color: p.ink4 }}>/20</Mono>
                    </div>
                  );
                })}
              </AppCard>
            )}
          </>
        )}

        {/* === Documents === */}
        {(docList.length > 0 || documentsError) && (
          <>
            <AppSectionLabel
              p={p}
              action="Voir tout"
              onAction={() => router.push("/company/documents")}
            >
              DOCUMENTS RÉCENTS
            </AppSectionLabel>
            {documentsError ? (
              <SectionEmpty p={p}>
                ERREUR · {documentsError.toUpperCase()}
              </SectionEmpty>
            ) : (
              <AppCard p={p}>
                {docList.map((d, i) => (
                  <div
                    key={d.id}
                    onClick={(e) => {
                      hapticPing(e.currentTarget);
                      router.push("/company/documents");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      cursor: "pointer",
                      borderBottom:
                        i === docList.length - 1
                          ? "none"
                          : `1px solid ${p.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 32,
                        borderRadius: 2,
                        background: p.sem.info,
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
                        {d.type}
                      </div>
                      <Mono
                        style={{
                          fontSize: 12.5,
                          color: p.ink3,
                          letterSpacing: 0.3,
                        }}
                      >
                        {d.apprentice_name} ·{" "}
                        {new Date(d.date).toLocaleDateString("fr-FR", {
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

        {/* === Empty state === */}
        {isEmpty && <SectionEmpty p={p}>RIEN À AFFICHER POUR L’INSTANT.</SectionEmpty>}
      </ScrollFade>

      {showNotifs && (
        <NotificationsPanel
          onClose={() => setShowNotifs(false)}
          onNav={() => router.push("/company")}
        />
      )}
    </PageShell>
  );
}
