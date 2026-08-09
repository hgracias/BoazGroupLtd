# Boaz Group Ltd — Website & Driver Portal

Cross-border freight marketing site plus an internal driver portal, built with
Next.js 14 (App Router), TypeScript and Tailwind CSS.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in NEXTAUTH_SECRET
npm run dev
```

The app runs at http://localhost:3000. **No database is required** — the portal
runs on a mock data layer (see below).

## Scripts

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Dev server                                |
| `npm run build`     | Production build                          |
| `npm run typecheck` | `tsc --noEmit`                            |
| `npm run lint`      | ESLint (next/core-web-vitals)             |
| `npm run db:push`   | Push the Prisma schema (once a DB is set) |

## Folder structure

```
prisma/schema.prisma          Target data model (Driver, Truck, Trip, ClockRecord,
                              MaintenanceRecord, ExpenseReport, Admin, Shipment)
src/app/(marketing)/          Public site — home, services, routes, tracking,
                              about, quote, contact (+ actions.ts for form posts)
src/app/driver/               BOAZ360 driver portal — login, dashboard, trips,
                              vehicle, inspections, clock, expenses, maintenance,
                              documents, messages, payroll, leave, emergency,
                              profile (+ actions.ts for mutations)
src/components/portal/        Portal shell: sidebar, topbar, mobile drawer, brand
src/components/driver/dashboard/  BOAZ360 dashboard cards, gauge, timeline, SOS
src/app/admin/                Admin — login, overview, expenses, maintenance, clock
src/app/api/auth/             NextAuth route handler
middleware.ts                 Role-based route protection for /driver and /admin
src/components/ui/            shadcn-style primitives
src/components/marketing/     Public site components
src/components/driver/        Portal components (forms, nav, clock panel)
src/components/admin/         Admin tables and review actions
src/lib/company.ts            Company identity + contact details — EDIT HERE
src/lib/content/              Marketing copy: services, corridors, about, testimonials
src/lib/currency.ts           TZS/KES/RWF/BIF/UGX rates and formatting
src/lib/data/                 Mock repository, seed data, lead capture
```

## Auth

Credentials auth (NextAuth, JWT sessions) with two roles.

| Role   | Login           | Employee ID |
| ------ | --------------- | ----------- |
| Driver | `/driver/login` | `BGL-0142`  |
| Admin  | `/admin/login`  | `ADM-001`   |

**No passwords are stored in this repository.** The two seeded accounts take
their passwords from `DEMO_DRIVER_PASSWORD` and `DEMO_ADMIN_PASSWORD`. If those
are unset, a random password is generated per server start, printed to the
terminal, and shown on the login page — so `npm run dev` works with no setup.

In a production build (`NODE_ENV=production`) the credentials are never printed
or displayed. Leave the variables unset there and the seeded accounts are
unusable by anyone.

`middleware.ts` sends anonymous traffic to the right login page, keeps drivers
out of `/admin` and admins out of `/driver`, and each page re-checks the session
server-side via `requireDriver()` / `requireAdmin()`.

Remove the demo-credential panels from both login pages once real accounts exist.

## Branding

Brand colours are derived from the company logo (`public/brand/boaz-logo.jpg`):
deep navy `#2B348C` as primary, warm gold `#C9962E` as accent, sand neutrals.
They are defined once in `tailwind.config.ts` and `src/app/globals.css`.

Typefaces: **Source Serif 4** for display (echoes the serif logotype) and
**Inter** for UI and body copy.

## Placeholder content

Phone numbers, the WhatsApp number, email and street addresses in
`src/lib/company.ts` are marked `PLACEHOLDER` and need replacing before launch.
Marketing copy in `src/lib/content/` is realistic but unverified — fleet counts,
on-time percentages and licence claims should be confirmed.

## Driver portal theming

The portal is a dark enterprise scope layered on the same component library.
`.portal-shell` (in `src/app/globals.css`) redefines the shadcn CSS variables —
`--background`, `--card`, `--border`, `--field` and friends — so Card, Input,
Table and Button render dark inside the portal and light on the public site,
with no forked components.

## Known gaps before launch

1. **Receipt uploads write to local disk** (`src/lib/uploads.ts`). Vercel's
   filesystem is read-only — swap for Vercel Blob, S3 or Supabase Storage.
2. **Quote and contact submissions are not emailed.** They are recorded in
   memory with a reference (`src/lib/data/leads.ts`); connect an email provider.
3. **Exchange rates are indicative placeholders** in `src/lib/currency.ts`.
   Each expense stores the rate used at submission, so changing them is safe.
4. **Company facts are unverified** — fleet counts, on-time percentage, founding
   year, leadership names, milestones and certifications in `src/lib/content/`.
5. **The SOS control is a mock.** `raiseEmergencyAction` records an alert and
   logs it server-side; no control room, SMS gateway or emergency service is
   connected. The UI says so explicitly — keep that wording until a real
   integration exists.
6. **Portal telemetry is seeded, not live** — fuel level, engine hours and the
   next-rest countdown come from mock data, not a telematics feed.

## Data layer

The app is built against a repository interface so the UI works today and the
database can be attached later:

- **Now:** in-memory seed data (drivers, trucks, trips, expenses, shipments).
- **Later:** set `DATABASE_URL` (Neon or Supabase), run `npm run db:push`, and
  swap the repository implementation in `src/lib/data`.

## Deployment

Vercel-ready. Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (plus `DATABASE_URL` once
a database is attached) in the project's environment variables.
