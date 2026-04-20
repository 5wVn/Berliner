import { redirect } from "next/navigation";
import { IconUsersGroup as Users } from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import { getRegistrarStudentsAction } from "@/actions/registrar";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { StudentsList } from "./_components/StudentsList";

export default async function RegistrarStudentsPage() {
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
  if (!canAccessRole(role, "registrar")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur";

  const result = await getRegistrarStudentsAction();
  const students = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  const activeCount = students.filter((s) => s.enrollmentStatus === "active").length;
  const pendingCount = students.filter((s) => s.enrollmentStatus === "pending").length;

  return (
    <DashboardLayout
      role="registrar"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="teal"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Étudiants</h1>
          <p className="text-muted-foreground">
            Annuaire, recherche et suivi des inscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {students.length}
                </p>
              </div>
              <Users className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actifs
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {activeCount}
                </p>
              </div>
              <Users className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  En attente
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {pendingCount}
                </p>
              </div>
              <Users className="h-7 w-7 text-warning" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des étudiants</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : students.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun étudiant enregistré dans votre établissement.
              </p>
            ) : (
              <StudentsList students={students} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
