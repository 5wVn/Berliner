export type ActionError = {
    code: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL';
    message: string;
    details?: Record<string, string>;
};

export type ActionResponse<T> = { ok: true; data: T } | { ok: false; error: ActionError };
export type ActionEmptyResponse = { ok: true } | { ok: false; error: ActionError };

export type UserRole = 'student' | 'teacher' | 'registrar' | 'academic_head' | 'company';

export type UserProfile = {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    establishmentId: string;
};

export type ScheduleSession = {
    id: string;
    subjectName: string;
    teacherName: string;
    startTime: string; // ISO
    endTime: string;   // ISO
    location: string;
    type: string; // CM, TD, TP
};

export type GradeItem = {
    id: string;
    evaluationName: string;
    subjectName: string;
    coefficient: number;
    score: number;
    maxScore: number;
    date: string;
};

export type AttendanceItem = {
    id: string;
    date: string;
    subjectName: string;
    status: 'present' | 'absent' | 'late' | 'excused' | 'pending_justification';
    justificationUrl?: string;
};

export type DocumentItem = {
    id: string;
    title: string;
    type: string;
    date: string;
    downloadUrl: string;
};
