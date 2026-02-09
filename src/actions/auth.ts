'use server';

import { ActionResponse, ActionEmptyResponse, UserRole } from '@/types/api';

export async function loginAction(input: {
    email: string;
}) {
    // TODO: Implement actual login logic with Supabase Auth
    console.log('Login attempt:', input.email);
    return { ok: true };
}

export async function logoutAction(): Promise<ActionEmptyResponse> {
    // TODO: Implement logout
    return { ok: true };
}

export async function registerAction(input: {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    establishmentId: string;
}): Promise<ActionEmptyResponse> {
    // TODO: Implement registration
    return { ok: true };
}
