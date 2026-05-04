import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { CompanyDocumentsClient } from "../_components/CompanyDocumentsClient";
import { createClient } from "@/shared/lib/supabase/server";
import { getCompanyDocumentsAction } from "@/actions/company";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function CompanyDocumentsPage() {
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

  const result = await getCompanyDocumentsAction();
  const documents = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  return (
    <MobileLayout role="company">
      <CompanyDocumentsClient documents={documents} error={error} />
    </MobileLayout>
  );
}
