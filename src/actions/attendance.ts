'use server';

import { ActionResponse, ActionEmptyResponse, AttendanceItem } from '@/types/api';

export async function getAttendanceAction(): Promise<ActionResponse<AttendanceItem[]>> {
    // TODO: Implement fetching attendance
    return {
        ok: true,
        data: []
    };
}

export async function uploadJustificationAction(input: {
    attendanceId: string;
    formData: FormData;
}): Promise<ActionEmptyResponse> {
    // TODO: Implement file upload
    return { ok: true };
}
