import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/",
  "/search",
  "/library",
  "/pulse",
  "/music-dna",
  "/tapes",
  "/memories",
  "/ai",
  "/together",
  "/settings",
];

function isProtectedPath(pathname: string) {
  if (pathname === "/") return true;

  return protectedPrefixes.some(
    (prefix) =>
      prefix !== "/" &&
      (pathname === prefix ||
        pathname.startsWith(`${prefix}/`)),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Day 5:
  // Authentication is not implemented yet.
  // This is only the protection boundary.
  //
  // Day 9/10 will replace this with the
  // real session verification logic.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};