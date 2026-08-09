import Link from "next/link";
import { AlertTriangle, ClipboardCheck, Gauge, Wrench } from "lucide-react";

import { FuelGauge } from "@/components/driver/dashboard/fuel-gauge";
import { EmptyState, InfoRow, PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import { Button } from "@/components/ui/button";
import {
  getActiveTripForDriver,
  getLatestInspection,
  getTrailerById,
  getTruckById,
  listMaintenance,
} from "@/lib/data";
import { formatMoney } from "@/lib/currency";
import {
  dateOnly,
  daysUntil,
  inspectionResultLabels,
  inspectionTypeLabels,
  maintenanceTypeLabels,
} from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Vehicle & Trailer" };

export default async function VehiclePage() {
  const driver = await requireDriver();
  const [truck, trip, inspection] = await Promise.all([
    getTruckById(driver.assignedTruckId),
    getActiveTripForDriver(driver.id),
    getLatestInspection(driver.id),
  ]);
  const trailer = await getTrailerById(trip?.trailerId);
  const maintenance = truck ? await listMaintenance({ truckId: truck.id }) : [];

  if (!truck) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <PortalHeader title="Vehicle & trailer" />
        <EmptyState
          title="No vehicle assigned"
          description="You are not currently assigned a truck. Operations will allocate one before your next trip."
        />
      </div>
    );
  }

  const insuranceDays = truck.insuranceExpiry ? daysUntil(truck.insuranceExpiry) : null;
  const serviceDueIn = truck.nextServiceKm ? truck.nextServiceKm - truck.odometerKm : null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <PortalHeader
        title="Vehicle & trailer"
        description="The unit assigned to you, its readings and its recent workshop history."
        action={
          <Button asChild variant="outline-inverse" size="touch">
            <Link href="/driver/maintenance/new">
              <Wrench className="h-4 w-4" aria-hidden="true" />
              Log maintenance
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <PortalSection title="Truck" description={`${truck.make} ${truck.model} · ${truck.year}`}>
          <p className="font-display text-3xl font-semibold tracking-tight">
            {truck.plateNumber}
          </p>
          <dl className="mt-4 divide-y divide-border/60">
            <InfoRow label="Trailer type carried" value={truck.trailerType ?? "—"} />
            <InfoRow
              label="Capacity"
              value={truck.capacityTons ? `${truck.capacityTons} t` : "—"}
            />
            <InfoRow label="Odometer" value={`${truck.odometerKm.toLocaleString()} km`} />
            <InfoRow label="Engine hours" value={`${truck.engineHours.toLocaleString()} h`} />
            <InfoRow
              label="Next service"
              value={truck.nextServiceKm ? `${truck.nextServiceKm.toLocaleString()} km` : "—"}
            />
            <InfoRow
              label="Insurance expires"
              value={truck.insuranceExpiry ? dateOnly(truck.insuranceExpiry) : "—"}
            />
          </dl>

          {serviceDueIn !== null && serviceDueIn <= 10_000 ? (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Service due in {serviceDueIn.toLocaleString()} km — book the workshop slot.
            </p>
          ) : null}
          {insuranceDays !== null && insuranceDays <= 45 ? (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Insurance expires in {insuranceDays} days. Border posts will not clear an
              expired certificate.
            </p>
          ) : null}
        </PortalSection>

        <div className="space-y-5">
          <PortalSection title="Fuel" description="Reading from the last telemetry sync.">
            <FuelGauge percent={truck.fuelLevelPercent} litres={truck.fuelCapacityLitres} />
          </PortalSection>

          <PortalSection title="Trailer">
            {trailer ? (
              <>
                <p className="font-display text-2xl font-semibold tracking-tight">
                  {trailer.plateNumber}
                </p>
                <dl className="mt-4 divide-y divide-border/60">
                  <InfoRow label="Type" value={trailer.type} />
                  <InfoRow label="Axles" value={String(trailer.axles)} />
                  <InfoRow
                    label="Capacity"
                    value={trailer.capacityTons ? `${trailer.capacityTons} t` : "—"}
                  />
                  <InfoRow
                    label="Inspection expires"
                    value={trailer.inspectionExpiry ? dateOnly(trailer.inspectionExpiry) : "—"}
                  />
                </dl>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No trailer is coupled to your current assignment.
              </p>
            )}
          </PortalSection>
        </div>
      </div>

      <PortalSection
        title="Latest inspection"
        action={
          <Button asChild variant="ghost" size="sm" className="text-blue-300 hover:bg-white/[0.06]">
            <Link href="/driver/inspections">
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              All inspections
            </Link>
          </Button>
        }
      >
        {inspection ? (
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">
                {inspectionTypeLabels[inspection.type]} ·{" "}
                {inspectionResultLabels[inspection.result]}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {dateOnly(inspection.performedAt)} · {inspection.odometerKm.toLocaleString()} km
              </p>
              {inspection.note ? (
                <p className="mt-2 max-w-xl text-sm text-slate-300">{inspection.note}</p>
              ) : null}
            </div>
            {inspection.defects.length ? (
              <ul className="space-y-1 text-sm text-amber-200">
                {inspection.defects.map((defect) => (
                  <li key={defect}>• {defect}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-emerald-300">No defects recorded</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No inspection logged yet.</p>
        )}
      </PortalSection>

      <PortalSection
        title="Workshop history"
        description={`Recent maintenance on ${truck.plateNumber}.`}
        action={
          <Button asChild variant="ghost" size="sm" className="text-blue-300 hover:bg-white/[0.06]">
            <Link href="/driver/maintenance">
              <Gauge className="h-4 w-4" aria-hidden="true" />
              Full history
            </Link>
          </Button>
        }
      >
        {maintenance.length ? (
          <ul className="divide-y divide-border/60">
            {maintenance.slice(0, 5).map((record) => (
              <li key={record.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {maintenanceTypeLabels[record.type]}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {dateOnly(record.performedAt)} · {record.odometerKm.toLocaleString()} km
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">
                  {formatMoney(record.costAmount, record.costCurrency)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing logged for this unit yet.</p>
        )}
      </PortalSection>
    </div>
  );
}
