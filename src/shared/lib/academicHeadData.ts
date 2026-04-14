// Type definitions for academic-head dashboard data shapes. Runtime
// fetchers live in `src/actions/academicHead.ts`.

export type AcademicHeadKPIs = {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  global_average: number | null;
};

export type AttendanceOverview = {
  rate: number;
  trend: "up" | "down" | "stable";
  trend_value: number;
};

export type GradeDistributionBucket = {
  range: string;
  count: number;
  percentage: number;
};

export type ProgramSummary = {
  id: string;
  name: string;
  students: number;
  classes: number;
};
