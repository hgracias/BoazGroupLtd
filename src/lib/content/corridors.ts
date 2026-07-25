/**
 * The cross-border corridors Boaz Group runs out of Dar es Salaam.
 * Coordinates are real lat/lng — the route map projects them, so the
 * schematic keeps the true geographic relationship between the cities.
 */

export type Point = { name: string; lat: number; lng: number };

export type Corridor = {
  slug: string;
  country: string;
  countryCode: string;
  flag: string;
  destination: string;
  colorVar: string;
  distanceKm: number;
  transitDays: string;
  borderPost: string;
  borderNote: string;
  altBorderPosts: string[];
  currency: string;
  summary: string;
  waypoints: Point[];
  cargo: string[];
  departures: string;
};

export const origin: Point = { name: "Dar es Salaam", lat: -6.82, lng: 39.28 };

export const corridors: Corridor[] = [
  {
    slug: "kenya",
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    destination: "Nairobi",
    colorVar: "#C9962E",
    distanceKm: 930,
    transitDays: "2 – 3 days",
    borderPost: "Namanga OSBP",
    borderNote:
      "One-stop border post — Tanzanian and Kenyan authorities clear in a single hall, which is why this is our fastest corridor.",
    altBorderPosts: ["Holili – Taveta", "Horohoro – Lunga Lunga"],
    currency: "KES",
    summary:
      "The shortest and busiest of our lanes. Daily departures via Namanga, with Holili and Horohoro used when the Arusha leg is congested or the consignee sits on the coast.",
    waypoints: [
      { name: "Dar es Salaam", lat: -6.82, lng: 39.28 },
      { name: "Chalinze", lat: -6.64, lng: 38.35 },
      { name: "Korogwe", lat: -5.15, lng: 38.46 },
      { name: "Arusha", lat: -3.37, lng: 36.68 },
      { name: "Namanga", lat: -2.55, lng: 36.79 },
      { name: "Nairobi", lat: -1.29, lng: 36.82 },
    ],
    cargo: ["Containerised imports", "Building materials", "FMCG", "Machinery & spares"],
    departures: "Daily",
  },
  {
    slug: "rwanda",
    country: "Rwanda",
    countryCode: "RW",
    flag: "🇷🇼",
    destination: "Kigali",
    colorVar: "#3D4599",
    distanceKm: 1470,
    transitDays: "4 – 5 days",
    borderPost: "Rusumo OSBP",
    borderNote:
      "One-stop post on the Kagera river. We pre-lodge under the EAC Single Customs Territory so trucks are not sitting in the queue waiting on paperwork.",
    altBorderPosts: ["Kabanga – Kobero (via Burundi)"],
    currency: "RWF",
    summary:
      "The Central Corridor proper: Dar es Salaam to Kigali via Morogoro, Dodoma, Singida, Nzega and Rusumo. Our highest-volume long-haul lane and the one our transit controllers know best.",
    waypoints: [
      { name: "Dar es Salaam", lat: -6.82, lng: 39.28 },
      { name: "Morogoro", lat: -6.82, lng: 37.66 },
      { name: "Dodoma", lat: -6.16, lng: 35.75 },
      { name: "Singida", lat: -4.82, lng: 34.75 },
      { name: "Nzega", lat: -4.22, lng: 33.18 },
      { name: "Rusumo", lat: -2.38, lng: 30.79 },
      { name: "Kigali", lat: -1.94, lng: 30.06 },
    ],
    cargo: ["Containerised imports", "Construction inputs", "Agricultural inputs", "Retail goods"],
    departures: "3 – 4 per week",
  },
  {
    slug: "uganda",
    country: "Uganda",
    countryCode: "UG",
    flag: "🇺🇬",
    destination: "Kampala",
    colorVar: "#2B348C",
    distanceKm: 1660,
    transitDays: "5 – 7 days",
    borderPost: "Mutukula OSBP",
    borderNote:
      "Cleared on the Tanzanian side at Mutukula with Ugandan URA counterparts in the same facility. Bukoba is our staging point before the crossing.",
    altBorderPosts: ["Namanga (via Kenya routing)"],
    currency: "UGX",
    summary:
      "Routed via Singida, Shinyanga and Bukoba on the western Lake Victoria shore. Longer than the Kenya lane but avoids double clearance for consignees in central and western Uganda.",
    waypoints: [
      { name: "Dar es Salaam", lat: -6.82, lng: 39.28 },
      { name: "Dodoma", lat: -6.16, lng: 35.75 },
      { name: "Singida", lat: -4.82, lng: 34.75 },
      { name: "Shinyanga", lat: -3.66, lng: 33.42 },
      { name: "Bukoba", lat: -1.33, lng: 31.81 },
      { name: "Mutukula", lat: -0.98, lng: 31.4 },
      { name: "Kampala", lat: 0.35, lng: 32.58 },
    ],
    cargo: ["Containerised imports", "Steel & cement", "Fuel-adjacent dry goods", "Retail goods"],
    departures: "2 – 3 per week",
  },
  {
    slug: "drc",
    country: "DR Congo",
    countryCode: "CD",
    flag: "🇨🇩",
    destination: "Goma",
    colorVar: "#8E94D0",
    distanceKm: 1630,
    transitDays: "5 – 7 days",
    borderPost: "Grande Barrière (Rubavu – Goma)",
    borderNote:
      "The only corridor with two crossings: Rusumo into Rwanda under the EAC Single Customs Territory, then a separate DRC entry lodged with the DGDA at the Grande Barrière on the Rubavu–Goma line. We prepare both sets of paperwork before the truck leaves Dar es Salaam.",
    altBorderPosts: [
      "Rusumo OSBP — Tanzania to Rwanda leg",
      "Petite Barrière — light and hand-carried cargo only",
    ],
    currency: "CDF",
    summary:
      "Central Corridor to Rusumo, then west through Kigali and Rubavu to the lakeside crossing into Goma. Rates and transit times are confirmed per load rather than published as a schedule, because North Kivu conditions move week to week.",
    waypoints: [
      { name: "Dar es Salaam", lat: -6.82, lng: 39.28 },
      { name: "Morogoro", lat: -6.82, lng: 37.66 },
      { name: "Dodoma", lat: -6.16, lng: 35.75 },
      { name: "Singida", lat: -4.82, lng: 34.75 },
      { name: "Nzega", lat: -4.22, lng: 33.18 },
      { name: "Rusumo", lat: -2.38, lng: 30.79 },
      { name: "Kigali", lat: -1.94, lng: 30.06 },
      { name: "Grande Barrière", lat: -1.7, lng: 29.27 },
      { name: "Goma", lat: -1.67, lng: 29.22 },
    ],
    cargo: [
      "Containerised imports",
      "Humanitarian & NGO consignments",
      "Construction inputs",
      "FMCG",
    ],
    departures: "On confirmed booking",
  },
  {
    slug: "burundi",
    country: "Burundi",
    countryCode: "BI",
    flag: "🇧🇮",
    destination: "Bujumbura",
    colorVar: "#616AB6",
    distanceKm: 1380,
    transitDays: "4 – 6 days",
    borderPost: "Kabanga – Kobero",
    borderNote:
      "Kabanga on the Tanzanian side, Kobero on the Burundian. Documentation is prepared in Kigoma region before the truck reaches the post.",
    altBorderPosts: ["Manyovu – Mugina"],
    currency: "BIF",
    summary:
      "Follows the Central Corridor to Nzega, then west through Kahama and Kasulu to Kabanga. We keep a standing agent relationship at Kobero because it is the corridor most sensitive to paperwork gaps.",
    waypoints: [
      { name: "Dar es Salaam", lat: -6.82, lng: 39.28 },
      { name: "Morogoro", lat: -6.82, lng: 37.66 },
      { name: "Dodoma", lat: -6.16, lng: 35.75 },
      { name: "Nzega", lat: -4.22, lng: 33.18 },
      { name: "Kahama", lat: -3.84, lng: 32.6 },
      { name: "Kabanga", lat: -2.9, lng: 30.55 },
      { name: "Bujumbura", lat: -3.38, lng: 29.36 },
    ],
    cargo: ["Containerised imports", "Food & beverage", "Construction inputs", "NGO consignments"],
    departures: "2 per week",
  },
];

export function getCorridor(slug: string) {
  return corridors.find((corridor) => corridor.slug === slug);
}
