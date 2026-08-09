"use server";

import { revalidatePath } from "next/cache";

import {
  clockIn,
  clockOut,
  createExpense,
  createLeaveRequest,
  createMaintenance,
  getActiveTripForDriver,
  markAllMessagesRead,
  markMessageRead,
  raiseEmergencyAlert,
} from "@/lib/data";
import type { EmergencyKind, LeaveType } from "@/lib/data/types";
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

const EMERGENCY_KINDS: EmergencyKind[] = [
  "BREAKDOWN",
  "ACCIDENT",
  "MEDICAL",
  "SECURITY",
  "OTHER",
];

/**
 * MOCK emergency escalation.
 *
 * This records an alert against the driver and logs it server-side. There is
 * no control-room, SMS or emergency-services integration behind it, so the UI
 * must say the alert was *logged*, never that help has been dispatched.
 */
export async function raiseEmergencyAction(formData: FormData): Promise<ActionResult> {
  const driver = await requireDriver();

  const rawKind = String(formData.get("kind") ?? "OTHER") as EmergencyKind;
  const kind = EMERGENCY_KINDS.includes(rawKind) ? rawKind : "OTHER";
  const note = optional(formData.get("note"));
  const location = optional(formData.get("location"));

  const trip = await getActiveTripForDriver(driver.id);
  const alert = await raiseEmergencyAlert({
    driverId: driver.id,
    tripId: trip?.id,
    kind,
    note,
    location,
  });

  revalidatePath("/driver");
  revalidatePath("/driver/emergency");

  return {
    ok: true,
    message: `Alert ${alert.id} logged. Call the operations desk now — this prototype does not notify anyone automatically.`,
  };
}

export async function markMessageReadAction(formData: FormData): Promise<ActionResult> {
  const driver = await requireDriver();
  const messageId = String(formData.get("messageId") ?? "");

  const result = await markMessageRead({ driverId: driver.id, messageId });
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/driver/messages");
  revalidatePath("/driver");
  return { ok: true, message: "Message marked as read." };
}

export async function markAllMessagesReadAction(): Promise<ActionResult> {
  const driver = await requireDriver();
  await markAllMessagesRead(driver.id);

  revalidatePath("/driver/messages");
  revalidatePath("/driver");
  return { ok: true, message: "All messages marked as read." };
}

export async function createLeaveRequestAction(formData: FormData): Promise<ActionResult> {
  const driver = await requireDriver();

  const type = String(formData.get("type") ?? "ANNUAL") as LeaveType;
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const reason = optional(formData.get("reason"));

  if (!startDate || !endDate) {
    return { ok: false, error: "Choose both a start and an end date." };
  }

  const result = await createLeaveRequest({
    driverId: driver.id,
    type,
    startDate,
    endDate,
    reason,
  });
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/driver/leave");
  return { ok: true, message: `Leave request submitted for ${result.request.days} day(s).` };
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
