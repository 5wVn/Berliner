import { redirect } from "next/navigation";
import { IconFileTime as FileClock } from "@tabler/icons-react";
import { DashboardLayout } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { createClient } from "@/shared/lib/supabase/server";
import { getRegistrarDocumentRequestsAction } from "@/actions/registrar";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";
import { DocumentsList } from "./_components/DocumentsList";

export default async function RegistrarDocumentsPage() {
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

  const result = await getRegistrarDocumentRequestsAction();
  const requests = result.ok ? result.data : [];
  const error = result.ok ? null : result.error.message;

  return (
    <DashboardLayout
      role="registrar"
      userName={userName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant="amber"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Demandes de documents</h1>
          <p className="text-muted-foreground">
            Certificats, relevés et attestations à traiter.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Demandes en attente
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {requests.length}
              </p>
            </div>
            <FileClock className="h-7 w-7 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>File de traitement</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : requests.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Aucune demande de document pour le moment.
                </p>
                <p className="text-xs text-muted-foreground">
                  Le workflow de demandes sera activé une fois la table
                  <span className="font-mono"> document_requests </span>
                  ajoutée au schéma.
                </p>
              </div>
            ) : (
              <DocumentsList requests={requests} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
