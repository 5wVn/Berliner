import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Placeholder middleware. Auth and tenant isolation will be added in Phase 4.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
