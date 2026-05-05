"use client";

import { useEffect, useMemo, useState } from "react";
import { type BerlinerState } from "@/actions/berliner-state";
import { useTheme } from "@/shared/design/ThemeProvider";
import {
  AppCard,
  AppSectionLabel,
  PageShell,
  SectionEmpty,
} from "@/shared/components/berliner/Shell";
import { colorFor, localISO, relDue } from "@/shared/design/tokens";
import {
  GlobalAnimations,
  Mono,
  ScrollFade,
  hapticPing,
} from "@/shared/design/primitives";
import { AppHeader } from "@/shared/components/berliner/Shell";

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

export function DevoirsClient({ state }: DevoirsClientProps) {
  const { palette: p } = useTheme();
  const isStudent = state.profile.role === "student";
  const today = localISO(new Date());
  const todayDate = new Date(today + "T00:00");

  const [progress, setProgress] = useState<ProgressMap>({});
  const [doneOverride, setDoneOverride] = useState<DoneMap>({});
  const [subjFilter, setSubjFilter] = useState<string | null>(null);

  // Hydrate from localStorage on mount.
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
      // For students, "done" is when a grade exists OR they checked it.
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

  const renderItem = (
    it: (typeof items)[number],
    last: boolean
  ) => {
    const subj = subjectsById.get(it.evaluation.subjectId);
    const c = subj ? colorFor(p, subj.color) : p.accent;
    const overdue =
      new Date(it.evaluation.date + "T00:00").getTime() < todayDate.getTime();
    return (
      <div
        key={it.evaluation.id}
        style={{
          padding: "12px 14px",
          borderBottom: last ? "none" : `1px solid ${p.border}`,
          animation: "berliner-fade-in 220ms ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div
            onClick={(e) => {
              hapticPing(e.currentTarget);
              toggleDone(it.evaluation.id);
            }}
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              border: `1.5px solid ${overdue ? p.sem.bad : p.ink3}`,
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 150ms",
            }}
          />
          <div
            style={{
              width: 3,
              height: 22,
              borderRadius: 2,
              background: c,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16.5, fontWeight: 500, lineHeight: 1.2 }}>
              {it.evaluation.name}
            </div>
            <Mono style={{ fontSize: 13, color: p.ink3 }}>
              {it.evaluation.subjectName}
            </Mono>
          </div>
          <Mono
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: 0.4,
              textAlign: "right",
              color: overdue ? p.sem.bad : p.accent,
            }}
          >
            {relDue(it.evaluation.date)}
          </Mono>
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
            style={{
              height: 6,
              borderRadius: 3,
              cursor: "pointer",
              background: p.dark ? p.surface2 : p.chip,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${(it.progress || 0) * 100}%`,
                background: c,
                borderRadius: 3,
                transition: "width 200ms ease-out",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderBucket = (label: string, list: typeof todo, color?: string) => {
    if (list.length === 0) return null;
    return (
      <div key={label}>
        <AppSectionLabel p={p}>
          <span style={{ color: color ?? p.ink3 }}>{label}</span>
          <Mono style={{ marginLeft: 6, color: p.ink4 }}>· {list.length}</Mono>
        </AppSectionLabel>
        <AppCard p={p}>
          {list.map((it, i) => renderItem(it, i === list.length - 1))}
        </AppCard>
      </div>
    );
  };

  return (
    <PageShell p={p}>
      <GlobalAnimations />
      <AppHeader
        p={p}
        kicker={isStudent ? "DEVOIRS" : "ÉVALUATIONS"}
        kickerRight={<Mono>{todo.length} EN COURS</Mono>}
        title={
          <>
            {todo.length} à {isStudent ? "rendre" : "noter"}
            <br />
            <span style={{ color: p.ink3, fontWeight: 500 }}>cette semaine.</span>
          </>
        }
      />

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
              background: !subjFilter ? (p.dark ? p.surface2 : p.ink) : "transparent",
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

      <ScrollFade style={{ padding: "0 16px 24px" }}>
        {isStudent && todo.length > 0 && (
          <Mono
            style={{
              fontSize: 11.5,
              color: p.ink4,
              padding: "2px 0 4px",
              letterSpacing: 0.3,
              display: "block",
              textTransform: "uppercase",
            }}
          >
            ↔ glisse la barre pour ajuster l&apos;avancement
          </Mono>
        )}

        {renderBucket("EN RETARD", buckets.late, p.sem.bad)}
        {renderBucket("AUJOURD'HUI", buckets.today, p.accent)}
        {renderBucket("CETTE SEMAINE", buckets.week)}
        {renderBucket("PLUS TARD", buckets.later)}

        {todo.length === 0 && (
          <SectionEmpty p={p}>RIEN À RENDRE — RESPIRE.</SectionEmpty>
        )}

        {done.length > 0 && (
          <>
            <AppSectionLabel p={p}>RENDUS</AppSectionLabel>
            <AppCard p={p}>
              {done.map((it, i) => {
                const subj = subjectsById.get(it.evaluation.subjectId);
                const c = subj ? colorFor(p, subj.color) : p.accent;
                return (
                  <div
                    key={it.evaluation.id}
                    onClick={() => toggleDone(it.evaluation.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      cursor: "pointer",
                      borderBottom:
                        i === done.length - 1 ? "none" : `1px solid ${p.border}`,
                      opacity: 0.75,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        background: c + "25",
                        color: c,
                        fontSize: 13,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15.5,
                          fontWeight: 500,
                          textDecoration: "line-through",
                          color: p.ink3,
                          lineHeight: 1.2,
                        }}
                      >
                        {it.evaluation.name}
                      </div>
                      <Mono style={{ fontSize: 12.5, color: p.ink4 }}>
                        {it.evaluation.subjectName} · {relDue(it.evaluation.date)}
                      </Mono>
                    </div>
                    {it.grade ? (
                      <Mono
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color:
                            (it.grade.score / Math.max(it.grade.maxScore, 1)) *
                              20 >=
                            14
                              ? p.sem.ok
                              : p.ink2,
                        }}
                      >
                        {it.grade.score}/{it.grade.maxScore}
                      </Mono>
                    ) : (
                      <Mono
                        style={{
                          fontSize: 12,
                          color: p.ink4,
                          letterSpacing: 0.3,
                        }}
                      >
                        note à venir
                      </Mono>
                    )}
                  </div>
                );
              })}
            </AppCard>
          </>
        )}
      </ScrollFade>
    </PageShell>
  );
}
