import type { Metadata } from "next";

import { CorridorSection } from "@/components/marketing/home/corridor-section";
import { CtaBanner } from "@/components/marketing/home/cta-banner";
import { Hero } from "@/components/marketing/home/hero";
import { HowItWorks } from "@/components/marketing/home/how-it-works";
import { ServicesGrid } from "@/components/marketing/home/services-grid";
import { StatsBand } from "@/components/marketing/home/stats-band";

export const metadata: Metadata = {
  title: "Cross-Border Freight from Tanzania to Rwanda, Kenya, Burundi & Uganda",
  description:
    "Boaz Group Ltd moves containerised and loose cargo from Dar es Salaam to Kigali, Nairobi, Bujumbura and Kampala — own fleet, licensed customs clearance, warehousing and transit monitoring.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <CorridorSection />
      <ServicesGrid />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
