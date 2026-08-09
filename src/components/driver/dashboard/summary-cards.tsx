import { CalendarClock, MapPin, Package, Truck } from "lucide-react";

import type { Trailer, Trip, Truck as TruckType } from "@/lib/data/types";
import { dateTime, tripStatusLabels } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The three light summary cards that sit at the top of the dashboard —
 * deliberately white against the navy shell, as in the reference design.
 */
function LightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white p-5 text-navy-900 shadow-[0_18px_40px_-28px_rgba(2,8,20,0.95)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">{children}</p>
  );
}

export function AssignmentCard({ trip }: { trip: Trip | null }) {
  return (
    <LightCard className="lg:col-span-5">
      <CardLabel>Today&apos;s assignment</CardLabel>

      {trip ? (
        <>
          <p className="mt-3 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {trip.reference}
          </p>

          <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
            <span>
              {trip.origin} <span aria-hidden="true">→</span> {trip.destination}
            </span>
          </p>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 shrink-0 text-navy-400" aria-hidden="true" />
              <dt className="text-navy-500">Departure</dt>
              <dd className="font-semibold">
                {trip.departedAt ? dateTime(trip.departedAt) : "Not yet departed"}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 shrink-0 text-navy-400" aria-hidden="true" />
              <dt className="text-navy-500">Cargo</dt>
              <dd className="truncate font-semibold">{trip.cargoSummary ?? "—"}</dd>
            </div>
          </dl>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            {tripStatusLabels[trip.status]}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-navy-500">
          No trip assigned right now. Operations will notify you when the next load is
          planned.
        </p>
      )}
    </LightCard>
  );
}

export function VehicleCard({ truck }: { truck: TruckType | null }) {
  return (
    <LightCard className="lg:col-span-4">
      <CardLabel>Current vehicle</CardLabel>

      {truck ? (
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              {truck.plateNumber}
            </p>
            <p className="mt-1 text-sm text-navy-500">
              {truck.make} {truck.model} · {truck.year}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              {truck.status === "ACTIVE" ? "Roadworthy" : "In workshop"}
            </p>
          </div>
          <TruckSilhouette className="hidden h-16 w-auto shrink-0 text-navy-200 sm:block" />
        </div>
      ) : (
        <p className="mt-4 text-sm text-navy-500">No truck assigned to you at the moment.</p>
      )}
    </LightCard>
  );
}

export function TrailerCard({ trailer }: { trailer: Trailer | null }) {
  return (
    <LightCard className="lg:col-span-3">
      <CardLabel>Trailer</CardLabel>

      {trailer ? (
        <>
          <p className="mt-3 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {trailer.plateNumber}
          </p>
          <p className="mt-1 text-sm text-navy-500">
            {trailer.type} · {trailer.axles} axles
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-navy-400" aria-hidden="true" />
            <span className="text-navy-500">Capacity</span>
            <span className="font-semibold">
              {trailer.capacityTons ? `${trailer.capacityTons} t` : "—"}
            </span>
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-navy-500">No trailer coupled to this assignment.</p>
      )}
    </LightCard>
  );
}

/** Simple side-view tractor unit — drawn, not a licensed photo. */
function TruckSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true" fill="currentColor">
      <path d="M4 14h52v28H4a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2Z" opacity="0.55" />
      <path d="M60 20h24l12 12v10H60z" />
      <path d="M64 24h16l8 8H64z" fill="#fff" opacity="0.65" />
      <circle cx="26" cy="46" r="8" />
      <circle cx="26" cy="46" r="3.4" fill="#fff" />
      <circle cx="84" cy="46" r="8" />
      <circle cx="84" cy="46" r="3.4" fill="#fff" />
      <rect x="2" y="42" width="112" height="3" rx="1.5" opacity="0.35" />
    </svg>
  );
}
