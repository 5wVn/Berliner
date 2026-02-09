"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/providers/AuthProvider";
import { UserRole } from "@/shared/types/auth";

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  adminOnly?: boolean;
}

export function RequireAuth({
  children,
  requiredRole,
  adminOnly = false,
}: RequireAuthProps) {
  const router = useRouter();
  const {
    loading,
    session,
    profile,
    authError,
    isAdmin,
    selectedRole,
    setSelectedRole,
  } = useAuth();

  const isReady = useMemo(() => {
    if (loading) return false;
    if (!session || !profile) return false;
    if (adminOnly && !isAdmin) return false;
    if (!adminOnly && requiredRole && !isAdmin && profile.role !== requiredRole)
      return false;
    if (isAdmin && !selectedRole && !adminOnly) return false;
    return true;
  }, [adminOnly, isAdmin, loading, profile, requiredRole, selectedRole, session]);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.replace("/");
      return;
    }

    if (!profile) return;

    if (adminOnly && !isAdmin) {
      router.replace(`/${profile.role}/dashboard`);
      return;
    }

    if (isAdmin) {
      if (!selectedRole) {
        if (!adminOnly) {
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
      router.replace(`/${profile.role}/dashboard`);
    }
  }, [
    adminOnly,
    isAdmin,
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
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Erreur d'authentification: {authError}
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Chargement...
      </div>
    );
  }

  return <>{children}</>;
}
