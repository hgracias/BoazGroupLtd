"use client";

import * as React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";

import { MobileSidebarDrawer } from "@/components/portal/mobile-sidebar-drawer";
import type { SidebarDriver } from "@/components/portal/sidebar-content";

export function DriverTopbar({
  driver,
  unreadMessages,
  /** Preformatted on the server so server and client markup agree. */
  todayLabel,
}: {
  driver: SidebarDriver;
  unreadMessages: number;
  todayLabel: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <MobileSidebarDrawer driver={driver} unreadMessages={unreadMessages} />
          <p className="hidden text-sm text-muted-foreground sm:block">{todayLabel}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/driver/messages"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-foreground"
            aria-label={
              unreadMessages > 0
                ? `Notifications, ${unreadMessages} unread messages`
                : "Notifications, no unread messages"
            }
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadMessages > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-white"
              >
                {unreadMessages}
              </span>
            ) : null}
          </Link>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-border/70 bg-white/[0.04] py-1.5 pl-1.5 pr-2.5 text-left transition-colors hover:bg-white/[0.08]"
                aria-label="Open profile menu"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-xs font-bold text-white"
                >
                  {driver.initials}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {driver.fullName}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {driver.employeeId}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="portal-shell z-50 min-w-[220px] rounded-xl border border-border/70 bg-popover p-1.5 shadow-2xl data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-foreground">{driver.fullName}</p>
                  <p className="text-xs text-muted-foreground">{driver.employeeId}</p>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-border/70" />
                <DropdownMenu.Item asChild>
                  <Link
                    href="/driver/profile"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none data-[highlighted]:bg-white/[0.08] data-[highlighted]:text-foreground"
                  >
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    My profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link
                    href="/driver/profile"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none data-[highlighted]:bg-white/[0.08] data-[highlighted]:text-foreground"
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border/70" />
                <DropdownMenu.Item
                  onSelect={() => signOut({ callbackUrl: "/driver/login" })}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-300 outline-none data-[highlighted]:bg-destructive/15 data-[highlighted]:text-red-200"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
