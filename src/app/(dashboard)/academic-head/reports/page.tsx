import { redirect } from "next/navigation";
import {
  IconDownload as Download,
  IconSchool as GraduationCap,
  IconUsersGroup as Users,
} from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Button } from "@/shared/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import { getAcademicHeadProgramsSummaryAction } from "@/actions/academicHead";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function AcademicHeadReportsPage() {
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
  if (!canAccessRole(role, "academic_head")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur";

  const result = await getAcademicHeadProgramsSummaryAction();
  const programs = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  const totalStudents = programs.reduce((sum, p) => sum + p.students, 0);
  const totalClasses = programs.reduce((sum, p) => sum + p.classes, 0);

  return (
    <DashboardLayout
      role="academic_head"
      userName={userName}
      showDashboardSwitcher
      backgroundVariant="violet"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Rapports</h1>
          <p className="text-muted-foreground">
            Synthèse par programme pour les bilans pédagogiques.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Programmes
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {programs.length}
                </p>
              </div>
              <GraduationCap className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Classes
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {totalClasses}
                </p>
              </div>
              <GraduationCap className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Étudiants inscrits
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
          <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Détail par programme</CardTitle>
            <Button size="sm" variant="outline" disabled className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : programs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun programme actif pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {programs.map((p) => (
                  <Card key={p.id} className="border-2">
                    <CardContent className="flex flex-col gap-2 p-5">
                      <h3 className="text-lg font-bold text-foreground">
                        {p.name}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{p.classes} classe{p.classes > 1 ? "s" : ""}</span>
                        <span>{p.students} étudiant{p.students > 1 ? "s" : ""}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
