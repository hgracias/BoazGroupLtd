"use server";

import { revalidatePath } from "next/cache";

import { setExpenseStatus } from "@/lib/data";
import { requireAdmin } from "@/lib/session";

export type ReviewResult = { ok: true; message: string } | { ok: false; error: string };

export async function reviewExpenseAction(formData: FormData): Promise<ReviewResult> {
  const admin = await requireAdmin();

  const expenseId = String(formData.get("expenseId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reviewNote = String(formData.get("reviewNote") ?? "").trim();

  if (!expenseId) return { ok: false, error: "Missing expense reference." };
  if (decision !== "APPROVED" && decision !== "REJECTED") {
    return { ok: false, error: "Choose approve or reject." };
  }
  if (decision === "REJECTED" && reviewNote.length < 5) {
    return { ok: false, error: "Give the driver a reason for the rejection." };
  }

  const result = await setExpenseStatus({
    expenseId,
    status: decision,
    reviewedById: admin.id,
    reviewNote: reviewNote || undefined,
  });

  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/admin");
  revalidatePath("/admin/expenses");
  revalidatePath("/driver/expenses");
  revalidatePath("/driver");

  return {
    ok: true,
    message: decision === "APPROVED" ? "Expense approved." : "Expense rejected.",
  };
}
