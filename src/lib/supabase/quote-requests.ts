import { randomBytes } from "node:crypto";

import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";
import type { QuoteValues } from "@/lib/validations";

/**
 * Persistence for public quote requests.
 *
 * Runs as the anonymous Postgres role: row-level security allows INSERT and
 * nothing else, so a submission can be written but never read back through
 * the Data API. That is why the reference is generated here rather than by a
 * database default — reading a generated value back would need a SELECT
 * policy, which would expose every customer's contact details.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/L/O/0/1
const MAX_ATTEMPTS = 3;

function newReference() {
  const bytes = randomBytes(5);
  const suffix = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
  return `BGL-Q-${new Date().getFullYear()}-${suffix}`;
}

function toRow(values: QuoteValues, reference: string): TablesInsert<"quote_requests"> {
  return {
    reference,
    origin_city: values.originCity,
    destination_country: values.destinationCountry,
    destination_city: values.destinationCity,
    service: values.service,
    cargo_type: values.cargoType,
    cargo_description: values.cargoDescription,
    weight_kg: values.weightKg,
    unit_count: values.unitCount ?? null,
    ready_date: values.readyDate,
    needs_customs: values.needsCustoms,
    contact_name: values.contactName,
    company_name: values.companyName,
    email: values.email,
    phone: values.phone,
    preferred_contact: values.preferredContact,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

export type SaveQuoteResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

export async function saveQuoteRequest(values: QuoteValues): Promise<SaveQuoteResult> {
  const supabase = createClient();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const reference = newReference();
    // No .select() — the anon role has INSERT only, so asking for the row
    // back would fail. PostgREST sends Prefer: return=minimal.
    const { error } = await supabase.from("quote_requests").insert(toRow(values, reference));

    if (!error) return { ok: true, reference };

    // 23505 = unique_violation. Only the reference is unique, so retry with a
    // fresh one; anything else is a real failure.
    if (error.code === "23505" && attempt < MAX_ATTEMPTS) continue;

    console.error("[quote] Supabase insert failed", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return { ok: false, error: error.message };
  }

  return { ok: false, error: "Could not allocate a unique reference." };
}
