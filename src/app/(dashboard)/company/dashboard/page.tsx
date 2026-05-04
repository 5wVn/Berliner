import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { CompanyHomeClient } from "../_components/CompanyHomeClient";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getCompanyApprenticesAction,
  getCompanyApprenticesAttendanceAction,
  getCompanyDocumentsAction,
  getCompanyRecentGradesAction,
} from "@/actions/company";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function CompanyDashboardPage() {
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
  if (!canAccessRole(role, "company")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
    "Entreprise";

  const [apprenticesResult, attendanceResult, gradesResult, documentsResult] =
    await Promise.all([
      getCompanyApprenticesAction(),
      getCompanyApprenticesAttendanceAction(),
      getCompanyRecentGradesAction(),
      getCompanyDocumentsAction(),
    ]);

  return (
    <MobileLayout role="company">
      <CompanyHomeClient
        userName={userName}
        apprentices={apprenticesResult.ok ? apprenticesResult.data : null}
        apprenticesError={
          apprenticesResult.ok ? null : apprenticesResult.error.message
        }
        attendance={attendanceResult.ok ? attendanceResult.data : null}
        attendanceError={
          attendanceResult.ok ? null : attendanceResult.error.message
        }
        grades={gradesResult.ok ? gradesResult.data : null}
        gradesError={gradesResult.ok ? null : gradesResult.error.message}
        documents={documentsResult.ok ? documentsResult.data : null}
        documentsError={
          documentsResult.ok ? null : documentsResult.error.message
        }
      />
    </MobileLayout>
  );
}
