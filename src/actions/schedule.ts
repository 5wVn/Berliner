'use server';

import { ActionResponse, ScheduleSession } from '@/types/api';

export async function getScheduleAction(input: {
    start: string;
    end: string;
}): Promise<ActionResponse<ScheduleSession[]>> {
    // TODO: Implement fetching schedule from Supabase
    return {
        ok: true,
        data: []
    };
}
