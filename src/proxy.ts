import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv } from "@/lib/env";

/** Routes reachable without a session. Everything else requires a signed-in user. */
const PUBLIC_PATHS = new Set(["/", "/login"]);

/**
 * Next.js 16 proxy (the renamed middleware). Refreshes the Supabase session cookie
 * and guards routes. Identity is resolved with `auth.getUser()` because this decision
 * is security-relevant; `getSession()` would trust unverified cookie contents.
 */
export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getPublicEnv();

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user) {
    return PUBLIC_PATHS.has(path) ? response : redirectTo(request, "/login", response);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();

  const hasOnboarded = Boolean(profile?.onboarding_completed_at);

  if (PUBLIC_PATHS.has(path)) {
    return redirectTo(request, hasOnboarded ? "/matches" : "/onboarding", response);
  }

  if (!hasOnboarded && path !== "/onboarding") {
    return redirectTo(request, "/onboarding", response);
  }

  return response;
}

/** Redirect while keeping any refreshed session cookies from the response. */
function redirectTo(request: NextRequest, pathname: string, source: NextResponse): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirect = NextResponse.redirect(url);
  for (const cookie of source.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
