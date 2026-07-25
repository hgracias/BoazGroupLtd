import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { company } from "@/lib/company";
import { corridors } from "@/lib/content/corridors";
import { trustSignals } from "@/lib/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      {/* Layered brand texture: grid + gold glow, no stock photography. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-navy-grid bg-[size:56px_56px] opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-gold-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-56 left-1/4 h-[24rem] w-[24rem] rounded-full bg-navy-500/40 blur-3xl"
      />

      <div className="container relative py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80">
                <MapPin className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
                Dar es Salaam · Central Corridor since {company.foundedYear}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Cargo that crosses borders
                <span className="block text-gold-400">without losing days.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                We haul containerised and loose cargo out of Dar es Salaam to Kigali,
                Nairobi, Kampala, Goma and Bujumbura — on our own trucks, with customs
                pre-lodged before the wheels turn.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="gold" size="lg">
                  <Link href="/quote">
                    Get a Quote
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline-inverse" size="lg">
                  <Link href="/tracking">Track Shipment</Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
                {trustSignals.map((signal) => (
                  <li key={signal} className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {signal}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
              <p className="eyebrow text-gold-400">Live corridors</p>
              <p className="mt-3 font-display text-2xl font-semibold text-white">
                Five destination markets, one operations desk.
              </p>
              <ul className="mt-6 divide-y divide-white/10">
                {corridors.map((corridor) => (
                  <li
                    key={corridor.slug}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="rounded bg-white/10 px-1.5 py-1 text-[10px] font-bold tracking-wider text-white/70"
                      >
                        {corridor.countryCode}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Dar es Salaam → {corridor.destination}
                        </p>
                        <p className="text-xs text-white/50">
                          via {corridor.borderPost} · {corridor.distanceKm.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-300">
                      {corridor.transitDays}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/routes"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300"
              >
                See full coverage & border posts
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
