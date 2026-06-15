import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isMemberLogin = pathname.includes("/member/login");
  const isProtected =
    (pathname.includes("/member") && !isMemberLogin) || pathname.includes("/admin");

  if (isProtected && !data.user) {
    const locale = pathname.split("/")[1] || routing.defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}/member/login`, request.url)
    );
  }

  if (pathname.includes("/admin")) {
    const role = data.user?.user_metadata?.role;
    if (role !== "admin") {
      const locale = pathname.split("/")[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/member`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
