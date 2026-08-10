/**
 * Honeypot: a field no human ever sees, which naive bots fill in anyway.
 *
 * The name is deliberately plausible ("company_website") — a field called
 * "honeypot" is trivially skipped. Anything arriving with a value here is
 * treated as a bot.
 */
export const HONEYPOT_FIELD = "company_website";

/**
 * True when the trap was tripped. Whitespace counts as empty so a browser
 * autofilling a space does not lock out a real person.
 */
export function isHoneypotTripped(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim().length > 0;
}
