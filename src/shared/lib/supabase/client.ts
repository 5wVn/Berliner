import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const globalForSupabase = globalThis as unknown as {
  supabase?: SupabaseClient;
};

export function createClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

export const supabase: SupabaseClient =
  globalForSupabase.supabase ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase;
}
