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
  { role: "registrar", label: "Scolarite", description: "Vue scolarite" },
  {
    role: "academic_head",
    label: "Direction",
    description: "Vue direction pedagogique",
  },
  { role: "company", label: "Entreprise", description: "Vue entreprise" },
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
      <main className="min-h-screen flex items-center justify-center p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Choisir un dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Selectionnez la vue a ouvrir pour cette session.
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    isActive
                      ? "border-indigo-300 bg-indigo-50 shadow-sm dark:border-indigo-500/60 dark:bg-indigo-500/15"
                      : "border-slate-200 bg-white/70 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {option.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
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
