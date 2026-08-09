import { format, formatDistanceStrict } from "date-fns";

import type {
  ApprovalStatus,
  DocumentCategory,
  DutyStatus,
  ExpenseCategory,
  InspectionResult,
  InspectionType,
  LeaveType,
  MaintenanceType,
  PayrollStatus,
  ShipmentStatus,
  TripStatus,
} from "@/lib/data/types";

export const dateOnly = (iso: string) => format(new Date(iso), "d MMM yyyy");
export const dateTime = (iso: string) => format(new Date(iso), "d MMM yyyy, HH:mm");
export const timeOnly = (iso: string) => format(new Date(iso), "HH:mm");
export const isoDateInput = (iso: string) => format(new Date(iso), "yyyy-MM-dd");

/** e.g. "9 hr 20 min" — used for shift lengths. */
export function duration(fromIso: string, toIso: string) {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const minutes = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

export const relative = (iso: string) =>
  formatDistanceStrict(new Date(iso), new Date(), { addSuffix: true });

export const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  OIL_CHANGE: "Oil change",
  TIRES: "Tyres",
  BRAKES: "Brakes",
  GENERAL_SERVICE: "General service",
  REPAIR: "Repair",
  INSPECTION: "Inspection",
};

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  FUEL: "Fuel",
  TOLLS: "Tolls & weighbridge",
  BORDER_FEES: "Border fees",
  FOOD_LODGING: "Food & lodging",
  PARKING: "Parking",
  REPAIRS: "Roadside repairs",
  OTHER: "Other",
};

export const approvalLabels: Record<ApprovalStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const dutyLabels: Record<DutyStatus, string> = {
  ON_DUTY: "On duty",
  OFF_DUTY: "Off duty",
};

export const tripStatusLabels: Record<TripStatus, string> = {
  PLANNED: "Planned",
  IN_TRANSIT: "In transit",
  AT_BORDER: "At border",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  BOOKED: "Booked",
  LOADED: "Loaded",
  IN_TRANSIT: "In transit",
  AT_BORDER: "At border",
  CLEARED: "Cleared",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  EXCEPTION: "Exception",
};

export const inspectionTypeLabels: Record<InspectionType, string> = {
  PRE_TRIP: "Pre-trip",
  POST_TRIP: "Post-trip",
  ROADSIDE: "Roadside check",
};

export const inspectionResultLabels: Record<InspectionResult, string> = {
  PASS: "Passed",
  PASS_WITH_DEFECTS: "Passed with defects",
  FAIL: "Failed",
};

export const leaveTypeLabels: Record<LeaveType, string> = {
  ANNUAL: "Annual leave",
  SICK: "Sick leave",
  COMPASSIONATE: "Compassionate leave",
  UNPAID: "Unpaid leave",
};

export const payrollStatusLabels: Record<PayrollStatus, string> = {
  PAID: "Paid",
  PROCESSING: "Processing",
  SCHEDULED: "Scheduled",
};

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  LICENCE: "Licence",
  IDENTITY: "Identity",
  MEDICAL: "Medical",
  TRAINING: "Training",
  VEHICLE: "Vehicle",
};

/** Days until a date — negative once it has passed. */
export function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export const approvalBadgeVariant: Record<ApprovalStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};
