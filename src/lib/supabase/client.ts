import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Browser-side Supabase client. `createBrowserClient` is already a singleton
 * internally, so calling this per component is fine.
 */
export function createClient() {
  const { url, key } = requireSupabaseEnv();
  return createBrowserClient<Database>(url, key);
}
