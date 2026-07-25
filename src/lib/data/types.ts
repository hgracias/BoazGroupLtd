/**
 * Domain types for the portal. These mirror prisma/schema.prisma exactly, so
 * swapping the mock repository for a Prisma-backed one is a drop-in change.
 */

export type Role = "DRIVER" | "ADMIN";
export type DutyStatus = "ON_DUTY" | "OFF_DUTY";
export type TruckStatus = "ACTIVE" | "IN_MAINTENANCE" | "RETIRED";
export type TripStatus = "PLANNED" | "IN_TRANSIT" | "AT_BORDER" | "DELIVERED" | "CANCELLED";

export type MaintenanceType =
  | "OIL_CHANGE"
  | "TIRES"
  | "BRAKES"
  | "GENERAL_SERVICE"
  | "REPAIR"
  | "INSPECTION";

export type ExpenseCategory =
  | "FUEL"
  | "TOLLS"
  | "BORDER_FEES"
  | "FOOD_LODGING"
  | "PARKING"
  | "REPAIRS"
  | "OTHER";

export type Currency = "TZS" | "KES" | "RWF" | "BIF" | "UGX";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ShipmentStatus =
  | "BOOKED"
  | "LOADED"
  | "IN_TRANSIT"
  | "AT_BORDER"
  | "CLEARED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "EXCEPTION";

export type Driver = {
  id: string;
  employeeId: string;
  passwordHash: string;
  role: Role;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  licenseNumber: string;
  licenseClass?: string;
  licenseExpiry?: string;
  nationalId?: string;
  homeBase: string;
  dutyStatus: DutyStatus;
  active: boolean;
  joinedAt: string;
  assignedTruckId?: string;
};

export type Admin = {
  id: string;
  employeeId: string;
  passwordHash: string;
  role: Role;
  fullName: string;
  email: string;
  title?: string;
};

export type Truck = {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  trailerType?: string;
  capacityTons?: number;
  odometerKm: number;
  status: TruckStatus;
  nextServiceKm?: number;
  insuranceExpiry?: string;
};

export type Trip = {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  corridorSlug: string;
  borderPost?: string;
  cargoSummary?: string;
  status: TripStatus;
  departedAt?: string;
  expectedAt?: string;
  deliveredAt?: string;
  driverId: string;
  truckId: string;
};

export type ClockRecord = {
  id: string;
  clockInAt: string;
  clockOutAt?: string;
  clockInNote?: string;
  clockOutNote?: string;
  startOdometerKm?: number;
  endOdometerKm?: number;
  locationIn?: string;
  locationOut?: string;
  driverId: string;
  tripId?: string;
};

export type MaintenanceRecord = {
  id: string;
  performedAt: string;
  type: MaintenanceType;
  description: string;
  costAmount: number;
  costCurrency: Currency;
  odometerKm: number;
  vendor?: string;
  receiptUrl?: string;
  truckId: string;
  driverId: string;
  createdAt: string;
};

export type ExpenseReport = {
  id: string;
  spentAt: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: Currency;
  /** Rate captured at submission so historical totals never shift. */
  rateToTzs: number;
  amountTzs: number;
  receiptUrl?: string;
  status: ApprovalStatus;
  reviewNote?: string;
  reviewedAt?: string;
  reviewedById?: string;
  driverId: string;
  tripId?: string;
  createdAt: string;
};

export type ShipmentEvent = {
  id: string;
  occurredAt: string;
  status: ShipmentStatus;
  location: string;
  note?: string;
};

export type Shipment = {
  id: string;
  trackingRef: string;
  clientName: string;
  origin: string;
  destination: string;
  corridorSlug: string;
  cargoSummary: string;
  weightKg?: number;
  containerNo?: string;
  status: ShipmentStatus;
  bookedAt: string;
  etaAt?: string;
  deliveredAt?: string;
  tripId?: string;
  events: ShipmentEvent[];
};
