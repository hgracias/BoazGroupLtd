import bcrypt from "bcryptjs";

import { rateToTzs } from "@/lib/currency";
import { createSeed, type SeedData } from "@/lib/data/seed";
import type {
  Admin,
  ApprovalStatus,
  ClockRecord,
  Currency,
  Driver,
  ExpenseCategory,
  ExpenseReport,
  MaintenanceRecord,
  MaintenanceType,
  Shipment,
  Trip,
  Truck,
} from "@/lib/data/types";

/**
 * Mock repository. Everything the app needs goes through this module, so
 * switching to Prisma later means reimplementing these functions against the
 * database — no page or component changes.
 *
 * State lives on globalThis so it survives dev-server hot reloads. It is
 * per-process and resets on restart, which is expected for a prototype.
 */

type Store = SeedData;

const globalStore = globalThis as unknown as { __boazStore?: Store };

function db(): Store {
  if (!globalStore.__boazStore) {
    globalStore.__boazStore = createSeed();
  }
  return globalStore.__boazStore;
}

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const byNewest = (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime();

/* ------------------------------------------------------------------ auth */

export type PortalUser =
  | { kind: "driver"; record: Driver }
  | { kind: "admin"; record: Admin };

export async function findUserByEmployeeId(employeeId: string): Promise<PortalUser | null> {
  const normalised = employeeId.trim().toUpperCase();
  const driver = db().drivers.find((d) => d.employeeId.toUpperCase() === normalised);
  if (driver) return { kind: "driver", record: driver };
  const admin = db().admins.find((a) => a.employeeId.toUpperCase() === normalised);
  if (admin) return { kind: "admin", record: admin };
  return null;
}

export async function verifyCredentials(employeeId: string, password: string) {
  const user = await findUserByEmployeeId(employeeId);
  if (!user || !password) return null;
  if (user.kind === "driver" && !user.record.active) return null;
  const ok = await bcrypt.compare(password, user.record.passwordHash);
  return ok ? user : null;
}

/* --------------------------------------------------------------- drivers */

export async function getDriverById(driverId: string) {
  return db().drivers.find((d) => d.id === driverId) ?? null;
}

export async function listDrivers() {
  return [...db().drivers].sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function getAdminById(adminId: string) {
  return db().admins.find((a) => a.id === adminId) ?? null;
}

/* ---------------------------------------------------------------- trucks */

export async function getTruckById(truckId?: string) {
  if (!truckId) return null;
  return db().trucks.find((t) => t.id === truckId) ?? null;
}

export async function listTrucks() {
  return [...db().trucks].sort((a, b) => a.plateNumber.localeCompare(b.plateNumber));
}

/* ----------------------------------------------------------------- trips */

export async function getActiveTripForDriver(driverId: string) {
  return (
    db().trips.find(
      (t) => t.driverId === driverId && ["IN_TRANSIT", "AT_BORDER", "PLANNED"].includes(t.status)
    ) ?? null
  );
}

export async function listTripsForDriver(driverId: string) {
  return db()
    .trips.filter((t) => t.driverId === driverId)
    .sort((a, b) => byNewest(a.departedAt ?? a.expectedAt ?? "", b.departedAt ?? b.expectedAt ?? ""));
}

export async function getTripById(tripId?: string) {
  if (!tripId) return null;
  return db().trips.find((t) => t.id === tripId) ?? null;
}

/* --------------------------------------------------------- clock records */

export async function getOpenClockRecord(driverId: string) {
  return db().clockRecords.find((r) => r.driverId === driverId && !r.clockOutAt) ?? null;
}

export async function listClockRecords(driverId?: string) {
  return db()
    .clockRecords.filter((r) => (driverId ? r.driverId === driverId : true))
    .sort((a, b) => byNewest(a.clockInAt, b.clockInAt));
}

export async function clockIn(input: {
  driverId: string;
  tripId?: string;
  note?: string;
  startOdometerKm?: number;
  location?: string;
}) {
  const existing = await getOpenClockRecord(input.driverId);
  if (existing) {
    return { ok: false as const, error: "You are already clocked in." };
  }
  const record: ClockRecord = {
    id: id("clk"),
    clockInAt: new Date().toISOString(),
    driverId: input.driverId,
    tripId: input.tripId,
    clockInNote: input.note,
    startOdometerKm: input.startOdometerKm,
    locationIn: input.location,
  };
  db().clockRecords.unshift(record);
  const driver = db().drivers.find((d) => d.id === input.driverId);
  if (driver) driver.dutyStatus = "ON_DUTY";
  return { ok: true as const, record };
}

export async function clockOut(input: {
  driverId: string;
  note?: string;
  endOdometerKm?: number;
  location?: string;
}) {
  const record = await getOpenClockRecord(input.driverId);
  if (!record) {
    return { ok: false as const, error: "You are not currently clocked in." };
  }
  record.clockOutAt = new Date().toISOString();
  record.clockOutNote = input.note;
  record.endOdometerKm = input.endOdometerKm;
  record.locationOut = input.location;

  const driver = db().drivers.find((d) => d.id === input.driverId);
  if (driver) driver.dutyStatus = "OFF_DUTY";

  // Keep the truck odometer in step with the last reading the driver logged.
  if (input.endOdometerKm && driver?.assignedTruckId) {
    const truck = db().trucks.find((t) => t.id === driver.assignedTruckId);
    if (truck && input.endOdometerKm > truck.odometerKm) truck.odometerKm = input.endOdometerKm;
  }
  return { ok: true as const, record };
}

/* --------------------------------------------------------- maintenance */

export async function listMaintenance(filters?: {
  driverId?: string;
  truckId?: string;
  from?: string;
  to?: string;
}) {
  return db()
    .maintenanceRecords.filter((record) => {
      if (filters?.driverId && record.driverId !== filters.driverId) return false;
      if (filters?.truckId && record.truckId !== filters.truckId) return false;
      if (filters?.from && record.performedAt < filters.from) return false;
      if (filters?.to && record.performedAt > `${filters.to}T23:59:59.999Z`) return false;
      return true;
    })
    .sort((a, b) => byNewest(a.performedAt, b.performedAt));
}

export async function createMaintenance(input: {
  driverId: string;
  truckId: string;
  performedAt: string;
  type: MaintenanceType;
  description: string;
  costAmount: number;
  costCurrency: Currency;
  odometerKm: number;
  vendor?: string;
  receiptUrl?: string;
}) {
  const record: MaintenanceRecord = {
    id: id("mnt"),
    createdAt: new Date().toISOString(),
    ...input,
  };
  db().maintenanceRecords.unshift(record);

  const truck = db().trucks.find((t) => t.id === input.truckId);
  if (truck && input.odometerKm > truck.odometerKm) truck.odometerKm = input.odometerKm;

  return record;
}

/* ------------------------------------------------------------- expenses */

export async function listExpenses(filters?: {
  driverId?: string;
  status?: ApprovalStatus;
  tripId?: string;
}) {
  return db()
    .expenseReports.filter((record) => {
      if (filters?.driverId && record.driverId !== filters.driverId) return false;
      if (filters?.status && record.status !== filters.status) return false;
      if (filters?.tripId && record.tripId !== filters.tripId) return false;
      return true;
    })
    .sort((a, b) => byNewest(a.spentAt, b.spentAt));
}

export async function createExpense(input: {
  driverId: string;
  tripId?: string;
  spentAt: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: Currency;
  receiptUrl?: string;
}) {
  const rate = rateToTzs(input.currency);
  const record: ExpenseReport = {
    id: id("exp"),
    createdAt: new Date().toISOString(),
    status: "PENDING",
    rateToTzs: rate,
    amountTzs: Math.round(input.amount * rate),
    ...input,
  };
  db().expenseReports.unshift(record);
  return record;
}

export async function setExpenseStatus(input: {
  expenseId: string;
  status: ApprovalStatus;
  reviewedById: string;
  reviewNote?: string;
}) {
  const record = db().expenseReports.find((e) => e.id === input.expenseId);
  if (!record) return { ok: false as const, error: "Expense not found." };
  record.status = input.status;
  record.reviewedById = input.reviewedById;
  record.reviewNote = input.reviewNote;
  record.reviewedAt = new Date().toISOString();
  return { ok: true as const, record };
}

/* ------------------------------------------------------------ shipments */

export async function getShipmentByRef(trackingRef: string): Promise<Shipment | null> {
  const normalised = trackingRef.trim().toUpperCase();
  return (
    db().shipments.find((s) => s.trackingRef.toUpperCase() === normalised) ?? null
  );
}

export async function listShipments() {
  return [...db().shipments].sort((a, b) => byNewest(a.bookedAt, b.bookedAt));
}

/* ------------------------------------------------- joined view helpers */

export type WithDriver<T> = T & { driverName: string; driverEmployeeId: string };
export type WithTruck<T> = T & { truckPlate: string };

export async function decorateWithDriver<T extends { driverId: string }>(rows: T[]) {
  const drivers = db().drivers;
  return rows.map((row) => {
    const driver = drivers.find((d) => d.id === row.driverId);
    return {
      ...row,
      driverName: driver?.fullName ?? "Unknown driver",
      driverEmployeeId: driver?.employeeId ?? "—",
    } as WithDriver<T>;
  });
}

export async function decorateWithTruck<T extends { truckId: string }>(rows: T[]) {
  const trucks = db().trucks;
  return rows.map((row) => ({
    ...row,
    truckPlate: trucks.find((t) => t.id === row.truckId)?.plateNumber ?? "—",
  })) as WithTruck<T>[];
}

export type { Admin, ClockRecord, Driver, ExpenseReport, MaintenanceRecord, Trip, Truck };
