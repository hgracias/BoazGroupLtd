import { at, inDays, inHours } from "@/lib/data/seed-time";
import type {
  DriverDocument,
  DriverMessage,
  EmergencyAlert,
  Inspection,
  LeaveRequest,
  PayrollEntry,
  RestSchedule,
  RouteStop,
  Trailer,
} from "@/lib/data/types";

/**
 * Driver-portal seed data: the collections the driver dashboard reads that
 * the original freight seed did not cover. Kept separate so seed.ts stays
 * legible; both are merged in createSeed().
 */

export type PortalSeed = {
  trailers: Trailer[];
  inspections: Inspection[];
  messages: DriverMessage[];
  restSchedules: RestSchedule[];
  documents: DriverDocument[];
  payroll: PayrollEntry[];
  leaveRequests: LeaveRequest[];
  emergencyAlerts: EmergencyAlert[];
};

/** Stops for the in-transit Kigali run (trp_1). */
export const kigaliStops: RouteStop[] = [
  {
    id: "stp_1",
    name: "Dar es Salaam",
    kind: "ORIGIN",
    status: "COMPLETED",
    departedAt: at(2, 5, 30),
    note: "Loaded at Vingunguti yard, seal 004182 applied.",
  },
  {
    id: "stp_2",
    name: "Morogoro",
    kind: "WAYPOINT",
    status: "COMPLETED",
    arrivedAt: at(2, 10, 15),
    departedAt: at(2, 11, 0),
  },
  {
    id: "stp_3",
    name: "Dodoma",
    kind: "WAYPOINT",
    status: "COMPLETED",
    arrivedAt: at(2, 20, 10),
    departedAt: at(1, 5, 5),
  },
  {
    id: "stp_4",
    name: "Singida",
    kind: "WAYPOINT",
    status: "CURRENT",
    arrivedAt: at(1, 19, 40),
    note: "Overnight stop, resuming for the Nzega leg.",
  },
  { id: "stp_5", name: "Rusumo Border", kind: "BORDER", status: "UPCOMING", scheduledAt: inDays(1, 9) },
  { id: "stp_6", name: "Kigali", kind: "DESTINATION", status: "UPCOMING", scheduledAt: inDays(2, 16) },
];

export const namangaStops: RouteStop[] = [
  { id: "stp_7", name: "Dar es Salaam", kind: "ORIGIN", status: "COMPLETED", departedAt: at(1, 4, 45) },
  {
    id: "stp_8",
    name: "Arusha",
    kind: "WAYPOINT",
    status: "COMPLETED",
    arrivedAt: at(1, 18, 30),
    departedAt: at(1, 21, 5),
  },
  {
    id: "stp_9",
    name: "Namanga Border",
    kind: "BORDER",
    status: "CURRENT",
    arrivedAt: at(0, 6, 5),
    note: "Documents lodged, awaiting KRA release.",
  },
  { id: "stp_10", name: "Nairobi", kind: "DESTINATION", status: "UPCOMING", scheduledAt: inDays(1, 10) },
];

export const kampalaStops: RouteStop[] = [
  { id: "stp_11", name: "Dar es Salaam", kind: "ORIGIN", status: "COMPLETED", departedAt: at(12, 5) },
  { id: "stp_12", name: "Shinyanga", kind: "WAYPOINT", status: "COMPLETED", arrivedAt: at(9, 14) },
  { id: "stp_13", name: "Mutukula Border", kind: "BORDER", status: "COMPLETED", arrivedAt: at(7, 20, 45) },
  {
    id: "stp_14",
    name: "Kampala",
    kind: "DESTINATION",
    status: "COMPLETED",
    arrivedAt: at(6, 9, 20),
    note: "POD signed by G. Ssemakula.",
  },
];

export const bujumburaStops: RouteStop[] = [
  { id: "stp_15", name: "Dar es Salaam", kind: "ORIGIN", status: "UPCOMING", scheduledAt: inDays(3, 6) },
  { id: "stp_16", name: "Nzega", kind: "WAYPOINT", status: "UPCOMING", scheduledAt: inDays(4, 14) },
  { id: "stp_17", name: "Kabanga Border", kind: "BORDER", status: "UPCOMING", scheduledAt: inDays(6, 9) },
  { id: "stp_18", name: "Bujumbura", kind: "DESTINATION", status: "UPCOMING", scheduledAt: inDays(7, 15) },
];

export function createPortalSeed(): PortalSeed {
  const trailers: Trailer[] = [
    {
      id: "trl_1",
      plateNumber: "T 221 DZX",
      type: "Skeletal",
      axles: 3,
      capacityTons: 32,
      status: "ACTIVE",
      inspectionExpiry: inDays(118),
    },
    {
      id: "trl_2",
      plateNumber: "T 908 KMB",
      type: "Flatbed",
      axles: 3,
      capacityTons: 30,
      status: "ACTIVE",
      inspectionExpiry: inDays(54),
    },
    {
      id: "trl_3",
      plateNumber: "T 460 PLW",
      type: "Curtain-side",
      axles: 2,
      capacityTons: 24,
      status: "ACTIVE",
      inspectionExpiry: inDays(201),
    },
  ];

  const inspections: Inspection[] = [
    {
      id: "insp_1",
      performedAt: at(0, 5, 5),
      type: "PRE_TRIP",
      result: "PASS",
      driverId: "drv_1",
      truckId: "trk_1",
      trailerId: "trl_1",
      odometerKm: 485_940,
      defects: [],
      note: "Lights, brakes, coupling and load straps checked before leaving Singida.",
    },
    {
      id: "insp_2",
      performedAt: at(2, 4, 40),
      type: "PRE_TRIP",
      result: "PASS_WITH_DEFECTS",
      driverId: "drv_1",
      truckId: "trk_1",
      trailerId: "trl_1",
      odometerKm: 484_320,
      defects: ["Nearside marker lamp intermittent"],
      note: "Lamp replaced at the yard before departure.",
    },
    {
      id: "insp_3",
      performedAt: at(1, 4, 30),
      type: "PRE_TRIP",
      result: "PASS",
      driverId: "drv_2",
      truckId: "trk_2",
      trailerId: "trl_2",
      odometerKm: 270_480,
      defects: [],
    },
    {
      id: "insp_4",
      performedAt: at(6, 12, 30),
      type: "POST_TRIP",
      result: "PASS",
      driverId: "drv_3",
      truckId: "trk_3",
      trailerId: "trl_3",
      odometerKm: 612_890,
      defects: [],
      note: "Unit returned clean after the Kampala run.",
    },
    {
      id: "insp_5",
      performedAt: at(8, 15, 10),
      type: "ROADSIDE",
      result: "PASS",
      driverId: "drv_3",
      truckId: "trk_3",
      odometerKm: 611_200,
      defects: [],
      note: "TANROADS check at Nzega — no findings.",
    },
  ];

  const messages: DriverMessage[] = [
    {
      id: "msg_1",
      driverId: "drv_1",
      from: "Neema Shirima",
      fromRole: "Operations Manager",
      subject: "Rusumo pre-lodgement confirmed",
      body: "Your entry for TRP-2026-0184 is lodged and the agent at Rusumo has the file. Call the desk when you are an hour out so we can confirm the release window.",
      sentAt: at(0, 7, 45),
      read: false,
      priority: "HIGH",
    },
    {
      id: "msg_2",
      driverId: "drv_1",
      from: "Peter Massawe",
      fromRole: "Customs & Compliance",
      subject: "Carry the amended packing list",
      body: "The consignee revised the packing list overnight. A printed copy is in the cab folder — present that version at the border, not the original.",
      sentAt: at(0, 6, 20),
      read: false,
      priority: "NORMAL",
    },
    {
      id: "msg_3",
      driverId: "drv_1",
      from: "Grace Kileo",
      fromRole: "Fleet & Workshop",
      subject: "Service due in under 10,000 km",
      body: "T 412 DKM is approaching its 495,000 km service. Book the workshop slot when you are back in Dar es Salaam.",
      sentAt: at(1, 16, 0),
      read: false,
      priority: "NORMAL",
    },
    {
      id: "msg_4",
      driverId: "drv_1",
      from: "Neema Shirima",
      fromRole: "Operations Manager",
      subject: "Expense approved",
      body: "Your Dodoma lodge claim has been approved and will appear on this month's payroll.",
      sentAt: at(2, 9, 10),
      read: true,
      priority: "NORMAL",
    },
    {
      id: "msg_5",
      driverId: "drv_2",
      from: "Neema Shirima",
      fromRole: "Operations Manager",
      subject: "Namanga release",
      body: "KRA has queried the manifest weight. Stay at the post, the agent is with them now.",
      sentAt: at(0, 8, 0),
      read: false,
      priority: "HIGH",
    },
  ];

  const restSchedules: RestSchedule[] = [
    { driverId: "drv_1", nextRestAt: inHours(2.75), requiredMinutes: 45, lastRestEndedAt: at(0, 5, 15) },
    { driverId: "drv_2", nextRestAt: inHours(1.2), requiredMinutes: 45, lastRestEndedAt: at(0, 4, 30) },
    { driverId: "drv_3", nextRestAt: inHours(11), requiredMinutes: 45 },
    { driverId: "drv_4", nextRestAt: inHours(9), requiredMinutes: 45 },
  ];

  const documents: DriverDocument[] = [
    {
      id: "doc_1",
      driverId: "drv_1",
      name: "Driving licence",
      category: "LICENCE",
      reference: "TZ-DL-4419028",
      issuedAt: at(1_100),
      expiresAt: inDays(412),
    },
    {
      id: "doc_2",
      driverId: "drv_1",
      name: "National ID",
      category: "IDENTITY",
      reference: "19870614-11201-00019-24",
      issuedAt: at(2_400),
    },
    {
      id: "doc_3",
      driverId: "drv_1",
      name: "Medical certificate",
      category: "MEDICAL",
      reference: "MED-2025-8841",
      issuedAt: at(210),
      expiresAt: inDays(155),
    },
    {
      id: "doc_4",
      driverId: "drv_1",
      name: "Dangerous goods awareness",
      category: "TRAINING",
      reference: "DG-AW-2024-119",
      issuedAt: at(560),
      expiresAt: inDays(38),
    },
    {
      id: "doc_5",
      driverId: "drv_1",
      name: "COMESA Yellow Card — T 412 DKM",
      category: "VEHICLE",
      reference: "CYC-TZ-77120",
      issuedAt: at(190),
      expiresAt: inDays(148),
    },
    {
      id: "doc_6",
      driverId: "drv_2",
      name: "Driving licence",
      category: "LICENCE",
      reference: "TZ-DL-3980114",
      issuedAt: at(900),
      expiresAt: inDays(233),
    },
  ];

  const payroll: PayrollEntry[] = [
    {
      id: "pay_1",
      driverId: "drv_1",
      periodLabel: "This month (in progress)",
      periodEnd: inDays(6),
      baseAmountTzs: 780_000,
      tripAllowanceTzs: 420_000,
      deductionsTzs: 0,
      netTzs: 1_200_000,
      status: "PROCESSING",
      tripsCompleted: 2,
    },
    {
      id: "pay_2",
      driverId: "drv_1",
      periodLabel: "Last month",
      periodEnd: at(25),
      baseAmountTzs: 780_000,
      tripAllowanceTzs: 610_000,
      deductionsTzs: 45_000,
      netTzs: 1_345_000,
      status: "PAID",
      paidAt: at(23),
      tripsCompleted: 3,
    },
    {
      id: "pay_3",
      driverId: "drv_1",
      periodLabel: "Two months ago",
      periodEnd: at(55),
      baseAmountTzs: 780_000,
      tripAllowanceTzs: 500_000,
      deductionsTzs: 0,
      netTzs: 1_280_000,
      status: "PAID",
      paidAt: at(53),
      tripsCompleted: 3,
    },
  ];

  const leaveRequests: LeaveRequest[] = [
    {
      id: "lv_1",
      driverId: "drv_1",
      type: "ANNUAL",
      startDate: inDays(34),
      endDate: inDays(41),
      days: 7,
      reason: "Family visit to Moshi.",
      status: "PENDING",
      createdAt: at(3, 18),
    },
    {
      id: "lv_2",
      driverId: "drv_1",
      type: "SICK",
      startDate: at(70),
      endDate: at(68),
      days: 2,
      reason: "Fever, clinic note filed.",
      status: "APPROVED",
      reviewedAt: at(69),
      createdAt: at(71),
    },
  ];

  return {
    trailers,
    inspections,
    messages,
    restSchedules,
    documents,
    payroll,
    leaveRequests,
    emergencyAlerts: [],
  };
}
