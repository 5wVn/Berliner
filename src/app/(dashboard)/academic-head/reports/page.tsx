import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { AcademicHeadReportsClient } from "../_components/AcademicHeadReportsClient";
import { createClient } from "@/shared/lib/supabase/server";
import { getAcademicHeadProgramsSummaryAction } from "@/actions/academicHead";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function AcademicHeadReportsPage() {
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

  const result = await getAcademicHeadProgramsSummaryAction();
  const programs = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  return (
    <MobileLayout role="academic_head">
      <AcademicHeadReportsClient programs={programs} error={error} />
    </MobileLayout>
  );
}
