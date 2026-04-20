'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse, RegistrarStudent } from '@/types/api';
import type {
    AttendanceAlert,
    DocumentRequest,
    PendingEnrollment,
    RegistrarStats,
} from '@/shared/lib/registrarData';

const unauthenticated = (): { ok: false; error: { code: 'UNAUTHENTICATED'; message: string } } => ({
    ok: false,
    error: { code: 'UNAUTHENTICATED', message: 'Session expirée.' },
});

const internal = (message: string): { ok: false; error: { code: 'INTERNAL'; message: string } } => ({
    ok: false,
    error: { code: 'INTERNAL', message },
});

const PRESENT_STATUSES = new Set(['present', 'late', 'excused']);
const ATTENDANCE_ALERT_THRESHOLD = 75;

/**
 * Registrar dashboard KPIs: total students in establishment, enrollments
 * created this month, the global attendance rate across all records, and
 * the count of pending document requests (currently always 0 — see note in
 * `getRegistrarDocumentRequestsAction`).
 */
export async function getRegistrarStatsAction(): Promise<
    ActionResponse<RegistrarStats>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    // Total students. RLS auto-scopes to the registrar's establishment.
    const { count: totalStudents, error: studentsError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'student');

    if (studentsError) return internal(studentsError.message);

    // New enrollments this calendar month.
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newEnrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

    if (enrollmentsError) return internal(enrollmentsError.message);

    // Global attendance rate across all records in the establishment.
    const { data: attendanceRows, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('status');

    if (attendanceError) return internal(attendanceError.message);

    const total = attendanceRows?.length ?? 0;
    const present = (attendanceRows ?? []).filter((row) =>
        PRESENT_STATUSES.has((row.status ?? '').toString())
    ).length;
    const globalAttendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
        ok: true,
        data: {
            total_students: totalStudents ?? 0,
            new_enrollments_month: newEnrollments ?? 0,
            global_attendance_rate: globalAttendanceRate,
            pending_document_requests: 0,
        },
    };
}

/**
 * Pending enrollments awaiting registrar approval.
 */
export async function getRegistrarPendingEnrollmentsAction(
    limit = 5
): Promise<ActionResponse<PendingEnrollment[]>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('id, student_id, class_id, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (enrollmentsError) return internal(enrollmentsError.message);

    const rows = (enrollments ?? []) as Array<{
        id: string;
        student_id: string;
        class_id: string;
        created_at: string;
    }>;
    if (rows.length === 0) return { ok: true, data: [] };

    const studentIds = Array.from(new Set(rows.map((row) => row.student_id)));
    const classIds = Array.from(new Set(rows.map((row) => row.class_id)));

    const [studentsResult, classesResult] = await Promise.all([
        supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', studentIds),
        supabase.from('classes').select('id, name').in('id', classIds),
    ]);

    if (studentsResult.error) return internal(studentsResult.error.message);
    if (classesResult.error) return internal(classesResult.error.message);

    const studentNameById = new Map(
        (studentsResult.data ?? []).map((profile) => [
            profile.id,
            `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Étudiant',
        ])
    );
    const classNameById = new Map(
        (classesResult.data ?? []).map((row) => [row.id, row.name])
    );

    const data: PendingEnrollment[] = rows.map((row) => ({
        id: row.id,
        student_name: studentNameById.get(row.student_id) ?? 'Étudiant',
        program: classNameById.get(row.class_id) ?? 'Classe',
        request_date: row.created_at,
    }));

    return { ok: true, data };
}

/**
 * Document requests awaiting registrar action.
 */
export async function getRegistrarDocumentRequestsAction(): Promise<
    ActionResponse<DocumentRequest[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();
    return { ok: true, data: [] };
}

/**
 * Students whose attendance rate falls below the alert threshold (75%).
 */
export async function getRegistrarAttendanceAlertsAction(
    limit = 5
): Promise<ActionResponse<AttendanceAlert[]>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: records, error: recordsError } = await supabase
        .from('attendance_records')
        .select('student_id, status');

    if (recordsError) return internal(recordsError.message);

    const aggregates = new Map<string, { total: number; present: number }>();
    (records ?? []).forEach((row) => {
        const current = aggregates.get(row.student_id) ?? { total: 0, present: 0 };
        current.total += 1;
        if (PRESENT_STATUSES.has((row.status ?? '').toString())) {
            current.present += 1;
        }
        aggregates.set(row.student_id, current);
    });

    const flagged = Array.from(aggregates.entries())
        .map(([studentId, { total, present }]) => ({
            studentId,
            rate: total > 0 ? Math.round((present / total) * 100) : 0,
            total,
        }))
        .filter((entry) => entry.total > 0 && entry.rate < ATTENDANCE_ALERT_THRESHOLD)
        .sort((a, b) => a.rate - b.rate)
        .slice(0, limit);

    if (flagged.length === 0) return { ok: true, data: [] };

    const studentIds = flagged.map((entry) => entry.studentId);

    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', studentIds);

    if (profilesError) return internal(profilesError.message);

    const profileById = new Map(
        (profiles ?? []).map((row) => [row.id, row])
    );

    const { data: enrollmentRows, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('student_id, class_id, created_at')
        .in('student_id', studentIds)
        .order('created_at', { ascending: false });

    if (enrollmentsError) return internal(enrollmentsError.message);

    const latestClassIdByStudent = new Map<string, string>();
    (enrollmentRows ?? []).forEach((row) => {
        if (!latestClassIdByStudent.has(row.student_id)) {
            latestClassIdByStudent.set(row.student_id, row.class_id);
        }
    });

    const classIds = Array.from(new Set(latestClassIdByStudent.values()));
    const classNameById = new Map<string, string>();
    if (classIds.length > 0) {
        const { data: classes, error: classesError } = await supabase
            .from('classes')
            .select('id, name')
            .in('id', classIds);
        if (classesError) return internal(classesError.message);
        (classes ?? []).forEach((row) => {
            classNameById.set(row.id, row.name);
        });
    }

    const data: AttendanceAlert[] = flagged.map((entry) => {
        const profile = profileById.get(entry.studentId);
        const classId = latestClassIdByStudent.get(entry.studentId);
        return {
            id: entry.studentId,
            student_name: profile
                ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Étudiant'
                : 'Étudiant',
            class_name: classId ? classNameById.get(classId) ?? '' : '',
            attendance_rate: entry.rate,
        };
    });

    return { ok: true, data };
}

/**
 * Liste tous les étudiants du tenant avec leur classe active.
 * Auth : registrar ou academic_head.
 */
export async function getRegistrarStudentsAction(): Promise<
    ActionResponse<RegistrarStudent[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: callerProfile, error: callerError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (callerError || !callerProfile) {
        return {
            ok: false,
            error: { code: 'NOT_FOUND', message: 'Profil introuvable.' },
        };
    }

    const allowed: ReadonlyArray<string> = ['registrar', 'academic_head', 'super_admin'];
    if (!allowed.includes(callerProfile.role)) {
        return {
            ok: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Accès réservé aux rôles registrar, academic_head ou super_admin.',
            },
        };
    }

    const { data, error } = await supabase
        .from('profiles')
        .select(
            `
            id,
            first_name,
            last_name,
            email,
            enrollments (
                status,
                classes ( name )
            )
            `,
        )
        .eq('role', 'student')
        .order('last_name', { ascending: true });

    if (error) {
        return {
            ok: false,
            error: { code: 'INTERNAL', message: error.message },
        };
    }

    type Row = {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        enrollments: Array<{
            status: string;
            classes: { name: string } | null;
        }> | null;
    };

    const rows = (data ?? []) as unknown as Row[];

    const students: RegistrarStudent[] = rows.map((r) => {
        const active = r.enrollments?.find((e) => e.status === 'active');
        const fallback = r.enrollments?.[0];
        const chosen = active ?? fallback ?? null;
        return {
            id: r.id,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            className: chosen?.classes?.name ?? null,
            enrollmentStatus: chosen?.status ?? null,
        };
    });

    return { ok: true, data: students };
}
