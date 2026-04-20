// Type definitions for teacher-facing data shapes. The runtime fetchers
// live in `src/actions/teacher.ts` (server-side, RLS-aware).

export type TeacherSession = {
  id: string;
  start_time: string;
  end_time: string;
  class_name: string;
  subject: string;
  room: string;
  student_count?: number;
};

export type TeacherClassSummary = {
  id: string;
  name: string;
  student_count: number;
  subject_count?: number;
  next_session_at?: string | null;
};

export type PendingAttendanceSession = {
  id: string;
  date: string;
  class_name: string;
  subject: string;
};
