import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PortalSidebar, PortalTabBar } from "@/components/driver/portal-nav";
import { SignOutButton } from "@/components/driver/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { company } from "@/lib/company";
import { dutyLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Driver Portal", template: "%s | Driver Portal" },
  robots: { index: false, follow: false },
};

export default async function DriverPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const driver = await requireDriver();
  const onDuty = driver.dutyStatus === "ON_DUTY";

  return (
    <div className="min-h-screen bg-sand-50">
      <a
        href="#portal-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/driver" className="flex items-center gap-3">
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-white">
              <Image src={company.logo} alt="" fill sizes="36px" className="object-cover" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold text-navy-900">
                Driver Portal
              </span>
              <span className="text-xs text-muted-foreground">{driver.employeeId}</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Badge variant={onDuty ? "success" : "subtle"}>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${onDuty ? "bg-emerald-600" : "bg-muted-foreground"}`}
              />
              {dutyLabels[driver.dutyStatus]}
            </Badge>
            <span className="hidden text-sm font-semibold text-navy-900 sm:block">
              {driver.fullName}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        <PortalSidebar />
        <main id="portal-main" className="min-w-0 flex-1 pb-24 lg:pb-10">
          {children}
        </main>
      </div>

      <PortalTabBar />
    </div>
  );
}
