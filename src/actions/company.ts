'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse } from '@/types/api';
import type {
    Apprentice,
    ApprenticeRecentGrade,
    ApprenticesAttendanceOverview,
    CompanyDocument,
} from '@/shared/lib/companyData';

const unauthenticated = (): { ok: false; error: { code: 'UNAUTHENTICATED'; message: string } } => ({
    ok: false,
    error: { code: 'UNAUTHENTICATED', message: 'Session expirée.' },
});

/**
 * SCHEMA GAP: The current database does not model the company-apprentice
 * relationship. There is no `companies` table and no `company_id` column
 * on `profiles`. To wire these actions up for real, the schema needs:
 *
 *   - either a `companies` table + a join (e.g. `apprenticeships(company_id, student_id)`)
 *   - or a `company_id uuid REFERENCES profiles(id)` column on student
 *     profiles for the simpler one-company-per-apprentice model.
 *
 * Until then, all four company actions return empty data so the UI shows
 * honest empty states instead of misleading mock fixtures.
 */

export async function getCompanyApprenticesAction(): Promise<
    ActionResponse<Apprentice[]>
> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthenticated();
    return { ok: true, data: [] };
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
