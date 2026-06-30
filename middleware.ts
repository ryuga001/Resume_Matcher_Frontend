import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/resumes", "/analyze", "/learn", "/history", "/settings"];

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();

  const hasSession =
    req.cookies.get("rm_access_token")?.value ||
    req.cookies.get("rm_refresh_token")?.value;

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
