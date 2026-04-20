import { redirect } from "next/navigation";
import { IconUsersGroup as Users } from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import { getTeacherClassesAction } from "@/actions/teacher";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { ClassesList } from "./_components/ClassesList";

export default async function TeacherClassesPage() {
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
  if (!canAccessRole(role, "teacher")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur";

  const result = await getTeacherClassesAction();
  const classes = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  const totalStudents = classes.reduce((sum, c) => sum + c.student_count, 0);

  return (
    <DashboardLayout
      role="teacher"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="rose"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Mes classes</h1>
          <p className="text-muted-foreground">
            Vos groupes, leurs effectifs et prochaines sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Classes
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {classes.length}
                </p>
              </div>
              <Users className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Étudiants suivis
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {totalStudents}
                </p>
              </div>
              <Users className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des classes</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Vous n&apos;êtes assigné à aucune classe pour le moment.
              </p>
            ) : (
              <ClassesList classes={classes} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
