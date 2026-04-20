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

export type ApprenticeStudent = {
    apprenticeshipId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    startDate: string;
    endDate: string | null;
    status: 'active' | 'ended' | 'pending';
    className: string | null;
};

export type DocumentRequestType =
    | 'certificate'
    | 'transcript'
    | 'attestation'
    | 'internship_agreement'
    | 'other';

export type DocumentRequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';

export type RegistrarStudent = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    className: string | null;
    enrollmentStatus: string | null;
};
