import type { UserRole } from "@/shared/types/auth";

const ROLE_TO_PATH: Record<UserRole, string> = {
  super_admin: "/choose-dashboard",
  student: "/student",
  teacher: "/teacher",
  registrar: "/registrar",
  academic_head: "/academic-head",
  company: "/company",
};

export function roleToPath(role: UserRole) {
  return ROLE_TO_PATH[role];
}

export function roleToDashboardPath(role: UserRole) {
  // super_admin doesn't have its own dashboard — it lands on the role
  // picker, same as academic_head with no selection.
  if (role === "super_admin") return "/choose-dashboard";
  return `${ROLE_TO_PATH[role]}/dashboard`;
}

/**
 * Whether a user with `role` can view a page gated by `requiredRole`.
 * Academic heads and super_admins have cross-role visibility via the
 * dashboard switcher; everyone else needs an exact role match.
 */
export function canAccessRole(role: UserRole, requiredRole: UserRole): boolean {
  if (role === requiredRole) return true;
  if (role === "academic_head" || role === "super_admin") return true;
  return false;
}
