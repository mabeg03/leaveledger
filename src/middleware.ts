import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Role } from "@prisma/client";

const protectedPrefixes = [
  "/dashboard",
  "/requests",
  "/approvals",
  "/calendar",
  "/team",
  "/settings",
];

function usesSecureCookies(request: NextRequest) {
  if (process.env.NODE_ENV === "production") return true;
  return (
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret:
      process.env.AUTH_SECRET ??
      process.env.NEXTAUTH_SECRET,
    secureCookie: usesSecureCookies(request),
  });

  if (!token?.sub) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as Role | undefined;

  if (
    pathname.startsWith("/approvals") &&
    role &&
    !["ADMIN", "MANAGER"].includes(role)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/team") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/requests",
    "/requests/:path*",
    "/approvals",
    "/approvals/:path*",
    "/calendar",
    "/calendar/:path*",
    "/team",
    "/team/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
