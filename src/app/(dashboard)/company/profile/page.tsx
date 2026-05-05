import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { RoleProfileClient } from "../../_berliner/RoleProfileClient";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, establishment_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) redirect("/");

  const role = profile.role as UserRole;
  if (!canAccessRole(role, "company")) {
    redirect(roleToDashboardPath(role));
  }

  let establishmentName: string | null = null;
  if (profile.establishment_id) {
    const { data: establishment } = await supabase
      .from("establishments")
      .select("name")
      .eq("id", profile.establishment_id)
      .maybeSingle();
    establishmentName = establishment?.name ?? null;
  }

  return (
    <MobileLayout role="company">
      <RoleProfileClient
        role="company"
        profile={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: user.email ?? "",
        }}
        establishmentName={establishmentName}
      />
    </MobileLayout>
  );
}
