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
src/app/driver/               Driver portal — login, dashboard, trips,
                              vehicle, inspections, clock, expenses, maintenance,
                              documents, messages, payroll, leave, emergency,
                              profile (+ actions.ts for mutations)
src/components/portal/        Portal shell: sidebar, topbar, mobile drawer, brand
src/components/driver/dashboard/  Dashboard cards, fuel gauge, trip timeline, SOS
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

## Supabase

The public **Get a Quote** form writes to Supabase (project `boazgroupltd`).
Everything else still runs on the mock repository in `src/lib/data`.

Set these in `.env` (both are publishable and safe in the browser):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Without them the quote form falls back to the in-memory store, so the app
still builds and runs on a bare checkout.

**Access model — no authentication.** Requests run as the anonymous Postgres
role. `public.quote_requests` has RLS enabled with a single INSERT policy for
`anon`/`authenticated` and **no** select/update/delete policy, so anyone can
submit a request and nobody can read submissions back through the Data API.
Reading them requires the service role (Supabase dashboard or a server-side
job). Verified: an anonymous `select` returns `42501 permission denied`.

Because there is no read access, the `BGL-Q-…` reference is generated in the
application rather than by a database default — returning a generated value
would require a SELECT policy and expose every customer's contact details.

Regenerate types after a schema change:

```bash
npx supabase gen types typescript --project-id iouiuvgyzujvrkyjihvg
```

### Public form tables

| Table | Written by | Reference |
| --- | --- | --- |
| `quote_requests` | `/quote` | `BGL-Q-YYYY-XXXXX` |
| `contact_submissions` | `/contact` | `BGL-M-YYYY-XXXXX` |

Both are insert-only for `anon`, both generate their reference in the
application, and both fall back to the in-memory store when Supabase is not
configured so a bare checkout still works.

## Spam protection

Two layers, both applied to the quote form and the contact form.

**1. Honeypot** — a hidden `company_website` field (`src/lib/spam/honeypot.ts`).
Positioned off-screen rather than `display: none`, `aria-hidden`, `tabIndex=-1`.
If it arrives with a value the submission is **silently dropped**: the caller
gets a normal-looking success response with a reference that corresponds to
nothing, so a bot has no signal to tune against. Nothing is written.

**2. Cloudflare Turnstile** — `src/lib/spam/turnstile.ts`, verified server-side
against `siteverify`. It **fails closed**: once `TURNSTILE_SECRET_KEY` is set,
a missing, malformed, expired or rejected token is refused, and so is a
submission where Cloudflare cannot be reached. With no secret set the check is
skipped, so the site works before Turnstile is configured.

Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` reaches the browser. The secret has no
`NEXT_PUBLIC_` prefix, so Next.js never inlines it into client JavaScript.

### Rate limiting — not implemented, recommended options

Neither honeypot nor Turnstile stops a determined attacker replaying valid
tokens, so a rate limit is still worth adding. **In-memory counters are not an
option**: Vercel runs multiple isolated instances that share no memory, so a
per-instance counter is trivially bypassed and resets constantly.

Recommended, in order:

1. **Vercel WAF rate limiting** — configure per-path limits in the Vercel
   dashboard. No code, no extra service, no new dependency. Best fit if the
   site is deployed to Vercel.
2. **Upstash Redis + `@upstash/ratelimit`** — the usual durable choice, has a
   free tier, but it is an external service and a new dependency. Not added
   without approval.
3. **A Postgres counter in Supabase** — a `SECURITY DEFINER` function that
   records a hashed IP with a timestamp and rejects bursts. No new vendor, but
   it adds a write per submission and needs careful RLS.

### TLS interception and `npm run dev`

`npm run dev` goes through `scripts/dev.mjs`, which adds Node's
`--use-system-ca`. Security products that inspect HTTPS (Avast, Kaspersky,
corporate proxies) re-sign traffic with a private root CA that Windows trusts
but Node's bundled CA list does not — without this, server-side Supabase calls
fail with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` while the browser works fine. It is
a no-op on machines without interception. Use `npm run dev:plain` for stock
`next dev`.

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
