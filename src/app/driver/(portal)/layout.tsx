import type { Metadata } from "next";
import { format } from "date-fns";

import { DriverPortalShell } from "@/components/portal/portal-shell";
import { countUnreadMessages } from "@/lib/data";
import { requireDriver } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Driver Portal", template: "%s | BOAZ360" },
  robots: { index: false, follow: false },
};

function initialsOf(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function DriverPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: middleware blocks anonymous traffic, this makes sure a
  // page can never render without a driver session behind it.
  const driver = await requireDriver();
  const unreadMessages = await countUnreadMessages(driver.id);

  return (
    <DriverPortalShell
      driver={{
        fullName: driver.fullName,
        employeeId: driver.employeeId,
        initials: initialsOf(driver.fullName),
        onDuty: driver.dutyStatus === "ON_DUTY",
      }}
      unreadMessages={unreadMessages}
      todayLabel={format(new Date(), "EEEE d MMMM yyyy")}
    >
      {children}
    </DriverPortalShell>
  );
}
