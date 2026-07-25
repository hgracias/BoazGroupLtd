import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Gauge,
  MapPin,
  Receipt,
  Truck as TruckIcon,
  Wrench,
} from "lucide-react";

import { InfoRow } from "@/components/driver/portal-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, formatTzs } from "@/lib/currency";
import {
  getActiveTripForDriver,
  getOpenClockRecord,
  getTruckById,
  listExpenses,
  listMaintenance,
} from "@/lib/data";
import {
  approvalBadgeVariant,
  approvalLabels,
  dateOnly,
  dateTime,
  duration,
  expenseCategoryLabels,
  maintenanceTypeLabels,
  tripStatusLabels,
} from "@/lib/format";
import { requireDriver } from "@/lib/session";

export default async function DriverDashboardPage() {
  const driver = await requireDriver();
  const [openShift, trip, truck, expenses, maintenance] = await Promise.all([
    getOpenClockRecord(driver.id),
    getActiveTripForDriver(driver.id),
    getTruckById(driver.assignedTruckId),
    listExpenses({ driverId: driver.id }),
    listMaintenance({ driverId: driver.id }),
  ]);

  const pending = expenses.filter((expense) => expense.status === "PENDING");
  const pendingTzs = pending.reduce((total, expense) => total + expense.amountTzs, 0);
  const firstName = driver.fullName.split(" ")[0];
  const serviceDueIn =
    truck?.nextServiceKm != null ? truck.nextServiceKm - truck.odometerKm : null;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <p className="text-sm text-muted-foreground">Karibu tena,</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy-900">
          {firstName}
        </h1>
      </div>

      {/* Primary action: the thing a driver opens the app to do. */}
      <Card className={openShift ? "border-emerald-200 bg-emerald-50/50" : ""}>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                openShift ? "bg-emerald-600 text-white" : "bg-navy-100 text-navy-700"
              }`}
            >
              <Clock className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-navy-900">
                {openShift ? "You are on shift" : "You are off duty"}
              </p>
              {openShift ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Clocked in {dateTime(openShift.clockInAt)} ·{" "}
                  {duration(openShift.clockInAt, new Date().toISOString())} so far
                  {openShift.locationIn ? ` · ${openShift.locationIn}` : ""}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Clock in when you start your shift or leave the yard.
                </p>
              )}
            </div>
          </div>
          <Button asChild size="touch" variant={openShift ? "outline" : "default"} className="sm:w-auto">
            <Link href="/driver/clock">
              {openShift ? "Clock out" : "Clock in"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-600" aria-hidden="true" />
              Current trip
            </CardTitle>
            {trip ? <Badge variant="gold">{tripStatusLabels[trip.status]}</Badge> : null}
          </CardHeader>
          <CardContent>
            {trip ? (
              <dl className="divide-y divide-border">
                <InfoRow label="Reference" value={trip.reference} />
                <InfoRow label="Route" value={`${trip.origin} → ${trip.destination}`} />
                <InfoRow label="Border post" value={trip.borderPost ?? "—"} />
                <InfoRow label="Cargo" value={trip.cargoSummary ?? "—"} />
                <InfoRow
                  label="Expected"
                  value={trip.expectedAt ? dateOnly(trip.expectedAt) : "—"}
                />
              </dl>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                No trip assigned right now. Operations will notify you when the next
                load is planned.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-gold-600" aria-hidden="true" />
              Assigned truck
            </CardTitle>
            {truck ? <Badge variant="subtle">{truck.plateNumber}</Badge> : null}
          </CardHeader>
          <CardContent>
            {truck ? (
              <>
                <dl className="divide-y divide-border">
                  <InfoRow label="Unit" value={`${truck.make} ${truck.model} (${truck.year})`} />
                  <InfoRow label="Trailer" value={truck.trailerType ?? "—"} />
                  <InfoRow
                    label="Odometer"
                    value={`${truck.odometerKm.toLocaleString()} km`}
                  />
                  <InfoRow
                    label="Next service"
                    value={
                      truck.nextServiceKm
                        ? `${truck.nextServiceKm.toLocaleString()} km`
                        : "—"
                    }
                  />
                </dl>
                {serviceDueIn !== null && serviceDueIn <= 10_000 ? (
                  <p className="mt-4 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Service due in {serviceDueIn.toLocaleString()} km — book it with the
                    workshop before the next long run.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                No truck assigned to you at the moment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button asChild size="touch" variant="outline" className="justify-start gap-3">
          <Link href="/driver/maintenance/new">
            <Wrench className="h-5 w-5 text-gold-600" aria-hidden="true" />
            Log maintenance
          </Link>
        </Button>
        <Button asChild size="touch" variant="outline" className="justify-start gap-3">
          <Link href="/driver/expenses/new">
            <Receipt className="h-5 w-5 text-gold-600" aria-hidden="true" />
            Add trip expense
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Expenses awaiting approval</CardTitle>
            <Badge variant={pending.length ? "warning" : "subtle"}>{pending.length}</Badge>
          </CardHeader>
          <CardContent>
            {pending.length ? (
              <>
                <ul className="divide-y divide-border">
                  {pending.slice(0, 4).map((expense) => (
                    <li key={expense.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy-900">
                          {expenseCategoryLabels[expense.category]}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {dateOnly(expense.spentAt)} · {expense.description}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-navy-900">
                          {formatMoney(expense.amount, expense.currency)}
                        </p>
                        {expense.currency !== "TZS" ? (
                          <p className="text-xs text-muted-foreground">
                            ≈ {formatTzs(expense.amountTzs)}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                  Pending total:{" "}
                  <span className="font-semibold text-navy-900">{formatTzs(pendingTzs)}</span>
                </p>
              </>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                Nothing pending. Everything you have submitted has been reviewed.
              </p>
            )}
            <Button asChild variant="link" className="mt-3 h-auto p-0">
              <Link href="/driver/expenses">
                View all expenses
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent maintenance</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            {maintenance.length ? (
              <ul className="divide-y divide-border">
                {maintenance.slice(0, 4).map((record) => (
                  <li key={record.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy-900">
                        {maintenanceTypeLabels[record.type]}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {dateOnly(record.performedAt)} · {record.odometerKm.toLocaleString()} km
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-navy-900">
                      {formatMoney(record.costAmount, record.costCurrency)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                No maintenance logged yet.
              </p>
            )}
            <Button asChild variant="link" className="mt-3 h-auto p-0">
              <Link href="/driver/maintenance">
                View maintenance history
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {expenses.some((expense) => expense.status === "REJECTED") ? (
        <Card className="border-red-200 bg-red-50/40">
          <CardHeader>
            <CardTitle className="text-red-900">Needs your attention</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {expenses
                .filter((expense) => expense.status === "REJECTED")
                .slice(0, 3)
                .map((expense) => (
                  <li key={expense.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant={approvalBadgeVariant[expense.status]}>
                        {approvalLabels[expense.status]}
                      </Badge>
                      <span className="font-semibold text-navy-900">
                        {formatMoney(expense.amount, expense.currency)} ·{" "}
                        {expenseCategoryLabels[expense.category]}
                      </span>
                    </div>
                    {expense.reviewNote ? (
                      <p className="mt-1.5 text-muted-foreground">{expense.reviewNote}</p>
                    ) : null}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
