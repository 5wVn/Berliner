import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { AcademicHeadHomeClient } from "../_components/AcademicHeadHomeClient";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getAcademicHeadAttendanceOverviewAction,
  getAcademicHeadGradeDistributionAction,
  getAcademicHeadKPIsAction,
  getAcademicHeadProgramsSummaryAction,
} from "@/actions/academicHead";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function AcademicHeadDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) redirect("/");

  const role = profile.role as UserRole;
  if (!canAccessRole(role, "academic_head")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
    "Utilisateur";

  const [kpisResult, overviewResult, distributionResult, programsResult] =
    await Promise.all([
      getAcademicHeadKPIsAction(),
      getAcademicHeadAttendanceOverviewAction(),
      getAcademicHeadGradeDistributionAction(),
      getAcademicHeadProgramsSummaryAction(),
    ]);

  return (
    <MobileLayout role="academic_head">
      <AcademicHeadHomeClient
        userName={userName}
        kpis={kpisResult.ok ? kpisResult.data : null}
        kpisError={kpisResult.ok ? null : kpisResult.error.message}
        overview={overviewResult.ok ? overviewResult.data : null}
        overviewError={overviewResult.ok ? null : overviewResult.error.message}
        distribution={distributionResult.ok ? distributionResult.data : null}
        distributionError={
          distributionResult.ok ? null : distributionResult.error.message
        }
        programs={programsResult.ok ? programsResult.data : null}
        programsError={programsResult.ok ? null : programsResult.error.message}
      />
    </MobileLayout>
  );
}
