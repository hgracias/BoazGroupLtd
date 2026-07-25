"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/expenses", label: "Expenses", exact: false },
  { href: "/admin/maintenance", label: "Maintenance", exact: false },
  { href: "/admin/clock", label: "Clock logs", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="border-b border-border bg-white">
      <ul className="container flex gap-1 overflow-x-auto">
        {adminNav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-12 items-center whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors",
                  active
                    ? "border-gold-500 text-navy-900"
                    : "border-transparent text-muted-foreground hover:text-navy-900"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
