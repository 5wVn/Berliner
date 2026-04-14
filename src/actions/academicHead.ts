'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse } from '@/types/api';
import type {
    AcademicHeadKPIs,
    AttendanceOverview,
    GradeDistributionBucket,
    ProgramSummary,
} from '@/shared/lib/academicHeadData';

const unauthenticated = (): { ok: false; error: { code: 'UNAUTHENTICATED'; message: string } } => ({
    ok: false,
    error: { code: 'UNAUTHENTICATED', message: 'Session expirée.' },
});

const internal = (message: string): { ok: false; error: { code: 'INTERNAL'; message: string } } => ({
    ok: false,
    error: { code: 'INTERNAL', message },
});

const PRESENT_STATUSES = new Set(['present', 'late', 'excused']);

/**
 * Top-line KPIs for the academic head dashboard. Trends are intentionally
 * omitted — computing month-over-month deltas needs history tracking we
 * don't have yet, and faking them is misleading.
 */
export async function getAcademicHeadKPIsAction(): Promise<
    ActionResponse<AcademicHeadKPIs>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const [
        studentsCountResult,
        teachersCountResult,
        classesCountResult,
        gradesResult,
    ] = await Promise.all([
        supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'student'),
        supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'teacher'),
        supabase
            .from('classes')
            .select('id', { count: 'exact', head: true }),
        supabase.from('grades').select('score, max_score'),
    ]);

    if (studentsCountResult.error) return internal(studentsCountResult.error.message);
    if (teachersCountResult.error) return internal(teachersCountResult.error.message);
    if (classesCountResult.error) return internal(classesCountResult.error.message);
    if (gradesResult.error) return internal(gradesResult.error.message);

    let normalizedSum = 0;
    let normalizedCount = 0;
    (gradesResult.data ?? []).forEach((grade) => {
        const score = typeof grade.score === 'number' ? grade.score : null;
        const max = typeof grade.max_score === 'number' && grade.max_score > 0 ? grade.max_score : 20;
        if (score === null) return;
        normalizedSum += (score / max) * 20;
        normalizedCount += 1;
    });
    const globalAverage = normalizedCount > 0
        ? Math.round((normalizedSum / normalizedCount) * 100) / 100
        : null;

    return {
        ok: true,
        data: {
            total_students: studentsCountResult.count ?? 0,
            total_teachers: teachersCountResult.count ?? 0,
            total_classes: classesCountResult.count ?? 0,
            global_average: globalAverage,
        },
    };
}

/**
 * Establishment-wide attendance overview with month-over-month trend.
 * Compares the current calendar month's attendance rate against the
 * previous calendar month using `attendance_records.created_at`.
 */
export async function getAcademicHeadAttendanceOverviewAction(): Promise<
    ActionResponse<AttendanceOverview>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const { data: records, error: recordsError } = await supabase
        .from('attendance_records')
        .select('status, created_at')
        .gte('created_at', startOfLastMonth.toISOString());

    if (recordsError) return internal(recordsError.message);

    let thisMonthTotal = 0;
    let thisMonthPresent = 0;
    let lastMonthTotal = 0;
    let lastMonthPresent = 0;

    (records ?? []).forEach((row) => {
        const createdAt = row.created_at ? new Date(row.created_at) : null;
        if (!createdAt) return;
        const isPresent = PRESENT_STATUSES.has((row.status ?? '').toString());
        if (createdAt >= startOfThisMonth) {
            thisMonthTotal += 1;
            if (isPresent) thisMonthPresent += 1;
        } else if (createdAt >= startOfLastMonth) {
            lastMonthTotal += 1;
            if (isPresent) lastMonthPresent += 1;
        }
    });

    // Use ALL records (not just last 2 months) for the headline rate, so
    // it matches what the registrar sees. Re-query without the date filter.
    const { data: allRecords, error: allRecordsError } = await supabase
        .from('attendance_records')
        .select('status');

    if (allRecordsError) return internal(allRecordsError.message);

    const totalAll = allRecords?.length ?? 0;
    const presentAll = (allRecords ?? []).filter((row) =>
        PRESENT_STATUSES.has((row.status ?? '').toString())
    ).length;
    const rate = totalAll > 0 ? Math.round((presentAll / totalAll) * 1000) / 10 : 0;

    const thisMonthRate = thisMonthTotal > 0 ? (thisMonthPresent / thisMonthTotal) * 100 : 0;
    const lastMonthRate = lastMonthTotal > 0 ? (lastMonthPresent / lastMonthTotal) * 100 : 0;
    const delta = Math.round((thisMonthRate - lastMonthRate) * 10) / 10;

    let trend: AttendanceOverview['trend'] = 'stable';
    if (delta > 0.1) trend = 'up';
    else if (delta < -0.1) trend = 'down';

    return {
        ok: true,
        data: {
            rate,
            trend,
            trend_value: Math.abs(delta),
        },
    };
}

/**
 * Distribution of all grades across the establishment, normalized to /20
 * and bucketed for the histogram.
 */
export async function getAcademicHeadGradeDistributionAction(): Promise<
    ActionResponse<GradeDistributionBucket[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('score, max_score');

    if (gradesError) return internal(gradesError.message);

    const buckets = [
        { range: '≥ 16', min: 16, max: Infinity, count: 0 },
        { range: '14-16', min: 14, max: 16, count: 0 },
        { range: '12-14', min: 12, max: 14, count: 0 },
        { range: '10-12', min: 10, max: 12, count: 0 },
        { range: '< 10', min: -Infinity, max: 10, count: 0 },
    ];

    let total = 0;
    (grades ?? []).forEach((grade) => {
        const score = typeof grade.score === 'number' ? grade.score : null;
        const max = typeof grade.max_score === 'number' && grade.max_score > 0 ? grade.max_score : 20;
        if (score === null) return;
        const normalized = (score / max) * 20;
        const bucket = buckets.find(
            (b) => normalized >= b.min && normalized < b.max
        );
        if (bucket) {
            bucket.count += 1;
            total += 1;
        }
    });

    const data: GradeDistributionBucket[] = buckets.map((b) => ({
        range: b.range,
        count: b.count,
        percentage: total > 0 ? Math.round((b.count / total) * 100) : 0,
    }));

    return { ok: true, data };
}

/**
 * Per-program summary: number of open classes and total enrolled students
 * for each program in the establishment.
 */
export async function getAcademicHeadProgramsSummaryAction(): Promise<
    ActionResponse<ProgramSummary[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const [programsResult, classesResult, enrollmentsResult] = await Promise.all([
        supabase.from('programs').select('id, name'),
        supabase.from('classes').select('id, program_id'),
        supabase.from('enrollments').select('class_id'),
    ]);

    if (programsResult.error) return internal(programsResult.error.message);
    if (classesResult.error) return internal(classesResult.error.message);
    if (enrollmentsResult.error) return internal(enrollmentsResult.error.message);

    const classesByProgram = new Map<string, string[]>();
    (classesResult.data ?? []).forEach((row) => {
        const list = classesByProgram.get(row.program_id) ?? [];
        list.push(row.id);
        classesByProgram.set(row.program_id, list);
    });

    const enrollmentsByClass = new Map<string, number>();
    (enrollmentsResult.data ?? []).forEach((row) => {
        const current = enrollmentsByClass.get(row.class_id) ?? 0;
        enrollmentsByClass.set(row.class_id, current + 1);
    });

    const data: ProgramSummary[] = (programsResult.data ?? [])
        .map((program) => {
            const classIds = classesByProgram.get(program.id) ?? [];
            const studentCount = classIds.reduce(
                (acc, classId) => acc + (enrollmentsByClass.get(classId) ?? 0),
                0
            );
            return {
                id: program.id,
                name: program.name,
                students: studentCount,
                classes: classIds.length,
            };
        })
        .sort((a, b) => b.students - a.students);

    return { ok: true, data };
}
