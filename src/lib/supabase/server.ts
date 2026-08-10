import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { requireSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Server-side Supabase client for Server Components, Server Actions and Route
 * Handlers.
 *
 * There is no Supabase Auth in this app yet, so every request runs as the
 * anonymous role and what it can do is decided entirely by row-level security.
 * The cookie adapter is wired up anyway so that adding Supabase Auth later
 * needs no change here.
 */
export function createClient() {
  const { url, key } = requireSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set headers. Safe to ignore when a
          // middleware or Server Action is responsible for refreshing
          // sessions — which is the case here, since we set no auth cookies.
        }
      },
    },
  });
}
