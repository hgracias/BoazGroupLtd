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
 * Order follows the reference design. Groups are kept for screen readers and
 * for the hairline dividers, but there are no visible category headings — the
 * prototype reads as one flat list, which also buys the vertical room to show
 * every item without scrolling on a laptop.
 *
 * Clock In/Out and Maintenance are additions to the reference: they carry the
 * portal's live server actions and would otherwise be orphaned.
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

// Emergency is deliberately not a nav entry. The SOS control lives on the
// dashboard, where it is visible without opening a menu — /driver/emergency
// remains reachable directly for the contacts and alert history.

export function isNavItemActive(pathname: string, item: PortalNavItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
