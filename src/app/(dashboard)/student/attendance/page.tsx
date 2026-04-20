import { redirect } from "next/navigation";
import {
  IconCircleCheck as CheckCircle2,
  IconTrendingUp as TrendingUp,
  IconCircleX as XCircle,
} from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getStudentAttendanceAction,
  getStudentAttendanceRecordsAction,
} from "@/actions/student";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { AttendanceList } from "./_components/AttendanceList";

export default async function StudentAttendancePage() {
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

  const [summaryResult, recordsResult] = await Promise.all([
    getStudentAttendanceAction(),
    getStudentAttendanceRecordsAction(),
  ]);

  const summary = summaryResult.ok ? summaryResult.data : { total: 0, present: 0, rate: 0 };
  const records = recordsResult.ok ? recordsResult.data : [];
  const error = !summaryResult.ok
    ? summaryResult.error.message
    : !recordsResult.ok
      ? recordsResult.error.message
      : null;

  const absences = summary.total - summary.present;

  return (
    <DashboardLayout
      role="student"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="teal"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Mon assiduité</h1>
          <p className="text-muted-foreground">
            Historique de vos présences, retards et absences.
          </p>
        </div>

        <Card className="border-b-4 border-primary-shadow bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
              Taux de présence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{summary.rate}</span>
              <span className="text-lg opacity-80">%</span>
            </div>
            <p className="mt-2 text-sm opacity-80">
              Sur {summary.total} séance{summary.total > 1 ? "s" : ""} enregistrée
              {summary.total > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Présences
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {summary.present}
                </p>
              </div>
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Absences
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {absences}
                </p>
              </div>
              <XCircle className="h-7 w-7 text-destructive" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Historique détaillé</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune séance enregistrée pour le moment.
              </p>
            ) : (
              <AttendanceList records={records} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
