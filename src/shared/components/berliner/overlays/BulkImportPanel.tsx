"use client";

import { useMemo, useState } from "react";
import {
  bulkAddGradesAction,
  type TeacherStudent,
  type TeacherSubject,
} from "@/actions/berliner";
import { useTheme } from "@/shared/design/ThemeProvider";
import { Mono } from "@/shared/design/primitives";
import { OverlayShell } from "./OverlayShell";

// BulkImportPanel — paste CSV, parse, preview, submit.
type BulkImportPanelProps = {
  onClose: () => void;
  subjects: TeacherSubject[];
  students: TeacherStudent[];
  onSaved?: (count: number) => void;
};

type ParsedRow = {
  line: number;
  name: string;
  note: number | null;
  max: number;
  studentId?: string;
  matchName?: string;
  error: string | null;
};

export function BulkImportPanel({
  onClose,
  subjects,
  students,
  onSaved,
}: BulkImportPanelProps) {
  const { palette: p } = useTheme();
  const [classSubjectId, setClassSubjectId] = useState<string | null>(
    subjects[0]?.classSubjectId ?? null
  );
  const [evalName, setEvalName] = useState("Évaluation");
  const [raw, setRaw] = useState(
    students
      .slice(0, 6)
      .map(
        (s) =>
          `${s.first_name} ${s.last_name},${(10 + Math.floor(Math.random() * 9)).toFixed(0)},20`
      )
      .join("\n")
  );
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Filter the student pool to only those enrolled in the chosen class.
  const allowedStudents = useMemo(() => {
    if (!classSubjectId) return students;
    const cs = subjects.find((s) => s.classSubjectId === classSubjectId);
    if (!cs) return students;
    return students.filter((s) => s.class_id === cs.classId);
  }, [classSubjectId, students, subjects]);

  const parsed = useMemo<ParsedRow[]>(() => {
    return raw
      .split("\n")
      .map((line, i): ParsedRow | null => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        const cols = trimmed.split(/[,;\t]/).map((c) => c.trim());
        if (cols.length < 2) {
          return {
            line: i + 1,
            name: cols[0] ?? "",
            note: null,
            max: 20,
            error: "note manquante",
          };
        }
        const name = cols[0];
        const note = parseFloat(cols[1].replace(",", "."));
        const max = cols[2] ? parseFloat(cols[2].replace(",", ".")) : 20;
        const lower = name.toLowerCase();
        const match = allowedStudents.find((s) => {
          const full = `${s.first_name} ${s.last_name}`.trim().toLowerCase();
          return (
            full === lower ||
            (s.last_name &&
              s.last_name.length > 2 &&
              lower.includes(s.last_name.toLowerCase()))
          );
        });
        let error: string | null = null;
        if (Number.isNaN(note)) error = "note invalide";
        else if (note < 0 || note > max) error = `hors [0, ${max}]`;
        else if (!match) error = "élève introuvable";
        return {
          line: i + 1,
          name,
          note: Number.isNaN(note) ? null : note,
          max,
          studentId: match?.id,
          matchName: match ? `${match.first_name} ${match.last_name}` : undefined,
          error,
        };
      })
      .filter((row): row is ParsedRow => row !== null);
  }, [raw, allowedStudents]);

  const valid = parsed.filter((r) => !r.error && r.note !== null);
  const errors = parsed.filter((r) => r.error);

  const submit = async () => {
    if (!classSubjectId || valid.length === 0) return;
    setBusy(true);
    setResult(null);
    const r = await bulkAddGradesAction({
      classSubjectId,
      evaluationName: evalName,
      coefficient: 1,
      rows: valid.map((v) => ({
        studentId: v.studentId!,
        score: v.note!,
        maxScore: v.max,
      })),
    });
    setBusy(false);
    if (!r.ok) {
      setResult({ kind: "err", text: r.error.message });
      return;
    }
    setResult({
      kind: "ok",
      text: `${r.data.count} note${r.data.count > 1 ? "s" : ""} publiée${r.data.count > 1 ? "s" : ""}`,
    });
    onSaved?.(r.data.count);
    window.setTimeout(onClose, 900);
  };

  return (
    <OverlayShell
      p={p}
      kicker="PROF · BULK CSV"
      title={
        <>
          Import <span className="text-primary">notes</span>
        </>
      }
      onClose={onClose}
      footer={
        <div className="flex items-center gap-2">
          <Mono className="text-[10.5px] tracking-[0.3px] text-ink-3">
            <span className="font-semibold text-sem-ok">{valid.length}</span> ok
            <span className="mx-1.5 opacity-40">·</span>
            <span className="font-semibold text-sem-bad">{errors.length}</span> ko
          </Mono>
          <div className="flex-1" />
          <div
            onClick={busy || valid.length === 0 ? undefined : submit}
            className="rounded-[9px] px-4 py-[11px] text-center font-mono text-[11px] font-semibold tracking-[0.5px]"
            style={{
              background:
                busy || valid.length === 0 ? (p.dark ? p.surface2 : p.chip) : p.accent,
              color:
                busy || valid.length === 0 ? p.ink3 : p.dark ? "#0E0E10" : "#FFF",
              cursor: busy || valid.length === 0 ? "not-allowed" : "pointer",
              border: `1px solid ${
                busy || valid.length === 0 ? p.border : p.accent
              }`,
            }}
          >
            {busy
              ? "PUBLICATION…"
              : `PUBLIER ${valid.length} NOTE${valid.length > 1 ? "S" : ""}`}
          </div>
        </div>
      }
    >
      <Mono className="mb-2.5 block text-[10.5px] tracking-[0.4px] text-ink-3">
        FORMAT · une ligne par élève ·{" "}
        <span className="text-ink-2">nom prénom, note, max</span>
      </Mono>

      <Mono className="mb-1.5 block text-[9.5px] uppercase tracking-[0.5px] text-ink-3">
        Matière
      </Mono>
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {subjects.map((s) => (
          <div
            key={s.classSubjectId}
            onClick={() => setClassSubjectId(s.classSubjectId)}
            className="cursor-pointer rounded-md px-2.5 py-[5px] font-mono text-[11px] tracking-[0.3px]"
            style={{
              background:
                classSubjectId === s.classSubjectId
                  ? p.accent
                  : p.dark
                  ? p.surface2
                  : p.chip,
              color:
                classSubjectId === s.classSubjectId
                  ? p.dark
                    ? "#0E0E10"
                    : "#FFF"
                  : p.ink2,
            }}
          >
            {s.subjectName} · {s.className}
          </div>
        ))}
      </div>

      <Mono className="mb-1.5 block text-[9.5px] uppercase tracking-[0.5px] text-ink-3">
        Nom de l&apos;évaluation
      </Mono>
      <input
        value={evalName}
        onChange={(e) => setEvalName(e.target.value)}
        placeholder="DS · contrôle · TP…"
        className="mb-3 w-full rounded-[9px] border border-border bg-surface px-[11px] py-[9px] font-sans text-[13px] text-ink outline-none dark:bg-surface-2"
      />

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={6}
        className="w-full resize-y rounded-[9px] border border-border bg-surface px-3 py-2.5 font-mono text-[12px] leading-[1.5] text-ink outline-none dark:bg-surface-2"
      />

      <Mono className="my-1.5 mb-1.5 mt-3 block text-[10px] tracking-[0.4px] text-ink-4">
        APERÇU · {parsed.length} LIGNE{parsed.length > 1 ? "S" : ""}
      </Mono>
      <div className="overflow-hidden rounded-[10px] border border-border bg-surface">
        {parsed.length === 0 && (
          <div className="p-3.5 text-center font-mono text-[11px] text-ink-4">
            — VIDE —
          </div>
        )}
        {parsed.map((r, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-2 ${
              i === parsed.length - 1 ? "" : "border-b border-border"
            }`}
            style={{ background: r.error ? p.sem.bad + "0d" : "transparent" }}
          >
            <Mono className="w-4 text-[10px] text-ink-4">{r.line}</Mono>
            <div className="min-w-0 flex-1">
              <div
                className={`overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium leading-[1.2] ${
                  r.error ? "text-ink-3" : "text-ink"
                }`}
              >
                {r.matchName ?? r.name}
              </div>
              {r.error && (
                <Mono className="text-[10px] tracking-[0.3px] text-sem-bad">
                  ⚠ {r.error}
                </Mono>
              )}
            </div>
            {!r.error && r.note !== null && (
              <Mono
                className="text-[14px] font-semibold tracking-[-0.3px]"
                style={{
                  color: r.note >= 14 ? p.sem.ok : r.note < 10 ? p.sem.bad : p.ink,
                }}
              >
                {r.note}
              </Mono>
            )}
            {!r.error && <Mono className="text-[10px] text-ink-4">/{r.max}</Mono>}
          </div>
        ))}
      </div>

      {result && (
        <div
          className="mt-3 rounded-lg px-[11px] py-[9px] font-mono text-[11px] tracking-[0.3px]"
          style={{
            background: result.kind === "err" ? p.sem.bad + "20" : p.sem.ok + "20",
            color: result.kind === "err" ? p.sem.bad : p.sem.ok,
          }}
        >
          {result.text}
        </div>
      )}
    </OverlayShell>
  );
}
