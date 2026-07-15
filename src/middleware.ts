import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Routes that never require auth even on the admin domain.
 * Auth pages must stay accessible or nobody can log in.
 */
const ADMIN_PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;

  // Admin domain: admin-longevo.vercel.app OR admin.longevo.life
  const isAdminDomain =
    hostname.includes("admin-longevo") || hostname.startsWith("admin.");
  const isMainDomain = !isAdminDomain;

  // ── MAIN DOMAIN ────────────────────────────────────────────────
  if (isMainDomain && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (
    isMainDomain &&
    (pathname === "/auth/login" || pathname === "/auth/signup")
  ) {
    return NextResponse.redirect(new URL("/beta", request.url));
  }

  // ── ADMIN DOMAIN ───────────────────────────────────────────────
  if (isAdminDomain) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Block public pages (only /admin, /auth, static allowed)
    if (
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/auth") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/favicon") &&
      !pathname.startsWith("/api")
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Always refresh session + get current user
  const { response, user } = await updateSession(request);

  // ── ADMIN AUTH GATE (server-side) ──────────────────────────────
  if (isAdminDomain && pathname.startsWith("/admin")) {
    const adminEmail = process.env.ADMIN_EMAIL;

    // Fail closed: if ADMIN_EMAIL env not set, no one gets in
    if (!adminEmail) {
      console.warn(
        "[middleware] ADMIN_EMAIL env var is missing — admin panel locked."
      );
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "admin_unconfigured");
      return NextResponse.redirect(loginUrl);
    }

    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.email !== adminEmail) {
      // Logged in but not the admin — block
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "not_admin");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
