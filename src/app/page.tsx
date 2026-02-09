"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabaseClient";
import { useAuth } from "@/shared/providers/AuthProvider";

export default function Home() {
  const router = useRouter();
  const { session, profile, loading, isAdmin, selectedRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session || !profile) return;

    if (isAdmin) {
      if (selectedRole) {
        router.replace(`/${selectedRole}/dashboard`);
      } else {
        router.replace("/choose-dashboard");
      }
      return;
    }

    router.replace(`/${profile.role}/dashboard`);
  }, [isAdmin, loading, profile, router, selectedRole, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.session) {
      setError(signInError?.message ?? "Identifiants invalides.");
      setSubmitting(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.session.user.id)
      .maybeSingle();

    if (profileError || !profileData) {
      setError(
        profileError?.message ??
          "Profil introuvable. Contactez un administrateur."
      );
      setSubmitting(false);
      return;
    }

    if (profileData.role === "academic_head") {
      router.replace("/choose-dashboard");
    } else {
      router.replace(`/${profileData.role}/dashboard`);
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-primary-50 to-transparent -z-10" />

      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary-600/20 mb-6">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Berliner
          </h1>
          <p className="text-slate-500 text-lg">
            Votre portail etudiant, simplifie.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 ml-1"
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
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 ml-1"
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
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm">
          ? 2026 Berliner Campus
        </p>
      </div>
    </main>
  );
}
