'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse } from '@/types/api';
import type {
    AttendanceSummary,
    GradesSummary,
    ScheduleSession,
    StudentAttendanceRecord,
    SubjectWithGrades,
} from '@/shared/lib/studentData';
import {
    calculateGlobalAverage,
    calculateWeightedAverage,
} from '@/shared/lib/student/calculations';

const unauthenticated = (): { ok: false; error: { code: 'UNAUTHENTICATED'; message: string } } => ({
    ok: false,
    error: { code: 'UNAUTHENTICATED', message: 'Session expirée.' },
});

const internal = (message: string): { ok: false; error: { code: 'INTERNAL'; message: string } } => ({
    ok: false,
    error: { code: 'INTERNAL', message },
});

const unique = <T>(items: Array<T | null | undefined>): T[] =>
    Array.from(new Set(items.filter((item): item is T => Boolean(item))));

const buildTeacherName = (
    teacher?: { first_name: string | null; last_name: string | null }
): string | undefined => {
    if (!teacher) return undefined;
    const parts = [teacher.first_name, teacher.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : undefined;
};

/**
 * Returns the upcoming sessions for the currently-authenticated student.
 * The student id is read from the server session — never accept it as a
 * parameter, otherwise a malicious client could request another student's
 * data (RLS would still block it, but defense-in-depth matters).
 */
export async function getStudentScheduleAction(
    limit = 3
): Promise<ActionResponse<ScheduleSession[]>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('class_id')
        .eq('student_id', user.id);

    if (enrollmentsError) return internal(enrollmentsError.message);

    const classIds = unique((enrollments ?? []).map((row) => row.class_id));
    if (classIds.length === 0) return { ok: true, data: [] };

    const { data: classSubjects, error: classSubjectsError } = await supabase
        .from('class_subjects')
        .select('id, subject_id, teacher_id, class_id')
        .in('class_id', classIds);

    if (classSubjectsError) return internal(classSubjectsError.message);

    const classSubjectIds = unique(
        (classSubjects ?? []).map((row) => row.id)
    );
    if (classSubjectIds.length === 0) return { ok: true, data: [] };

    const now = new Date().toISOString();
    const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, start_time, end_time, location, class_subject_id')
        .in('class_subject_id', classSubjectIds)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(limit);

    if (sessionsError) return internal(sessionsError.message);

    const subjectIds = unique(
        (classSubjects ?? []).map((row) => row.subject_id)
    );
    const teacherIds = unique(
        (classSubjects ?? []).map((row) => row.teacher_id)
    );

    const [subjectsResult, teachersResult] = await Promise.all([
        subjectIds.length > 0
            ? supabase.from('subjects').select('id, name').in('id', subjectIds)
            : Promise.resolve({ data: [], error: null }),
        teacherIds.length > 0
            ? supabase
                  .from('profiles')
                  .select('id, first_name, last_name')
                  .in('id', teacherIds)
            : Promise.resolve({ data: [], error: null }),
    ]);

    if (subjectsResult.error) return internal(subjectsResult.error.message);
    if (teachersResult.error) return internal(teachersResult.error.message);

    const subjectMap = new Map(
        (subjectsResult.data ?? []).map((subject) => [subject.id, subject])
    );
    const teacherMap = new Map(
        (teachersResult.data ?? []).map((teacher) => [teacher.id, teacher])
    );
    const classSubjectMap = new Map(
        (classSubjects ?? []).map((row) => [row.id, row])
    );

    const data: ScheduleSession[] = (sessions ?? [])
        .filter((session) => session.start_time)
        .map((session) => {
            const classSubject = session.class_subject_id
                ? classSubjectMap.get(session.class_subject_id)
                : undefined;
            const subject = classSubject?.subject_id
                ? subjectMap.get(classSubject.subject_id)
                : undefined;
            const teacher = classSubject?.teacher_id
                ? teacherMap.get(classSubject.teacher_id)
                : undefined;
            return {
                id: session.id,
                start_time: session.start_time,
                end_time: session.end_time ?? undefined,
                location: session.location ?? undefined,
                subject_name: subject?.name ?? 'Cours',
                teacher_name: buildTeacherName(teacher),
            };
        });

    return { ok: true, data };
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Internal helper that loads the authenticated student's subjects with all
 * their grades. Shared by `getStudentSubjectsWithGradesAction` and
 * `getStudentGradesAction` so the multi-step join logic only lives once.
 */
async function loadStudentSubjectsWithGrades(
    supabase: SupabaseServerClient,
    studentId: string
): Promise<{ ok: true; data: SubjectWithGrades[] } | { ok: false; message: string }> {
    const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('id, evaluation_id, score, max_score, created_at')
        .eq('student_id', studentId);

    if (gradesError) return { ok: false, message: gradesError.message };
    if (!grades || grades.length === 0) return { ok: true, data: [] };

    const evaluationIds = unique(grades.map((grade) => grade.evaluation_id));
    if (evaluationIds.length === 0) return { ok: true, data: [] };

    const { data: evaluations, error: evaluationsError } = await supabase
        .from('evaluations')
        .select('id, class_subject_id, name, coefficient, date')
        .in('id', evaluationIds);

    if (evaluationsError) return { ok: false, message: evaluationsError.message };

    const evaluationMap = new Map(
        (evaluations ?? []).map((evaluation) => [evaluation.id, evaluation])
    );

    const classSubjectIds = unique(
        (evaluations ?? []).map((evaluation) => evaluation.class_subject_id)
    );
    if (classSubjectIds.length === 0) return { ok: true, data: [] };

    const { data: classSubjects, error: classSubjectsError } = await supabase
        .from('class_subjects')
        .select('id, subject_id, teacher_id')
        .in('id', classSubjectIds);

    if (classSubjectsError) return { ok: false, message: classSubjectsError.message };

    const classSubjectMap = new Map(
        (classSubjects ?? []).map((row) => [row.id, row])
    );

    const subjectIds = unique(
        (classSubjects ?? []).map((row) => row.subject_id)
    );
    const teacherIds = unique(
        (classSubjects ?? []).map((row) => row.teacher_id)
    );

    const [subjectsResult, teachersResult] = await Promise.all([
        subjectIds.length > 0
            ? supabase.from('subjects').select('id, name').in('id', subjectIds)
            : Promise.resolve({ data: [], error: null }),
        teacherIds.length > 0
            ? supabase
                  .from('profiles')
                  .select('id, first_name, last_name')
                  .in('id', teacherIds)
            : Promise.resolve({ data: [], error: null }),
    ]);

    if (subjectsResult.error) return { ok: false, message: subjectsResult.error.message };
    if (teachersResult.error) return { ok: false, message: teachersResult.error.message };

    const subjectMap = new Map(
        (subjectsResult.data ?? []).map((subject) => [subject.id, subject])
    );
    const teacherMap = new Map(
        (teachersResult.data ?? []).map((teacher) => [teacher.id, teacher])
    );

    const subjectsById = new Map<string, SubjectWithGrades>();

    grades.forEach((grade) => {
        if (!grade.evaluation_id) return;
        const evaluation = evaluationMap.get(grade.evaluation_id);
        if (!evaluation) return;
        const classSubject = evaluation.class_subject_id
            ? classSubjectMap.get(evaluation.class_subject_id)
            : undefined;
        const subject = classSubject?.subject_id
            ? subjectMap.get(classSubject.subject_id)
            : undefined;
        if (!subject?.id || !subject.name) return;

        const teacherName = buildTeacherName(
            classSubject?.teacher_id
                ? teacherMap.get(classSubject.teacher_id)
                : undefined
        );

        const subjectEntry =
            subjectsById.get(subject.id) ??
            (() => {
                const created: SubjectWithGrades = {
                    id: subject.id,
                    name: subject.name,
                    teacher: teacherName,
                    grades: [],
                };
                subjectsById.set(subject.id, created);
                return created;
            })();

        if (teacherName && !subjectEntry.teacher) {
            subjectEntry.teacher = teacherName;
        }

        if (grade.score === null || grade.score === undefined) return;

        subjectEntry.grades.push({
            id: grade.id,
            value: grade.score,
            coefficient: evaluation.coefficient ?? 1,
            date:
                evaluation.date ??
                grade.created_at ??
                new Date().toISOString(),
            label: evaluation.name ?? 'Evaluation',
            max: grade.max_score ?? 20,
        });
    });

    const subjects = Array.from(subjectsById.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    return { ok: true, data: subjects };
}

/**
 * Returns the full subjects-with-grades list for the authenticated student.
 * Used by the grades list page and the per-subject detail page.
 */
export async function getStudentSubjectsWithGradesAction(): Promise<
    ActionResponse<SubjectWithGrades[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const result = await loadStudentSubjectsWithGrades(supabase, user.id);
    if (!result.ok) return internal(result.message);

    return { ok: true, data: result.data };
}

/**
 * Returns the grades summary (per-subject averages + global average) for
 * the authenticated student. Used by the dashboard widget.
 */
export async function getStudentGradesAction(): Promise<
    ActionResponse<GradesSummary>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const result = await loadStudentSubjectsWithGrades(supabase, user.id);
    if (!result.ok) return internal(result.message);

    const summary: GradesSummary = {
        subjects: result.data.map((subject) => ({
            id: subject.id,
            name: subject.name,
            teacher: subject.teacher,
            average: calculateWeightedAverage(subject.grades),
            count: subject.grades.length,
        })),
        globalAverage: calculateGlobalAverage(result.data),
    };

    return { ok: true, data: summary };
}

/**
 * Returns the attendance summary for the authenticated student.
 */
export async function getStudentAttendanceAction(): Promise<
    ActionResponse<AttendanceSummary>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: records, error: recordsError } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('student_id', user.id);

    if (recordsError) return internal(recordsError.message);

    const total = records?.length ?? 0;
    const present = (records ?? []).filter((record) => {
        const value = (record.status ?? '').toString().toLowerCase();
        if (value.includes('absent')) return false;
        return (
            value.includes('present') ||
            value.includes('late') ||
            value.includes('excuse')
        );
    }).length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { ok: true, data: { total, present, rate } };
}

/**
 * Returns the detailed attendance records for the authenticated student:
 * one row per session with status, subject, class and location.
 */
export async function getStudentAttendanceRecordsAction(): Promise<
    ActionResponse<StudentAttendanceRecord[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: records, error: recordsError } = await supabase
        .from('attendance_records')
        .select('id, status, session_id, justification_url, created_at')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

    if (recordsError) return internal(recordsError.message);

    const rows = (records ?? []) as Array<{
        id: string;
        status: string | null;
        session_id: string | null;
        justification_url: string | null;
        created_at: string | null;
    }>;
    if (rows.length === 0) return { ok: true, data: [] };

    const sessionIds = unique(rows.map((row) => row.session_id));
    if (sessionIds.length === 0) return { ok: true, data: [] };

    const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, start_time, location, class_subject_id')
        .in('id', sessionIds);

    if (sessionsError) return internal(sessionsError.message);

    const sessionById = new Map(
        (sessions ?? []).map((row) => [row.id, row])
    );

    const classSubjectIds = unique(
        (sessions ?? []).map((row) => row.class_subject_id)
    );

    const classSubjectById = new Map<
        string,
        { class_id: string; subject_id: string }
    >();
    if (classSubjectIds.length > 0) {
        const { data: classSubjects, error: classSubjectsError } = await supabase
            .from('class_subjects')
            .select('id, class_id, subject_id')
            .in('id', classSubjectIds);
        if (classSubjectsError) return internal(classSubjectsError.message);
        (classSubjects ?? []).forEach((row) => {
            classSubjectById.set(row.id, {
                class_id: row.class_id,
                subject_id: row.subject_id,
            });
        });
    }

    const subjectIds = unique(
        Array.from(classSubjectById.values()).map((row) => row.subject_id)
    );
    const classIds = unique(
        Array.from(classSubjectById.values()).map((row) => row.class_id)
    );

    const [subjectsResult, classesResult] = await Promise.all([
        subjectIds.length > 0
            ? supabase.from('subjects').select('id, name').in('id', subjectIds)
            : Promise.resolve({ data: [], error: null }),
        classIds.length > 0
            ? supabase.from('classes').select('id, name').in('id', classIds)
            : Promise.resolve({ data: [], error: null }),
    ]);

    if (subjectsResult.error) return internal(subjectsResult.error.message);
    if (classesResult.error) return internal(classesResult.error.message);

    const subjectNameById = new Map(
        (subjectsResult.data ?? []).map((row) => [row.id, row.name])
    );
    const classNameById = new Map(
        (classesResult.data ?? []).map((row) => [row.id, row.name])
    );

    const data: StudentAttendanceRecord[] = rows.map((row) => {
        const session = row.session_id ? sessionById.get(row.session_id) : undefined;
        const classSubject = session?.class_subject_id
            ? classSubjectById.get(session.class_subject_id)
            : undefined;
        return {
            id: row.id,
            status: row.status ?? 'unknown',
            date: session?.start_time ?? row.created_at ?? new Date().toISOString(),
            subject_name: classSubject?.subject_id
                ? subjectNameById.get(classSubject.subject_id) ?? 'Cours'
                : 'Cours',
            class_name: classSubject?.class_id
                ? classNameById.get(classSubject.class_id) ?? ''
                : '',
            location: session?.location ?? null,
            justification_url: row.justification_url,
        };
    });

    return { ok: true, data };
}
