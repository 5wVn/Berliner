// Type definitions for registrar-facing data shapes. Runtime fetchers
// live in `src/actions/registrar.ts` (server-side, RLS-aware).

export type RegistrarStats = {
  total_students: number;
  new_enrollments_month: number;
  global_attendance_rate: number;
  pending_document_requests: number;
};

export type PendingEnrollment = {
  id: string;
  student_name: string;
  program: string;
  request_date: string;
};

export type DocumentRequest = {
  id: string;
  student_name: string;
  document_type: string;
  request_date: string;
  status: "pending" | "processing";
};

export type AttendanceAlert = {
  id: string;
  student_name: string;
  class_name: string;
  attendance_rate: number;
};
