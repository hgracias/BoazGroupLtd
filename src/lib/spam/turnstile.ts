/**
 * Cloudflare Turnstile verification. Server-only by construction: it reads
 * TURNSTILE_SECRET_KEY, and Next.js only inlines NEXT_PUBLIC_* variables into
 * the client bundle, so importing this from a client component would yield
 * `undefined` and the "not configured" path rather than leaking the secret.
 *
 * The secret is read from TURNSTILE_SECRET_KEY, which has no NEXT_PUBLIC_
 * prefix and is therefore never bundled into client JavaScript. Only the site
 * key (NEXT_PUBLIC_TURNSTILE_SITE_KEY) reaches the browser, which is by
 * design — it is public.
 */

import { TURNSTILE_FIELD } from "@/lib/spam/turnstile-client";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export { TURNSTILE_FIELD };

/** Turnstile is optional: unset keys mean the check is skipped entirely. */
export function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export type TurnstileResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; reason: string };

type SiteVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

/**
 * Verifies a Turnstile token server-side.
 *
 * Fails closed: once a secret is configured, a missing, malformed or rejected
 * token is a failure. A network error talking to Cloudflare is also a failure
 * — letting submissions through when the check cannot run would defeat it.
 */
export async function verifyTurnstile(
  token: FormDataEntryValue | null,
  remoteIp?: string
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };

  if (typeof token !== "string" || token.trim().length === 0) {
    return { ok: false, reason: "missing-token" };
  }

  const body = new URLSearchParams({ secret, response: token });
  // Optional but recommended by Cloudflare — never persisted.
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { ok: false, reason: `siteverify-http-${response.status}` };
    }

    const result = (await response.json()) as SiteVerifyResponse;
    if (result.success) return { ok: true };

    return { ok: false, reason: result["error-codes"]?.join(",") || "rejected" };
  } catch (error) {
    console.error("[turnstile] verification request failed", error);
    return { ok: false, reason: "verification-unavailable" };
  }
}
