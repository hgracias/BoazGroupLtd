import { MapPin, Package } from "lucide-react";

import { TripProgressTimeline } from "@/components/driver/dashboard/trip-progress-timeline";
import { EmptyState, PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import { getTrailerById, getTruckById, listTripsForDriver } from "@/lib/data";
import type { TripStatus } from "@/lib/data/types";
import { dateOnly, tripStatusLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "My Trips" };

const statusTone: Record<TripStatus, string> = {
  PLANNED: "bg-white/[0.07] text-slate-300",
  IN_TRANSIT: "bg-blue-500/20 text-blue-200",
  AT_BORDER: "bg-amber-500/20 text-amber-200",
  DELIVERED: "bg-emerald-500/15 text-emerald-300",
  CANCELLED: "bg-red-500/15 text-red-300",
};

export default async function TripsPage() {
  const driver = await requireDriver();
  const trips = await listTripsForDriver(driver.id);

  const decorated = await Promise.all(
    trips.map(async (trip) => ({
      trip,
      truck: await getTruckById(trip.truckId),
      trailer: await getTrailerById(trip.trailerId),
    }))
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      <PortalHeader
        title="My trips"
        description="Every run assigned to you, newest first."
      />

      {decorated.length ? (
        <div className="space-y-5">
          {decorated.map(({ trip, truck, trailer }) => {
            const done = trip.stops.filter((stop) => stop.status === "COMPLETED").length;

            return (
              <PortalSection key={trip.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-xl font-semibold">{trip.reference}</h2>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[trip.status]}`}
                      >
                        {tripStatusLabels[trip.status]}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-200">
                      <MapPin className="h-4 w-4 text-blue-300" aria-hidden="true" />
                      {trip.origin} <span aria-hidden="true">→</span> {trip.destination}
                      {trip.borderPost ? (
                        <span className="text-muted-foreground">· via {trip.borderPost}</span>
                      ) : null}
                    </p>
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" aria-hidden="true" />
                      {trip.cargoSummary ?? "Cargo to be confirmed"}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Departed</dt>
                    <dd className="text-right font-semibold">
                      {trip.departedAt ? dateOnly(trip.departedAt) : "—"}
                    </dd>
                    <dt className="text-muted-foreground">
                      {trip.deliveredAt ? "Delivered" : "Expected"}
                    </dt>
                    <dd className="text-right font-semibold">
                      {trip.deliveredAt
                        ? dateOnly(trip.deliveredAt)
                        : trip.expectedAt
                          ? dateOnly(trip.expectedAt)
                          : "—"}
                    </dd>
                    <dt className="text-muted-foreground">Unit</dt>
                    <dd className="text-right font-semibold">
                      {truck?.plateNumber ?? "—"}
                      {trailer ? ` + ${trailer.plateNumber}` : ""}
                    </dd>
                    <dt className="text-muted-foreground">Stops done</dt>
                    <dd className="text-right font-semibold">
                      {done} / {trip.stops.length}
                    </dd>
                  </dl>
                </div>

                {trip.stops.length > 0 ? (
                  <div className="mt-6 border-t border-border/60 pt-6">
                    <TripProgressTimeline stops={trip.stops} />
                  </div>
                ) : null}
              </PortalSection>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No trips assigned"
          description="Once operations schedules a run for you it will appear here with its full route."
        />
      )}
    </div>
  );
}
