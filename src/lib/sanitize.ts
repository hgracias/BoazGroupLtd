/**
 * Input normalisation for anything arriving from the public internet.
 *
 * This is not HTML escaping — React escapes on render and Supabase sends
 * parameterised queries, so neither XSS nor SQL injection is the concern
 * here. What this removes is junk that corrupts stored records and mail
 * clients: control characters, zero-width padding used to slip past length
 * checks, and sprawling whitespace.
 */

// C0/C1 control characters, keeping tab and newline which are legitimate in
// a message body.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

// Zero-width space/non-joiner/joiner and the byte-order mark.
const INVISIBLE_CHARS = /[\u200B-\u200D\uFEFF]/g;

function strip(value: string): string {
  return value.replace(CONTROL_CHARS, "").replace(INVISIBLE_CHARS, "");
}

/** Single-line values: collapse all whitespace, strip junk, trim. */
export function cleanLine(value: string): string {
  return strip(value).replace(/\s+/g, " ").trim();
}

/** Multi-line values: keep paragraph breaks, cap runs of blank lines. */
export function cleanText(value: string): string {
  return strip(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

/** Emails are compared and delivered lowercase. */
export function cleanEmail(value: string): string {
  return cleanLine(value).toLowerCase();
}

/** Phone numbers: keep digits and the punctuation dialling actually uses. */
export function cleanPhone(value: string): string {
  return cleanLine(value).replace(/[^\d+()\-.\s]/g, "");
}
