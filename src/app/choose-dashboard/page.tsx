"use client";

import { useRouter } from "next/navigation";
import { RequireAuth } from "@/shared/components/auth/RequireAuth";
import { useAuth } from "@/shared/providers/AuthProvider";
import { UserRole } from "@/shared/types/auth";
import { roleToDashboardPath } from "@/shared/lib/roles";

const ROLE_OPTIONS: Array<{
  role: UserRole;
  label: string;
  description: string;
}> = [
  { role: "student", label: "Etudiant", description: "Vue etudiant" },
  { role: "teacher", label: "Professeur", description: "Vue enseignant" },
];

export default function ChooseDashboardPage() {
  const router = useRouter();
  const { selectedRole, setSelectedRole, signOut } = useAuth();

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
    router.replace(roleToDashboardPath(role));
  };

  return (
    <RequireAuth requireDashboardSwitcher>
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Choisir un dashboard
              </h1>
              <p className="text-muted-foreground">
                Selectionnez la vue a ouvrir pour cette session.
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Se deconnecter
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const isActive = selectedRole === option.role;
              return (
                <button
                  key={option.role}
                  onClick={() => handleSelect(option.role)}
                  className={`rounded-2xl border-2 p-5 text-left transition-all ${
                    isActive
                      ? "border-primary bg-primary/15"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="text-lg font-semibold text-foreground">
                    {option.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
