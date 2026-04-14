// Canonical UserRole lives in @/shared/types/auth. Re-exported here so
// Server Actions and types/api consumers don't need a second import path.
export type { UserRole } from '@/shared/types/auth';

export type ActionError = {
    code: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL';
    message: string;
    details?: Record<string, string>;
};

export type ActionResponse<T> = { ok: true; data: T } | { ok: false; error: ActionError };
export type ActionEmptyResponse = { ok: true } | { ok: false; error: ActionError };
