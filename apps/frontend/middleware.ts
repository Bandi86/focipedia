import { NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCESS } from "@/config/constants";

export function middleware(req: NextRequest) {
  const access = req.cookies.get(COOKIE_ACCESS)?.value;
  const pathname = req.nextUrl.pathname;

  // Public routes that should be accessible without auth
  const publicPaths = ["/", "/login", "/register"];

  if (!access && !publicPaths.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (access && (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals and static assets from middleware for correct landing rendering
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


