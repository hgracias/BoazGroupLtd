import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/driver/login-form";
import { company } from "@/lib/company";
import { DEMO_DRIVER } from "@/lib/data/seed";

export const metadata: Metadata = {
  title: "Driver Sign In",
  robots: { index: false, follow: false },
};

export default function DriverLoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  // Only allow internal paths back, never an absolute URL from the query.
  const raw = searchParams.callbackUrl ?? "/driver";
  const callbackUrl = raw.startsWith("/driver") ? raw : "/driver";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-12 text-white lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy-grid bg-[size:56px_56px] opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl"
        />
        <div className="relative flex items-center gap-3">
          <span className="relative block h-12 w-12 overflow-hidden rounded-full bg-white">
            <Image src={company.logo} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <span className="font-display text-xl font-semibold">
            Boaz Group <span className="font-normal">Ltd</span>
          </span>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Driver Portal
          </h1>
          <p className="mt-4 text-white/70">
            Clock in and out, log maintenance and submit trip expenses from the cab.
            Built to work on a phone, on a weak signal, with gloves on.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/60">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-gold-400" aria-hidden="true" />
              Your records are visible to operations only
            </li>
            <li className="flex items-center gap-3">
              <KeyRound className="h-4 w-4 text-gold-400" aria-hidden="true" />
              Lost your password? Call the operations desk on {company.phone}
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-white/40">{company.tagline}</p>
      </section>

      <section className="flex flex-col justify-center bg-background px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to boazigroup.com
          </Link>

          <div className="mt-8 flex items-center gap-3 lg:hidden">
            <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-border bg-white">
              <Image src={company.logo} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="font-display text-lg font-semibold text-navy-900">
              Boaz Group <span className="font-normal">Ltd</span>
            </span>
          </div>

          <h2 className="mt-8 font-display text-3xl font-semibold tracking-tight text-navy-900">
            Sign in to the driver portal
          </h2>
          <p className="mt-2 text-muted-foreground">
            Use the employee ID printed on your Boaz Group ID card.
          </p>

          <div className="mt-8">
            <LoginForm callbackUrl={callbackUrl} />
          </div>

          <div className="mt-8 rounded-lg border border-dashed border-gold-300 bg-gold-50 p-4 text-sm">
            <p className="font-semibold text-navy-900">Demo credentials (prototype data)</p>
            <p className="mt-1 text-muted-foreground">
              Employee ID <code className="font-semibold text-navy-800">{DEMO_DRIVER.employeeId}</code>{" "}
              · Password <code className="font-semibold text-navy-800">{DEMO_DRIVER.password}</code>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Remove this panel once real driver accounts are loaded.
            </p>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Operations staff:{" "}
            <Link href="/admin/login" className="font-semibold text-navy-700 hover:underline">
              admin sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
