"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";

import { BrandMark, BrandWordmark } from "@/components/portal/brand-mark";
import { isNavItemActive, portalNav } from "@/components/portal/nav-items";
import { cn } from "@/lib/utils";

export type SidebarDriver = {
  fullName: string;
  employeeId: string;
  initials: string;
  onDuty: boolean;
};

export function SidebarContent({
  driver,
  unreadMessages,
  onNavigate,
}: {
  driver: SidebarDriver;
  unreadMessages: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-panel">
      <div className="flex items-center gap-3 px-5 py-4">
        <BrandMark />
        <BrandWordmark />
      </div>

      <div className="mx-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-white/[0.03] p-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-sm font-bold text-white ring-2 ring-[#D4AF37]/60"
        >
          {driver.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{driver.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">ID: {driver.employeeId}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                driver.onDuty ? "bg-emerald-400" : "bg-slate-500"
              )}
            />
            {driver.onDuty ? "On duty" : "Off duty"}
          </p>
        </div>
      </div>

      <nav aria-label="Driver portal" className="mt-3 flex-1 overflow-y-auto px-3 pb-3">
        {portalNav.map((group, groupIndex) => (
          <div
            key={group.label}
            className={cn(
              "py-1.5",
              groupIndex > 0 && "border-t border-border/40"
            )}
          >
            {/* Headings are for assistive tech only — the reference design
                reads as one flat list. */}
            <h2 className="sr-only">{group.label}</h2>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isNavItemActive(pathname, item);
                const danger = item.tone === "danger";
                const badgeCount = item.badge === "messages" ? unreadMessages : 0;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors lg:min-h-[40px]",
                        active && !danger &&
                          "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_rgba(37,99,235,0.95)]",
                        active && danger &&
                          "bg-destructive text-destructive-foreground shadow-[0_10px_24px_-12px_rgba(220,38,38,0.95)]",
                        !active && danger && "text-red-300 hover:bg-destructive/15 hover:text-red-200",
                        !active && !danger && "text-slate-300 hover:bg-white/[0.06] hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {badgeCount > 0 ? (
                        <span
                          className={cn(
                            "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                            active ? "bg-white text-primary" : "bg-primary text-white"
                          )}
                        >
                          {badgeCount}
                          <span className="sr-only"> unread messages</span>
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 p-3">
        <Link
          href="/driver/profile"
          onClick={onNavigate}
          aria-current={pathname === "/driver/profile" ? "page" : undefined}
          className={cn(
            "flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors lg:min-h-[40px]",
            pathname === "/driver/profile"
              ? "bg-primary text-primary-foreground"
              : "text-slate-300 hover:bg-white/[0.06] hover:text-foreground"
          )}
        >
          <Settings className="h-[18px] w-[18px]" aria-hidden="true" />
          Settings
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/driver/login" })}
          className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-foreground lg:min-h-[40px]"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
