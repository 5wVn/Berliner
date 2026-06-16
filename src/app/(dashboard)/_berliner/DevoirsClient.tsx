"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { type BerlinerState } from "@/actions/berliner-state";
import { subjectColor, localISO, relDue } from "@/shared/design/tokens";
import { ScrollFade, hapticPing } from "@/shared/design/primitives";

type DevoirsClientProps = { state: BerlinerState };

const PROGRESS_KEY = "berliner.devoirs.progress.v1";
const DONE_KEY = "berliner.devoirs.done.v1";

type ProgressMap = Record<string, number>; // evaluationId → 0..1
type DoneMap = Record<string, boolean>; // evaluationId → completed

function loadMap<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveMap(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Carte générique.
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 overflow-hidden rounded-[12px] border border-border bg-surface">
      {children}
    </div>
  );
}

export function DevoirsClient({ state }: DevoirsClientProps) {
  const isStudent = state.profile.role === "student";
  const today = localISO(new Date());
  const todayDate = new Date(today + "T00:00");

  const [progress, setProgress] = useState<ProgressMap>({});
  const [doneOverride, setDoneOverride] = useState<DoneMap>({});
  const [subjFilter, setSubjFilter] = useState<string | null>(null);

  // Lecture du localStorage après le montage (évite un décalage d'hydratation).
  useEffect(() => {
    setProgress(loadMap<ProgressMap>(PROGRESS_KEY, {}));
    setDoneOverride(loadMap<DoneMap>(DONE_KEY, {}));
  }, []);

  const subjectsById = useMemo(
    () => new Map(state.subjects.map((s) => [s.id, s])),
    [state.subjects]
  );

  const items = useMemo(() => {
    const filtered = subjFilter
      ? state.evaluations.filter((e) => e.subjectId === subjFilter)
      : state.evaluations;

    return filtered.map((ev) => {
      const grade = isStudent
        ? state.grades.find(
            (g) => g.evaluationId === ev.id && g.studentId === state.profile.id
          )
        : null;
      const stored = doneOverride[ev.id];
      const computed = stored !== undefined ? stored : Boolean(grade);
      return {
        evaluation: ev,
        grade,
        done: computed,
        progress: progress[ev.id] ?? (computed ? 1 : 0),
      };
    });
  }, [
    state.evaluations,
    state.grades,
    state.profile.id,
    isStudent,
    subjFilter,
    progress,
    doneOverride,
  ]);

  const todo = items
    .filter((it) => !it.done)
    .sort((a, b) => a.evaluation.date.localeCompare(b.evaluation.date));
  const done = items
    .filter((it) => it.done)
    .sort((a, b) => b.evaluation.date.localeCompare(a.evaluation.date));

  const buckets = {
    late: [] as typeof todo,
    today: [] as typeof todo,
    week: [] as typeof todo,
    later: [] as typeof todo,
  };
  todo.forEach((it) => {
    const d = new Date(it.evaluation.date + "T00:00");
    const diff = Math.floor((d.getTime() - todayDate.getTime()) / 86400000);
    if (diff < 0) buckets.late.push(it);
    else if (diff === 0) buckets.today.push(it);
    else if (diff <= 7) buckets.week.push(it);
    else buckets.later.push(it);
  });

  const setItemProgress = (id: string, pct: number) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: pct };
      saveMap(PROGRESS_KEY, next);
      return next;
    });
    if (pct >= 1) {
      setDoneOverride((prev) => {
        const next = { ...prev, [id]: true };
        saveMap(DONE_KEY, next);
        return next;
      });
    }
  };

  const toggleDone = (id: string) => {
    setDoneOverride((prev) => {
      const wasDone = prev[id] ?? false;
      const next = { ...prev, [id]: !wasDone };
      saveMap(DONE_KEY, next);
      return next;
    });
    setProgress((prev) => {
      const wasDone = doneOverride[id] ?? false;
      const next = { ...prev, [id]: wasDone ? 0 : 1 };
      saveMap(PROGRESS_KEY, next);
      return next;
    });
  };

  const renderItem = (it: (typeof items)[number], last: boolean) => {
    const subj = subjectsById.get(it.evaluation.subjectId);
    const c = subjectColor(subj?.color);
    const overdue =
      new Date(it.evaluation.date + "T00:00").getTime() < todayDate.getTime();
    return (
      <div
        key={it.evaluation.id}
        className={`animate-berliner-fade-in px-3.5 py-3 ${
          last ? "" : "border-b border-border"
        }`}
      >
        <div className="mb-2 flex items-center gap-3">
          <div
            onClick={(e) => {
              hapticPing(e.currentTarget);
              toggleDone(it.evaluation.id);
            }}
            className={`h-[22px] w-[22px] shrink-0 cursor-pointer rounded-full border-[1.5px] ${
              overdue ? "border-sem-bad" : "border-ink-3"
            }`}
          />
          <div
            className="h-[22px] w-[3px] shrink-0 rounded-[2px]"
            style={{ background: c }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[14.5px] font-medium leading-[1.2]">
              {it.evaluation.name}
            </div>
            <div className="font-mono text-[11px] text-ink-3">
              {it.evaluation.subjectName}
            </div>
          </div>
          <span
            className={`text-right font-mono text-[10.5px] font-semibold tracking-[0.4px] ${
              overdue ? "text-sem-bad" : "text-primary"
            }`}
          >
            {relDue(it.evaluation.date)}
          </span>
        </div>
        {isStudent && (
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(
                0,
                Math.min(1, (e.clientX - rect.left) / rect.width)
              );
              setItemProgress(it.evaluation.id, pct);
            }}
            className="relative h-1.5 cursor-pointer overflow-hidden rounded-[3px] bg-chip"
          >
            <div
              className="absolute left-0 top-0 h-full rounded-[3px] transition-[width] duration-200 ease-out"
              style={{ width: `${(it.progress || 0) * 100}%`, background: c }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderBucket = (
    label: string,
    list: typeof todo,
    labelClass = "text-ink-3"
  ) => {
    if (list.length === 0) return null;
    return (
      <div key={label}>
        <div className="mt-[18px] mb-2 px-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.6px]">
          <span className={labelClass}>{label}</span>
          <span className="ml-1.5 text-ink-4">· {list.length}</span>
        </div>
        <Card>{list.map((it, i) => renderItem(it, i === list.length - 1))}</Card>
      </div>
    );
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col text-ink">
      {/* En-tête */}
      <div className="px-5 pb-2 pt-3.5">
        <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
          <span>{isStudent ? "DEVOIRS" : "ÉVALUATIONS"}</span>
          <span>{todo.length} EN COURS</span>
        </div>
        <div className="text-[26px] font-semibold leading-[1.15] tracking-[-0.4px]">
          {todo.length} à {isStudent ? "rendre" : "noter"}
          <br />
          <span className="font-medium text-ink-3">cette semaine.</span>
        </div>
      </div>

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

      <ScrollFade style={{ padding: "0 16px 24px" }}>
        {isStudent && todo.length > 0 && (
          <span className="block px-0 py-1 font-mono text-[9.5px] uppercase tracking-[0.3px] text-ink-4">
            ↔ glisse la barre pour ajuster l&apos;avancement
          </span>
        )}

        {renderBucket("EN RETARD", buckets.late, "text-sem-bad")}
        {renderBucket("AUJOURD'HUI", buckets.today, "text-primary")}
        {renderBucket("CETTE SEMAINE", buckets.week)}
        {renderBucket("PLUS TARD", buckets.later)}

        {todo.length === 0 && (
          <div className="mb-2 rounded-[12px] border border-dashed border-border p-[18px] text-center font-mono text-[11px] uppercase tracking-[0.5px] text-ink-3">
            RIEN À RENDRE — RESPIRE.
          </div>
        )}

        {done.length > 0 && (
          <>
            <div className="mt-[18px] mb-2 px-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.6px] text-ink-3">
              RENDUS
            </div>
            <Card>
              {done.map((it, i) => {
                const subj = subjectsById.get(it.evaluation.subjectId);
                const c = subjectColor(subj?.color);
                const ok =
                  it.grade != null &&
                  (it.grade.score / Math.max(it.grade.maxScore, 1)) * 20 >= 14;
                return (
                  <div
                    key={it.evaluation.id}
                    onClick={() => toggleDone(it.evaluation.id)}
                    className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 opacity-75 ${
                      i === done.length - 1 ? "" : "border-b border-border"
                    }`}
                  >
                    <div
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: c + "25", color: c }}
                    >
                      ✓
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium leading-[1.2] text-ink-3 line-through">
                        {it.evaluation.name}
                      </div>
                      <div className="font-mono text-[10.5px] text-ink-4">
                        {it.evaluation.subjectName} · {relDue(it.evaluation.date)}
                      </div>
                    </div>
                    {it.grade ? (
                      <span
                        className={`font-mono text-[13px] font-semibold ${
                          ok ? "text-sem-ok" : "text-ink-2"
                        }`}
                      >
                        {it.grade.score}/{it.grade.maxScore}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] tracking-[0.3px] text-ink-4">
                        note à venir
                      </span>
                    )}
                  </div>
                );
              })}
            </Card>
          </>
        )}
      </ScrollFade>
    </div>
  );
}
