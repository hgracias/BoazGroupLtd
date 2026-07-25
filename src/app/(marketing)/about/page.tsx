import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { company } from "@/lib/company";
import { compliance, fleet, leadership, milestones, values } from "@/lib/content/about";
import { stats } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Boaz Group Ltd is a Tanzanian cross-border road freight and clearing company based in Dar es Salaam, running company-owned trucks across the East African Community corridor since 2020.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow="Who we are"
        title="A Dar es Salaam haulier that treats the border as part of the job."
        description="Boaz Group Ltd has been moving cargo out of Dar es Salaam since 2020. We own the trucks, employ the drivers and hold the clearing licence — which is why we can be held to a date."
      />

      <section className="section bg-background">
        <div className="container grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div>
              <p className="eyebrow">Our story</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
                One truck, one corridor, a lot of queuing.
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  The company started with a single prime mover shuttling containers
                  between Dar es Salaam port and inland depots. The freight was the easy
                  part. What cost clients money was the border — entries lodged late,
                  documents that did not match the manifest, trucks idling at Rusumo while
                  someone in an office chased a signature.
                </p>
                <p>
                  So we became a licensed clearing and forwarding agent ourselves rather
                  than subcontracting the part that actually determined the transit time.
                  Today the declaration is lodged before the truck leaves the yard, and the
                  same operations desk that booked your load is the one that answers when
                  you ask where it is.
                </p>
                <p>
                  Six years on we run {stats[3].value} company-owned prime movers across
                  five corridors, from a yard and warehouse in Vingunguti. It is a small
                  fleet on purpose: we still turn down loads we cannot deliver on time,
                  because that is cheaper than an apology.
                </p>
              </div>

              <figure className="mt-10 border-l-2 border-gold-500 pl-6">
                <Quote className="h-6 w-6 text-gold-500" aria-hidden="true" />
                <blockquote className="mt-3 font-display text-xl leading-relaxed text-navy-900">
                  Quality is our definition. On this corridor that means one thing:
                  the cargo arrives when we said it would.
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  {leadership[0].name}, {leadership[0].role}
                </figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="lg:sticky lg:top-28">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  At a glance
                </h3>
                <dl className="mt-4 divide-y divide-border">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                      <dd className="font-display text-lg font-semibold text-navy-900">
                        {stat.value}
                        <span className="text-gold-600">{stat.suffix}</span>
                      </dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-sm text-muted-foreground">Head office</dt>
                    <dd className="text-sm font-semibold text-navy-900">
                      {company.offices[0].city}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section bg-sand-100">
        <div className="container">
          <SectionHeading eyebrow="How we work" title="Four things we do not compromise on." />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {values.map((value, index) => (
              <Reveal as="li" key={value.title} delay={index * 0.05}>
                <div className="h-full rounded-xl border border-sand-200 bg-card p-7 shadow-card">
                  <h3 className="font-display text-xl font-semibold text-navy-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container">
          <SectionHeading eyebrow="Milestones" title="How the corridor network was built." />
          <ol className="mt-12 space-y-0">
            {milestones.map((milestone, index) => (
              <Reveal as="li" key={milestone.year} delay={index * 0.04}>
                <div className="relative flex gap-6 pb-10 last:pb-0">
                  {index < milestones.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[39px] top-12 h-full w-px bg-border"
                    />
                  ) : null}
                  <span className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-card font-display text-lg font-semibold text-navy-900">
                    {milestone.year}
                  </span>
                  <div className="pt-5">
                    <h3 className="font-display text-lg font-semibold text-navy-900">
                      {milestone.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                      {milestone.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-navy-900 text-white">
        <div className="container">
          <SectionHeading
            tone="light"
            eyebrow="Leadership"
            title="The people who answer when something goes wrong."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person, index) => (
              <Reveal as="li" key={person.name} delay={index * 0.05}>
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.04] p-6">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 font-display text-lg font-semibold text-navy-900">
                    {person.initials}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">
                    {person.name}
                  </h3>
                  <p className="text-sm text-gold-400">{person.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{person.bio}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow">Fleet</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
                Owned, maintained and tracked in-house.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every unit is serviced on interval at our own workshop, with maintenance
                logged by the driver against the plate number. Insurance and roadworthiness
                are checked before dispatch, not at the border.
              </p>
              <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
                {fleet.map((item) => (
                  <li key={item.type} className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <p className="font-semibold text-navy-900">{item.type}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <p className="shrink-0 font-display text-lg font-semibold text-navy-900">
                      {item.count}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <p className="eyebrow">Compliance</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
                Licences and cover.
              </h2>
              <p className="mt-4 text-muted-foreground">
                The documents that let a truck cross a border without an argument.
                Certificates are available on request during onboarding.
              </p>
              <ul className="mt-8 space-y-3">
                {compliance.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-navy-800">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-xl bg-sand-100 p-6">
                <p className="font-semibold text-navy-900">Working with us for the first time?</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Onboarding takes one call. We will send the licence pack, agree payment
                  terms and give you a named transit controller before the first load.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/contact">
                    Start onboarding
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
