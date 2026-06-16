'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse, ActionEmptyResponse } from '@/types/api';

const unauthenticated = () => ({
  ok: false as const,
  error: { code: 'UNAUTHENTICATED' as const, message: 'Session expirée.' },
});

const internal = (message: string) => ({
  ok: false as const,
  error: { code: 'INTERNAL' as const, message },
});

const validation = (message: string) => ({
  ok: false as const,
  error: { code: 'VALIDATION' as const, message },
});

const unique = <T>(items: Array<T | null | undefined>): T[] =>
  Array.from(new Set(items.filter((item): item is T => Boolean(item))));

// QR scan / attendance — student marks themselves present.
// Real-world: a server-validated nonce would be required; for the
// MVP we trust the session id and rely on RLS to scope writes.
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export async function markAttendanceAction(
  sessionId: string,
  status: AttendanceStatus = 'present'
): Promise<ActionEmptyResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  if (!sessionId) return validation('Identifiant de session manquant.');

  // Look up the session to fetch its establishment_id (every row needs it).
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id, establishment_id')
    .eq('id', sessionId)
    .maybeSingle();

  if (sessionError) return internal(sessionError.message);
  if (!session) return { ok: false, error: { code: 'NOT_FOUND', message: 'Session introuvable.' } };

  // Upsert by (session_id, student_id). If the row exists, update its status.
  const { data: existing, error: existingError } = await supabase
    .from('attendance_records')
    .select('id')
    .eq('session_id', sessionId)
    .eq('student_id', user.id)
    .maybeSingle();

  if (existingError) return internal(existingError.message);

  if (existing) {
    const { error } = await supabase
      .from('attendance_records')
      .update({ status })
      .eq('id', existing.id);
    if (error) return internal(error.message);
    return { ok: true };
  }

  const { error } = await supabase.from('attendance_records').insert({
    session_id: sessionId,
    student_id: user.id,
    status,
    establishment_id: session.establishment_id,
  });
  if (error) return internal(error.message);
  return { ok: true };
}

// Update own profile (any role).
// Avatar is stored as a public URL; clients pass a base64 data
// URL and we store it directly in `avatar_url` (column is text).
export type ProfileUpdate = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string | null;
};

export async function updateMyProfileAction(
  patch: ProfileUpdate
): Promise<ActionEmptyResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  const update: Record<string, unknown> = {};
  if (typeof patch.first_name === 'string') update.first_name = patch.first_name.trim();
  if (typeof patch.last_name === 'string') update.last_name = patch.last_name.trim();
  // NOTE: la colonne profiles.avatar_url n'existe pas dans cette base — on
  // n'écrit donc pas la photo (les initiales sont utilisées). Pour l'activer,
  // lance scripts/add-profile-columns.mjs puis réintègre la ligne ci-dessous :
  // if ('avatar_url' in patch) update.avatar_url = patch.avatar_url ?? null;

  if (Object.keys(update).length === 0) return { ok: true };

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id);

  if (error) return internal(error.message);
  return { ok: true };
}

// Teacher: add a single grade for a student on a given subject.
export type AddGradeInput = {
  studentId: string;
  classSubjectId: string;
  evaluationName: string;
  score: number;
  maxScore: number;
  coefficient?: number;
};

export async function addGradeAction(
  input: AddGradeInput
): Promise<ActionEmptyResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  if (!input.studentId || !input.classSubjectId) {
    return validation('Informations manquantes.');
  }
  if (!Number.isFinite(input.score) || !Number.isFinite(input.maxScore) || input.maxScore <= 0) {
    return validation('Note invalide.');
  }

  // Verify the teacher actually owns the class_subject (RLS will also enforce).
  const { data: cs, error: csError } = await supabase
    .from('class_subjects')
    .select('id, teacher_id, establishment_id')
    .eq('id', input.classSubjectId)
    .maybeSingle();
  if (csError) return internal(csError.message);
  if (!cs) return { ok: false, error: { code: 'NOT_FOUND', message: 'Matière introuvable.' } };
  if (cs.teacher_id !== user.id) {
    return { ok: false, error: { code: 'UNAUTHORIZED', message: "Vous n'enseignez pas cette matière." } };
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  const { data: evaluation, error: evalError } = await supabase
    .from('evaluations')
    .insert({
      class_subject_id: input.classSubjectId,
      name: input.evaluationName || 'Évaluation',
      coefficient: input.coefficient ?? 1,
      date: todayIso,
      establishment_id: cs.establishment_id,
    })
    .select('id')
    .maybeSingle();

  if (evalError || !evaluation) return internal(evalError?.message ?? 'Insertion impossible.');

  const { error: gradeError } = await supabase.from('grades').insert({
    evaluation_id: evaluation.id,
    student_id: input.studentId,
    score: input.score,
    max_score: input.maxScore,
    establishment_id: cs.establishment_id,
  });
  if (gradeError) return internal(gradeError.message);

  return { ok: true };
}

// Teacher: delete a single grade.
export async function deleteGradeAction(
  gradeId: string
): Promise<ActionEmptyResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();
  if (!gradeId) return validation('Identifiant manquant.');

  const { error } = await supabase.from('grades').delete().eq('id', gradeId);
  if (error) return internal(error.message);
  return { ok: true };
}

// Teacher: bulk-create one evaluation + grades from a CSV row set.
export type BulkGradeRow = { studentId: string; score: number; maxScore: number };
export type BulkGradesInput = {
  classSubjectId: string;
  evaluationName: string;
  coefficient?: number;
  rows: BulkGradeRow[];
};

export async function bulkAddGradesAction(
  input: BulkGradesInput
): Promise<ActionResponse<{ count: number }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  if (!input.classSubjectId || !input.rows?.length) {
    return validation('Aucune ligne à publier.');
  }

  const { data: cs, error: csError } = await supabase
    .from('class_subjects')
    .select('id, teacher_id, establishment_id')
    .eq('id', input.classSubjectId)
    .maybeSingle();
  if (csError) return internal(csError.message);
  if (!cs) return { ok: false, error: { code: 'NOT_FOUND', message: 'Matière introuvable.' } };
  if (cs.teacher_id !== user.id) {
    return { ok: false, error: { code: 'UNAUTHORIZED', message: "Vous n'enseignez pas cette matière." } };
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  const { data: evaluation, error: evalError } = await supabase
    .from('evaluations')
    .insert({
      class_subject_id: input.classSubjectId,
      name: input.evaluationName || 'Évaluation',
      coefficient: input.coefficient ?? 1,
      date: todayIso,
      establishment_id: cs.establishment_id,
    })
    .select('id')
    .maybeSingle();

  if (evalError || !evaluation) return internal(evalError?.message ?? 'Insertion impossible.');

  const grades = input.rows
    .filter((r) => Number.isFinite(r.score) && Number.isFinite(r.maxScore) && r.maxScore > 0)
    .map((r) => ({
      evaluation_id: evaluation.id,
      student_id: r.studentId,
      score: r.score,
      max_score: r.maxScore,
      establishment_id: cs.establishment_id,
    }));

  if (grades.length === 0) {
    return { ok: true, data: { count: 0 } };
  }

  const { error: gradeError } = await supabase.from('grades').insert(grades);
  if (gradeError) return internal(gradeError.message);
  return { ok: true, data: { count: grades.length } };
}

// Teacher: list students in their classes (for grade entry +
// CSV preview matching).
export type TeacherStudent = {
  id: string;
  first_name: string;
  last_name: string;
  class_id: string;
  class_name: string;
};

export async function getTeacherStudentsAction(): Promise<
  ActionResponse<TeacherStudent[]>
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  const { data: classSubjects, error: csError } = await supabase
    .from('class_subjects')
    .select('class_id')
    .eq('teacher_id', user.id);
  if (csError) return internal(csError.message);

  const classIds = unique((classSubjects ?? []).map((row) => row.class_id));
  if (classIds.length === 0) return { ok: true, data: [] };

  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('student_id, class_id')
    .in('class_id', classIds);
  if (enrollError) return internal(enrollError.message);

  const studentIds = unique((enrollments ?? []).map((row) => row.student_id));
  if (studentIds.length === 0) return { ok: true, data: [] };

  const [profilesResult, classesResult] = await Promise.all([
    supabase.from('profiles').select('id, first_name, last_name').in('id', studentIds),
    supabase.from('classes').select('id, name').in('id', classIds),
  ]);
  if (profilesResult.error) return internal(profilesResult.error.message);
  if (classesResult.error) return internal(classesResult.error.message);

  const profileMap = new Map(
    (profilesResult.data ?? []).map((row) => [row.id, row])
  );
  const classNameMap = new Map(
    (classesResult.data ?? []).map((row) => [row.id, row.name])
  );

  const data: TeacherStudent[] = (enrollments ?? [])
    .map((row) => {
      const profile = profileMap.get(row.student_id);
      if (!profile) return null;
      return {
        id: profile.id,
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        class_id: row.class_id,
        class_name: classNameMap.get(row.class_id) ?? 'Classe',
      };
    })
    .filter((row): row is TeacherStudent => Boolean(row))
    .sort((a, b) =>
      a.last_name.localeCompare(b.last_name) ||
      a.first_name.localeCompare(b.first_name)
    );

  return { ok: true, data };
}

// Teacher: list class_subjects they teach (for grade entry UI).
export type TeacherSubject = {
  classSubjectId: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
};

export async function getTeacherSubjectsAction(): Promise<
  ActionResponse<TeacherSubject[]>
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  const { data: classSubjects, error: csError } = await supabase
    .from('class_subjects')
    .select('id, class_id, subject_id')
    .eq('teacher_id', user.id);
  if (csError) return internal(csError.message);

  const rows = classSubjects ?? [];
  if (rows.length === 0) return { ok: true, data: [] };

  const subjectIds = unique(rows.map((r) => r.subject_id));
  const classIds = unique(rows.map((r) => r.class_id));

  const [subjectsResult, classesResult] = await Promise.all([
    supabase.from('subjects').select('id, name').in('id', subjectIds),
    supabase.from('classes').select('id, name').in('id', classIds),
  ]);
  if (subjectsResult.error) return internal(subjectsResult.error.message);
  if (classesResult.error) return internal(classesResult.error.message);

  const subjectMap = new Map(
    (subjectsResult.data ?? []).map((row) => [row.id, row.name])
  );
  const classMap = new Map(
    (classesResult.data ?? []).map((row) => [row.id, row.name])
  );

  const data: TeacherSubject[] = rows.map((row) => ({
    classSubjectId: row.id,
    subjectId: row.subject_id,
    subjectName: subjectMap.get(row.subject_id) ?? 'Matière',
    classId: row.class_id,
    className: classMap.get(row.class_id) ?? 'Classe',
  }));

  return { ok: true, data };
}

// Notifications feed — derived from recent grades, upcoming
// evaluations (devoirs), and live sessions in the next hour.
// Read-state is tracked client-side in localStorage; the action
// just builds the candidate feed.
export type NotifKind = 'grade' | 'homework' | 'live';
export type NotifItem = {
  id: string;
  kind: NotifKind;
  title: string;
  meta: string;
  ago: string;
  ts: string; // iso timestamp for client-side ordering / dedupe
  nav?: 'home' | 'grades' | 'planning' | 'devoirs';
};

const fmtAgo = (iso: string, now = Date.now()): string => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '—';
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "À L'INSTANT";
  if (min < 60) return `IL Y A ${min}MIN`;
  const h = Math.floor(min / 60);
  if (h < 24) return `IL Y A ${h}H`;
  const d = Math.floor(h / 24);
  if (d < 7) return `IL Y A ${d}J`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase();
};

export async function getNotificationsAction(): Promise<
  ActionResponse<NotifItem[]>
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  const role = profile?.role ?? 'student';
  const isStudent = role === 'student';

  const items: NotifItem[] = [];

  if (isStudent) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('class_id')
      .eq('student_id', user.id);
    const classIds = unique((enrollments ?? []).map((r) => r.class_id));

    if (classIds.length > 0) {
      const { data: classSubjects } = await supabase
        .from('class_subjects')
        .select('id, subject_id')
        .in('class_id', classIds);
      const csIds = (classSubjects ?? []).map((r) => r.id);
      const subjectIds = unique((classSubjects ?? []).map((r) => r.subject_id));
      const subjectMap = new Map<string, string>();
      if (subjectIds.length > 0) {
        const { data: subjects } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds);
        (subjects ?? []).forEach((s) => subjectMap.set(s.id, s.name));
      }

      const csById = new Map(
        (classSubjects ?? []).map((r) => [r.id, r])
      );

      // Recent grades (last 14 days)
      const { data: grades } = await supabase
        .from('grades')
        .select('id, score, max_score, created_at, evaluation_id')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      const evalIds = unique((grades ?? []).map((g) => g.evaluation_id));
      const evalMap = new Map<string, { name: string; class_subject_id: string }>();
      if (evalIds.length > 0) {
        const { data: evals } = await supabase
          .from('evaluations')
          .select('id, name, class_subject_id')
          .in('id', evalIds);
        (evals ?? []).forEach((e) =>
          evalMap.set(e.id, { name: e.name, class_subject_id: e.class_subject_id })
        );
      }
      (grades ?? []).slice(0, 6).forEach((g) => {
        const ev = g.evaluation_id ? evalMap.get(g.evaluation_id) : undefined;
        const cs = ev?.class_subject_id ? csById.get(ev.class_subject_id) : undefined;
        const subjectName = cs?.subject_id ? subjectMap.get(cs.subject_id) : undefined;
        items.push({
          id: `grade:${g.id}`,
          kind: 'grade',
          title: `Note publiée · ${g.score}/${g.max_score}`,
          meta: subjectName
            ? `${subjectName}${ev ? ' · ' + ev.name : ''}`
            : ev?.name ?? 'Évaluation',
          ago: fmtAgo(g.created_at ?? new Date().toISOString()),
          ts: g.created_at ?? new Date().toISOString(),
          nav: 'grades',
        });
      });

      // Upcoming evaluations (next 14 days) → devoirs
      const now = new Date();
      const in14 = new Date(now.getTime() + 14 * 86400000).toISOString().slice(0, 10);
      if (csIds.length > 0) {
        const { data: evalsUpcoming } = await supabase
          .from('evaluations')
          .select('id, name, date, class_subject_id')
          .in('class_subject_id', csIds)
          .gte('date', now.toISOString().slice(0, 10))
          .lte('date', in14)
          .order('date', { ascending: true })
          .limit(6);
        (evalsUpcoming ?? []).forEach((e) => {
          const cs = csById.get(e.class_subject_id);
          const subjectName = cs?.subject_id ? subjectMap.get(cs.subject_id) : undefined;
          items.push({
            id: `eval:${e.id}`,
            kind: 'homework',
            title: `À rendre · ${e.name}`,
            meta: subjectName ?? '',
            ago: e.date
              ? new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()
              : '—',
            ts: e.date ?? new Date().toISOString(),
            nav: 'devoirs',
          });
        });
      }

      // Live sessions (current hour)
      if (csIds.length > 0) {
        const startWindow = new Date();
        startWindow.setMinutes(0, 0, 0);
        const endWindow = new Date(startWindow.getTime() + 2 * 3600000);
        const { data: live } = await supabase
          .from('sessions')
          .select('id, start_time, location, class_subject_id')
          .in('class_subject_id', csIds)
          .gte('start_time', startWindow.toISOString())
          .lte('start_time', endWindow.toISOString())
          .order('start_time', { ascending: true })
          .limit(2);
        (live ?? []).forEach((s) => {
          const cs = csById.get(s.class_subject_id);
          const subjectName = cs?.subject_id ? subjectMap.get(cs.subject_id) : undefined;
          items.push({
            id: `live:${s.id}`,
            kind: 'live',
            title: `Cours imminent · ${subjectName ?? ''}`,
            meta: s.location ?? '',
            ago: new Date(s.start_time).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            ts: s.start_time,
            nav: 'planning',
          });
        });
      }
    }
  }

  // Sort newest first.
  items.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));

  return { ok: true, data: items.slice(0, 20) };
}
