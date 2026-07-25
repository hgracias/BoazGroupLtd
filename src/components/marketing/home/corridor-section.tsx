import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CorridorMap } from "@/components/marketing/corridor-map";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";

export function CorridorSection() {
  return (
    <section className="bg-navy-900 py-16 text-white md:py-24">
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="light"
            eyebrow="Routes & coverage"
            title="The Central Corridor, mapped by the posts we actually clear."
            description="Tap a destination to see the road we take, where the truck crosses, and how long the run realistically takes."
          />
          <Reveal delay={0.1}>
            <Button asChild variant="outline-inverse">
              <Link href="/routes">
                Full route detail
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="mt-12">
          <CorridorMap />
        </Reveal>
      </div>
    </section>
  );
}
