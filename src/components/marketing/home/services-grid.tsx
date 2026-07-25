import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { services } from "@/lib/content/services";

export function ServicesGrid() {
  return (
    <section className="section bg-background">
      <div className="container">
        <SectionHeading
          eyebrow="What we do"
          title="Everything between the loading bay and the delivery note."
          description="Six services that exist because a truck alone does not move cargo across a border — paperwork, storage and monitoring do the rest."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={index * 0.05}>
              <Link
                href={`/services#${service.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lift"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-700 group-hover:text-white">
                  <service.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.short}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-700">
                  Read more
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
