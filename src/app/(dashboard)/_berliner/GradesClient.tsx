"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type BerlinerState } from "@/actions/berliner-state";
import {
  computeGlobalAverage,
  computeSubjectStats,
} from "@/shared/lib/berliner-stats";
import {
  addGradeAction,
  deleteGradeAction,
  type TeacherStudent,
  type TeacherSubject,
} from "@/actions/berliner";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import {
  colorFor,
  ditherGradient,
  termFromDate,
  type Palette,
} from "@/shared/design/tokens";
import {
  GlobalAnimations,
  Mono,
  ScrollFade,
  Sparkline,
} from "@/shared/design/primitives";
import { BulkImportPanel } from "@/shared/components/berliner/Overlays";

type GradesClientProps = {
  state: BerlinerState;
};

type Term = "T1" | "T2" | "T3";

export function GradesClient({ state }: GradesClientProps) {
  const { palette: p } = useTheme();
  const router = useRouter();
  const isStudent = state.profile.role === "student";

  const [term, setTerm] = useState<Term>("T2");
  const [subjFilter, setSubjFilter] = useState<string | null>(null);
  const [detailSubjectId, setDetailSubjectId] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);

  const grades = isStudent
    ? state.grades.filter((g) => g.studentId === state.profile.id)
    : state.grades;

  const stats = useMemo(
    () => computeSubjectStats({ subjects: state.subjects, grades }),
    [state.subjects, grades]
  );
  const globalAvg = useMemo(
    () => computeGlobalAverage({ subjects: state.subjects, grades }),
    [state.subjects, grades]
  );

  const gradesInTerm = grades.filter((g) => termFromDate(g.evaluationDate) === term);
  const termAvg = useMemo(() => {
    if (gradesInTerm.length === 0) return null;
    const bySub: Record<string, number[]> = {};
    gradesInTerm.forEach((g) => {
      const arr = bySub[g.subjectId] ?? (bySub[g.subjectId] = []);
      arr.push((g.score / Math.max(g.maxScore, 1)) * 20);
    });
    let num = 0;
    let den = 0;
    Object.entries(bySub).forEach(([sid, arr]) => {
      const subj = state.subjects.find((s) => s.id === sid);
      const coef = subj?.coef ?? 1;
      const a = arr.reduce((x, y) => x + y, 0) / arr.length;
      num += a * coef;
      den += coef;
    });
    return den > 0 ? num / den : null;
  }, [gradesInTerm, state.subjects]);

  const prevTermKey: Term | null = term === "T2" ? "T1" : term === "T3" ? "T2" : null;
  const prevTermGrades = prevTermKey
    ? grades.filter((g) => termFromDate(g.evaluationDate) === prevTermKey)
    : [];
  const prevAvg =
    prevTermGrades.length > 0
      ? prevTermGrades.reduce(
          (acc, g) => acc + (g.score / Math.max(g.maxScore, 1)) * 20,
          0
        ) / prevTermGrades.length
      : null;
  const delta = termAvg != null && prevAvg != null ? termAvg - prevAvg : null;

  const chartData = useMemo(
    () =>
      [...gradesInTerm]
        .sort((a, b) => a.evaluationDate.localeCompare(b.evaluationDate))
        .map((g) => ({
          v: (g.score / Math.max(g.maxScore, 1)) * 20,
          d: g.evaluationDate,
          sid: g.subjectId,
        })),
    [gradesInTerm]
  );

  const statsFiltered = subjFilter
    ? stats.filter((s) => s.subjectId === subjFilter)
    : stats;

  const subjectsById = useMemo(
    () => new Map(state.subjects.map((s) => [s.id, s])),
    [state.subjects]
  );

  const detailSubject = detailSubjectId ? subjectsById.get(detailSubjectId) : null;
  const detailStat = detailSubjectId
    ? stats.find((s) => s.subjectId === detailSubjectId)
    : null;
  const detailGrades = detailSubjectId
    ? grades.filter((g) => g.subjectId === detailSubjectId)
    : [];

  return (
    <PageShell p={p}>
      <GlobalAnimations />

      <ScrollFade style={{ overflowX: "hidden" }}>
        {/* HERO */}
        <div
          style={{
            position: "relative",
            padding: "14px 20px 10px",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              right: -20,
              width: "60%",
              height: 200,
              ...ditherGradient({ fg: p.accent, alpha: 0.5 }),
              maskImage:
                "radial-gradient(circle at 100% 0%, #000 0%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle at 100% 0%, #000 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <Mono
                style={{
                  fontSize: 64,
                  fontWeight: 500,
                  letterSpacing: -2.5,
                  lineHeight: 0.95,
                  color: p.ink,
                }}
              >
                {termAvg != null
                  ? termAvg.toFixed(1)
                  : globalAvg != null
                  ? globalAvg.toFixed(1)
                  : "—"}
              </Mono>
              <Mono style={{ fontSize: 18, color: p.ink3, fontWeight: 500 }}>
                /20
              </Mono>
            </div>
            <Mono
              style={{
                fontSize: 13,
                color: p.ink3,
                marginTop: 6,
                display: "block",
                letterSpacing: 0.3,
              }}
            >
              {termAvg != null ? (
                <>
                  {gradesInTerm.length} note{gradesInTerm.length > 1 ? "s" : ""} ·{" "}
                  {term}
                  {prevTermKey && delta != null ? ` · vs ${prevTermKey}` : ""}
                </>
              ) : globalAvg != null ? (
                <>moy. générale · {term} vide</>
              ) : (
                <>aucune note</>
              )}
            </Mono>
          </div>
        </div>

        {/* Term segments */}
        <div
          style={{
            display: "flex",
            gap: 0,
            background: p.dark ? p.surface2 : p.chip,
            margin: "4px 16px 10px",
            borderRadius: 10,
            padding: 3,
            border: `1px solid ${p.border}`,
          }}
        >
          {(["T1", "T2", "T3"] as Term[]).map((tk) => {
            const gs = grades.filter((g) => termFromDate(g.evaluationDate) === tk);
            const avg =
              gs.length > 0
                ? gs.reduce(
                    (a, g) => a + (g.score / Math.max(g.maxScore, 1)) * 20,
                    0
                  ) / gs.length
                : null;
            return (
              <div
                key={tk}
                onClick={() => setTerm(tk)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  textAlign: "center",
                  background: tk === term ? p.surface : "transparent",
                  color: tk === term ? p.ink : p.ink3,
                  border:
                    tk === term
                      ? `1px solid ${p.border}`
                      : "1px solid transparent",
                  borderRadius: 7,
                  fontFamily: p.font.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                {tk}
                <Mono
                  style={{
                    marginLeft: 6,
                    color: tk === term ? p.ink3 : p.ink4,
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  {avg != null ? avg.toFixed(1) : "—"}
                </Mono>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <div
            style={{
              margin: "0 16px 10px",
              padding: "12px 14px 10px",
              background: p.surface,
              borderRadius: 14,
              border: `1px solid ${p.border}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: p.font.mono,
                fontSize: 12.5,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: p.ink3,
                marginBottom: 10,
              }}
            >
              <span>ÉVOLUTION · {term}</span>
              <span>{chartData.length} POINTS</span>
            </div>
            <GradeChart
              data={chartData}
              subjectColors={Object.fromEntries(
                state.subjects.map((s) => [s.id, colorFor(p, s.color)])
              )}
              avg={termAvg}
              p={p}
            />
          </div>
        )}

        {/* Subject filter chips */}
        {state.subjects.length > 0 && (
          <div
            style={{
              padding: "4px 16px 6px",
              display: "flex",
              gap: 6,
              overflowX: "auto",
            }}
          >
            <div
              onClick={() => setSubjFilter(null)}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                flexShrink: 0,
                background: !subjFilter
                  ? p.dark
                    ? p.surface2
                    : p.ink
                  : "transparent",
                color: !subjFilter ? (p.dark ? p.ink : "#fff") : p.ink3,
                border: `1px solid ${
                  !subjFilter ? (p.dark ? p.border : p.ink) : p.border
                }`,
                fontFamily: p.font.mono,
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: 0.3,
                cursor: "pointer",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              Toutes
            </div>
            {state.subjects.map((s) => {
              const c = colorFor(p, s.color);
              const active = subjFilter === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSubjFilter(active ? null : s.id)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 6,
                    flexShrink: 0,
                    background: active ? c : "transparent",
                    color: active ? "#fff" : p.ink3,
                    border: `1px solid ${active ? c : p.border}`,
                    fontFamily: p.font.mono,
                    fontSize: 12.5,
                    fontWeight: 500,
                    letterSpacing: 0.3,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {!active && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        background: c,
                      }}
                    />
                  )}
                  {s.name}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ padding: "4px 16px 24px" }}>
          {/* Teacher mode: grade entry */}
          {!isStudent && (
            <TeacherGradeEntry
              state={state}
              onSaved={() => router.refresh()}
              onOpenBulk={() => setShowBulk(true)}
            />
          )}

          <AppSectionLabel p={p}>
            {subjFilter
              ? subjectsById.get(subjFilter)?.name?.toUpperCase() ?? "MATIÈRE"
              : `MATIÈRES (${stats.length})`}
          </AppSectionLabel>
          {statsFiltered.length === 0 && <SectionEmpty p={p}>AUCUNE MATIÈRE</SectionEmpty>}
          {statsFiltered.map((s) => {
            const subj = subjectsById.get(s.subjectId);
            if (!subj) return null;
            const c = colorFor(p, subj.color);
            return (
              <div
                key={s.subjectId}
                onClick={() => setDetailSubjectId(s.subjectId)}
                style={{
                  background: p.surface,
                  border: `1px solid ${p.border}`,
                  borderRadius: 12,
                  padding: "11px 14px",
                  marginBottom: 8,
                  cursor: "pointer",
                  transition: "transform 150ms",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 3,
                      height: 28,
                      borderRadius: 2,
                      background: c,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>
                      {subj.name}
                    </div>
                    <Mono style={{ fontSize: 13, color: p.ink3 }}>
                      {s.count} note{s.count > 1 ? "s" : ""} · coef {subj.coef}
                    </Mono>
                  </div>
                  {s.trend.length > 0 && (
                    <Sparkline data={s.trend} color={c} p={p} />
                  )}
                  <div style={{ textAlign: "right", minWidth: 52 }}>
                    <Mono
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: p.ink,
                        letterSpacing: -0.4,
                      }}
                    >
                      {s.avg != null ? s.avg.toFixed(1) : "—"}
                    </Mono>
                    <Mono style={{ fontSize: 12, color: p.ink4 }}>/20</Mono>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollFade>

      {/* Detail overlay */}
      {detailSubject && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: p.dark ? "#0E0E10" : "#FAFAF7",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            animation: "berliner-slide-up 250ms ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderBottom: `1px solid ${p.border}`,
              paddingTop: "calc(env(safe-area-inset-top) + 12px)",
            }}
          >
            <div
              onClick={() => setDetailSubjectId(null)}
              style={{
                fontFamily: p.font.mono,
                fontSize: 14,
                color: p.ink3,
                cursor: "pointer",
                letterSpacing: 0.4,
              }}
            >
              ← RETOUR
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: colorFor(p, detailSubject.color),
              }}
            />
            <Mono
              style={{
                fontSize: 13,
                color: p.ink3,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {detailSubject.code || detailSubject.name}
            </Mono>
          </div>
          <div
            style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: -0.5,
                marginBottom: 4,
              }}
            >
              {detailSubject.name}
            </div>
            <Mono
              style={{
                fontSize: 13,
                color: p.ink3,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              COEF {detailSubject.coef} · {detailGrades.length} NOTES
            </Mono>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {[
                {
                  l: "MOYENNE",
                  v: detailStat?.avg != null ? detailStat.avg.toFixed(1) : "—",
                  c: p.ink,
                },
                {
                  l: "MAX",
                  v:
                    detailGrades.length > 0
                      ? Math.max(
                          ...detailGrades.map(
                            (g) => (g.score / Math.max(g.maxScore, 1)) * 20
                          )
                        ).toFixed(1)
                      : "—",
                  c: p.sem.ok,
                },
                {
                  l: "MIN",
                  v:
                    detailGrades.length > 0
                      ? Math.min(
                          ...detailGrades.map(
                            (g) => (g.score / Math.max(g.maxScore, 1)) * 20
                          )
                        ).toFixed(1)
                      : "—",
                  c: p.sem.bad,
                },
              ].map((s) => (
                <div
                  key={s.l}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: p.surface,
                    border: `1px solid ${p.border}`,
                    borderRadius: 10,
                  }}
                >
                  <Mono
                    style={{
                      fontSize: 11.5,
                      color: p.ink4,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {s.l}
                  </Mono>
                  <Mono
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: s.c,
                      letterSpacing: -0.5,
                      display: "block",
                      marginTop: 2,
                    }}
                  >
                    {s.v}
                  </Mono>
                </div>
              ))}
            </div>

            {detailGrades.length > 1 && (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  background: p.surface,
                  border: `1px solid ${p.border}`,
                  borderRadius: 12,
                }}
              >
                <Mono
                  style={{
                    fontSize: 12.5,
                    color: p.ink3,
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  ÉVOLUTION
                </Mono>
                <GradeChart
                  data={[...detailGrades]
                    .sort((a, b) =>
                      a.evaluationDate.localeCompare(b.evaluationDate)
                    )
                    .map((g) => ({
                      v: (g.score / Math.max(g.maxScore, 1)) * 20,
                      d: g.evaluationDate,
                      sid: g.subjectId,
                    }))}
                  subjectColors={Object.fromEntries(
                    state.subjects.map((s) => [s.id, colorFor(p, s.color)])
                  )}
                  avg={detailStat?.avg ?? null}
                  p={p}
                  forceColor={colorFor(p, detailSubject.color)}
                />
              </div>
            )}

            <AppSectionLabel p={p}>HISTORIQUE</AppSectionLabel>
            <AppCard p={p}>
              {[...detailGrades]
                .sort((a, b) =>
                  b.evaluationDate.localeCompare(a.evaluationDate)
                )
                .map((r, i, arr) => {
                  const note20 = (r.score / Math.max(r.maxScore, 1)) * 20;
                  return (
                    <div
                      key={r.id}
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
                      <Mono
                        style={{
                          fontSize: 12,
                          color: p.ink3,
                          letterSpacing: 0.4,
                          width: 44,
                        }}
                      >
                        {fmtDate(r.evaluationDate)}
                      </Mono>
                      <Mono
                        style={{
                          fontSize: 13,
                          color: p.ink2,
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                          flex: 1,
                        }}
                      >
                        {r.evaluationName} · {termFromDate(r.evaluationDate)}
                      </Mono>
                      <Mono
                        style={{
                          fontSize: 18,
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
                        {r.score}
                      </Mono>
                      <Mono style={{ fontSize: 13, color: p.ink4 }}>
                        /{r.maxScore}
                      </Mono>
                      {!isStudent && (
                        <DeleteGradeButton
                          gradeId={r.id}
                          p={p}
                          onDeleted={() => router.refresh()}
                        />
                      )}
                    </div>
                  );
                })}
            </AppCard>
          </div>
        </div>
      )}

      {showBulk && state.students && (
        <BulkImportPanel
          onClose={() => setShowBulk(false)}
          subjects={(state.teacherClassSubjectIds ?? [])
            .map((csId) => state.classSubjects.find((cs) => cs.id === csId))
            .filter((cs): cs is NonNullable<typeof cs> => cs != null)
            .map<TeacherSubject>((cs) => ({
              classSubjectId: cs.id,
              subjectId: cs.subjectId,
              subjectName: cs.subjectName,
              classId: cs.classId,
              className: cs.className,
            }))}
          students={(state.students ?? []).map<TeacherStudent>((s) => ({
            ...s,
            class_name:
              state.classes?.find((c) => c.id === s.class_id)?.name ?? "Classe",
          }))}
          onSaved={() => router.refresh()}
        />
      )}
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// Inline grade chart — SVG polyline + Bayer dither area + dots.
// ─────────────────────────────────────────────────────────────────
function GradeChart({
  data,
  subjectColors,
  avg,
  p,
  forceColor,
}: {
  data: { v: number; d: string; sid: string }[];
  subjectColors: Record<string, string>;
  avg: number | null;
  p: Palette;
  forceColor?: string;
}) {
  const W = 320;
  const H = 100;
  const PAD = 4;
  if (!data || data.length === 0) return null;
  const yMin = 0;
  const yMax = 20;
  const xStep = data.length > 1 ? (W - PAD * 2) / (data.length - 1) : 0;
  const yFor = (v: number) => H - ((v - yMin) / (yMax - yMin)) * H;
  const points = data.map((d, i) => `${PAD + i * xStep},${yFor(d.v)}`).join(" ");
  const areaPoints =
    `${PAD},${H} ` +
    data.map((d, i) => `${PAD + i * xStep},${yFor(d.v)}`).join(" ") +
    ` ${PAD + (data.length - 1) * xStep},${H}`;
  const stroke = forceColor ?? p.accent;
  const patternId = `bayer-${stroke.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H + 18}`}
        style={{ width: "100%", height: H + 18, display: "block" }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={patternId} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="transparent" />
            <rect x="0" y="0" width="1" height="1" fill={stroke} fillOpacity="0.6" />
            <rect x="2" y="2" width="1" height="1" fill={stroke} fillOpacity="0.6" />
            <rect x="1" y="3" width="1" height="1" fill={stroke} fillOpacity="0.3" />
            <rect x="3" y="1" width="1" height="1" fill={stroke} fillOpacity="0.3" />
          </pattern>
        </defs>
        {[0, 0.5, 0.7, 1].map((t) => (
          <g key={t}>
            <line
              x1="0"
              x2={W}
              y1={H * (1 - t)}
              y2={H * (1 - t)}
              stroke={p.border}
              strokeWidth="0.5"
              strokeDasharray="2 3"
            />
            <text
              x={W - 2}
              y={H * (1 - t) - 2}
              textAnchor="end"
              fill={p.ink4}
              fontSize="7"
              fontFamily={p.font.mono}
            >
              {(t * 20).toFixed(0)}
            </text>
          </g>
        ))}
        {data.length > 1 && <polygon points={areaPoints} fill={`url(#${patternId})`} />}
        <line
          x1="0"
          x2={W}
          y1={yFor(14)}
          y2={yFor(14)}
          stroke={p.ink2}
          strokeWidth="0.7"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        {avg != null && (
          <line
            x1="0"
            x2={W}
            y1={yFor(avg)}
            y2={yFor(avg)}
            stroke={stroke}
            strokeWidth="0.8"
            strokeDasharray="4 2"
            opacity="0.7"
          />
        )}
        {data.length > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {data.map((d, i) => {
          const c = forceColor ?? subjectColors[d.sid] ?? stroke;
          return (
            <circle
              key={i}
              cx={PAD + i * xStep}
              cy={yFor(d.v)}
              r="2.5"
              fill={p.bg}
              stroke={c}
              strokeWidth="1.2"
            />
          );
        })}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          fontFamily: p.font.mono,
          fontSize: 11,
          color: p.ink4,
          letterSpacing: 0.3,
        }}
      >
        <span>
          {data[0].d
            ? new Date(data[0].d).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })
            : ""}
        </span>
        {avg != null && (
          <span style={{ color: stroke }}>moy {avg.toFixed(1)}</span>
        )}
        <span>
          {data[data.length - 1].d
            ? new Date(data[data.length - 1].d).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })
            : ""}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Teacher grade-entry panel (inline, above the subject list).
// ─────────────────────────────────────────────────────────────────
function TeacherGradeEntry({
  state,
  onSaved,
  onOpenBulk,
}: {
  state: BerlinerState;
  onSaved: () => void;
  onOpenBulk: () => void;
}) {
  const { palette: p } = useTheme();
  const [adding, setAdding] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [classSubjectId, setClassSubjectId] = useState<string | null>(null);
  const [evalName, setEvalName] = useState("DS");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState(20);
  const [isPending, startTransition] = useTransition();

  const teachableClassSubjects = useMemo(
    () =>
      (state.teacherClassSubjectIds ?? [])
        .map((id) => state.classSubjects.find((cs) => cs.id === id))
        .filter((cs): cs is NonNullable<typeof cs> => cs != null),
    [state.teacherClassSubjectIds, state.classSubjects]
  );

  // Default selections.
  useEffect(() => {
    if (!studentId && state.students?.length) {
      setStudentId(state.students[0].id);
    }
  }, [state.students, studentId]);
  useEffect(() => {
    if (!classSubjectId && teachableClassSubjects.length > 0) {
      setClassSubjectId(teachableClassSubjects[0].id);
    }
  }, [teachableClassSubjects, classSubjectId]);

  const submit = () => {
    if (!studentId || !classSubjectId || !score) return;
    const numScore = parseFloat(score.replace(",", "."));
    if (Number.isNaN(numScore)) return;
    startTransition(async () => {
      const r = await addGradeAction({
        studentId,
        classSubjectId,
        evaluationName: evalName,
        score: numScore,
        maxScore,
      });
      if (r.ok) {
        setScore("");
        setAdding(false);
        onSaved();
      } else if (typeof window !== "undefined") {
        window.alert(r.error.message);
      }
    });
  };

  if (!state.students || state.students.length === 0) {
    return null;
  }

  return (
    <>
      <AppSectionLabel p={p}>ÉLÈVE</AppSectionLabel>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {state.students.map((st) => (
          <div
            key={st.id}
            onClick={() => setStudentId(st.id)}
            style={{
              padding: "6px 10px",
              borderRadius: 7,
              fontSize: 14,
              background: studentId === st.id ? p.accent : p.surface,
              color:
                studentId === st.id ? (p.dark ? "#0E0E10" : "#FFF") : p.ink2,
              border: `1px solid ${studentId === st.id ? p.accent : p.border}`,
              fontFamily: p.font.sans,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {st.first_name} {st.last_name?.[0] ?? ""}.
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <div
          onClick={() => setAdding((v) => !v)}
          style={{
            flex: 1,
            padding: "9px 12px",
            textAlign: "center",
            background: adding ? p.accent : p.surface,
            border: `1px solid ${adding ? p.accent : p.border}`,
            borderRadius: 9,
            fontFamily: p.font.mono,
            fontSize: 13,
            color: adding ? (p.dark ? "#0E0E10" : "#FFF") : p.ink2,
            fontWeight: 600,
            letterSpacing: 0.4,
            cursor: "pointer",
          }}
        >
          {adding ? "ANNULER" : "+ SAISIR UNE NOTE"}
        </div>
        <div
          onClick={onOpenBulk}
          style={{
            flex: 1,
            padding: "9px 12px",
            textAlign: "center",
            background: p.surface,
            border: `1px dashed ${p.border}`,
            borderRadius: 9,
            fontFamily: p.font.mono,
            fontSize: 13,
            color: p.ink2,
            fontWeight: 600,
            letterSpacing: 0.4,
            cursor: "pointer",
          }}
        >
          ↥ IMPORT CSV
        </div>
      </div>
      {adding && (
        <div
          style={{
            background: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 8,
            animation: "berliner-slide-down 200ms ease-out",
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {teachableClassSubjects.map((cs) => (
              <div
                key={cs.id}
                onClick={() => setClassSubjectId(cs.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 13,
                  background:
                    classSubjectId === cs.id
                      ? p.accent
                      : p.dark
                      ? p.surface2
                      : p.chip,
                  color:
                    classSubjectId === cs.id
                      ? p.dark
                        ? "#0E0E10"
                        : "#FFF"
                      : p.ink2,
                  fontFamily: p.font.mono,
                  cursor: "pointer",
                }}
              >
                {cs.subjectName} · {cs.className}
              </div>
            ))}
          </div>
          <input
            value={evalName}
            onChange={(e) => setEvalName(e.target.value)}
            placeholder="DS, contrôle, TP…"
            style={{
              width: "100%",
              background: p.dark ? p.surface2 : p.chip,
              border: `1px solid ${p.border}`,
              borderRadius: 6,
              padding: "6px 10px",
              fontFamily: p.font.sans,
              fontSize: 15,
              color: p.ink,
              outline: "none",
              marginBottom: 8,
            }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              placeholder="Note"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              step="0.5"
              min="0"
              max={maxScore}
              style={{
                width: 70,
                background: p.dark ? p.surface2 : p.chip,
                border: `1px solid ${p.border}`,
                borderRadius: 6,
                padding: "6px 8px",
                fontFamily: p.font.mono,
                fontSize: 15,
                color: p.ink,
                outline: "none",
              }}
            />
            <Mono style={{ color: p.ink3, fontSize: 15 }}>
              / {maxScore}
            </Mono>
            <input
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(parseInt(e.target.value, 10) || 20)}
              min="1"
              style={{
                width: 50,
                background: p.dark ? p.surface2 : p.chip,
                border: `1px solid ${p.border}`,
                borderRadius: 6,
                padding: "6px 8px",
                fontFamily: p.font.mono,
                fontSize: 14,
                color: p.ink3,
                outline: "none",
              }}
            />
            <div style={{ flex: 1 }} />
            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              style={{
                background: p.accent,
                color: p.dark ? "#0E0E10" : "#FFF",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontFamily: p.font.mono,
                fontSize: 13,
                fontWeight: 600,
                cursor: isPending ? "wait" : "pointer",
                letterSpacing: 0.4,
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? "..." : "PUBLIER"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function DeleteGradeButton({
  gradeId,
  p,
  onDeleted,
}: {
  gradeId: string;
  p: Palette;
  onDeleted: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && !window.confirm("Supprimer cette note ?")) return;
    startTransition(async () => {
      const r = await deleteGradeAction(gradeId);
      if (r.ok) onDeleted();
    });
  };
  return (
    <div
      onClick={onClick}
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        marginLeft: 4,
        background: p.dark ? p.surface2 : p.chip,
        color: p.ink3,
        fontSize: 14,
        fontFamily: p.font.mono,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isPending ? "wait" : "pointer",
        flexShrink: 0,
        opacity: isPending ? 0.5 : 1,
      }}
    >
      ×
    </div>
  );
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", { day: "numeric", month: "short" }).toUpperCase();
}
