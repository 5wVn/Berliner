import type { UserRole } from "@/shared/types/auth";

const ROLE_TO_PATH: Record<UserRole, string> = {
  super_admin: "/choose-dashboard",
  student: "/student",
  teacher: "/teacher",
};

export function roleToDashboardPath(role: UserRole) {
  // super_admin doesn't have its own dashboard — it lands on the role picker.
  if (role === "super_admin") return "/choose-dashboard";
  return `${ROLE_TO_PATH[role]}/dashboard`;
}

/**
 * Whether a user with `role` can view a page gated by `requiredRole`.
 * super_admins have cross-role visibility via the dashboard switcher;
 * everyone else needs an exact role match.
 */
export function canAccessRole(role: UserRole, requiredRole: UserRole): boolean {
  if (role === requiredRole) return true;
  if (role === "super_admin") return true;
  return false;
}
