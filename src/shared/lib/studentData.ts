// Type definitions for student-facing data shapes. The runtime fetchers
// that used to live here have been replaced by Server Actions in
// `src/actions/student.ts`. Kept as a type module so existing imports
// (`import type { ... } from "@/shared/lib/studentData"`) keep working.

export type SubjectGrade = {
  id: string;
  value: number;
  coefficient: number;
  date: string;
  label: string;
  max: number;
};

export type SubjectWithGrades = {
  id: string;
  name: string;
  teacher?: string;
  grades: SubjectGrade[];
};

export type GradesSummaryItem = {
  id: string;
  name: string;
  teacher?: string;
  average: number | null;
  count: number;
};

export type GradesSummary = {
  subjects: GradesSummaryItem[];
  globalAverage: number | null;
};

export type ScheduleSession = {
  id: string;
  start_time: string;
  end_time?: string | null;
  subject_name: string;
  teacher_name?: string;
  location?: string | null;
};

export type AttendanceSummary = {
  total: number;
  present: number;
  rate: number;
};
