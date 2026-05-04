import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { CompanyApprenticesClient } from "../_components/CompanyApprenticesClient";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getCompanyApprenticesAction,
  getCompanyApprenticesAttendanceAction,
} from "@/actions/company";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function CompanyApprenticesPage() {
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
  if (!canAccessRole(role, "company")) {
    redirect(roleToDashboardPath(role));
  }

  const [apprenticesResult, attendanceResult] = await Promise.all([
    getCompanyApprenticesAction(),
    getCompanyApprenticesAttendanceAction(),
  ]);

  const apprentices = apprenticesResult.ok ? apprenticesResult.data : [];
  const attendance = attendanceResult.ok
    ? attendanceResult.data
    : { global_rate: 0, apprentices: [] };
  const error = !apprenticesResult.ok
    ? apprenticesResult.error.message
    : !attendanceResult.ok
    ? attendanceResult.error.message
    : null;

  return (
    <MobileLayout role="company">
      <CompanyApprenticesClient
        apprentices={apprentices}
        attendance={attendance}
        error={error}
      />
    </MobileLayout>
  );
}
