"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { roleToDashboardPath } from "@/shared/lib/roles";
import { useAuth } from "@/shared/providers/AuthProvider";
import { Button } from "@/shared/components/ui/Button";

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

    await refreshProfile();

    if (result.data.role === "academic_head") {
      router.replace("/choose-dashboard");
    } else {
      router.replace(roleToDashboardPath(result.data.role));
    }

    setSubmitting(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-b-4 border-primary-shadow bg-primary">
            <span className="text-3xl font-bold text-primary-foreground">B</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Berliner
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre portail etudiant, simplifie.
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border-2 border-border bg-card p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="ml-1 block text-sm font-medium text-foreground"
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
                className="w-full rounded-xl border-2 border-border bg-surface-2 px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="ml-1 block text-sm font-medium text-foreground"
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
                className="w-full rounded-xl border-2 border-border bg-surface-2 px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          © 2026 Berliner Campus
        </p>
      </div>
    </main>
  );
}
