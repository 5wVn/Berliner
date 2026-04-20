"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/providers/AuthProvider";
import { UserRole } from "@/shared/types/auth";
import { roleToDashboardPath } from "@/shared/lib/roles";

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  /**
   * When true, the route is only accessible to users with the dashboard
   * switcher capability (currently academic_head). Other users get bounced
   * back to their own role's dashboard.
   */
  requireDashboardSwitcher?: boolean;
}

export function RequireAuth({
  children,
  requiredRole,
  requireDashboardSwitcher = false,
}: RequireAuthProps) {
  const router = useRouter();
  const {
    loading,
    session,
    profile,
    authError,
    canSwitchDashboard,
    selectedRole,
    setSelectedRole,
  } = useAuth();

  const isReady = useMemo(() => {
    if (loading) return false;
    if (!session || !profile) return false;
    if (requireDashboardSwitcher && !canSwitchDashboard) return false;
    if (
      !requireDashboardSwitcher &&
      requiredRole &&
      !canSwitchDashboard &&
      profile.role !== requiredRole
    )
      return false;
    if (canSwitchDashboard && !selectedRole && !requireDashboardSwitcher)
      return false;
    return true;
  }, [
    requireDashboardSwitcher,
    canSwitchDashboard,
    loading,
    profile,
    requiredRole,
    selectedRole,
    session,
  ]);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.replace("/");
      return;
    }

    if (!profile) return;

    if (requireDashboardSwitcher && !canSwitchDashboard) {
      router.replace(roleToDashboardPath(profile.role));
      return;
    }

    if (canSwitchDashboard) {
      if (!selectedRole) {
        if (!requireDashboardSwitcher) {
          router.replace("/choose-dashboard");
        }
        return;
      }
      if (requiredRole && selectedRole !== requiredRole) {
        setSelectedRole(requiredRole);
      }
      return;
    }

    if (requiredRole && profile.role !== requiredRole) {
      router.replace(roleToDashboardPath(profile.role));
    }
  }, [
    requireDashboardSwitcher,
    canSwitchDashboard,
    loading,
    profile,
    requiredRole,
    router,
    selectedRole,
    session,
    setSelectedRole,
  ]);

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Erreur d&apos;authentification: {authError}
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return <>{children}</>;
}
