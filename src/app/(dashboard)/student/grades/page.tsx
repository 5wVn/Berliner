import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, GraduationCap } from "lucide-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { createClient } from "@/shared/lib/supabase/server";
import { getStudentGradesAction } from "@/actions/student";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function StudentGradesPage() {
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
  if (!canAccessRole(role, "student")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur";

  const result = await getStudentGradesAction();
  const summary = result.ok ? result.data : null;
  const error = result.ok ? null : result.error.message;

  const subjects = summary?.subjects ?? [];
  const globalAverage = summary?.globalAverage ?? null;

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="violet"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Mes notes</h1>
          <p className="text-muted-foreground">
            Suivi de vos résultats et moyennes par matière.
          </p>
        </div>

        <Card className="border-b-4 border-primary-shadow bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
              Moyenne générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold sm:text-5xl">
                {globalAverage !== null ? globalAverage.toFixed(2) : "--"}
              </span>
              <span className="text-lg opacity-80">/ 20</span>
            </div>
            <p className="mt-2 text-sm opacity-80">
              Calculé sur {subjects.length} matière{subjects.length > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        {error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : subjects.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Aucune note disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const isPassing = subject.average !== null && subject.average >= 10;

              return (
                <Link key={subject.id} href={`/student/grades/${subject.id}`}>
                  <Card className="h-full cursor-pointer transition-colors hover:bg-muted">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex flex-col gap-1">
                        <h3 className="break-words font-semibold text-foreground">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {subject.teacher ?? "Enseignant"}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {subject.count} note{subject.count > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <Badge variant={isPassing ? "default" : "destructive"} className="shrink-0">
                          {subject.average !== null ? subject.average.toFixed(2) : "--"}
                        </Badge>
                        <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
