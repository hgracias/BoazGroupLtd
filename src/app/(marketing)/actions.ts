"use server";

import { recordContactMessage, recordQuoteRequest } from "@/lib/data/leads";
import { contactSchema, quoteSchema } from "@/lib/validations";

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

function toObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function submitQuoteAction(formData: FormData): Promise<SubmitResult> {
  const parsed = quoteSchema.safeParse(toObject(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const lead = await recordQuoteRequest(parsed.data);
  return { ok: true, reference: lead.reference };
}

export async function submitContactAction(formData: FormData): Promise<SubmitResult> {
  const parsed = contactSchema.safeParse(toObject(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const lead = await recordContactMessage(parsed.data);
  return { ok: true, reference: lead.reference };
}
