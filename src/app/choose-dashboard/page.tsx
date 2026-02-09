"use client";

import { useRouter } from "next/navigation";
import { RequireAuth } from "@/shared/components/auth/RequireAuth";
import { useAuth } from "@/shared/providers/AuthProvider";
import { UserRole } from "@/shared/types/auth";

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
    router.replace(`/${role}/dashboard`);
  };

  return (
    <RequireAuth adminOnly>
      <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Choisir un dashboard
              </h1>
              <p className="text-slate-500">
                Selectionnez la vue a ouvrir pour cette session.
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
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
                      ? "border-indigo-500 bg-indigo-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-lg font-semibold text-slate-900">
                    {option.label}
                  </div>
                  <div className="text-sm text-slate-500">
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
