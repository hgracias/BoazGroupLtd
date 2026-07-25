/**
 * Single source of truth for company identity and contact details.
 * Everything marked PLACEHOLDER should be replaced with real details
 * before the site goes live — nothing else in the app hardcodes them.
 */

export const company = {
  name: "Boaz Group Ltd",
  shortName: "Boaz Group",
  tagline: "Quality Is Our Definition",
  positioning:
    "Cross-border road freight across the East African Community corridor.",
  foundedYear: 2020,
  logo: "/brand/boaz-logo.jpg",

  phone: "+255 677 841 333",
  phoneHref: "tel:+255677841333",
  // International line — clients outside the region reach the same desk.
  whatsapp: "+1 617 818 5235",
  whatsappHref: "https://wa.me/16178185235",
  email: "Jimmyhboaz@boazigroup.com",
  emailHref: "mailto:Jimmyhboaz@boazigroup.com",

  hours: {
    weekday: "Mon – Fri, 07:30 – 18:00 EAT",
    saturday: "Sat, 08:00 – 13:00 EAT",
    note: "Border operations desk runs 24/7 during active transits.",
  },

  offices: [
    {
      id: "hq",
      label: "Head Office & Yard",
      city: "Dar es Salaam",
      country: "Tanzania",
      // PLACEHOLDER address — street, P.O. box and the second office below
      // are still unconfirmed.
      address: ["Nyerere Road, Vingunguti", "P.O. Box 78421", "Dar es Salaam, Tanzania"],
      phone: "+255 677 841 333",
      mapQuery: "Nyerere Road, Vingunguti, Dar es Salaam, Tanzania",
    },
    {
      id: "port",
      label: "Port Liaison Desk",
      city: "Dar es Salaam Port",
      country: "Tanzania",
      address: ["Kurasini, Gate 5 Area", "Dar es Salaam Port", "Dar es Salaam, Tanzania"],
      phone: "+255 677 841 333",
      mapQuery: "Dar es Salaam Port, Kurasini, Tanzania",
    },
  ],

  socials: {
    linkedin: "#",
    facebook: "#",
    instagram: "#",
  },
} as const;

export const mainNav = [
  { href: "/services", label: "Services" },
  { href: "/routes", label: "Routes & Coverage" },
  { href: "/tracking", label: "Track Shipment" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/routes", label: "Routes & Coverage" },
    { href: "/contact", label: "Contact" },
  ],
  customers: [
    { href: "/quote", label: "Request a Quote" },
    { href: "/tracking", label: "Track a Shipment" },
    { href: "/services#customs", label: "Customs Clearance" },
    { href: "/services#warehousing", label: "Warehousing" },
  ],
  internal: [
    { href: "/driver/login", label: "Driver Portal" },
    { href: "/admin", label: "Operations Admin" },
  ],
} as const;
