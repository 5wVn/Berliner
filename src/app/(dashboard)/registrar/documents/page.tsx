import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { RegistrarDocumentsClient } from "../_components/RegistrarDocumentsClient";
import { createClient } from "@/shared/lib/supabase/server";
import { getRegistrarDocumentRequestsAction } from "@/actions/registrar";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function RegistrarDocumentsPage() {
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
  if (!canAccessRole(role, "registrar")) {
    redirect(roleToDashboardPath(role));
  }

  const result = await getRegistrarDocumentRequestsAction();
  const requests = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  return (
    <MobileLayout role="registrar">
      <RegistrarDocumentsClient requests={requests} error={error} />
    </MobileLayout>
  );
}
