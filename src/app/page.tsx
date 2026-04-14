"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { roleToDashboardPath } from "@/shared/lib/roles";
import { useAuth } from "@/shared/providers/AuthProvider";

export default function Home() {
  const router = useRouter();
  const { session, profile, loading, canSwitchDashboard, selectedRole, refreshProfile } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session || !profile) return;

    if (canSwitchDashboard) {
      if (selectedRole) {
        router.replace(roleToDashboardPath(selectedRole));
      } else {
        router.replace("/choose-dashboard");
      }
      return;
    }

    router.replace(roleToDashboardPath(profile.role));
  }, [canSwitchDashboard, loading, profile, router, selectedRole, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await loginAction({ email, password });

    if (!result.ok) {
      setError(result.error.message);
      setSubmitting(false);
      return;
    }

    // Server cookies are now set; sync the browser AuthProvider so the
    // redirect effect above sees the new session without a full reload.
    await refreshProfile();

    if (result.data.role === "academic_head") {
      router.replace("/choose-dashboard");
    } else {
      router.replace(roleToDashboardPath(result.data.role));
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient handled by global CSS, removed specific overlay */}

      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-glow-indigo-soft dark:shadow-glow-indigo mb-6">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-50">
            Berliner
          </h1>
          <p className="text-slate-600 text-lg dark:text-slate-400">
            Votre portail etudiant, simplifie.
          </p>
        </div>

        <div className="card-corners p-6 rounded-2xl space-y-6 dark:bg-slate-900/60">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 ml-1 dark:text-slate-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="etudiant@ecole.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/50 dark:focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 ml-1 dark:text-slate-300"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/50 dark:focus:border-indigo-500"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl shadow-glow-indigo-soft dark:shadow-glow-indigo active:scale-[0.98] transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm">
          ? 2026 Berliner Campus
        </p>
      </div>
    </main>
  );
}
