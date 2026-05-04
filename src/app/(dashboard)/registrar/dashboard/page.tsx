import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { RegistrarHomeClient } from "../_components/RegistrarHomeClient";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getRegistrarAttendanceAlertsAction,
  getRegistrarDocumentRequestsAction,
  getRegistrarPendingEnrollmentsAction,
  getRegistrarStatsAction,
} from "@/actions/registrar";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function RegistrarDashboardPage() {
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
  if (!canAccessRole(role, "registrar")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
    "Utilisateur";

  const [statsResult, enrollmentsResult, requestsResult, alertsResult] =
    await Promise.all([
      getRegistrarStatsAction(),
      getRegistrarPendingEnrollmentsAction(5),
      getRegistrarDocumentRequestsAction(),
      getRegistrarAttendanceAlertsAction(5),
    ]);

  return (
    <MobileLayout role="registrar">
      <RegistrarHomeClient
        userName={userName}
        stats={statsResult.ok ? statsResult.data : null}
        statsError={statsResult.ok ? null : statsResult.error.message}
        enrollments={enrollmentsResult.ok ? enrollmentsResult.data : null}
        enrollmentsError={
          enrollmentsResult.ok ? null : enrollmentsResult.error.message
        }
        requests={requestsResult.ok ? requestsResult.data : null}
        requestsError={requestsResult.ok ? null : requestsResult.error.message}
        alerts={alertsResult.ok ? alertsResult.data : null}
        alertsError={alertsResult.ok ? null : alertsResult.error.message}
      />
    </MobileLayout>
  );
}
