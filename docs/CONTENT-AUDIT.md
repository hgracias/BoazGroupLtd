# Public content audit — unverified business information

Audit date: 9 August 2026. Scope: every public-facing page on boazigroup.com
(`src/app/(marketing)/**`) plus the content files that feed them.

**Nothing in this document has been changed in the code.** It lists what is
currently published, why it may not be true, and what is needed from you.

Legend for **Status**:

| Status | Meaning |
| --- | --- |
| ✅ Confirmed | You supplied this directly |
| 🔴 Invented | I wrote it to fill the page; no basis in fact |
| 🟠 Unverified | Plausible operational claim, never confirmed |
| ⚪ Absent | The category does not appear on the site (no action) |

---

## Summary

| Category | Status | Action |
| --- | --- | --- |
| Founder / leadership names | 🔴 Invented | You must supply, or delete section |
| Office addresses | 🔴 Invented | You must supply |
| Phone numbers | ✅ Confirmed | None |
| WhatsApp number | ✅ Confirmed | None |
| Email address | ✅ Confirmed | None |
| Fleet size (3 prime movers) | ✅ Confirmed | None |
| Years in business (6, founded 2020) | ✅ Confirmed | None |
| Countries served (5) | ✅ Confirmed | Confirm DRC lane is operable |
| Number of customers | ⚪ Absent | None |
| Revenue / financial stats | ⚪ Absent | None |
| Partner / customer logos | ⚪ Absent | None |
| Testimonials | ⚪ Absent (removed) | None |
| On-time delivery % | 🔴 Invented | You must supply, or delete stat |
| Warehouse size & yard | 🔴 Invented | You must supply |
| Milestone dates (2022, 2024) | 🔴 Invented | You must supply, or delete |
| Sample client names on /tracking | 🔴 Invented | Replace with neutral labels |
| Certifications & licences | 🟠 Unverified | Confirm each one |
| Corridor distances & transit times | 🟠 Unverified | Confirm |
| Departure frequencies | 🟠 Unverified | Confirm |
| Border posts used | 🟠 Unverified | Confirm |
| Service capability claims | 🟠 Unverified | Confirm |
| Opening hours | 🟠 Unverified | Confirm |
| Quote turnaround promise | 🟠 Unverified | Confirm |

---

## 1. Leadership and founder names — 🔴 Invented

**A. Current text**

- "Boaz Mushi — Managing Director. Founded the company in 2020 after years in port logistics. Still signs off every corridor rate."
- "Neema Shirima — Operations Manager. Runs the transit desk and the border escalation path across every corridor."
- "Peter Massawe — Head of Customs & Compliance. Licensed clearing agent…"
- "Grace Kileo — Fleet & Workshop Manager. Keeps the fleet roadworthy…"
- Pull-quote on About attributed to **Boaz Mushi, Managing Director**:
  "Quality is our definition. On this corridor that means one thing: the cargo
  arrives when we said it would."

**B. Location** — `src/lib/content/about.ts` (`leadership`), rendered by
`src/app/(marketing)/about/page.tsx`. The same invented name **Neema Shirima**
is also the seeded admin account in `src/lib/data/seed.ts`.

**C. Why it may be inaccurate** — I invented all four people, their roles, and
their biographies. They are presented publicly as real staff. This is the
highest-risk content on the site: it misattributes a quote to a named
"Managing Director" who may not exist, and you told me your own name is
Hakizimana Gracias, which appears nowhere.

**D. Recommendation** — **I need this from you.** Send real names, job titles
and one-line responsibilities, or tell me to delete the leadership section and
the attributed pull-quote. Do not launch with these names.

---

## 2. Office addresses — 🔴 Invented

**A. Current text**

- Head Office & Yard: "Nyerere Road, Vingunguti / P.O. Box 78421 / Dar es Salaam, Tanzania"
- Port Liaison Desk: "Kurasini, Gate 5 Area / Dar es Salaam Port / Dar es Salaam, Tanzania"
- Both addresses drive "Open in Google Maps" links that point at those places.
- "Vingunguti yard" is also referenced on Services and Routes as your facility.

**B. Location** — `src/lib/company.ts` (`offices`), used by the contact page,
footer, Services and Routes.

**C. Why it may be inaccurate** — Street, P.O. box and the existence of a
second office are all invented. The maps links currently send customers to a
location that is probably not yours. A three-truck operator having a dedicated
port liaison desk is also a strong claim.

**D. Recommendation** — **I need this from you:** the real registered address,
and whether the second office exists. If there is only one location, say so and
I will remove the port desk everywhere.

---

## 3. Phone, WhatsApp, email — ✅ Confirmed

**A. Current text** — Phone +255 677 841 333 · WhatsApp +1 617 818 5235 ·
Email Jimmyhboaz@boazigroup.com

**B. Location** — `src/lib/company.ts`

**C./D.** — You supplied these on 9 August 2026. No action. One observation
only: the WhatsApp number is a **US** number while the site is Tanzanian; if
that is not intended for customer contact, say so.

---

## 4. Fleet size, years in business, countries — ✅ Confirmed

**A. Current text** — "3 company-owned prime movers", "6 years on the Central
Corridor", founded 2020, five corridors to Rwanda, Kenya, Uganda, DR Congo and
Burundi.

**B. Location** — `src/lib/content/site.ts` (`stats`),
`src/lib/content/services.ts`, `src/lib/company.ts` (`foundedYear`),
`src/lib/content/corridors.ts`

**C./D.** — You confirmed these. One caveat carried forward: **the Goma / DR
Congo lane** should be confirmed as currently operable before the Routes page
advertises it, given conditions in North Kivu.

The About fleet table deliberately says "Matched to load" for trailers rather
than inventing counts — no action.

---

## 5. On-time delivery statistic — 🔴 Invented

**A. Current text** — "**96.4%** On-time delivery, last 12 months" (home page
stat band and About "at a glance" panel).

**B. Location** — `src/lib/content/site.ts` (`stats`)

**C. Why it may be inaccurate** — I invented the figure. It is a precise,
measurable performance claim with a stated measurement window, which makes it
the kind of number a customer may rely on or a competitor may challenge. There
is no data behind it.

**D. Recommendation** — **I need this from you**, measured from your own
delivery records. Alternatives if you do not track it: replace with a
non-numeric statement, or swap the tile for something you can evidence (for
example number of border posts worked).

---

## 6. Warehouse and yard specifications — 🔴 Invented

**A. Current text** — "4,200 m² covered warehouse plus fenced hardstanding
yard", specs "Covered area 4,200 m²", "Yard 1.8 hectares", "24/7 manned
security, CCTV and per-consignment stock cards".

**B. Location** — `src/lib/content/services.ts` (warehousing service)

**C. Why it may be inaccurate** — Every figure is invented, including the
security arrangements. If you do not operate a warehouse of that size, the
Warehousing & Consolidation service is materially overstated.

**D. Recommendation** — **I need this from you:** real dimensions and security
arrangements, or confirmation to drop the numbers and describe the service
qualitatively.

---

## 7. Milestone timeline — 🔴 Invented (except founding year)

**A. Current text** — 2020 Founded · **2022 First Rusumo crossing / registered
as a licensed clearing and forwarding agent** · **2024 Namanga and Mutukula
lanes added, dedicated border desk** · 2026 Five corridors, one desk.

**B. Location** — `src/lib/content/about.ts` (`milestones`)

**C. Why it may be inaccurate** — Only 2020 is confirmed. The 2022 and 2024
entries invent both the dates and the events, including when you became a
licensed clearing agent — a regulatory claim with a specific date attached.

**D. Recommendation** — **I need real dates**, or tell me to reduce the
timeline to founding plus today.

---

## 8. Sample client names on the public tracking page — 🔴 Invented

**A. Current text** — The /tracking page lists four sample references and, when
one is opened, shows a client name: **Horizon Build Rwanda**, **Rift Valley
Distributors**, **Kampala Steel Works**, **Lac Tanganyika Trading**, along with
cargo details, container numbers and a signature ("POD signed by G. Ssemakula").

**B. Location** — `src/lib/data/seed.ts` (`shipments`), rendered by
`src/app/(marketing)/tracking/page.tsx`

**C. Why it may be inaccurate** — These are invented companies presented as
Boaz Group customers on a public page. The panel is labelled "Prototype data",
but the named businesses still read as a customer list, and one of them
(Horizon Build Rwanda) previously appeared as a testimonial author.

**D. Recommendation** — I can fix this **without needing anything from you**:
replace client names with neutral labels ("Sample consignment A"), or hide the
sample-reference panel entirely once real bookings exist. Say which you prefer.

---

## 9. Certifications and licences — 🟠 Unverified

**A. Current text**

- "TRA-licensed clearing & forwarding" (home trust bar, About compliance list)
- "COMESA Yellow Card on every unit"
- "TASSTA member"
- "EAC Single Customs Territory pre-lodgement"
- "Goods-in-transit cover through licensed Tanzanian underwriters"
- "TANROADS abnormal load permitting"
- "Annual roadworthiness inspection across the fleet"
- Footer: "Registered in Tanzania · TIN and licence numbers to be confirmed"

**B. Location** — `src/lib/content/site.ts` (`trustSignals`),
`src/lib/content/about.ts` (`compliance`), `src/lib/content/services.ts`

**C. Why it may be inaccurate** — These are regulatory and membership claims I
wrote without evidence. Claiming a TRA clearing licence or TASSTA membership
you do not hold is the category most likely to cause you actual trouble.

**D. Recommendation** — **Confirm each line individually.** I will delete any
you cannot evidence. The footer already admits licence numbers are unconfirmed,
which contradicts the confident claims above it.

---

## 10. Corridor distances, transit times, departures, border posts — 🟠 Unverified

**A. Current text** — Per corridor: distances (930–1,660 km), transit times
("2 – 3 days" Nairobi, "4 – 5 days" Kigali, "5 – 7 days" Kampala and Goma,
"4 – 6 days" Bujumbura), departure frequency ("Daily", "3 – 4 per week",
"2 – 3 per week", "2 per week", "On confirmed booking"), border posts used
(Namanga, Rusumo, Mutukula, Kabanga–Kobero, Grande Barrière), and
"Avg. clearance 6 – 14 hrs" / "Border posts 6 active".

**B. Location** — `src/lib/content/corridors.ts`,
`src/lib/content/services.ts` (customs specs)

**C. Why it may be inaccurate** — Road distances and border-post names are
real geography, so those are broadly sound. The **transit times, departure
frequencies and clearance averages are estimates I wrote**, and they function
as service commitments customers will quote back to you. "Daily" departures on
the Nairobi lane is a strong claim for a three-truck fleet.

**D. Recommendation** — **Confirm the numbers**, particularly departure
frequency against your actual fleet capacity.

---

## 11. Service capability claims — 🟠 Unverified

**A. Current text** — Selected examples:

- "Company-owned fleet with GPS tracking and fuel telemetry"
- "no unvetted subcontracting" / "The driver on the road is on our payroll"
- "Every consignment has a named transit controller"
- "Two-driver relay on Nairobi and Kigali corridors"
- "Abnormal and over-dimensional load permits arranged"
- "Bonded transit under TANCIS / RADDEx where required"
- "Same-day escalation path at every border post we use"
- "Duty and VAT computation before dispatch"

**B. Location** — `src/lib/content/services.ts`, `src/lib/content/about.ts`
(`values`)

**C. Why it may be inaccurate** — These describe operating capabilities and
processes I invented to make the services read convincingly. Several imply
systems (telematics, a controller per consignment, a relay crew) that a small
operation may not run.

**D. Recommendation** — **Read through and strike anything you do not do.**
These are the easiest claims for a customer to test on their first shipment.

---

## 12. Opening hours and response promises — 🟠 Unverified

**A. Current text** — "Mon – Fri, 07:30 – 18:00 EAT", "Sat, 08:00 – 13:00 EAT",
"Border operations desk runs 24/7 during active transits", and on the quote
page "usually within one working day" / "A transit controller reviews the lane
and comes back with questions or a rate".

**B. Location** — `src/lib/company.ts` (`hours`),
`src/app/(marketing)/quote/page.tsx`

**C. Why it may be inaccurate** — Invented. The 24/7 border desk and the
one-working-day quote turnaround are commitments customers will hold you to.

**D. Recommendation** — **Confirm or adjust**, especially the 24/7 claim.

---

## 13. Categories with nothing to fix — ⚪ Absent

- **Number of customers** — no customer count is published anywhere.
- **Revenue or financial statistics** — none published.
- **Partner or customer logos** — no logo wall exists; the only logo used is
  your own (`public/brand/boaz-logo.jpg`).
- **Testimonials** — the three invented testimonials were deleted in commit
  `589e43b`. Verified: no quotes attributed to named people remain on the site.
- **Awards or press mentions** — none claimed.

---

## Non-public, but worth knowing

These are invented but appear only behind the login, so they carry no public
risk. Listed for completeness:

- Driver names and employee IDs (Emmanuel Kimaro BGL-0142, Joseph Mwakalinga,
  Hamisi Juma, Baraka Ndossi) — `src/lib/data/seed.ts`
- Truck plates (T 412 DKM, T 887 CFR, T 235 BGT) and trailer plates
- Licence numbers, national ID, medical and training certificate references
- Payroll figures, trip references, telemetry readings

All are replaced the moment real records load from the database.
