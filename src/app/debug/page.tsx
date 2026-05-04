export const dynamic = "force-dynamic";

export default function DebugPage() {
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_URL_length:
      process.env.NEXT_PUBLIC_SUPABASE_URL?.length ?? 0,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY_length:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0,
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_SERVICE_ROLE_KEY_length:
      process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
  };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "monospace",
        background: "#0E0E10",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Debug</h1>
      <pre
        style={{
          background: "#1a1a1d",
          padding: "1rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(envStatus, null, 2)}
      </pre>
    </main>
  );
}
