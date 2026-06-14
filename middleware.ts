import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPrefixes = ["/member", "/admin"];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.includes(prefix)
  );

  if (isProtected) {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      const locale = pathname.split("/")[1] || routing.defaultLocale;
      return NextResponse.redirect(
        new URL(`/${locale}/member/login`, request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
