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
const UNAVAILABLE =
  "We're unable to process your request right now. Please try again later.";

/**
 * Storage policy.
 *
 * In production a submission is only ever answered "ok" if it reached the
 * database. If Supabase is not configured there, the request is refused and
 * the misconfiguration is logged server-side — silently keeping a customer's
 * enquiry in a process that will be recycled minutes later would lose real
 * business.
 *
 * Outside production the in-memory store still backs the forms so a bare
 * checkout and CI keep working without credentials.
 */
type Storage = { kind: "database" } | { kind: "memory" } | { kind: "unavailable" };

function storageFor(form: "quote" | "contact"): Storage {
  if (isSupabaseConfigured()) return { kind: "database" };

  if (process.env.NODE_ENV === "production") {
    console.error(
      `[${form}] CONFIGURATION ERROR: Supabase is not configured in production. ` +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "The submission was refused and nothing was stored."
    );
    return { kind: "unavailable" };
  }

  console.warn(
    `[${form}] Supabase not configured — using the in-memory store. ` +
      "This fallback is for local development and CI only."
  );
  return { kind: "memory" };
}

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

  const storage = storageFor("quote");
  if (storage.kind === "unavailable") {
    return { ok: false, error: UNAVAILABLE };
  }

  if (storage.kind === "database") {
    const saved = await saveQuoteRequest(parsed.data);
    // The underlying database error is logged server-side, never returned.
    return saved.ok
      ? { ok: true, reference: saved.reference }
      : { ok: false, error: SAVE_FAILED };
  }

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

  const storage = storageFor("contact");
  if (storage.kind === "unavailable") {
    return { ok: false, error: UNAVAILABLE };
  }

  if (storage.kind === "database") {
    const saved = await saveContactSubmission(parsed.data);
    return saved.ok
      ? { ok: true, reference: saved.reference }
      : { ok: false, error: SAVE_FAILED };
  }

  const lead = await recordContactMessage(parsed.data);
  return { ok: true, reference: lead.reference };
}
