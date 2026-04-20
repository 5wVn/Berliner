import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IconCalendar as Calendar,
  IconChevronLeft as ChevronLeft,
  IconSchool as GraduationCap,
  IconTrophy as Trophy,
} from "@tabler/icons-react";

import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { createClient } from "@/shared/lib/supabase/server";
import { getStudentSubjectsWithGradesAction } from "@/actions/student";
import { calculateWeightedAverage } from "@/shared/lib/student/calculations";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

const getGradeBadgeVariant = (value: number, max: number) => {
  const normalized = (value / max) * 20;
  if (normalized >= 16) return "success" as const;
  if (normalized >= 14) return "info" as const;
  if (normalized >= 10) return "warning" as const;
  return "destructive" as const;
};

interface SubjectGradesPageProps {
  params: Promise<{ subjectId: string }>;
}

export default async function SubjectGradesPage({ params }: SubjectGradesPageProps) {
  const { subjectId } = await params;

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

  const result = await getStudentSubjectsWithGradesAction();
  const error = result.ok ? null : result.error.message;
  const subject = result.ok
    ? result.data.find((item) => item.id === subjectId) ?? null
    : null;

  const average = subject ? calculateWeightedAverage(subject.grades) : null;
  const sortedGrades = subject
    ? [...subject.grades].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="violet"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-4">
          <Link href="/student/grades" className="w-fit">
            <Button
              variant="ghost"
              className="gap-2 pl-0 text-muted-foreground hover:bg-transparent hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
              Retour aux notes
            </Button>
          </Link>

          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              {subject?.name ?? "Matière"}
            </h1>
            <p className="break-words text-muted-foreground">
              Enseignant : {subject?.teacher ?? "Enseignant"}
            </p>
          </div>
        </div>

        {error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : !subject ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Matière introuvable.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="relative overflow-hidden border-b-4 border-primary-shadow bg-primary text-primary-foreground">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Trophy className="h-24 w-24 rotate-12 transform sm:h-32 sm:w-32" />
              </div>
              <CardHeader className="relative z-10 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                  Moyenne matière
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold sm:text-5xl">
                    {average !== null ? average.toFixed(2) : "--"}
                  </span>
                  <span className="text-xl opacity-80">/ 20</span>
                </div>
                <p className="mt-2 text-sm opacity-80">
                  Sur {subject.grades.length} évaluation{subject.grades.length > 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Historique des évaluations
              </h2>

              {sortedGrades.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Aucune note disponible pour cette matière.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {sortedGrades.map((grade) => (
                    <Card key={grade.id}>
                      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="break-words font-medium text-foreground">
                              {grade.label}
                            </span>
                            <span className="shrink-0 rounded-sm border-2 border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                              Coeff. {grade.coefficient}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span className="capitalize">
                              {format(new Date(grade.date), "dd MMMM yyyy", { locale: fr })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end">
                          <Badge
                            variant={getGradeBadgeVariant(grade.value, grade.max)}
                            className="w-fit px-2.5 py-1 text-sm"
                          >
                            {grade.value}
                            <span className="ml-0.5 text-[0.7em] opacity-80">/ {grade.max}</span>
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
