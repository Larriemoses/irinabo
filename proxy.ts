import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAuthConfig } from "@/lib/supabase/config";

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname === "/protected" || pathname.startsWith("/incidents/");
}

function safeNextPath(pathname: string, search: string) {
  const nextPath = `${pathname}${search}`;
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) return "/dashboard";
  return nextPath;
}

export async function proxy(request: NextRequest) {
  const config = getSupabaseAuthConfig();
  if (!config) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (isDashboardPath(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/staff/sign-in";
    redirectUrl.search = `?next=${encodeURIComponent(safeNextPath(pathname, search))}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/staff/sign-in" && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/protected", "/incidents/:path*", "/staff/sign-in"],
};
