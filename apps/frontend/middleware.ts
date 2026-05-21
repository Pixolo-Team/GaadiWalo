// COMPONENTS //
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = new Set([
  "/login",
  "/reset-password",
  "/verify-otp",
  "/change-password",
]);
const PROTECTED_PREFIXES = ["/leads", "/profile"];

/**
 * Handles auth redirects before rendering pages.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get("access_token")?.value);
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (pathname === "/") {
    const destination = hasAccessToken ? "/leads" : "/login";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (!hasAccessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasAccessToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/leads", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/reset-password",
    "/verify-otp",
    "/change-password",
    "/leads/:path*",
    "/profile/:path*",
  ],
};
