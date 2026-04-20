'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse } from '@/types/api';
import type { ApprenticeStudent } from '@/types/api';
import type {
    ApprenticeRecentGrade,
    ApprenticesAttendanceOverview,
    CompanyDocument,
} from '@/shared/lib/companyData';

const unauthenticated = (): { ok: false; error: { code: 'UNAUTHENTICATED'; message: string } } => ({
    ok: false,
    error: { code: 'UNAUTHENTICATED', message: 'Session expirée.' },
});

/**
 * Liste les apprentis rattachés à la company de l'utilisateur connecté.
 * Utilise la table `apprenticeships` (P1) pour joindre company → students.
 */
export async function getCompanyApprenticesAction(): Promise<
    ActionResponse<ApprenticeStudent[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, company_id')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        return {
            ok: false,
            error: { code: 'NOT_FOUND', message: 'Profil introuvable.' },
        };
    }

    const isOversight = profile.role === 'academic_head' || profile.role === 'super_admin';
    const isCompanyContact = profile.role === 'company' && !!profile.company_id;

    if (!isOversight && !isCompanyContact) {
        return {
            ok: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Accès réservé aux contacts entreprise rattachés ou aux rôles d\'encadrement.',
            },
        };
    }

    let query = supabase
        .from('apprenticeships')
        .select(
            `
            id,
            start_date,
            end_date,
            status,
            student:profiles!apprenticeships_student_id_fkey (
                id,
                first_name,
                last_name,
                email,
                enrollments (
                    status,
                    classes ( name )
                )
            )
            `,
        );

    if (isCompanyContact) {
        query = query.eq('company_id', profile.company_id!);
    }

    const { data, error } = await query;

    if (error) {
        return {
            ok: false,
            error: { code: 'INTERNAL', message: error.message },
        };
    }

    type Row = {
        id: string;
        start_date: string;
        end_date: string | null;
        status: 'active' | 'ended' | 'pending';
        student: {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            enrollments: Array<{
                status: string;
                classes: { name: string } | null;
            }> | null;
        } | null;
    };

    const rows = (data ?? []) as unknown as Row[];

    const apprentices: ApprenticeStudent[] = rows
        .filter((r): r is Row & { student: NonNullable<Row['student']> } => r.student !== null)
        .map((r) => {
            const activeEnrollment = r.student.enrollments?.find((e) => e.status === 'active');
            return {
                apprenticeshipId: r.id,
                studentId: r.student.id,
                firstName: r.student.first_name,
                lastName: r.student.last_name,
                email: r.student.email,
                startDate: r.start_date,
                endDate: r.end_date,
                status: r.status,
                className: activeEnrollment?.classes?.name ?? null,
            };
        });

    return { ok: true, data: apprentices };
}

export async function getCompanyApprenticesAttendanceAction(): Promise<
    ActionResponse<ApprenticesAttendanceOverview>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();
    return {
        ok: true,
        data: { global_rate: 0, apprentices: [] },
    };
}

export async function getCompanyRecentGradesAction(): Promise<
    ActionResponse<ApprenticeRecentGrade[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();
    return { ok: true, data: [] };
}

export async function getCompanyDocumentsAction(): Promise<
    ActionResponse<CompanyDocument[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();
    return { ok: true, data: [] };
}
