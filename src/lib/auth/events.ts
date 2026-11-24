import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

/** Event name recorded once per successful sign-in (M2 baseline). */
const LOGIN_EVENT = "login_succeeded";

/**
 * Records `login_succeeded` with `{ is_first_login }` and returns the flag.
 * Identity comes from the caller's session, so RLS applies.
 * Analytics must never block sign-in: a failed write is intentionally ignored.
 */
export async function recordLoginSucceeded(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { count, error } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("name", LOGIN_EVENT);

  const isFirstLogin = error ? false : (count ?? 0) === 0;

  await supabase.from("events").insert({
    user_id: userId,
    name: LOGIN_EVENT,
    props: { is_first_login: isFirstLogin },
  });

  return isFirstLogin;
}
