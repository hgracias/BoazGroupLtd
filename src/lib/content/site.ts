import type { LucideIcon } from "lucide-react";
import { ClipboardList, PackageCheck, MapPin, FileSignature } from "lucide-react";

export const stats = [
  { value: "14", suffix: "+", label: "Years on the Central Corridor" },
  { value: "6", suffix: "", label: "Border posts worked daily" },
  { value: "96.4", suffix: "%", label: "On-time delivery, last 12 months" },
  { value: "38", suffix: "", label: "Company-owned prime movers" },
];

export type Step = { icon: LucideIcon; title: string; body: string };

export const howItWorks: Step[] = [
  {
    icon: ClipboardList,
    title: "Tell us the load",
    body: "Send the origin, destination, cargo type and weight. You get a written rate with duties, border fees and transit time broken out — no bundled surprises.",
  },
  {
    icon: FileSignature,
    title: "We clear before we roll",
    body: "Declarations are pre-lodged on TANCIS and RADDEx while the truck is still loading, so the paperwork reaches the border before the wheels do.",
  },
  {
    icon: MapPin,
    title: "Track every milestone",
    body: "One reference number covers loading, each border post and delivery. Your named transit controller logs the status as it happens.",
  },
  {
    icon: PackageCheck,
    title: "Delivered and documented",
    body: "Signed proof of delivery, digital and hard copy, plus the customs entry number for your own records and audit trail.",
  },
];

export const testimonials = [
  {
    quote:
      "We moved four 40ft containers of roofing sheets to Kigali on a deadline. Boaz pre-lodged at Rusumo and the trucks cleared the same afternoon — our own agent had quoted us three days for that step alone.",
    name: "Aline Mukamana",
    role: "Procurement Lead",
    org: "Horizon Build Rwanda, Kigali",
  },
  {
    quote:
      "What I actually buy from them is the phone call I don't have to make. The transit controller updates us at every post, so I stop chasing and start planning around a real date.",
    name: "Samuel Otieno",
    role: "Supply Chain Manager",
    org: "Rift Valley Distributors, Nairobi",
  },
  {
    quote:
      "Kobero has caught us out before with documentation. Two years with Boaz and we have not had a single consignment held over a paperwork gap. That consistency is worth more than a lower rate.",
    name: "Jean-Claude Nduwimana",
    role: "Operations Director",
    org: "Lac Tanganyika Trading, Bujumbura",
  },
];

export const trustSignals = [
  "TRA-licensed clearing & forwarding",
  "COMESA Yellow Card on every unit",
  "EAC Single Customs Territory pre-lodgement",
  "TASSTA member",
];
