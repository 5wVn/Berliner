import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getAcademicHeadAttendanceOverviewAction,
  getAcademicHeadGradeDistributionAction,
} from "@/actions/academicHead";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { AcademicHeadAnalyticsClient } from "../../_berliner/AcademicHeadAnalyticsClient";

export default async function AcademicHeadAnalyticsPage() {
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
  if (!canAccessRole(role, "academic_head")) {
    redirect(roleToDashboardPath(role));
  }

  const [attendanceResult, distributionResult] = await Promise.all([
    getAcademicHeadAttendanceOverviewAction(),
    getAcademicHeadGradeDistributionAction(),
  ]);

  return (
    <MobileLayout role="academic_head">
      <AcademicHeadAnalyticsClient
        attendance={attendanceResult.ok ? attendanceResult.data : null}
        attendanceError={attendanceResult.ok ? null : attendanceResult.error.message}
        distribution={distributionResult.ok ? distributionResult.data : null}
        distributionError={distributionResult.ok ? null : distributionResult.error.message}
      />
    </MobileLayout>
  );
}
