import Link from "next/link";
import { ArrowRight, Clock, Receipt, Truck, Users } from "lucide-react";

import { ExpenseTable } from "@/components/admin/expense-table";
import { EmptyState } from "@/components/driver/portal-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, totalsByCurrency } from "@/lib/currency";
import {
  decorateWithDriver,
  listClockRecords,
  listDrivers,
  listExpenses,
  listMaintenance,
  listTrucks,
} from "@/lib/data";
import { requireAdmin } from "@/lib/session";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [pendingRaw, drivers, trucks, clockRecords, maintenance] = await Promise.all([
    listExpenses({ status: "PENDING" }),
    listDrivers(),
    listTrucks(),
    listClockRecords(),
    listMaintenance(),
  ]);

  const pending = await decorateWithDriver(pendingRaw);
  // Grouped per currency — see src/lib/currency.ts on why these are not added.
  const pendingTotals = totalsByCurrency(pending);
  const onDuty = drivers.filter((driver) => driver.dutyStatus === "ON_DUTY").length;
  const openShifts = clockRecords.filter((record) => !record.clockOutAt).length;
  const inWorkshop = trucks.filter((truck) => truck.status === "IN_MAINTENANCE").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy-900">
          Operations overview
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything drivers have submitted, and what still needs a decision.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Receipt className="h-5 w-5" aria-hidden="true" />}
          label="Expenses pending"
          value={String(pending.length)}
          detail={
            pendingTotals.length
              ? pendingTotals
                  .map((entry) => formatMoney(entry.total, entry.currency))
                  .join(" · ")
              : "nothing pending"
          }
        />
        <StatCard
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          label="Drivers on duty"
          value={`${onDuty} / ${drivers.length}`}
          detail={`${openShifts} open shift${openShifts === 1 ? "" : "s"}`}
        />
        <StatCard
          icon={<Truck className="h-5 w-5" aria-hidden="true" />}
          label="Trucks in workshop"
          value={String(inWorkshop)}
          detail={`${trucks.length} in fleet`}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" aria-hidden="true" />}
          label="Maintenance logged"
          value={String(maintenance.length)}
          detail="all time"
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Expenses awaiting approval</CardTitle>
          <Button asChild variant="link" className="h-auto p-0">
            <Link href="/admin/expenses">
              All expenses
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          {pending.length ? (
            <ExpenseTable rows={pending} />
          ) : (
            <div className="px-6">
              <EmptyState
                title="Nothing to review"
                description="Every submitted expense has been approved or rejected."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
        </div>
        <p className="mt-3 font-display text-3xl font-semibold text-navy-900">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
