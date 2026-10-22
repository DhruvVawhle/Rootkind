import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "rootkind_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "rootkind_default_secret_key_change_in_prod_2026_xyz"
);

// Protected routes requiring authentication
const PROTECTED_PREFIXES = ["/checkout", "/account", "/admin"];

// Auth pages (redirect to account/admin if already logged in)
const AUTH_PAGES = ["/account/login", "/account/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  let sessionUser: { userId: string; role: string } | null = null;
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, SECRET_KEY);
      if (payload?.userId) {
        sessionUser = payload as unknown as { userId: string; role: string };
      }
    } catch {
      sessionUser = null;
    }
  }

  // 1. Check if user is navigating to protected route while unauthenticated
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    // If not authenticated, redirect to login with callbackUrl
    if (!sessionUser) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role check for admin
    if (pathname.startsWith("/admin") && sessionUser.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // 2. If authenticated user visits login or register, redirect them back
  if (sessionUser && AUTH_PAGES.includes(pathname)) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    const dest = sessionUser.role === "ADMIN" ? "/admin" : "/account";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled per endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, and static public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
