import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardCheck,
  Clock,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Receipt,
  Route,
  ShieldAlert,
  Truck,
  Wallet,
  Wrench,
} from "lucide-react";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Exact match for index routes so children do not keep the parent active. */
  exact?: boolean;
  /** Which counter, if any, feeds this item's badge. */
  badge?: "messages";
  tone?: "danger";
};

export type PortalNavGroup = { label: string; items: PortalNavItem[] };

/**
 * Every entry points at a route that exists. Clock In/Out and Maintenance are
 * kept from the original portal — they carry live server actions.
 */
export const portalNav: PortalNavGroup[] = [
  {
    label: "Operations",
    items: [
      { href: "/driver", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/driver/trips", label: "My Trips", icon: Route },
      { href: "/driver/vehicle", label: "Vehicle & Trailer", icon: Truck },
      { href: "/driver/inspections", label: "Inspections", icon: ClipboardCheck },
      { href: "/driver/clock", label: "Clock In / Out", icon: Clock },
    ],
  },
  {
    label: "Records",
    items: [
      { href: "/driver/expenses", label: "Fuel & Expenses", icon: Receipt },
      { href: "/driver/maintenance", label: "Maintenance", icon: Wrench },
      { href: "/driver/documents", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Personal",
    items: [
      { href: "/driver/messages", label: "Messages", icon: MessagesSquare, badge: "messages" },
      { href: "/driver/payroll", label: "Payroll", icon: Wallet },
      { href: "/driver/leave", label: "Leave Requests", icon: CalendarDays },
    ],
  },
];

/**
 * Pinned above Settings rather than sitting in a scrollable group — an
 * emergency link that can be scrolled out of view is no use in a cab.
 */
export const emergencyNavItem: PortalNavItem = {
  href: "/driver/emergency",
  label: "Emergency (SOS)",
  icon: ShieldAlert,
  tone: "danger",
};

export function isNavItemActive(pathname: string, item: PortalNavItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
