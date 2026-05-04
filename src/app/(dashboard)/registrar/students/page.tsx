import { redirect } from "next/navigation";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { RegistrarStudentsClient } from "../_components/RegistrarStudentsClient";
import { createClient } from "@/shared/lib/supabase/server";
import { getRegistrarStudentsAction } from "@/actions/registrar";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function RegistrarStudentsPage() {
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

  const result = await getRegistrarStudentsAction();
  const students = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  return (
    <MobileLayout role="registrar">
      <RegistrarStudentsClient students={students} error={error} />
    </MobileLayout>
  );
}
