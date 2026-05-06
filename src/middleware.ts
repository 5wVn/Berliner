import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/shared/lib/supabase/middleware";

// Routes that require an authenticated user. Anything not listed here is
// public (login, marketing, static assets, etc.).
const PROTECTED_PREFIXES = [
  "/student",
  "/teacher",
  "/registrar",
  "/academic-head",
  "/company",
  "/choose-dashboard",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const { response, userId } = await updateSession(request);

    const { pathname } = request.nextUrl;

    // Unauthenticated users are bounced to the login page.
    if (isProtectedPath(pathname) && !userId) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/";
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated users hitting the login page get sent to their dashboard.
    // Restrict to GET so we don't accidentally intercept Server Action POSTs
    // (which Next.js routes through the page URL).
    if (pathname === "/" && userId && request.method === "GET") {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/choose-dashboard";
      return NextResponse.redirect(dashboardUrl);
    }

    return response;
  } catch (err) {
    // Last-resort safety net: never let middleware turn into a 500 for the
    // entire site. Log and pass the request through untouched. Protected
    // routes will still be guarded client-side by RequireAuth.
    console.error("[middleware] Unhandled error:", err);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and common static assets.
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*\\.js|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)).*)",
  ],
};
