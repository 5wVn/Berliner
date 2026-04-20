'use server';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionEmptyResponse, ActionResponse, UserRole } from '@/types/api';

type LoginInput = {
    email: string;
    password: string;
};

type LoginData = {
    userId: string;
    role: UserRole;
};

const isUserRole = (value: unknown): value is UserRole =>
    value === 'student' ||
    value === 'teacher' ||
    value === 'registrar' ||
    value === 'academic_head' ||
    value === 'company';

const validateLoginInput = (input: LoginInput): string | null => {
    if (typeof input?.email !== 'string' || input.email.trim().length === 0) {
        return 'Email requis.';
    }
    if (!/^\S+@\S+\.\S+$/.test(input.email)) {
        return 'Email invalide.';
    }
    if (typeof input?.password !== 'string' || input.password.length === 0) {
        return 'Mot de passe requis.';
    }
    return null;
};

export async function loginAction(
    input: LoginInput
): Promise<ActionResponse<LoginData>> {
    const validationError = validateLoginInput(input);
    if (validationError) {
        return {
            ok: false,
            error: { code: 'VALIDATION', message: validationError },
        };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email.trim(),
        password: input.password,
    });

    if (error || !data.session) {
        return {
            ok: false,
            error: {
                code: 'UNAUTHENTICATED',
                message: error?.message ?? 'Identifiants invalides.',
            },
        };
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

    if (profileError) {
        return {
            ok: false,
            error: { code: 'INTERNAL', message: profileError.message },
        };
    }

    if (!profile || !isUserRole(profile.role)) {
        return {
            ok: false,
            error: {
                code: 'NOT_FOUND',
                message: 'Profil introuvable. Contactez un administrateur.',
            },
        };
    }

    return {
        ok: true,
        data: { userId: data.user.id, role: profile.role },
    };
}

export async function logoutAction(): Promise<ActionEmptyResponse> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return {
            ok: false,
            error: { code: 'INTERNAL', message: error.message },
        };
    }

    return { ok: true };
}
