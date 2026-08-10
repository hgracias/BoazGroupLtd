/**
 * Turnstile values that are safe in the browser.
 *
 * Kept apart from the verification module so client components never import
 * anything that touches TURNSTILE_SECRET_KEY.
 */

export const TURNSTILE_FIELD = "cf-turnstile-response";

/** Public by design — Cloudflare site keys are meant to be visible. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Whether the widget should render, and therefore whether the form must wait
 * for a token before it can be submitted.
 */
export function isTurnstileClientEnabled() {
  return Boolean(TURNSTILE_SITE_KEY);
}
