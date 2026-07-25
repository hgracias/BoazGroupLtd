import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { company } from "@/lib/company";
import { getShipmentByRef, listShipments } from "@/lib/data";
import type { ShipmentStatus } from "@/lib/data/types";
import { dateOnly, dateTime, shipmentStatusLabels } from "@/lib/format";

export const metadata: Metadata = {
  title: "Track Shipment",
  description:
    "Track a Boaz Group consignment from Dar es Salaam to Rwanda, Kenya, Uganda, DR Congo or Burundi using your BGL tracking reference.",
  alternates: { canonical: "/tracking" },
};

const STAGES: ShipmentStatus[] = [
  "BOOKED",
  "LOADED",
  "IN_TRANSIT",
  "AT_BORDER",
  "CLEARED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const statusVariant: Record<ShipmentStatus, "gold" | "success" | "warning" | "danger" | "subtle"> = {
  BOOKED: "subtle",
  LOADED: "subtle",
  IN_TRANSIT: "gold",
  AT_BORDER: "warning",
  CLEARED: "gold",
  OUT_FOR_DELIVERY: "gold",
  DELIVERED: "success",
  EXCEPTION: "danger",
};

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const reference = (searchParams.ref ?? "").trim();
  const shipment = reference ? await getShipmentByRef(reference) : null;
  const samples = await listShipments();

  return (
    <>
      <PageHero
        breadcrumb="Track Shipment"
        eyebrow="Where is my cargo"
        title="Track a consignment."
        description="Enter the BGL reference from your booking confirmation. Milestones are logged by the transit controller as they happen."
      >
        <form className="mt-9 flex max-w-xl flex-col gap-3 sm:flex-row" role="search">
          <label htmlFor="ref" className="sr-only">
            Tracking reference
          </label>
          <Input
            id="ref"
            name="ref"
            defaultValue={reference}
            placeholder="e.g. BGL-2026-0455"
            autoCapitalize="characters"
            spellCheck={false}
            className="h-12 flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40"
          />
          <Button type="submit" variant="gold" size="lg">
            <Search className="h-4 w-4" aria-hidden="true" />
            Track
          </Button>
        </form>
      </PageHero>

      <section className="section bg-background">
        <div className="container">
          {reference && !shipment ? (
            <Card className="mx-auto max-w-2xl border-amber-200 bg-amber-50/60">
              <CardContent className="flex items-start gap-4 p-6">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-navy-900">
                    No shipment found for “{reference}”.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Check the reference against your booking confirmation — it looks like
                    BGL-YYYY-NNNN. If it still does not resolve, call the operations desk on{" "}
                    <a href={company.phoneHref} className="font-semibold text-navy-700 hover:underline">
                      {company.phone}
                    </a>{" "}
                    and we will look it up manually.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {shipment ? (
            <div className="mx-auto max-w-4xl">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking reference</p>
                      <p className="font-display text-2xl font-semibold text-navy-900">
                        {shipment.trackingRef}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Booked {dateOnly(shipment.bookedAt)} for {shipment.clientName}
                      </p>
                    </div>
                    <Badge variant={statusVariant[shipment.status]} className="self-start text-sm">
                      {shipmentStatusLabels[shipment.status]}
                    </Badge>
                  </div>

                  <dl className="grid gap-6 border-b border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail
                      icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
                      label="Route"
                      value={`${shipment.origin} → ${shipment.destination}`}
                    />
                    <Detail
                      icon={<Package className="h-4 w-4" aria-hidden="true" />}
                      label="Cargo"
                      value={shipment.cargoSummary}
                    />
                    <Detail
                      icon={<Truck className="h-4 w-4" aria-hidden="true" />}
                      label="Weight"
                      value={shipment.weightKg ? `${shipment.weightKg.toLocaleString()} kg` : "—"}
                    />
                    <Detail
                      icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
                      label={shipment.deliveredAt ? "Delivered" : "Estimated arrival"}
                      value={
                        shipment.deliveredAt
                          ? dateOnly(shipment.deliveredAt)
                          : shipment.etaAt
                            ? dateOnly(shipment.etaAt)
                            : "To be confirmed"
                      }
                    />
                  </dl>

                  {/* Stage progress */}
                  <ol className="flex flex-wrap gap-2 py-6">
                    {STAGES.map((stage) => {
                      const reached = shipment.events.some((event) => event.status === stage);
                      const current = shipment.status === stage;
                      return (
                        <li
                          key={stage}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            current
                              ? "bg-navy-700 text-white"
                              : reached
                                ? "bg-gold-100 text-gold-700"
                                : "bg-sand-100 text-muted-foreground"
                          }`}
                        >
                          {shipmentStatusLabels[stage]}
                        </li>
                      );
                    })}
                  </ol>

                  <h2 className="mt-2 font-display text-lg font-semibold text-navy-900">
                    Status timeline
                  </h2>
                  <ol className="mt-5 space-y-0">
                    {[...shipment.events]
                      .sort(
                        (a, b) =>
                          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
                      )
                      .map((event, index, array) => (
                        <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                          {index < array.length - 1 ? (
                            <span
                              aria-hidden="true"
                              className="absolute left-[11px] top-7 h-full w-px bg-border"
                            />
                          ) : null}
                          <span
                            className={`relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                              index === 0 ? "bg-navy-700 text-white" : "bg-sand-200 text-navy-700"
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-navy-900">
                              {shipmentStatusLabels[event.status]} · {event.location}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {dateTime(event.occurredAt)}
                            </p>
                            {event.note ? (
                              <p className="mt-1.5 text-sm text-navy-800">{event.note}</p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                  </ol>

                  <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
                    <Button asChild variant="outline">
                      <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                        Ask about this shipment on WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="ghost">
                      <a href={company.phoneHref}>Call the operations desk</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {!shipment ? (
            <div className="mx-auto mt-12 max-w-2xl">
              <div className="rounded-xl border border-dashed border-gold-300 bg-gold-50 p-6">
                <p className="font-semibold text-navy-900">Prototype data</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  These references resolve against the seeded shipments so you can see the
                  timeline in action. Replace them with live bookings once the database is
                  attached.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {samples.map((sample) => (
                    <li key={sample.id}>
                      <Link
                        href={`/tracking?ref=${sample.trackingRef}`}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-navy-800 hover:border-navy-300"
                      >
                        {sample.trackingRef}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
