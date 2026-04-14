// Type definitions for company-facing data shapes. Runtime fetchers live
// in `src/actions/company.ts`.
//
// IMPORTANT: The current schema does not model the company-apprentice
// relationship. There is no `companies` table, nor a `company_id` link on
// `profiles`. Until that schema lands, the company actions return empty
// data and the widgets show honest empty states.

export type Apprentice = {
  id: string;
  name: string;
  program: string;
  initials: string;
};

export type ApprenticeAttendance = {
  id: string;
  name: string;
  rate: number;
};

export type ApprenticesAttendanceOverview = {
  global_rate: number;
  apprentices: ApprenticeAttendance[];
};

export type ApprenticeRecentGrade = {
  id: string;
  apprentice_name: string;
  subject: string;
  grade: number;
  date: string;
};

export type CompanyDocument = {
  id: string;
  type: string;
  apprentice_name: string;
  date: string;
};
