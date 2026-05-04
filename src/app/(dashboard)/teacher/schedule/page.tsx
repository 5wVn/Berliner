import { redirect } from "next/navigation";
import { getBerlinerStateAction } from "@/actions/berliner-state";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { PlanningClient } from "../../_berliner/PlanningClient";
import { MobileLayout } from "../../_berliner/MobileLayout";

export default async function TeacherSchedulePage() {
  const result = await getBerlinerStateAction();
  if (!result.ok) {
    if (result.error.code === "UNAUTHENTICATED") redirect("/");
    throw new Error(result.error.message);
  }
  const role = result.data.profile.role as UserRole;
  if (!canAccessRole(role, "teacher")) {
    redirect(roleToDashboardPath(role));
  }
  return (
    <MobileLayout role="teacher">
      <PlanningClient state={result.data} />
    </MobileLayout>
  );
}
