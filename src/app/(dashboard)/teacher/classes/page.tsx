import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { getTeacherClassesAction } from "@/actions/teacher";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { MobileLayout } from "../../_berliner/MobileLayout";
import { TeacherClassesClient } from "../../_berliner/TeacherClassesClient";

export default async function TeacherClassesPage() {
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
  if (!canAccessRole(role, "teacher")) {
    redirect(roleToDashboardPath(role));
  }

  const result = await getTeacherClassesAction();
  const classes = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  return (
    <MobileLayout role="teacher">
      <TeacherClassesClient classes={classes} error={error} />
    </MobileLayout>
  );
}
