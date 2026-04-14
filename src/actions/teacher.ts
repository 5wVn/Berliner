'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse } from '@/types/api';
import type {
    PendingAttendanceSession,
    TeacherClassSummary,
    TeacherSession,
} from '@/shared/lib/teacherData';

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

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type ClassSubjectRow = {
    id: string;
    class_id: string;
    subject_id: string;
};

type SessionRow = {
    id: string;
    start_time: string;
    end_time: string;
    location: string | null;
    class_subject_id: string;
};

/**
 * Loads the class_subjects assigned to the given teacher together with the
 * related subjects and classes. Returns a lookup map keyed by class_subject
 * id, plus the raw class_subject rows so callers can derive class lists.
 */
async function loadTeacherClassSubjects(
    supabase: SupabaseServerClient,
    teacherId: string
): Promise<
    | {
          ok: true;
          classSubjects: ClassSubjectRow[];
          subjectNameById: Map<string, string>;
          classNameById: Map<string, string>;
      }
    | { ok: false; message: string }
> {
    const { data: classSubjects, error } = await supabase
        .from('class_subjects')
        .select('id, class_id, subject_id')
        .eq('teacher_id', teacherId);

    if (error) return { ok: false, message: error.message };

    const rows = (classSubjects ?? []) as ClassSubjectRow[];
    if (rows.length === 0) {
        return {
            ok: true,
            classSubjects: [],
            subjectNameById: new Map(),
            classNameById: new Map(),
        };
    }

    const subjectIds = unique(rows.map((row) => row.subject_id));
    const classIds = unique(rows.map((row) => row.class_id));

    const [subjectsResult, classesResult] = await Promise.all([
        supabase.from('subjects').select('id, name').in('id', subjectIds),
        supabase.from('classes').select('id, name').in('id', classIds),
    ]);

    if (subjectsResult.error) return { ok: false, message: subjectsResult.error.message };
    if (classesResult.error) return { ok: false, message: classesResult.error.message };

    const subjectNameById = new Map(
        (subjectsResult.data ?? []).map((row) => [row.id, row.name])
    );
    const classNameById = new Map(
        (classesResult.data ?? []).map((row) => [row.id, row.name])
    );

    return { ok: true, classSubjects: rows, subjectNameById, classNameById };
}

/**
 * Returns sessions whose start_time falls within today (UTC), for any
 * class_subject taught by the authenticated teacher. Includes the
 * student_count for each session's class so the UI can show "X étudiants".
 */
export async function getTeacherTodayClassesAction(): Promise<
    ActionResponse<TeacherSession[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const lookup = await loadTeacherClassSubjects(supabase, user.id);
    if (!lookup.ok) return internal(lookup.message);
    if (lookup.classSubjects.length === 0) return { ok: true, data: [] };

    const classSubjectIds = lookup.classSubjects.map((row) => row.id);
    const classSubjectById = new Map(
        lookup.classSubjects.map((row) => [row.id, row])
    );

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, start_time, end_time, location, class_subject_id')
        .in('class_subject_id', classSubjectIds)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time', { ascending: true });

    if (sessionsError) return internal(sessionsError.message);

    const sessionRows = (sessions ?? []) as SessionRow[];
    const classIdsForSessions = unique(
        sessionRows
            .map((row) => classSubjectById.get(row.class_subject_id)?.class_id)
    );

    const studentCountByClassId = new Map<string, number>();
    if (classIdsForSessions.length > 0) {
        const { data: enrollmentRows, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select('class_id')
            .in('class_id', classIdsForSessions);

        if (enrollmentsError) return internal(enrollmentsError.message);

        (enrollmentRows ?? []).forEach((row) => {
            const current = studentCountByClassId.get(row.class_id) ?? 0;
            studentCountByClassId.set(row.class_id, current + 1);
        });
    }

    const data: TeacherSession[] = sessionRows.map((session) => {
        const classSubject = classSubjectById.get(session.class_subject_id);
        const classId = classSubject?.class_id;
        return {
            id: session.id,
            start_time: session.start_time,
            end_time: session.end_time,
            class_name: classId
                ? lookup.classNameById.get(classId) ?? 'Classe'
                : 'Classe',
            subject: classSubject?.subject_id
                ? lookup.subjectNameById.get(classSubject.subject_id) ?? 'Matière'
                : 'Matière',
            room: session.location ?? 'Salle à définir',
            student_count: classId ? studentCountByClassId.get(classId) ?? 0 : undefined,
        };
    });

    return { ok: true, data };
}

/**
 * Returns the next `limit` sessions for the authenticated teacher, starting
 * strictly after the end of today.
 */
export async function getTeacherUpcomingSessionsAction(
    limit = 5
): Promise<ActionResponse<TeacherSession[]>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const lookup = await loadTeacherClassSubjects(supabase, user.id);
    if (!lookup.ok) return internal(lookup.message);
    if (lookup.classSubjects.length === 0) return { ok: true, data: [] };

    const classSubjectIds = lookup.classSubjects.map((row) => row.id);
    const classSubjectById = new Map(
        lookup.classSubjects.map((row) => [row.id, row])
    );

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, start_time, end_time, location, class_subject_id')
        .in('class_subject_id', classSubjectIds)
        .gt('start_time', endOfToday.toISOString())
        .order('start_time', { ascending: true })
        .limit(limit);

    if (sessionsError) return internal(sessionsError.message);

    const data: TeacherSession[] = (sessions ?? []).map((session) => {
        const classSubject = classSubjectById.get(session.class_subject_id);
        const classId = classSubject?.class_id;
        return {
            id: session.id,
            start_time: session.start_time,
            end_time: session.end_time,
            class_name: classId
                ? lookup.classNameById.get(classId) ?? 'Classe'
                : 'Classe',
            subject: classSubject?.subject_id
                ? lookup.subjectNameById.get(classSubject.subject_id) ?? 'Matière'
                : 'Matière',
            room: session.location ?? 'Salle à définir',
        };
    });

    return { ok: true, data };
}

/**
 * Returns the distinct classes the authenticated teacher is assigned to,
 * with the current enrollment count for each.
 */
export async function getTeacherClassesAction(): Promise<
    ActionResponse<TeacherClassSummary[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const lookup = await loadTeacherClassSubjects(supabase, user.id);
    if (!lookup.ok) return internal(lookup.message);
    if (lookup.classSubjects.length === 0) return { ok: true, data: [] };

    const classIds = unique(lookup.classSubjects.map((row) => row.class_id));

    const studentCountByClassId = new Map<string, number>();
    const { data: enrollmentRows, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('class_id')
        .in('class_id', classIds);

    if (enrollmentsError) return internal(enrollmentsError.message);

    (enrollmentRows ?? []).forEach((row) => {
        const current = studentCountByClassId.get(row.class_id) ?? 0;
        studentCountByClassId.set(row.class_id, current + 1);
    });

    const data: TeacherClassSummary[] = classIds
        .map((classId) => ({
            id: classId,
            name: lookup.classNameById.get(classId) ?? 'Classe',
            student_count: studentCountByClassId.get(classId) ?? 0,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return { ok: true, data };
}

/**
 * Returns past sessions (within the last 14 days) for the authenticated
 * teacher that have NO attendance_records yet — i.e. the teacher hasn't
 * taken attendance for them.
 */
export async function getTeacherPendingAttendanceAction(): Promise<
    ActionResponse<PendingAttendanceSession[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const lookup = await loadTeacherClassSubjects(supabase, user.id);
    if (!lookup.ok) return internal(lookup.message);
    if (lookup.classSubjects.length === 0) return { ok: true, data: [] };

    const classSubjectIds = lookup.classSubjects.map((row) => row.id);
    const classSubjectById = new Map(
        lookup.classSubjects.map((row) => [row.id, row])
    );

    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, start_time, end_time, class_subject_id')
        .in('class_subject_id', classSubjectIds)
        .gte('end_time', fourteenDaysAgo.toISOString())
        .lt('end_time', now.toISOString())
        .order('start_time', { ascending: false });

    if (sessionsError) return internal(sessionsError.message);

    const sessionRows = (sessions ?? []) as Array<{
        id: string;
        start_time: string;
        end_time: string;
        class_subject_id: string;
    }>;
    if (sessionRows.length === 0) return { ok: true, data: [] };

    const sessionIds = sessionRows.map((row) => row.id);
    const { data: attendanceRows, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('session_id')
        .in('session_id', sessionIds);

    if (attendanceError) return internal(attendanceError.message);

    const recordedSessionIds = new Set(
        (attendanceRows ?? []).map((row) => row.session_id)
    );

    const data: PendingAttendanceSession[] = sessionRows
        .filter((session) => !recordedSessionIds.has(session.id))
        .map((session) => {
            const classSubject = classSubjectById.get(session.class_subject_id);
            const classId = classSubject?.class_id;
            return {
                id: session.id,
                date: session.start_time,
                class_name: classId
                    ? lookup.classNameById.get(classId) ?? 'Classe'
                    : 'Classe',
                subject: classSubject?.subject_id
                    ? lookup.subjectNameById.get(classSubject.subject_id) ?? 'Matière'
                    : 'Matière',
            };
        });

    return { ok: true, data };
}
