'use server';

import { ActionResponse, DocumentItem } from '@/types/api';

export async function listDocumentsAction(): Promise<ActionResponse<DocumentItem[]>> {
    // TODO: Implement fetching documents
    return {
        ok: true,
        data: []
    };
}
