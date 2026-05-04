import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the user's Supabase session on every request and returns the
 * resulting `NextResponse` so cookies are written back to the browser.
 *
 * The caller is responsible for any redirects on top of the returned
 * response — see `src/middleware.ts`.
 *
 * If Supabase env vars are missing or the auth call fails, returns a
 * pass-through response with `userId: null` so the rest of the app can
 * treat the request as unauthenticated rather than 500-ing the route.
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  userId: string | null;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const passthrough = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
    return { response: passthrough, userId: null };
  }

  let response = passthrough;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // Calling getUser() forces a session refresh and revalidates the JWT.
    // Do not remove — without it, the auth cookie can become stale.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { response, userId: user?.id ?? null };
  } catch (err) {
    console.error("[middleware] Supabase session refresh failed:", err);
    return { response: passthrough, userId: null };
  }
}
