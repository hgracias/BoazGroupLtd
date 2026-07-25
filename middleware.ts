import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

/**
 * Role-based route protection.
 *   /driver/*  → signed-in drivers only
 *   /admin/*   → signed-in admins only
 * Public visitors are bounced to the matching login page with a callbackUrl.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isLoginRoute = pathname === "/driver/login" || pathname === "/admin/login";

    if (isLoginRoute) {
      // Already signed in? Send them to their own home instead of the form.
      if (token) {
        return NextResponse.redirect(new URL(token.role === "ADMIN" ? "/admin" : "/driver", req.url));
      }
      return NextResponse.next();
    }

    if (!token) {
      const loginPath = pathname.startsWith("/admin") ? "/admin/login" : "/driver/login";
      const loginUrl = new URL(loginPath, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/driver", req.url));
    }

    if (pathname.startsWith("/driver") && token.role !== "DRIVER") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    // The middleware function above owns every redirect decision.
    callbacks: { authorized: () => true },
  }
);

export const config = {
  matcher: ["/driver/:path*", "/admin/:path*"],
};
