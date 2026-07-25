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
  foundedYear: 2011,
  logo: "/brand/boaz-logo.jpg",

  // PLACEHOLDER — swap for real numbers/addresses.
  phone: "+255 22 286 1140",
  phoneHref: "tel:+255222861140",
  whatsapp: "+255 754 000 000",
  whatsappHref: "https://wa.me/255754000000",
  email: "operations@boazgroup.co.tz",
  emailHref: "mailto:operations@boazgroup.co.tz",

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
      // PLACEHOLDER address
      address: ["Nyerere Road, Vingunguti", "P.O. Box 78421", "Dar es Salaam, Tanzania"],
      phone: "+255 22 286 1140",
      mapQuery: "Nyerere Road, Vingunguti, Dar es Salaam, Tanzania",
    },
    {
      id: "port",
      label: "Port Liaison Desk",
      city: "Dar es Salaam Port",
      country: "Tanzania",
      address: ["Kurasini, Gate 5 Area", "Dar es Salaam Port", "Dar es Salaam, Tanzania"],
      phone: "+255 22 286 1141",
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
