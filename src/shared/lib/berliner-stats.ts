// Pure helpers for the Berliner mobile UI. Lives outside `actions/` so it
// can be imported from both server components and `'use client'` modules
// (Server Action files require every export to be async).

import type {
  BerlinerState,
  BerlinerSubjectStats,
} from "@/actions/berliner-state";

export function computeSubjectStats(
  state: Pick<BerlinerState, "subjects" | "grades">
): BerlinerSubjectStats[] {
  return state.subjects.map((subj) => {
    const gs = state.grades.filter((g) => g.subjectId === subj.id);
    const sorted = [...gs].sort((a, b) =>
      (a.evaluationDate || "").localeCompare(b.evaluationDate || "")
    );
    const trend = sorted.map((g) =>
      g.maxScore > 0 ? (g.score / g.maxScore) * 20 : 0
    );
    const avg =
      gs.length > 0
        ? gs.reduce((acc, g) => acc + (g.score / Math.max(g.maxScore, 1)) * 20, 0) /
          gs.length
        : null;
    return { subjectId: subj.id, count: gs.length, avg, trend };
  });
}

export function computeGlobalAverage(
  state: Pick<BerlinerState, "subjects" | "grades">
): number | null {
  const stats = computeSubjectStats(state).filter((s) => s.avg !== null);
  if (stats.length === 0) return null;
  const num = stats.reduce(
    (acc, s) =>
      acc +
      (s.avg as number) *
        (state.subjects.find((x) => x.id === s.subjectId)?.coef ?? 1),
    0
  );
  const den = stats.reduce(
    (acc, s) =>
      acc + (state.subjects.find((x) => x.id === s.subjectId)?.coef ?? 1),
    0
  );
  return den > 0 ? num / den : null;
}
