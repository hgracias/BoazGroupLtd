"use server";

import { headers } from "next/headers";

import { recordContactMessage, recordQuoteRequest } from "@/lib/data/leads";
import { isHoneypotTripped } from "@/lib/spam/honeypot";
import { TURNSTILE_FIELD, verifyTurnstile } from "@/lib/spam/turnstile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { saveContactSubmission } from "@/lib/supabase/contact-submissions";
import { saveQuoteRequest } from "@/lib/supabase/quote-requests";
import { contactSchema, quoteSchema } from "@/lib/validations";

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

const SAVE_FAILED =
  "We could not save your request just now. Please call the operations desk, or try again in a moment.";
const CHALLENGE_FAILED =
  "We could not confirm you are human. Refresh the page and try again, or call the operations desk.";

function toObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

/** Client IP for Turnstile only — passed to Cloudflare, never stored. */
function clientIp(): string | undefined {
  const header = headers();
  const forwarded = header.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return header.get("x-real-ip") ?? undefined;
}

/**
 * Shared anti-spam gate for the public forms.
 *
 * Returns a *silent* verdict for the honeypot: a bot that filled the hidden
 * field gets the same success response a human would, so it has nothing to
 * tune against, but nothing is written to the database.
 */
async function screen(
  formData: FormData
): Promise<{ verdict: "pass" } | { verdict: "silent-drop" } | { verdict: "reject" }> {
  if (isHoneypotTripped(formData)) {
    console.warn("[spam] honeypot tripped — submission dropped");
    return { verdict: "silent-drop" };
  }

  const turnstile = await verifyTurnstile(formData.get(TURNSTILE_FIELD), clientIp());
  if (!turnstile.ok) {
    console.warn(`[spam] turnstile rejected submission: ${turnstile.reason}`);
    return { verdict: "reject" };
  }

  return { verdict: "pass" };
}

/** A reference that looks ordinary but corresponds to nothing stored. */
function decoyReference(prefix: "BGL-Q" | "BGL-M") {
  return `${prefix}-${new Date().getFullYear()}-0000`;
}

export async function submitQuoteAction(formData: FormData): Promise<SubmitResult> {
  const screening = await screen(formData);
  if (screening.verdict === "silent-drop") {
    return { ok: true, reference: decoyReference("BGL-Q") };
  }
  if (screening.verdict === "reject") {
    return { ok: false, error: CHALLENGE_FAILED };
  }

  const parsed = quoteSchema.safeParse(toObject(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  if (isSupabaseConfigured()) {
    const saved = await saveQuoteRequest(parsed.data);
    // The underlying database error is logged server-side, never returned.
    return saved.ok
      ? { ok: true, reference: saved.reference }
      : { ok: false, error: SAVE_FAILED };
  }

  // No Supabase configured (bare checkout or CI): keep the form working.
  const lead = await recordQuoteRequest(parsed.data);
  return { ok: true, reference: lead.reference };
}

export async function submitContactAction(formData: FormData): Promise<SubmitResult> {
  const screening = await screen(formData);
  if (screening.verdict === "silent-drop") {
    return { ok: true, reference: decoyReference("BGL-M") };
  }
  if (screening.verdict === "reject") {
    return { ok: false, error: CHALLENGE_FAILED };
  }

  const parsed = contactSchema.safeParse(toObject(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  if (isSupabaseConfigured()) {
    const saved = await saveContactSubmission(parsed.data);
    return saved.ok
      ? { ok: true, reference: saved.reference }
      : { ok: false, error: SAVE_FAILED };
  }

  const lead = await recordContactMessage(parsed.data);
  return { ok: true, reference: lead.reference };
}
