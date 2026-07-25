import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { corridors } from "@/lib/content/corridors";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cross-border road freight, customs and border clearance, warehousing and consolidation, express and project cargo, insurance facilitation and transit monitoring from Dar es Salaam across the EAC.",
  alternates: { canonical: "/services" },
};

const customsFaq = [
  {
    q: "Which customs regimes do you handle?",
    a: "Transit under the EAC Single Customs Territory, home consumption entries, warehousing and temporary imports. We pre-lodge on TANCIS and share data through RADDEx with the destination revenue authority before the truck leaves the yard.",
  },
  {
    q: "Who pays the duties and taxes?",
    a: "You do, but we compute them before dispatch and put them in writing with the freight rate, so the landed cost is known upfront rather than discovered at the border. We can pay on your behalf against a deposit where that speeds up clearance.",
  },
  {
    q: "What happens if a consignment is held at the border?",
    a: "Your transit controller escalates the same day through our standing agent at that post and reports back with the reason and the expected release. You get the entry number and the officer's query, not a vague apology.",
  },
  {
    q: "Do you handle abnormal or over-dimensional loads?",
    a: "Yes — permits are arranged through TANROADS and the equivalent authority in the destination country, with escort where the route demands it. Lead time is longer, so tell us early.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow="What we do"
        title="Freight, paperwork and storage — handled by one operations desk."
        description="A truck alone does not move cargo across a border. These six services are what actually gets a consignment from the port gate in Dar es Salaam to a consignee in Kigali, Nairobi, Bujumbura or Kampala."
      />

      <nav aria-label="Services" className="border-b border-border bg-white">
        <ul className="container flex gap-1 overflow-x-auto py-2">
          {services.map((service) => (
            <li key={service.slug}>
              <a
                href={`#${service.slug}`}
                className="inline-flex h-11 items-center whitespace-nowrap rounded-md px-4 text-sm font-medium text-muted-foreground hover:bg-sand-100 hover:text-navy-900"
              >
                {service.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-background">
        {services.map((service, index) => (
          <section
            key={service.slug}
            id={service.slug}
            className={`scroll-mt-32 border-b border-border ${
              index % 2 === 1 ? "bg-sand-50" : "bg-background"
            }`}
          >
            <div className="container py-16 md:py-20">
              <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
                <Reveal>
                  <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-700 text-white">
                      <service.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-navy-900">
                      {service.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {service.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                          <span className="text-sm text-navy-800">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <aside className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      At a glance
                    </h3>
                    <dl className="mt-4 divide-y divide-border">
                      {service.specs.map((spec) => (
                        <div key={spec.label} className="flex justify-between gap-4 py-3">
                          <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                          <dd className="text-right text-sm font-semibold text-navy-900">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <Button asChild className="mt-6 w-full">
                      <Link href={`/quote?service=${service.slug}`}>
                        Get a quote
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </aside>
                </Reveal>
              </div>

              {service.slug === "customs" ? (
                <Reveal delay={0.1}>
                  <div className="mt-14 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
                    <h3 className="font-display text-xl font-semibold text-navy-900">
                      Border posts we clear through
                    </h3>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {corridors.map((corridor) => (
                        <li
                          key={corridor.slug}
                          className="rounded-lg border border-border bg-sand-50 p-5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-navy-900">{corridor.borderPost}</p>
                            <Badge variant="subtle">{corridor.country}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {corridor.borderNote}
                          </p>
                          {corridor.altBorderPosts.length ? (
                            <p className="mt-3 text-xs text-muted-foreground">
                              Alternatives: {corridor.altBorderPosts.join(", ")}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-10 font-display text-xl font-semibold text-navy-900">
                      Common questions
                    </h3>
                    <Accordion type="single" collapsible className="mt-2">
                      {customsFaq.map((item) => (
                        <AccordionItem key={item.q} value={item.q}>
                          <AccordionTrigger>{item.q}</AccordionTrigger>
                          <AccordionContent>{item.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <section className="section bg-navy-900 text-white">
        <div className="container text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Not sure which of these you actually need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Describe the load and the destination. We will tell you what the corridor
            requires and quote only that.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <Link href="/quote">
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline-inverse" size="lg">
              <Link href="/contact">Talk to operations</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
