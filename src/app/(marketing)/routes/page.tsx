import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Flag, MapPin, Package, Route as RouteIcon } from "lucide-react";

import { CorridorMap } from "@/components/marketing/corridor-map";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { corridors } from "@/lib/content/corridors";

export const metadata: Metadata = {
  title: "Routes & Coverage",
  description:
    "Cross-border corridors from Dar es Salaam to Kigali, Nairobi, Kampala, Goma and Bujumbura — border posts used, distances, transit times and departure frequency.",
  alternates: { canonical: "/routes" },
};

export default function RoutesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Routes & Coverage"
        eyebrow="Where we run"
        title="Five corridors out of Dar es Salaam."
        description="Every route below is one we run ourselves, through border posts where we hold standing agent relationships. Transit times are realistic ranges from loading to delivery, not best-case marketing numbers."
      />

      <section className="bg-navy-900 pb-16 pt-4 md:pb-24">
        <div className="container">
          <CorridorMap />
        </div>
      </section>

      <section className="section bg-background">
        <div className="container">
          <SectionHeading
            eyebrow="Corridor detail"
            title="What each run actually involves."
            description="Distances are road kilometres from our Vingunguti yard. Transit times assume normal border conditions — we tell you when they are not."
          />

          <div className="mt-12 space-y-8">
            {corridors.map((corridor, index) => (
              <Reveal key={corridor.slug} delay={index * 0.05}>
                <article
                  id={corridor.slug}
                  className="scroll-mt-28 overflow-hidden rounded-xl border border-border bg-card shadow-card"
                >
                  <div className="flex flex-col gap-4 border-b border-border bg-sand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-navy-100 px-2 py-1 text-[11px] font-bold tracking-wider text-navy-800">
                          {corridor.countryCode}
                        </span>
                        <h3 className="font-display text-2xl font-semibold text-navy-900">
                          Dar es Salaam → {corridor.destination}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {corridor.country} · settle in {corridor.currency}
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/quote?destination=${corridor.slug}`}>
                        Quote this lane
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-8 p-6 lg:grid-cols-[1.4fr_1fr] sm:p-8">
                    <div>
                      <p className="text-muted-foreground">{corridor.summary}</p>

                      <h4 className="mt-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <RouteIcon className="h-4 w-4" aria-hidden="true" />
                        Route
                      </h4>
                      <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
                        {corridor.waypoints.map((point, pointIndex) => {
                          const isBorder = corridor.borderPost.startsWith(point.name);
                          const isLast = pointIndex === corridor.waypoints.length - 1;
                          return (
                            <li key={point.name} className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  isBorder
                                    ? "bg-gold-100 text-gold-700"
                                    : isLast
                                      ? "bg-navy-700 text-white"
                                      : "bg-sand-100 text-navy-800"
                                }`}
                              >
                                {point.name}
                                {isBorder ? " ⛳" : ""}
                              </span>
                              {!isLast ? (
                                <span aria-hidden="true" className="text-muted-foreground">
                                  →
                                </span>
                              ) : null}
                            </li>
                          );
                        })}
                      </ol>

                      <h4 className="mt-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <Flag className="h-4 w-4" aria-hidden="true" />
                        Border crossing
                      </h4>
                      <p className="mt-3 text-sm text-navy-800">
                        <span className="font-semibold">{corridor.borderPost}</span> —{" "}
                        {corridor.borderNote}
                      </p>
                      {corridor.altBorderPosts.length ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Alternative posts: {corridor.altBorderPosts.join(", ")}
                        </p>
                      ) : null}

                      <h4 className="mt-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <Package className="h-4 w-4" aria-hidden="true" />
                        Typical cargo
                      </h4>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {corridor.cargo.map((item) => (
                          <li key={item}>
                            <Badge variant="outline">{item}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-1">
                      <Metric label="Distance" value={`${corridor.distanceKm.toLocaleString()} km`} />
                      <Metric label="Transit time" value={corridor.transitDays} icon />
                      <Metric label="Departures" value={corridor.departures} />
                      <Metric label="Settlement currency" value={corridor.currency} />
                    </dl>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand-100">
        <div className="container">
          <SectionHeading
            eyebrow="Side by side"
            title="Corridor comparison."
            description="Useful when the consignee could be served from more than one lane."
          />
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Corridor</TableHead>
                  <TableHead>Border post</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead>Transit</TableHead>
                  <TableHead>Departures</TableHead>
                  <TableHead>Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {corridors.map((corridor) => (
                  <TableRow key={corridor.slug}>
                    <TableCell className="whitespace-nowrap font-semibold">
                      <Link href={`#${corridor.slug}`} className="hover:underline">
                        Dar es Salaam → {corridor.destination}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{corridor.borderPost}</TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      {corridor.distanceKm.toLocaleString()} km
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{corridor.transitDays}</TableCell>
                    <TableCell className="whitespace-nowrap">{corridor.departures}</TableCell>
                    <TableCell>{corridor.currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
            Serving a destination not listed — Lubumbashi, Juba, Lusaka? Ask. We run those
            on request through partner carriers and will say so plainly rather than
            pretending it is our own fleet.
          </p>
        </div>
      </section>

      <section className="bg-navy-900 py-16 text-white md:py-20">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Know your lane? Get it priced.
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <Link href="/quote">
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline-inverse" size="lg">
              <Link href="/tracking">Track a Shipment</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="bg-card p-5">
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon ? <Clock className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-lg font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
