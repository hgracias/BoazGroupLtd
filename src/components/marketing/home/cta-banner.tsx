import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { company } from "@/lib/company";

export function CtaBanner() {
  return (
    <section className="bg-background pb-16 pt-4 md:pb-24">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-navy-800 px-7 py-12 text-white sm:px-12 md:py-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-navy-grid bg-[size:48px_48px] opacity-60"
            />
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_auto]">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Tell us the load. We&apos;ll tell you the real landed cost.
                </h2>
                <p className="mt-4 max-w-xl text-white/70">
                  Rates broken down by freight, duties and border fees — quoted in writing,
                  usually within one working day.
                </p>
                <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
                  <a href={company.phoneHref} className="flex items-center gap-2 hover:text-white">
                    <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {company.phone}
                  </a>
                  <a
                    href={company.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {company.whatsapp}
                  </a>
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
