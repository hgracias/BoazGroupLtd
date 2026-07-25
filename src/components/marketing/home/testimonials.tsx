import { Quote } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { testimonials } from "@/lib/content/site";

export function Testimonials() {
  return (
    <section className="section bg-sand-100">
      <div className="container">
        <SectionHeading
          eyebrow="Client experience"
          title="Shippers stay because the border stops being a gamble."
        />

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal as="li" key={testimonial.name} delay={index * 0.07}>
              <figure className="flex h-full flex-col rounded-xl border border-sand-200 bg-card p-7 shadow-card">
                <Quote className="h-7 w-7 text-gold-400" aria-hidden="true" />
                <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-navy-800">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-sand-200 pt-5">
                  <p className="text-sm font-semibold text-navy-900">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} · {testimonial.org}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
