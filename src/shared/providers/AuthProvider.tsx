"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/shared/lib/supabase/client";
import { UserRole } from "@/shared/types/auth";

type Profile = {
  id: string;
  establishment_id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone: string | null;
};

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  authError: string | null;
  canSwitchDashboard: boolean;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SELECTED_ROLE_KEY = "berliner:selected-role";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    setAuthError(null);
    const { data, error } = await getSupabaseClient()
      .from("profiles")
      .select(
        "id, establishment_id, email, role, first_name, last_name, phone"
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setAuthError(error.message);
      setProfile(null);
      return;
    }

    setProfile(data ?? null);
  }, []);

  const refreshProfile = useCallback(async () => {
    // Re-read the session from Supabase first so that newly-set cookies
    // (e.g. from a Server Action login) are picked up before fetching the
    // profile. Without this, refreshProfile would short-circuit whenever
    // the in-memory session is still null.
    const { data } = await getSupabaseClient().auth.getSession();
    const nextSession = data.session ?? null;
    setSession(nextSession);

    if (!nextSession?.user?.id) {
      setProfile(null);
      return;
    }

    await fetchProfile(nextSession.user.id);
  }, [fetchProfile]);

  const setSelectedRole = useCallback((role: UserRole | null) => {
    setSelectedRoleState(role);
    if (typeof window === "undefined") return;
    if (role) {
      window.localStorage.setItem(SELECTED_ROLE_KEY, role);
    } else {
      window.localStorage.removeItem(SELECTED_ROLE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(SELECTED_ROLE_KEY) as UserRole | null;
    if (stored) {
      setSelectedRoleState(stored);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      supabase = getSupabaseClient();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Supabase init failed");
      setLoading(false);
      return;
    }

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setSession(data.session ?? null);
        if (data.session?.user?.id) {
          await fetchProfile(data.session.user.id);
        } else {
          setProfile(null);
          setAuthError(null);
        }
      } catch (err) {
        if (!active) return;
        // Aborted fetches are expected on unmount/navigation — don't surface.
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAuthError(err instanceof Error ? err.message : "Session load failed");
        setProfile(null);
      } finally {
        // Always release the loading state. The component being unmounted
        // mid-flight is fine — React tolerates state updates on unmounted
        // components, but leaving `loading` stuck at true blocks RequireAuth
        // forever if cleanup raced ahead of the async resolution.
        setLoading(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        try {
          setSession(nextSession);
          if (nextSession?.user?.id) {
            await fetchProfile(nextSession.user.id);
          } else {
            setProfile(null);
            setSelectedRole(null);
            setAuthError(null);
          }
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setAuthError(
            err instanceof Error ? err.message : "Auth state change failed"
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile, setSelectedRole]);

  useEffect(() => {
    if (!profile) return;
    if (profile.role !== "academic_head" && profile.role !== "super_admin") {
      setSelectedRole(null);
    }
  }, [profile, setSelectedRole]);

  const signOut = useCallback(async () => {
    setSelectedRole(null);
    await getSupabaseClient().auth.signOut();
  }, [setSelectedRole]);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      profile,
      authError,
      canSwitchDashboard:
        profile?.role === "academic_head" || profile?.role === "super_admin",
      selectedRole,
      setSelectedRole,
      refreshProfile,
      signOut,
    }),
    [
      loading,
      session,
      profile,
      authError,
      selectedRole,
      setSelectedRole,
      refreshProfile,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
