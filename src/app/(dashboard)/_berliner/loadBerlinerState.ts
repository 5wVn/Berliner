import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getBerlinerStateAction } from "@/actions/berliner-state";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import type { BerlinerState } from "@/actions/berliner-state";

const fetchBerlinerState = cache(async () => getBerlinerStateAction());

export async function loadBerlinerState(
  expectedRole: UserRole
): Promise<BerlinerState> {
  const result = await fetchBerlinerState();
  if (!result.ok) {
    if (result.error.code === "UNAUTHENTICATED") redirect("/");
    throw new Error(result.error.message);
  }
  const role = result.data.profile.role as UserRole;
  if (!canAccessRole(role, expectedRole)) {
    redirect(roleToDashboardPath(role));
  }
  return result.data;
}
