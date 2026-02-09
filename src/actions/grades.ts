'use server';

import { ActionResponse, GradeItem } from '@/types/api';

export async function getGradesAction(): Promise<ActionResponse<GradeItem[]>> {
    // TODO: Implement fetching grades
    return {
        ok: true,
        data: []
    };
}
