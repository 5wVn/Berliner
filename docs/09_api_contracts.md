# API Contracts (Server Actions)

## Conventions
- Server Actions utilisees depuis App Router
- Validation avec zod (ou equivalent)
- Erreurs retournees dans un format unique

## Error shape
```ts
export type ActionError = {
  code: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL';
  message: string;
  details?: Record<string, string>;
};
```

## Auth
```ts
export async function loginAction(input: {
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: ActionError }>;

export async function logoutAction(): Promise<{ ok: true } | { ok: false; error: ActionError }>;

export async function registerAction(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  establishmentId: string;
  role: 'student' | 'teacher' | 'registrar' | 'academic_head' | 'company';
}): Promise<{ ok: true } | { ok: false; error: ActionError }>;

export async function resetPasswordAction(input: {
  email: string;
}): Promise<{ ok: true } | { ok: false; error: ActionError }>;
```

## Scheduling
```ts
export async function getScheduleAction(input: {
  start: string; // ISO date
  end: string;   // ISO date
}): Promise<{ ok: true; data: ScheduleSession[] } | { ok: false; error: ActionError }>;

export type ScheduleSession = {
  id: string;
  subjectName: string;
  teacherName: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  location?: string;
};
```

## Grades
```ts
export async function getGradesAction(): Promise<{ ok: true; data: GradeItem[] } | { ok: false; error: ActionError }>;

export type GradeItem = {
  evaluationName: string;
  subjectName: string;
  coefficient: number;
  score: number;
  maxScore: number;
};
```

## Attendance
```ts
export async function getAttendanceAction(): Promise<{ ok: true; data: AttendanceItem[] } | { ok: false; error: ActionError }>;

export async function uploadJustificationAction(input: {
  attendanceId: string;
  file: File;
}): Promise<{ ok: true } | { ok: false; error: ActionError }>;
```

## Documents
```ts
export async function listDocumentsAction(): Promise<{ ok: true; data: DocumentItem[] } | { ok: false; error: ActionError }>;

export type DocumentItem = {
  id: string;
  title: string;
  type: string;
  downloadUrl: string;
};
```
