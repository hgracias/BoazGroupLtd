import { randomBytes } from "node:crypto";

import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";
import type { ContactValues } from "@/lib/validations";

/**
 * Persistence for public contact messages.
 *
 * Same shape as quote requests: the anonymous role may INSERT and nothing
 * else, so the reference is generated here rather than read back from the
 * database. Nothing beyond what the visitor typed is stored — no IP address,
 * no user agent.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/L/O/0/1
const MAX_ATTEMPTS = 3;

function newReference() {
  const bytes = randomBytes(5);
  const suffix = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
  return `BGL-M-${new Date().getFullYear()}-${suffix}`;
}

function toRow(
  values: ContactValues,
  reference: string
): TablesInsert<"contact_submissions"> {
  return {
    reference,
    name: values.name,
    email: values.email,
    phone: values.phone?.trim() ? values.phone.trim() : null,
    company: values.company?.trim() ? values.company.trim() : null,
    subject: values.subject,
    message: values.message,
    source: "website_contact_form",
  };
}

export type SaveContactResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

export async function saveContactSubmission(
  values: ContactValues
): Promise<SaveContactResult> {
  const supabase = createClient();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const reference = newReference();
    const { error } = await supabase
      .from("contact_submissions")
      .insert(toRow(values, reference));

    if (!error) return { ok: true, reference };

    // 23505 = unique_violation on the reference; retry with a fresh one.
    if (error.code === "23505" && attempt < MAX_ATTEMPTS) continue;

    console.error("[contact] Supabase insert failed", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return { ok: false, error: error.message };
  }

  return { ok: false, error: "Could not allocate a unique reference." };
}
