import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getStudentAttendanceAction,
  getStudentAttendanceRecordsAction,
} from "@/actions/student";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { StudentAttendanceClient } from "../../_berliner/StudentAttendanceClient";

export default async function StudentAttendancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) redirect("/");

  const role = profile.role as UserRole;
  if (!canAccessRole(role, "student")) {
    redirect(roleToDashboardPath(role));
  }

  const [summaryResult, recordsResult] = await Promise.all([
    getStudentAttendanceAction(),
    getStudentAttendanceRecordsAction(),
  ]);

  const summary = summaryResult.ok
    ? summaryResult.data
    : { total: 0, present: 0, rate: 0 };
  const records = recordsResult.ok ? recordsResult.data : [];
  const error = !summaryResult.ok
    ? summaryResult.error.message
    : !recordsResult.ok
      ? recordsResult.error.message
      : null;

  return (
    <MobileLayout role="student">
      <StudentAttendanceClient summary={summary} records={records} error={error} />
    </MobileLayout>
  );
}
