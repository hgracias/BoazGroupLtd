import type { LucideIcon } from "lucide-react";
import { Truck, FileCheck2, Warehouse, Zap, ShieldCheck, Route } from "lucide-react";

export type Service = {
  slug: string;
  icon: LucideIcon;
  title: string;
  short: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
};

export const services: Service[] = [
  {
    slug: "cross-border-trucking",
    icon: Truck,
    title: "Cross-Border Road Freight",
    short:
      "Full-truck and part-load haulage from Dar es Salaam to Rwanda, Kenya, Burundi and Uganda.",
    description:
      "Our core business. We move containerised and loose cargo out of Dar es Salaam port and inland depots to consignees across the EAC, on our own fleet with our own drivers — no unvetted subcontracting. Every load is assigned a named transit controller who owns it from loading bay to final delivery note.",
    highlights: [
      "FTL, LTL and containerised (20ft / 40ft) movements",
      "Company-owned fleet with GPS tracking and fuel telemetry",
      "COMESA Yellow Card and regional third-party cover on every unit",
      "Bonded transit under TANCIS / RADDEx where required",
    ],
    specs: [
      { label: "Fleet", value: "38 prime movers" },
      { label: "Max payload", value: "30 tonnes / unit" },
      { label: "Trailer types", value: "Flatbed, skeletal, curtain-side, tipper" },
    ],
  },
  {
    slug: "customs",
    icon: FileCheck2,
    title: "Customs & Border Clearance",
    short:
      "Licensed clearing support at Rusumo, Namanga, Kabanga, Mutukula and the Dar es Salaam port gates.",
    description:
      "Border delays are the single biggest cost in EAC road freight. We pre-lodge declarations before the truck leaves the yard, hold standing relationships with agents at each post, and escalate stuck consignments the same day. Clients get the entry number and the clearance status, not a promise.",
    highlights: [
      "Pre-lodgement on TANCIS, RADDEx and the EAC Single Customs Territory",
      "Duty and VAT computation before dispatch, so there are no surprises",
      "Transit bonds, T1 documentation and gate passes handled end to end",
      "Same-day escalation path at every border post we use",
    ],
    specs: [
      { label: "Border posts", value: "6 active" },
      { label: "Avg. clearance", value: "6 – 14 hrs" },
      { label: "Regimes", value: "SCT, transit, home consumption" },
    ],
  },
  {
    slug: "warehousing",
    icon: Warehouse,
    title: "Warehousing & Consolidation",
    short:
      "Secured storage and cargo consolidation at our Vingunguti yard, minutes from the port corridor.",
    description:
      "Cargo rarely arrives ready to move. Our Dar es Salaam facility takes in part-loads, palletises and consolidates them into full trucks headed for the same corridor, which is how smaller importers get FTL economics on an LTL volume.",
    highlights: [
      "4,200 m² covered warehouse plus fenced hardstanding yard",
      "24/7 manned security, CCTV and per-consignment stock cards",
      "Consolidation into scheduled Kigali, Nairobi and Kampala departures",
      "Short-term bonded and general storage options",
    ],
    specs: [
      { label: "Covered area", value: "4,200 m²" },
      { label: "Yard", value: "1.8 hectares" },
      { label: "Security", value: "24/7 + CCTV" },
    ],
  },
  {
    slug: "express",
    icon: Zap,
    title: "Express & Project Cargo",
    short:
      "Time-critical runs, abnormal loads and dedicated trucks for cargo that cannot wait in a queue.",
    description:
      "For breakdown-critical spares, perishables and project equipment, we run dedicated units with two-driver relays and priority border handling. Departure is committed in hours, not days, and the transit controller reports at every checkpoint.",
    highlights: [
      "Dedicated truck, no consolidation stops",
      "Two-driver relay on Nairobi and Kigali corridors",
      "Abnormal and over-dimensional load permits arranged",
      "Checkpoint-by-checkpoint reporting to a named contact",
    ],
    specs: [
      { label: "Dispatch", value: "From 6 hrs" },
      { label: "Relay crews", value: "Available" },
      { label: "Escort", value: "On request" },
    ],
  },
  {
    slug: "cargo-insurance",
    icon: ShieldCheck,
    title: "Cargo Insurance Facilitation",
    short: "Goods-in-transit cover arranged through regional underwriters before dispatch.",
    description:
      "We arrange goods-in-transit and marine extension cover through licensed Tanzanian underwriters so your consignment is protected across every border on the route, not just the first leg.",
    highlights: [
      "Goods-in-transit cover across all four destination markets",
      "Certificates issued before the truck leaves the yard",
      "Claims support with documented PODs and incident reports",
    ],
    specs: [
      { label: "Cover", value: "Regional GIT" },
      { label: "Issued", value: "Pre-dispatch" },
      { label: "Claims", value: "Documented support" },
    ],
  },
  {
    slug: "transit-monitoring",
    icon: Route,
    title: "Transit Monitoring & Reporting",
    short: "Live shipment status, border milestones and proof of delivery in one reference number.",
    description:
      "Every consignment gets a Boaz tracking reference from booking. Status updates are logged by the transit controller at loading, each border post and delivery, and are visible to you without a phone call.",
    highlights: [
      "One reference number from booking to POD",
      "Border-post milestones logged as they happen",
      "Digital proof of delivery on request",
    ],
    specs: [
      { label: "Updates", value: "Per milestone" },
      { label: "POD", value: "Digital + hard copy" },
      { label: "Access", value: "Public tracking page" },
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
