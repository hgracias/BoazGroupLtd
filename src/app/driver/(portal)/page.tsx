import Link from "next/link";
import { AlertTriangle, Clock, Gauge, Route as RouteIcon, Timer } from "lucide-react";

import { EmergencySOSCard } from "@/components/driver/dashboard/emergency-sos-card";
import { FuelGauge } from "@/components/driver/dashboard/fuel-gauge";
import { MetricBadge, MetricCard, MetricValue } from "@/components/driver/dashboard/metric-card";
import { NextRestCountdown } from "@/components/driver/dashboard/next-rest-countdown";
import {
  AssignmentCard,
  TrailerCard,
  VehicleCard,
} from "@/components/driver/dashboard/summary-cards";
import {
  ExpenseSummaryCard,
  InspectionSummaryCard,
  MessageSummaryCard,
} from "@/components/driver/dashboard/summary-tiles";
import { TripProgressTimeline } from "@/components/driver/dashboard/trip-progress-timeline";
import { company } from "@/lib/company";
import {
  countUnreadMessages,
  getActiveTripForDriver,
  getLatestInspection,
  getOpenClockRecord,
  getRestSchedule,
  getTrailerById,
  getTruckById,
  listExpenses,
  listMessages,
} from "@/lib/data";
import { duration, timeOnly } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export default async function DriverDashboardPage() {
  const driver = await requireDriver();

  const [trip, truck, openShift, inspection, expenses, messages, unread, rest] =
    await Promise.all([
      getActiveTripForDriver(driver.id),
      getTruckById(driver.assignedTruckId),
      getOpenClockRecord(driver.id),
      getLatestInspection(driver.id),
      listExpenses({ driverId: driver.id }),
      listMessages(driver.id),
      countUnreadMessages(driver.id),
      getRestSchedule(driver.id),
    ]);

  const trailer = await getTrailerById(trip?.trailerId);
  const firstName = driver.fullName.split(" ")[0];
  const latestExpense = expenses[0] ?? null;
  const latestMessage = messages[0] ?? null;
  const serviceDueIn = truck?.nextServiceKm ? truck.nextServiceKm - truck.odometerKm : null;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {firstName} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Here is your current assignment and vehicle status.
          </p>
        </div>

        <p
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
            openShift
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/[0.06] text-muted-foreground"
          }`}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          {openShift
            ? `On shift · ${duration(openShift.clockInAt, new Date().toISOString())}`
            : "Off duty"}
        </p>
      </div>

      {/* Top summary cards */}
      <div className="grid gap-4 lg:grid-cols-12">
        <AssignmentCard trip={trip} />
        <VehicleCard truck={truck} />
        <TrailerCard trailer={trailer} />
      </div>

      {/* Operating metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Fuel level"
          icon={Gauge}
          footer={
            truck?.fuelCapacityLitres
              ? `≈ ${Math.round((truck.fuelLevelPercent / 100) * truck.fuelCapacityLitres).toLocaleString()} L of ${truck.fuelCapacityLitres.toLocaleString()} L`
              : undefined
          }
        >
          {truck ? (
            <FuelGauge percent={truck.fuelLevelPercent} />
          ) : (
            <p className="text-sm text-muted-foreground">No vehicle assigned</p>
          )}
        </MetricCard>

        <MetricCard
          label="Odometer"
          icon={RouteIcon}
          footer={
            serviceDueIn !== null
              ? serviceDueIn <= 10_000
                ? `Service due in ${serviceDueIn.toLocaleString()} km`
                : `Next service at ${truck?.nextServiceKm?.toLocaleString()} km`
              : undefined
          }
        >
          <MetricValue value={(truck?.odometerKm ?? 0).toLocaleString()} unit="km" />
        </MetricCard>

        <MetricCard
          label="Engine hours"
          icon={Timer}
          footer={truck ? `Unit ${truck.plateNumber}` : undefined}
        >
          <MetricValue value={(truck?.engineHours ?? 0).toLocaleString()} unit="h" />
        </MetricCard>

        <MetricCard label="Next rest" icon={Clock}>
          {rest ? (
            <div className="flex items-center gap-3">
              <MetricBadge icon={Clock} />
              <div className="min-w-0">
                <NextRestCountdown
                  nextRestAt={rest.nextRestAt}
                  serverLabel={timeOnly(rest.nextRestAt)}
                  requiredMinutes={rest.requiredMinutes}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No rest scheduled</p>
          )}
        </MetricCard>
      </div>

      {/* Trip progress */}
      <section className="portal-panel p-5 sm:p-6" aria-labelledby="trip-progress-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="trip-progress-heading" className="font-display text-lg font-semibold">
            Current trip progress
          </h2>
          {trip ? (
            <Link
              href="/driver/trips"
              className="text-sm font-semibold text-blue-300 hover:text-blue-200"
            >
              All trips
            </Link>
          ) : null}
        </div>

        <div className="mt-5">
          {trip && trip.stops.length > 0 ? (
            <TripProgressTimeline stops={trip.stops} />
          ) : (
            <p className="py-6 text-sm text-muted-foreground">
              No active trip. Your next assignment will appear here once operations
              schedules it.
            </p>
          )}
        </div>
      </section>

      {/* Lower action cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InspectionSummaryCard inspection={inspection} />
        <MessageSummaryCard unreadCount={unread} latest={latestMessage} />
        <ExpenseSummaryCard expense={latestExpense} />
        <EmergencySOSCard operationsPhone={company.phone} />
      </div>

      {expenses.some((expense) => expense.status === "REJECTED") ? (
        <section className="portal-panel border-red-500/30 bg-destructive/10 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-red-200">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            Needs your attention
          </h2>
          <ul className="mt-4 space-y-3">
            {expenses
              .filter((expense) => expense.status === "REJECTED")
              .slice(0, 3)
              .map((expense) => (
                <li key={expense.id} className="text-sm">
                  <p className="font-semibold text-foreground">
                    Rejected · {expense.description}
                  </p>
                  {expense.reviewNote ? (
                    <p className="mt-1 text-muted-foreground">{expense.reviewNote}</p>
                  ) : null}
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
