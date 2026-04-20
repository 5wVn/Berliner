import { redirect } from "next/navigation";
import { IconFileText as FileText } from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import { getCompanyDocumentsAction } from "@/actions/company";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { DocumentsList } from "./_components/DocumentsList";

export default async function CompanyDocumentsPage() {
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

  const result = await getCompanyDocumentsAction();
  const documents = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  return (
    <DashboardLayout
      role="company"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="indigo"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">
            Conventions, attestations et pièces liées à vos apprentis.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Documents disponibles
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {documents.length}
              </p>
            </div>
            <FileText className="h-7 w-7 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tous les documents</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : documents.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Aucun document disponible pour le moment.
                </p>
                <p className="text-xs text-muted-foreground">
                  Les documents s&apos;afficheront ici une fois le lien
                  entreprise-apprenti activé et le bucket
                  <span className="font-mono"> documents </span>
                  configuré.
                </p>
              </div>
            ) : (
              <DocumentsList documents={documents} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
