"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-foreground">
      <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
      <pre className="max-w-2xl whitespace-pre-wrap rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        {error.message || "Erreur inconnue"}
      </pre>
      {error.digest ? (
        <p className="text-xs text-muted-foreground">digest: {error.digest}</p>
      ) : null}
      <button
        onClick={reset}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Réessayer
      </button>
    </div>
  );
}
