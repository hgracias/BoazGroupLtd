"use server";

import { revalidatePath } from "next/cache";

import {
  clockIn,
  clockOut,
  createExpense,
  createMaintenance,
  getActiveTripForDriver,
} from "@/lib/data";
import { requireDriver } from "@/lib/session";
import { saveReceipt } from "@/lib/uploads";
import {
  clockInSchema,
  clockOutSchema,
  expenseSchema,
  maintenanceSchema,
} from "@/lib/validations";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

const optional = (value: FormDataEntryValue | null) => {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : undefined;
};

export async function clockInAction(formData: FormData): Promise<ActionResult> {
  const driver = await requireDriver();

  const parsed = clockInSchema.safeParse({
    location: formData.get("location") ?? "",
    startOdometerKm: optional(formData.get("startOdometerKm")),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const trip = await getActiveTripForDriver(driver.id);
  const result = await clockIn({
    driverId: driver.id,
    tripId: trip?.id,
    location: parsed.data.location || undefined,
    startOdometerKm: parsed.data.startOdometerKm,
    note: parsed.data.note || undefined,
  });

  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/driver");
  revalidatePath("/driver/clock");
  return { ok: true, message: "Clocked in. Have a safe run." };
}

export async function clockOutAction(formData: FormData): Promise<ActionResult> {
  const driver = await requireDriver();

  const parsed = clockOutSchema.safeParse({
    location: formData.get("location") ?? "",
    endOdometerKm: optional(formData.get("endOdometerKm")),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const result = await clockOut({
    driverId: driver.id,
    location: parsed.data.location || undefined,
    endOdometerKm: parsed.data.endOdometerKm,
    note: parsed.data.note || undefined,
  });

  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/driver");
  revalidatePath("/driver/clock");
  return { ok: true, message: "Clocked out. Shift recorded." };
}

export async function createMaintenanceAction(formData: FormData): Promise<ActionResult> {
  const driver = await requireDriver();

  const parsed = maintenanceSchema.safeParse({
    truckId: formData.get("truckId") ?? "",
    performedAt: formData.get("performedAt") ?? "",
    type: formData.get("type") ?? "",
    description: formData.get("description") ?? "",
    costAmount: formData.get("costAmount") ?? "",
    costCurrency: formData.get("costCurrency") ?? "TZS",
    odometerKm: formData.get("odometerKm") ?? "",
    vendor: formData.get("vendor") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const receipt = await saveReceipt(formData.get("receipt") as File | null);
  if (!receipt.ok) return { ok: false, error: receipt.error };

  await createMaintenance({
    driverId: driver.id,
    truckId: parsed.data.truckId,
    performedAt: new Date(`${parsed.data.performedAt}T09:00:00`).toISOString(),
    type: parsed.data.type,
    description: parsed.data.description,
    costAmount: parsed.data.costAmount,
    costCurrency: parsed.data.costCurrency,
    odometerKm: parsed.data.odometerKm,
    vendor: parsed.data.vendor || undefined,
    receiptUrl: receipt.url,
  });

  revalidatePath("/driver/maintenance");
  revalidatePath("/driver");
  revalidatePath("/admin");
  return { ok: true, message: "Maintenance record saved." };
}

export async function createExpenseAction(formData: FormData): Promise<ActionResult> {
  const driver = await requireDriver();

  const parsed = expenseSchema.safeParse({
    spentAt: formData.get("spentAt") ?? "",
    category: formData.get("category") ?? "",
    description: formData.get("description") ?? "",
    amount: formData.get("amount") ?? "",
    currency: formData.get("currency") ?? "TZS",
    tripId: formData.get("tripId") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const receipt = await saveReceipt(formData.get("receipt") as File | null);
  if (!receipt.ok) return { ok: false, error: receipt.error };

  await createExpense({
    driverId: driver.id,
    tripId: parsed.data.tripId || undefined,
    spentAt: new Date(`${parsed.data.spentAt}T09:00:00`).toISOString(),
    category: parsed.data.category,
    description: parsed.data.description,
    amount: parsed.data.amount,
    currency: parsed.data.currency,
    receiptUrl: receipt.url,
  });

  revalidatePath("/driver/expenses");
  revalidatePath("/driver");
  revalidatePath("/admin");
  return { ok: true, message: "Expense submitted for approval." };
}
