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

export type Currency = "TZS" | "KES" | "RWF" | "BIF" | "UGX" | "CDF" | "USD";

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
  /** Telemetry surfaced on the driver dashboard. */
  fuelLevelPercent: number;
  fuelCapacityLitres?: number;
  engineHours: number;
};

export type Trailer = {
  id: string;
  plateNumber: string;
  type: string;
  axles: number;
  capacityTons?: number;
  status: TruckStatus;
  inspectionExpiry?: string;
};

export type TripStopStatus = "COMPLETED" | "CURRENT" | "UPCOMING";
export type TripStopKind = "ORIGIN" | "WAYPOINT" | "BORDER" | "DESTINATION";

export type RouteStop = {
  id: string;
  name: string;
  kind: TripStopKind;
  status: TripStopStatus;
  /** Planned time — used for upcoming stops. */
  scheduledAt?: string;
  arrivedAt?: string;
  departedAt?: string;
  note?: string;
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
  trailerId?: string;
  /** Ordered origin → destination. The timeline renders straight from this. */
  stops: RouteStop[];
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
  /** Amount and currency are the record of truth — never assume TZS. */
  amount: number;
  currency: Currency;
  /**
   * Indicative TZS rate captured at submission so historical figures never
   * shift. Absent when no rate is configured for the currency (CDF, USD),
   * in which case the expense is simply held in its own currency.
   */
  rateToTzs?: number;
  amountTzs?: number;
  receiptUrl?: string;
  status: ApprovalStatus;
  reviewNote?: string;
  reviewedAt?: string;
  reviewedById?: string;
  driverId: string;
  tripId?: string;
  createdAt: string;
};

/* ------------------------------------------------- driver portal ------- */

export type InspectionType = "PRE_TRIP" | "POST_TRIP" | "ROADSIDE";
export type InspectionResult = "PASS" | "PASS_WITH_DEFECTS" | "FAIL";

export type Inspection = {
  id: string;
  performedAt: string;
  type: InspectionType;
  result: InspectionResult;
  driverId: string;
  truckId: string;
  trailerId?: string;
  odometerKm: number;
  /** Empty when the unit passed clean. */
  defects: string[];
  note?: string;
};

export type MessagePriority = "NORMAL" | "HIGH";

export type DriverMessage = {
  id: string;
  driverId: string;
  from: string;
  fromRole: string;
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
  priority: MessagePriority;
};

export type RestSchedule = {
  driverId: string;
  /** When the driver must next stop. */
  nextRestAt: string;
  requiredMinutes: number;
  lastRestEndedAt?: string;
};

export type DocumentCategory = "LICENCE" | "IDENTITY" | "MEDICAL" | "TRAINING" | "VEHICLE";

export type DriverDocument = {
  id: string;
  driverId: string;
  name: string;
  category: DocumentCategory;
  reference?: string;
  issuedAt?: string;
  expiresAt?: string;
  fileUrl?: string;
};

export type PayrollStatus = "PAID" | "PROCESSING" | "SCHEDULED";

export type PayrollEntry = {
  id: string;
  driverId: string;
  periodLabel: string;
  periodEnd: string;
  baseAmountTzs: number;
  tripAllowanceTzs: number;
  deductionsTzs: number;
  netTzs: number;
  status: PayrollStatus;
  paidAt?: string;
  tripsCompleted: number;
};

export type LeaveType = "ANNUAL" | "SICK" | "COMPASSIONATE" | "UNPAID";

export type LeaveRequest = {
  id: string;
  driverId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: ApprovalStatus;
  reviewedAt?: string;
  reviewNote?: string;
  createdAt: string;
};

export type EmergencyKind = "BREAKDOWN" | "ACCIDENT" | "MEDICAL" | "SECURITY" | "OTHER";

export type EmergencyAlert = {
  id: string;
  driverId: string;
  tripId?: string;
  kind: EmergencyKind;
  note?: string;
  location?: string;
  raisedAt: string;
  acknowledged: boolean;
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
