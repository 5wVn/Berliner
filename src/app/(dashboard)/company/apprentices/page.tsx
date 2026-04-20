import { redirect } from "next/navigation";
import {
  IconBriefcase as Briefcase,
  IconTrendingUp as TrendingUp,
} from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getCompanyApprenticesAction,
  getCompanyApprenticesAttendanceAction,
} from "@/actions/company";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { ApprenticesList } from "./_components/ApprenticesList";

export default async function CompanyApprenticesPage() {
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
  if (!canAccessRole(role, "company")) {
    redirect(roleToDashboardPath(role));
  }

  const userName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur";

  const [apprenticesResult, attendanceResult] = await Promise.all([
    getCompanyApprenticesAction(),
    getCompanyApprenticesAttendanceAction(),
  ]);

  const apprentices = apprenticesResult.ok ? apprenticesResult.data : [];
  const attendance = attendanceResult.ok
    ? attendanceResult.data
    : { global_rate: 0, apprentices: [] };

  const error = !apprenticesResult.ok
    ? apprenticesResult.error.message
    : !attendanceResult.ok
      ? attendanceResult.error.message
      : null;

  return (
    <DashboardLayout
      role="company"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="indigo"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Mes apprentis</h1>
          <p className="text-muted-foreground">
            Suivi des apprentis rattachés à votre entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Apprentis
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {apprentices.length}
                </p>
              </div>
              <Briefcase className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Présence globale
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {attendance.global_rate}%
                </p>
              </div>
              <TrendingUp className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des apprentis</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : apprentices.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun apprenti rattaché pour le moment.
              </p>
            ) : (
              <ApprenticesList
                apprentices={apprentices}
                attendance={attendance.apprentices}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
