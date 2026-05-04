import { redirect } from "next/navigation";
import { getBerlinerStateAction } from "@/actions/berliner-state";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { GradesClient } from "../../_berliner/GradesClient";
import { MobileLayout } from "../../_berliner/MobileLayout";

export default async function StudentGradesPage() {
  const result = await getBerlinerStateAction();
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
      <GradesClient state={result.data} />
    </MobileLayout>
  );
}
