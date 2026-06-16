'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { canAccessRole } from '@/shared/lib/roles';
import type { UserRole } from '@/shared/types/auth';
import type { ActionResponse } from '@/types/api';

const unauthenticated = () => ({
  ok: false as const,
  error: { code: 'UNAUTHENTICATED' as const, message: 'Session expirée.' },
});

const internal = (message: string) => ({
  ok: false as const,
  error: { code: 'INTERNAL' as const, message },
});

const unique = <T>(items: Array<T | null | undefined>): T[] =>
  Array.from(new Set(items.filter((item): item is T => Boolean(item))));

// Shape returned to mobile clients.
//
// One snapshot is fetched on each navigation (server component → page),
// then handed to the client component that drives the interactive UI.
// Everything is hydrated once per navigation.
export type BerlinerSubject = {
  id: string;
  name: string;
  code?: string;
  coef: number;
  color: string; // accent name (green/blue/orange/violet/lemon/slate/red)
  classSubjectIds: string[]; // a subject can map to multiple class_subjects (one per class)
};

export type BerlinerSubjectStats = {
  subjectId: string;
  count: number;
  avg: number | null;
  trend: number[]; // chronological list of grades normalized to /20
};

export type BerlinerEvaluation = {
  id: string;
  classSubjectId: string;
  subjectId: string;
  subjectName: string;
  name: string;
  date: string; // ISO yyyy-mm-dd
  coefficient: number;
};

export type BerlinerGrade = {
  id: string;
  evaluationId: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  evaluationName: string;
  evaluationDate: string;
  score: number;
  maxScore: number;
  createdAt: string;
};

export type BerlinerSlot = {
  id: string;
  classSubjectId: string;
  subjectId: string;
  subjectName: string;
  classId?: string;
  className?: string;
  start: string; // ISO datetime
  end: string;
  room: string | null;
  teacherName?: string;
  color: string; // accent name
};

export type BerlinerAttendance = {
  id: string;
  sessionId: string;
  studentId: string;
  status: string;
};

export type BerlinerProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url: string | null;
  establishment_id: string;
  class_id?: string;
  class_name?: string;
};

export type BerlinerClassSubject = {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string | null;
};

export type BerlinerState = {
  profile: BerlinerProfile;
  establishmentName: string | null;
  subjects: BerlinerSubject[];
  classSubjects: BerlinerClassSubject[];
  evaluations: BerlinerEvaluation[];
  grades: BerlinerGrade[]; // for student: own grades; for teacher: grades for their classes
  sessions: BerlinerSlot[]; // current ± 21 days
  attendance: BerlinerAttendance[];
  // Teacher-only:
  classes?: { id: string; name: string }[];
  students?: { id: string; first_name: string; last_name: string; class_id: string }[];
  /** Teacher-only: ids of class_subjects they personally teach (subset of classSubjects). */
  teacherClassSubjectIds?: string[];
  // Schedule range covered by `sessions`
  range: { startISO: string; endISO: string };
};

const ACCENT_NAMES = ['green', 'blue', 'orange', 'violet', 'lemon', 'slate', 'red'] as const;
const colorForIndex = (i: number) => ACCENT_NAMES[i % ACCENT_NAMES.length];

function formatLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function getBerlinerStateAction(
  // Rôle de la VUE demandée (selon la page : "student" ou "teacher").
  // Permet à un compte super_admin de consulter les deux dashboards.
  viewAs?: UserRole
): Promise<ActionResponse<BerlinerState>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthenticated();

  // 1) Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, role, establishment_id')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) return internal(profileError.message);
  if (!profile) {
    return { ok: false, error: { code: 'NOT_FOUND', message: 'Profil introuvable.' } };
  }

  // Rôle effectif : si la page demande une vue (viewAs) et que le compte y a
  // droit (super_admin pour les deux), on l'utilise ; sinon le rôle réel.
  const actualRole = profile.role as UserRole;
  const role: string =
    viewAs && canAccessRole(actualRole, viewAs) ? viewAs : actualRole;
  const isStudent = role === 'student';

  // 2) Establishment name (cosmetic).
  let establishmentName: string | null = null;
  if (profile.establishment_id) {
    const { data: est } = await supabase
      .from('establishments')
      .select('name')
      .eq('id', profile.establishment_id)
      .maybeSingle();
    establishmentName = est?.name ?? null;
  }

  // 3) Discover the class_subjects that scope the rest of the snapshot.
  // ─ Student: those tied to classes they're enrolled in.
  // ─ Teacher: those they teach.
  let classIds: string[] = [];
  let teacherClassSubjectIds: string[] = []; // teacher-only

  if (isStudent) {
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('class_id')
      .eq('student_id', user.id);
    if (enrollError) return internal(enrollError.message);
    classIds = unique((enrollments ?? []).map((r) => r.class_id));
  } else {
    const { data: csTeacher, error: csError } = await supabase
      .from('class_subjects')
      .select('id, class_id')
      .eq('teacher_id', user.id);
    if (csError) return internal(csError.message);
    teacherClassSubjectIds = (csTeacher ?? []).map((r) => r.id);
    classIds = unique((csTeacher ?? []).map((r) => r.class_id));
  }

  // 4) Class names + class label for the current profile.
  let className: string | undefined;
  const classNameById = new Map<string, string>();
  if (classIds.length > 0) {
    const { data: classRows, error: classesError } = await supabase
      .from('classes')
      .select('id, name')
      .in('id', classIds);
    if (classesError) return internal(classesError.message);
    (classRows ?? []).forEach((c) => classNameById.set(c.id, c.name));
    // La classe de l'élève est déduite de ses inscriptions (table enrollments).
    if (isStudent && classIds.length > 0) {
      className = classNameById.get(classIds[0]);
    }
  }

  // 5) class_subjects in scope (all subjects taught in those classes).
  let classSubjectRows: Array<{
    id: string;
    class_id: string;
    subject_id: string;
    teacher_id: string | null;
  }> = [];
  if (classIds.length > 0) {
    const { data: csAll, error: csAllError } = await supabase
      .from('class_subjects')
      .select('id, class_id, subject_id, teacher_id')
      .in('class_id', classIds);
    if (csAllError) return internal(csAllError.message);
    classSubjectRows = csAll ?? [];
  }

  // 6) Subjects + teachers
  const subjectIds = unique(classSubjectRows.map((r) => r.subject_id));
  const teacherIds = unique(classSubjectRows.map((r) => r.teacher_id));

  const [subjectsResult, teachersResult] = await Promise.all([
    subjectIds.length
      ? supabase.from('subjects').select('id, name, code').in('id', subjectIds)
      : Promise.resolve({ data: [], error: null }),
    teacherIds.length
      ? supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', teacherIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (subjectsResult.error) return internal(subjectsResult.error.message);
  if (teachersResult.error) return internal(teachersResult.error.message);

  const subjectMap = new Map(
    (subjectsResult.data ?? []).map((s) => [s.id, s])
  );
  const teacherMap = new Map(
    (teachersResult.data ?? []).map((t) => [t.id, t])
  );
  const csById = new Map(classSubjectRows.map((r) => [r.id, r]));

  // Aggregate subjects with stable color (by index in sorted order).
  const subjectsBeforeColor: BerlinerSubject[] = [];
  for (const sid of subjectIds) {
    const subj = subjectMap.get(sid);
    if (!subj || !subj.name) continue;
    const csForSubject = classSubjectRows.filter((r) => r.subject_id === sid);
    subjectsBeforeColor.push({
      id: sid,
      name: subj.name,
      code: subj.code ?? undefined,
      coef: 1,
      color: 'green',
      classSubjectIds: csForSubject.map((r) => r.id),
    });
  }
  subjectsBeforeColor.sort((a, b) => a.name.localeCompare(b.name));
  const subjectsAggregated: BerlinerSubject[] = subjectsBeforeColor.map(
    (s, i) => ({ ...s, color: colorForIndex(i) })
  );

  const subjectColorById = new Map(subjectsAggregated.map((s) => [s.id, s.color]));
  const subjectNameById = new Map(subjectsAggregated.map((s) => [s.id, s.name]));

  // 7) Evaluations — past 90d → future 60d.
  const today = new Date();
  const evalStart = new Date(today.getTime() - 90 * 86400000)
    .toISOString()
    .slice(0, 10);
  const evalEnd = new Date(today.getTime() + 60 * 86400000)
    .toISOString()
    .slice(0, 10);

  const csIdsScope = isStudent
    ? classSubjectRows.map((r) => r.id)
    : teacherClassSubjectIds;

  let evaluationRows: Array<{
    id: string;
    class_subject_id: string;
    name: string;
    date: string;
    coefficient: number | null;
  }> = [];
  if (csIdsScope.length > 0) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('id, class_subject_id, name, date, coefficient')
      .in('class_subject_id', csIdsScope)
      .gte('date', evalStart)
      .lte('date', evalEnd)
      .order('date', { ascending: false });
    if (error) return internal(error.message);
    evaluationRows = data ?? [];
  }

  const evaluations: BerlinerEvaluation[] = evaluationRows
    .map((ev) => {
      const cs = csById.get(ev.class_subject_id);
      if (!cs) return null;
      return {
        id: ev.id,
        classSubjectId: ev.class_subject_id,
        subjectId: cs.subject_id,
        subjectName: subjectNameById.get(cs.subject_id) ?? 'Matière',
        name: ev.name,
        date: ev.date,
        coefficient: ev.coefficient ?? 1,
      };
    })
    .filter((e): e is BerlinerEvaluation => e !== null);

  // 8) Grades.
  // ─ Student: own grades.
  // ─ Teacher: grades for evaluations they own (i.e. csIdsScope).
  let gradeRows: Array<{
    id: string;
    evaluation_id: string;
    student_id: string;
    score: number;
    max_score: number;
    created_at: string;
  }> = [];

  if (isStudent) {
    const { data, error } = await supabase
      .from('grades')
      .select('id, evaluation_id, student_id, score, max_score, created_at')
      .eq('student_id', user.id);
    if (error) return internal(error.message);
    gradeRows = data ?? [];
  } else if (evaluationRows.length > 0) {
    const evalIds = evaluationRows.map((e) => e.id);
    const { data, error } = await supabase
      .from('grades')
      .select('id, evaluation_id, student_id, score, max_score, created_at')
      .in('evaluation_id', evalIds);
    if (error) return internal(error.message);
    gradeRows = data ?? [];
  }

  const evalById = new Map(evaluationRows.map((e) => [e.id, e]));

  const grades: BerlinerGrade[] = gradeRows
    .map((g) => {
      const ev = evalById.get(g.evaluation_id);
      const cs = ev ? csById.get(ev.class_subject_id) : undefined;
      return {
        id: g.id,
        evaluationId: g.evaluation_id,
        studentId: g.student_id,
        subjectId: cs?.subject_id ?? '',
        subjectName: cs?.subject_id
          ? subjectNameById.get(cs.subject_id) ?? 'Matière'
          : 'Matière',
        evaluationName: ev?.name ?? 'Évaluation',
        evaluationDate: ev?.date ?? g.created_at?.slice(0, 10) ?? '',
        score: Number(g.score),
        maxScore: Number(g.max_score),
        createdAt: g.created_at ?? '',
      };
    })
    .sort((a, b) => (b.evaluationDate < a.evaluationDate ? -1 : 1));

  // 9) Sessions — current ± 21 days.
  const sessStart = new Date(today.getTime() - 21 * 86400000).toISOString();
  const sessEnd = new Date(today.getTime() + 21 * 86400000).toISOString();
  let sessionRows: Array<{
    id: string;
    class_subject_id: string;
    start_time: string;
    end_time: string;
    location: string | null;
  }> = [];
  if (csIdsScope.length > 0) {
    const { data, error } = await supabase
      .from('sessions')
      .select('id, class_subject_id, start_time, end_time, location')
      .in('class_subject_id', csIdsScope)
      .gte('start_time', sessStart)
      .lte('start_time', sessEnd)
      .order('start_time', { ascending: true });
    if (error) return internal(error.message);
    sessionRows = data ?? [];
  }

  const sessions: BerlinerSlot[] = [];
  for (const s of sessionRows) {
    const cs = csById.get(s.class_subject_id);
    if (!cs) continue;
    const teacher = cs.teacher_id ? teacherMap.get(cs.teacher_id) : undefined;
    const teacherName = teacher
      ? [teacher.first_name, teacher.last_name].filter(Boolean).join(' ')
      : undefined;
    sessions.push({
      id: s.id,
      classSubjectId: s.class_subject_id,
      subjectId: cs.subject_id,
      subjectName: subjectNameById.get(cs.subject_id) ?? 'Cours',
      classId: cs.class_id,
      className: classNameById.get(cs.class_id),
      start: s.start_time,
      end: s.end_time,
      room: s.location,
      teacherName,
      color: subjectColorById.get(cs.subject_id) ?? 'green',
    });
  }

  // 10) Attendance — student only loads their own.
  let attendance: BerlinerAttendance[] = [];
  if (isStudent && sessionRows.length > 0) {
    const sessionIds = sessionRows.map((s) => s.id);
    const { data, error } = await supabase
      .from('attendance_records')
      .select('id, session_id, student_id, status')
      .eq('student_id', user.id)
      .in('session_id', sessionIds);
    if (error) return internal(error.message);
    attendance = (data ?? []).map((a) => ({
      id: a.id,
      sessionId: a.session_id,
      studentId: a.student_id,
      status: a.status,
    }));
  }

  // Also bring in *all* recent attendance for the presence-rate stat.
  let attendanceAll: BerlinerAttendance[] = attendance;
  if (isStudent) {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('id, session_id, student_id, status')
      .eq('student_id', user.id);
    if (!error) {
      attendanceAll = (data ?? []).map((a) => ({
        id: a.id,
        sessionId: a.session_id,
        studentId: a.student_id,
        status: a.status,
      }));
    }
  }

  // 11) Teacher extras: classes + students.
  let classes: { id: string; name: string }[] | undefined;
  let students:
    | { id: string; first_name: string; last_name: string; class_id: string }[]
    | undefined;

  if (!isStudent && classIds.length > 0) {
    classes = classIds.map((id) => ({
      id,
      name: classNameById.get(id) ?? 'Classe',
    }));

    const { data: enrollRows } = await supabase
      .from('enrollments')
      .select('student_id, class_id')
      .in('class_id', classIds);
    const studentIds = unique((enrollRows ?? []).map((r) => r.student_id));
    if (studentIds.length > 0) {
      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', studentIds);
      const studentMap = new Map(
        (studentProfiles ?? []).map((s) => [s.id, s])
      );
      students = (enrollRows ?? [])
        .map((row) => {
          const sp = studentMap.get(row.student_id);
          if (!sp) return null;
          return {
            id: sp.id,
            first_name: sp.first_name ?? '',
            last_name: sp.last_name ?? '',
            class_id: row.class_id,
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);
    }
  }

  // Flatten class_subjects with names for client-side use.
  const classSubjects: BerlinerClassSubject[] = classSubjectRows.map((row) => ({
    id: row.id,
    classId: row.class_id,
    className: classNameById.get(row.class_id) ?? 'Classe',
    subjectId: row.subject_id,
    subjectName: subjectNameById.get(row.subject_id) ?? 'Matière',
    teacherId: row.teacher_id,
  }));

  const result: BerlinerState = {
    profile: {
      id: profile.id,
      email: profile.email ?? user.email ?? '',
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      role,
      // avatar_url et class_id ne sont pas dans le schéma de cette base :
      // on les laisse vides (le profil affiche les initiales, la classe vient
      // des inscriptions). Voir scripts/add-profile-columns.mjs pour les activer.
      avatar_url: null,
      establishment_id: profile.establishment_id ?? '',
      class_id: undefined,
      class_name: className,
    },
    establishmentName,
    subjects: subjectsAggregated,
    classSubjects,
    evaluations,
    grades,
    sessions,
    attendance: attendanceAll,
    classes,
    students,
    teacherClassSubjectIds: isStudent ? undefined : teacherClassSubjectIds,
    range: {
      startISO: formatLocalISO(new Date(today.getTime() - 21 * 86400000)),
      endISO: formatLocalISO(new Date(today.getTime() + 21 * 86400000)),
    },
  };

  return { ok: true, data: result };
}

// Pure helpers (`computeSubjectStats`, `computeGlobalAverage`) live in
// `@/shared/lib/berliner-stats` because Server Action files can only export
// async functions.
