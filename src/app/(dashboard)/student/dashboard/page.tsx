import { redirect } from "next/navigation";
import { getBerlinerStateAction } from "@/actions/berliner-state";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { HomeClient } from "../../_berliner/HomeClient";
import { MobileLayout } from "../../_berliner/MobileLayout";

export default async function StudentDashboardPage() {
  const result = await getBerlinerStateAction("student");
  if (!result.ok) {
    if (result.error.code === "UNAUTHENTICATED") redirect("/");
    throw new Error(result.error.message);
  }
  const role = result.data.profile.role as UserRole;
  if (!canAccessRole(role, "student")) {
    redirect(roleToDashboardPath(role));
  }
  return (
    <MobileLayout role="student">
      <HomeClient state={result.data} />
    </MobileLayout>
  );
}
