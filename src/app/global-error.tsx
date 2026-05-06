"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          background: "#0E0E10",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Une erreur est survenue
        </h1>
        <pre
          style={{
            maxWidth: "42rem",
            whiteSpace: "pre-wrap",
            border: "1px solid #333",
            borderRadius: "0.75rem",
            padding: "1rem",
            fontSize: "0.875rem",
            color: "#aaa",
          }}
        >
          {error.message || "Erreur inconnue"}
        </pre>
        {error.digest ? (
          <p style={{ fontSize: "0.75rem", color: "#888" }}>
            digest: {error.digest}
          </p>
        ) : null}
        <button
          onClick={reset}
          style={{
            borderRadius: "0.75rem",
            background: "#dc2626",
            color: "#fff",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
