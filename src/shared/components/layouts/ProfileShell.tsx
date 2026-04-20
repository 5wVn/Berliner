import { redirect } from "next/navigation";
import {
  IconAt as AtSign,
  IconBuilding as Building2,
  IconMail as Mail,
  IconShieldCheck as ShieldCheck,
  IconUserCircle as UserCircle2,
} from "@tabler/icons-react";
import { DashboardLayout, type DashboardBackground } from "@/shared/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { LogoutButton } from "@/shared/components/auth/LogoutButton";
import { createClient } from "@/shared/lib/supabase/server";
import { canAccessRole, roleToDashboardPath } from "@/shared/lib/roles";
import type { UserRole } from "@/shared/types/auth";

interface ProfileShellProps {
  requiredRole: UserRole;
  backgroundVariant?: DashboardBackground;
}

const ROLE_LABEL: Record<UserRole, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  registrar: "Scolarité",
  academic_head: "Responsable pédagogique",
  company: "Entreprise",
  super_admin: "Super administrateur",
};

const getInitials = (firstName: string | null, lastName: string | null) => {
  const a = firstName?.trim().charAt(0).toUpperCase() ?? "";
  const b = lastName?.trim().charAt(0).toUpperCase() ?? "";
  return `${a}${b}` || "U";
};

export async function ProfileShell({ requiredRole, backgroundVariant = "slate" }: ProfileShellProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, establishment_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) redirect("/");

  const role = profile.role as UserRole;
  if (!canAccessRole(role, requiredRole)) {
    redirect(roleToDashboardPath(role));
  }

  const fullName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Utilisateur";
  const initials = getInitials(profile.first_name, profile.last_name);

  let establishmentName: string | null = null;
  if (profile.establishment_id) {
    const { data: establishment } = await supabase
      .from("establishments")
      .select("name")
      .eq("id", profile.establishment_id)
      .maybeSingle();
    establishmentName = establishment?.name ?? null;
  }

  return (
    <DashboardLayout
      role={requiredRole}
      userName={fullName}
      showDashboardSwitcher={role === "academic_head" || role === "super_admin"}
      backgroundVariant={backgroundVariant}
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
          <p className="text-muted-foreground">
            Informations personnelles et gestion de session.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-2xl font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start">
              <h2 className="break-words text-center text-xl font-bold text-foreground sm:text-left">
                {fullName}
              </h2>
              <Badge variant="secondary">{ROLE_LABEL[role]}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-primary" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="break-words text-base text-foreground">{user.email ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rôle
                </p>
                <p className="break-words text-base text-foreground">{ROLE_LABEL[role]}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Établissement
                </p>
                <p className="break-words text-base text-foreground">
                  {establishmentName ?? "Non renseigné"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AtSign className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Identifiant
                </p>
                <p className="break-all font-mono text-sm text-muted-foreground">
                  {user.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Déconnectez-vous pour terminer votre session sur cet appareil.
            </p>
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
