import { redirect } from "next/navigation";
import {
  IconMinus as Minus,
  IconTrendingDown as TrendingDown,
  IconTrendingUp as TrendingUp,
} from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getAcademicHeadAttendanceOverviewAction,
  getAcademicHeadGradeDistributionAction,
} from "@/actions/academicHead";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

export default async function AcademicHeadAnalyticsPage() {
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

  const [attendanceResult, distributionResult] = await Promise.all([
    getAcademicHeadAttendanceOverviewAction(),
    getAcademicHeadGradeDistributionAction(),
  ]);

  const attendance = attendanceResult.ok
    ? attendanceResult.data
    : { rate: 0, trend: "stable" as const, trend_value: 0 };
  const distribution = distributionResult.ok ? distributionResult.data : [];

  const error = !attendanceResult.ok
    ? attendanceResult.error.message
    : !distributionResult.ok
      ? distributionResult.error.message
      : null;

  const TrendIcon =
    attendance.trend === "up"
      ? TrendingUp
      : attendance.trend === "down"
        ? TrendingDown
        : Minus;

  return (
    <DashboardLayout
      role="academic_head"
      userName={userName}
      showDashboardSwitcher
      backgroundVariant="teal"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Analytique</h1>
          <p className="text-muted-foreground">
            Vue d&apos;ensemble de la présence et de la performance académique.
          </p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Taux de présence global</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-foreground">
                {attendance.rate.toFixed(1)}
              </span>
              <span className="text-xl text-muted-foreground">%</span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <TrendIcon className="h-4 w-4" />
              {attendance.trend === "stable"
                ? "Stable par rapport au mois dernier"
                : `${attendance.trend === "up" ? "+" : "-"}${attendance.trend_value.toFixed(1)} pt vs. mois dernier`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Distribution des notes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {distribution.every((b) => b.count === 0) ? (
              <p className="text-sm text-muted-foreground">
                Pas encore assez de notes pour générer une distribution.
              </p>
            ) : (
              distribution.map((bucket) => {
                const width = Math.min(100, Math.max(0, bucket.percentage));
                return (
                  <div key={bucket.range} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">
                        {bucket.range}
                      </span>
                      <span className="text-muted-foreground">
                        {bucket.count} note{bucket.count > 1 ? "s" : ""} · {bucket.percentage}%
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
