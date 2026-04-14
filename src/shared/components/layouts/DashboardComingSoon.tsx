import { redirect } from "next/navigation";
import { DashboardLayout, type DashboardBackground } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

interface DashboardComingSoonProps {
  requiredRole: UserRole;
  title: string;
  description: string;
  backgroundVariant?: DashboardBackground;
}

/**
 * Shared placeholder shell for unfinished subpages. Renders the
 * "Section en preparation" card inside the role-specific DashboardLayout.
 *
 * Server Component: it performs its own auth + role gate so the 13 caller
 * pages stay as one-line files. Academic heads can view any role's
 * placeholder via the dashboard switcher; everyone else is redirected to
 * their own dashboard if the role doesn't match.
 */
export async function DashboardComingSoon({
  requiredRole,
  title,
  description,
  backgroundVariant = "slate",
}: DashboardComingSoonProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) redirect("/");

  const role = profile.role as UserRole;
  if (!canAccessRole(role, requiredRole)) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur";

  return (
    <DashboardLayout
      role={requiredRole}
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant={backgroundVariant}
    >
      <div className="space-y-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{description}</p>
        </div>

        <Card className="border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <CardContent className="p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
              Bientot
            </div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Section en preparation
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Nous finalisons cette partie du portail. Revenez bientot pour les
              prochaines fonctionnalites.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
