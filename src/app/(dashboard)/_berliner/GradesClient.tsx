"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
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
  academicYearLabel,
  subjectColor,
  ditherGradient,
  termFromDate,
} from "@/shared/design/tokens";
import { ScrollFade, Sparkline } from "@/shared/design/primitives";
import { GradeChart, type GradePoint } from "@/shared/components/berliner/GradeChart";
import { BulkImportPanel } from "@/shared/components/berliner/Overlays";

type GradesClientProps = { state: BerlinerState };
type Term = "T1" | "T2" | "T3";

// Petit libellé de section (mono, majuscules).
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[18px] mb-2 px-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.6px] text-ink-3">
      {children}
    </div>
  );
}

function toPoints(
  grades: { score: number; maxScore: number; evaluationDate: string }[]
): GradePoint[] {
  return [...grades]
    .sort((a, b) => a.evaluationDate.localeCompare(b.evaluationDate))
    .map((g) => ({
      date: g.evaluationDate,
      note: (g.score / Math.max(g.maxScore, 1)) * 20,
    }));
}

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

  const chartPoints = useMemo(() => toPoints(gradesInTerm), [gradesInTerm]);

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
    <div className="relative flex min-h-[100dvh] w-full flex-col text-ink">
      <ScrollFade style={{ overflowX: "hidden" }}>
        {/* HÉRO */}
        <div className="relative overflow-hidden px-5 pb-2.5 pt-3.5">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-20px] top-0 h-[200px] w-3/5"
            style={{
              ...ditherGradient({ fg: subjectColor("red"), alpha: 0.5 }),
              maskImage: "radial-gradient(circle at 100% 0%, #000 0%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle at 100% 0%, #000 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="mb-3.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
              <span>
                NOTES · {term} {academicYearLabel()}
              </span>
              <span>
                OBJ. <span className="font-semibold text-primary">14.0</span>
                {delta != null && (
                  <span
                    className={`ml-2.5 ${delta >= 0 ? "text-sem-ok" : "text-sem-bad"}`}
                  >
                    {delta >= 0 ? "↑" : "↓"} {delta >= 0 ? "+" : ""}
                    {delta.toFixed(1)}
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[64px] font-medium leading-[0.95] tracking-[-2.5px] tabular-nums text-ink">
                {termAvg != null
                  ? termAvg.toFixed(1)
                  : globalAvg != null
                  ? globalAvg.toFixed(1)
                  : "—"}
              </span>
              <span className="font-mono text-[16px] font-medium text-ink-3">/20</span>
            </div>
            <span className="mt-1.5 block font-mono text-[11px] tracking-[0.3px] text-ink-3">
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
            </span>
          </div>
        </div>

        {/* Sélecteur de trimestre */}
        <div className="mx-4 mb-2.5 mt-1 flex gap-0 rounded-[10px] border border-border bg-chip p-[3px]">
          {(["T1", "T2", "T3"] as Term[]).map((tk) => {
            const gs = grades.filter((g) => termFromDate(g.evaluationDate) === tk);
            const avg =
              gs.length > 0
                ? gs.reduce(
                    (a, g) => a + (g.score / Math.max(g.maxScore, 1)) * 20,
                    0
                  ) / gs.length
                : null;
            const active = tk === term;
            return (
              <div
                key={tk}
                onClick={() => setTerm(tk)}
                className={`flex-1 cursor-pointer rounded-[7px] border py-[7px] text-center font-mono text-[12px] font-semibold tracking-[0.4px] transition-all ${
                  active
                    ? "border-border bg-surface text-ink"
                    : "border-transparent text-ink-3"
                }`}
              >
                {tk}
                <span
                  className={`ml-1.5 font-mono text-[11px] font-medium ${
                    active ? "text-ink-3" : "text-ink-4"
                  }`}
                >
                  {avg != null ? avg.toFixed(1) : "—"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Courbe (shadcn / recharts) */}
        {chartPoints.length > 1 && (
          <div className="mx-4 mb-2.5 overflow-hidden rounded-[14px] border border-border bg-surface px-3.5 pb-2.5 pt-3">
            <div className="mb-2.5 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.6px] text-ink-3">
              <span>ÉVOLUTION · {term}</span>
              <span>{chartPoints.length} POINTS</span>
            </div>
            <GradeChart data={chartPoints} avg={termAvg} />
          </div>
        )}

        {/* Filtres matière */}
        {state.subjects.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-1.5 pt-1">
            <div
              onClick={() => setSubjFilter(null)}
              className={`shrink-0 cursor-pointer whitespace-nowrap rounded-[6px] border px-2.5 py-[5px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.3px] ${
                !subjFilter
                  ? "border-ink bg-ink text-surface dark:border-border dark:bg-surface-2 dark:text-ink"
                  : "border-border text-ink-3"
              }`}
            >
              Toutes
            </div>
            {state.subjects.map((s) => {
              const c = subjectColor(s.color);
              const active = subjFilter === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSubjFilter(active ? null : s.id)}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] border px-2.5 py-[5px] font-mono text-[10.5px] tracking-[0.3px]"
                  style={{
                    background: active ? c : "transparent",
                    color: active ? "#fff" : "var(--ink-3)",
                    borderColor: active ? c : "var(--border)",
                  }}
                >
                  {!active && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: c }}
                    />
                  )}
                  {s.name}
                </div>
              );
            })}
          </div>
        )}

        <div className="px-4 pb-6 pt-1">
          {/* Mode prof : saisie de note */}
          {!isStudent && (
            <TeacherGradeEntry
              state={state}
              onSaved={() => router.refresh()}
              onOpenBulk={() => setShowBulk(true)}
            />
          )}

          <SectionLabel>
            {subjFilter
              ? subjectsById.get(subjFilter)?.name?.toUpperCase() ?? "MATIÈRE"
              : `MATIÈRES (${stats.length})`}
          </SectionLabel>
          {statsFiltered.length === 0 && (
            <div className="mb-2 rounded-[12px] border border-dashed border-border p-[18px] text-center font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
              AUCUNE MATIÈRE
            </div>
          )}
          {statsFiltered.map((s) => {
            const subj = subjectsById.get(s.subjectId);
            if (!subj) return null;
            const c = subjectColor(subj.color);
            return (
              <div
                key={s.subjectId}
                onClick={() => setDetailSubjectId(s.subjectId)}
                className="mb-2 cursor-pointer rounded-[12px] border border-border bg-surface px-3.5 py-[11px]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-7 w-[3px] rounded-[2px]"
                    style={{ background: c }}
                  />
                  <div className="flex-1">
                    <div className="text-[14px] font-medium">{subj.name}</div>
                    <span className="font-mono text-[11px] text-ink-3">
                      {s.count} note{s.count > 1 ? "s" : ""} · coef {subj.coef}
                    </span>
                  </div>
                  {s.trend.length > 0 && (
                    <Sparkline data={s.trend} color={c} p={p} />
                  )}
                  <div className="min-w-[52px] text-right">
                    <span className="font-mono text-[18px] font-semibold tracking-[-0.4px] tabular-nums text-ink">
                      {s.avg != null ? s.avg.toFixed(1) : "—"}
                    </span>
                    <span className="font-mono text-[10px] text-ink-4">/20</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollFade>

      {/* Vue détail matière */}
      {detailSubject && (
        <div className="absolute inset-0 z-50 flex animate-berliner-slide-up flex-col bg-[#FAFAF7] dark:bg-[#0E0E10]">
          <div
            className="flex items-center gap-3 border-b border-border px-4 py-3"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
          >
            <div
              onClick={() => setDetailSubjectId(null)}
              className="cursor-pointer font-mono text-[12px] tracking-[0.4px] text-ink-3"
            >
              ← RETOUR
            </div>
            <div className="flex-1" />
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: subjectColor(detailSubject.color) }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
              {detailSubject.code || detailSubject.name}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-[100px] pt-4">
            <div className="mb-1 text-[26px] font-semibold tracking-[-0.5px]">
              {detailSubject.name}
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.4px] text-ink-3">
              COEF {detailSubject.coef} · {detailGrades.length} NOTES
            </span>

            <div className="mt-3.5 flex gap-2.5">
              {[
                {
                  l: "MOYENNE",
                  v: detailStat?.avg != null ? detailStat.avg.toFixed(1) : "—",
                  cls: "text-ink",
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
                  cls: "text-sem-ok",
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
                  cls: "text-sem-bad",
                },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex-1 rounded-[10px] border border-border bg-surface px-3 py-2.5"
                >
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.5px] text-ink-4">
                    {s.l}
                  </span>
                  <span
                    className={`mt-0.5 block font-mono text-[22px] font-semibold tracking-[-0.5px] tabular-nums ${s.cls}`}
                  >
                    {s.v}
                  </span>
                </div>
              ))}
            </div>

            {detailGrades.length > 1 && (
              <div className="mt-3.5 rounded-[12px] border border-border bg-surface px-3.5 py-3">
                <span className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.6px] text-ink-3">
                  ÉVOLUTION
                </span>
                <GradeChart
                  data={toPoints(detailGrades)}
                  avg={detailStat?.avg ?? null}
                  color={subjectColor(detailSubject.color)}
                />
              </div>
            )}

            <SectionLabel>HISTORIQUE</SectionLabel>
            <div className="mb-2 overflow-hidden rounded-[12px] border border-border bg-surface">
              {[...detailGrades]
                .sort((a, b) => b.evaluationDate.localeCompare(a.evaluationDate))
                .map((r, i, arr) => {
                  const note20 = (r.score / Math.max(r.maxScore, 1)) * 20;
                  const noteCls =
                    note20 >= 14
                      ? "text-sem-ok"
                      : note20 < 10
                      ? "text-sem-bad"
                      : "text-ink";
                  return (
                    <div
                      key={r.id}
                      className={`flex items-center gap-3 px-3.5 py-[11px] ${
                        i === arr.length - 1 ? "" : "border-b border-border"
                      }`}
                    >
                      <span className="w-11 font-mono text-[10px] tracking-[0.4px] text-ink-3">
                        {fmtDate(r.evaluationDate)}
                      </span>
                      <span className="flex-1 font-mono text-[11px] uppercase tracking-[0.4px] text-ink-2">
                        {r.evaluationName} · {termFromDate(r.evaluationDate)}
                      </span>
                      <span
                        className={`font-mono text-[16px] font-semibold tracking-[-0.3px] ${noteCls}`}
                      >
                        {r.score}
                      </span>
                      <span className="font-mono text-[11px] text-ink-4">
                        /{r.maxScore}
                      </span>
                      {!isStudent && (
                        <DeleteGradeButton
                          gradeId={r.id}
                          onDeleted={() => router.refresh()}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
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
    </div>
  );
}

// Panneau prof : saisie d'une note (inline, au-dessus de la liste).
function TeacherGradeEntry({
  state,
  onSaved,
  onOpenBulk,
}: {
  state: BerlinerState;
  onSaved: () => void;
  onOpenBulk: () => void;
}) {
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

  // Sélections par défaut, dérivées (pas d'effet nécessaire).
  const effStudentId = studentId ?? state.students?.[0]?.id ?? null;
  const effClassSubjectId = classSubjectId ?? teachableClassSubjects[0]?.id ?? null;

  const submit = () => {
    if (!effStudentId || !effClassSubjectId || !score) return;
    const numScore = parseFloat(score.replace(",", "."));
    if (Number.isNaN(numScore)) return;
    startTransition(async () => {
      const r = await addGradeAction({
        studentId: effStudentId,
        classSubjectId: effClassSubjectId,
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

  if (!state.students || state.students.length === 0) return null;

  const inputCls =
    "rounded-[6px] border border-border bg-chip px-2.5 py-1.5 text-[13px] text-ink outline-none";

  return (
    <>
      <SectionLabel>ÉLÈVE</SectionLabel>
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {state.students.map((st) => {
          const active = effStudentId === st.id;
          return (
            <div
              key={st.id}
              onClick={() => setStudentId(st.id)}
              className={`cursor-pointer rounded-[7px] border px-2.5 py-1.5 text-[12px] font-medium ${
                active
                  ? "border-primary bg-primary text-white dark:text-[#0E0E10]"
                  : "border-border bg-surface text-ink-2"
              }`}
            >
              {st.first_name} {st.last_name?.[0] ?? ""}.
            </div>
          );
        })}
      </div>
      <div className="mb-2 flex gap-1.5">
        <div
          onClick={() => setAdding((v) => !v)}
          className={`flex-1 cursor-pointer rounded-[9px] border px-3 py-2.5 text-center font-mono text-[11px] font-semibold tracking-[0.4px] ${
            adding
              ? "border-primary bg-primary text-white dark:text-[#0E0E10]"
              : "border-border bg-surface text-ink-2"
          }`}
        >
          {adding ? "ANNULER" : "+ SAISIR UNE NOTE"}
        </div>
        <div
          onClick={onOpenBulk}
          className="flex-1 cursor-pointer rounded-[9px] border border-dashed border-border bg-surface px-3 py-2.5 text-center font-mono text-[11px] font-semibold tracking-[0.4px] text-ink-2"
        >
          ↥ IMPORT CSV
        </div>
      </div>
      {adding && (
        <div className="mb-2 animate-berliner-slide-down rounded-[12px] border border-border bg-surface p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {teachableClassSubjects.map((cs) => {
              const active = effClassSubjectId === cs.id;
              return (
                <div
                  key={cs.id}
                  onClick={() => setClassSubjectId(cs.id)}
                  className={`cursor-pointer rounded-[6px] px-2 py-1 font-mono text-[11px] ${
                    active
                      ? "bg-primary text-white dark:text-[#0E0E10]"
                      : "bg-chip text-ink-2"
                  }`}
                >
                  {cs.subjectName} · {cs.className}
                </div>
              );
            })}
          </div>
          <input
            value={evalName}
            onChange={(e) => setEvalName(e.target.value)}
            placeholder="DS, contrôle, TP…"
            className={`mb-2 w-full ${inputCls}`}
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Note"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              step="0.5"
              min="0"
              max={maxScore}
              className={`w-[70px] ${inputCls} font-mono`}
            />
            <span className="font-mono text-[13px] text-ink-3">/ {maxScore}</span>
            <input
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(parseInt(e.target.value, 10) || 20)}
              min="1"
              className={`w-[50px] ${inputCls} font-mono text-ink-3`}
            />
            <div className="flex-1" />
            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              className="rounded-[6px] bg-primary px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.4px] text-white disabled:opacity-70 dark:text-[#0E0E10]"
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
  onDeleted,
}: {
  gradeId: string;
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
      className={`ml-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-chip font-mono text-[12px] text-ink-3 ${
        isPending ? "cursor-wait opacity-50" : "cursor-pointer"
      }`}
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
