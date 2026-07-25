"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, LayoutDashboard, Receipt, UserRound, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export const driverNav = [
  { href: "/driver", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/driver/clock", label: "Clock", icon: Clock, exact: false },
  { href: "/driver/maintenance", label: "Maintenance", icon: Wrench, exact: false },
  { href: "/driver/expenses", label: "Expenses", icon: Receipt, exact: false },
  { href: "/driver/profile", label: "Profile", icon: UserRound, exact: false },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop: persistent sidebar. */
export function PortalSidebar() {
  const isActive = useIsActive();

  return (
    <nav aria-label="Driver portal" className="hidden w-60 shrink-0 border-r border-border bg-white lg:block">
      <ul className="sticky top-16 space-y-1 p-4">
        {driverNav.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-semibold transition-colors",
                  active
                    ? "bg-navy-700 text-white"
                    : "text-navy-800 hover:bg-navy-50"
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Mobile: fixed bottom tab bar with large tap targets. */
export function PortalTabBar() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Driver portal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {driverNav.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-[68px] flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                  active ? "text-navy-800" : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
                    active && "bg-navy-100"
                  )}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
