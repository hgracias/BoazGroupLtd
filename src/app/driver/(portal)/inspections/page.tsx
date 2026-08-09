import { CheckCircle2, TriangleAlert, XCircle } from "lucide-react";

import { EmptyState, PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import { getTrailerById, getTruckById, listInspections } from "@/lib/data";
import type { InspectionResult } from "@/lib/data/types";
import { dateTime, inspectionResultLabels, inspectionTypeLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Inspections" };

const resultStyle: Record<
  InspectionResult,
  { chip: string; icon: typeof CheckCircle2; iconClass: string }
> = {
  PASS: {
    chip: "bg-emerald-500/15 text-emerald-300",
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
  },
  PASS_WITH_DEFECTS: {
    chip: "bg-amber-500/15 text-amber-200",
    icon: TriangleAlert,
    iconClass: "text-amber-400",
  },
  FAIL: { chip: "bg-red-500/15 text-red-300", icon: XCircle, iconClass: "text-red-400" },
};

export default async function InspectionsPage() {
  const driver = await requireDriver();
  const inspections = await listInspections({ driverId: driver.id });

  const rows = await Promise.all(
    inspections.map(async (inspection) => ({
      inspection,
      truck: await getTruckById(inspection.truckId),
      trailer: await getTrailerById(inspection.trailerId),
    }))
  );

  const passed = inspections.filter((item) => item.result === "PASS").length;
  const defects = inspections.filter((item) => item.result !== "PASS").length;

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PortalHeader
        title="Inspections"
        description="Pre-trip, post-trip and roadside checks recorded against your units."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <PortalSection>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Total logged
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">{inspections.length}</p>
        </PortalSection>
        <PortalSection>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Clean passes
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-emerald-400">{passed}</p>
        </PortalSection>
        <PortalSection>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            With findings
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-amber-400">{defects}</p>
        </PortalSection>
      </div>

      {rows.length ? (
        <ul className="space-y-4">
          {rows.map(({ inspection, truck, trailer }) => {
            const style = resultStyle[inspection.result];
            const Icon = style.icon;

            return (
              <li key={inspection.id}>
                <PortalSection>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClass}`} aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {inspectionTypeLabels[inspection.type]}
                          <span
                            className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${style.chip}`}
                          >
                            {inspectionResultLabels[inspection.result]}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dateTime(inspection.performedAt)} ·{" "}
                          {inspection.odometerKm.toLocaleString()} km
                        </p>
                        {inspection.note ? (
                          <p className="mt-2 max-w-2xl text-sm text-slate-300">
                            {inspection.note}
                          </p>
                        ) : null}
                        {inspection.defects.length ? (
                          <ul className="mt-3 space-y-1">
                            {inspection.defects.map((defect) => (
                              <li key={defect} className="text-sm text-amber-200">
                                • {defect}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-right text-sm">
                      <p className="font-semibold text-foreground">{truck?.plateNumber ?? "—"}</p>
                      {trailer ? (
                        <p className="text-muted-foreground">{trailer.plateNumber}</p>
                      ) : null}
                    </div>
                  </div>
                </PortalSection>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="No inspections recorded"
          description="Pre-trip checks logged against your assigned units will appear here."
        />
      )}
    </div>
  );
}
