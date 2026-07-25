import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/driver/login-form";
import { company } from "@/lib/company";
import { DEMO_ADMIN } from "@/lib/data/seed";

export const metadata: Metadata = {
  title: "Operations Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const raw = searchParams.callbackUrl ?? "/admin";
  const callbackUrl = raw.startsWith("/admin") ? raw : "/admin";

  return (
    <div className="flex min-h-screen flex-col justify-center bg-navy-900 px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-navy-grid bg-[size:56px_56px] opacity-60"
      />
      <div className="relative mx-auto w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to boazgroup.co.tz
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white p-7 shadow-lift sm:p-9">
          <div className="flex items-center gap-3">
            <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-border bg-white">
              <Image src={company.logo} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="font-display text-lg font-semibold text-navy-900">
              Operations Admin
            </span>
          </div>

          <h1 className="mt-7 font-display text-2xl font-semibold tracking-tight text-navy-900">
            Sign in to review submissions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Clock logs, maintenance records and expense approvals.
          </p>

          <div className="mt-7">
            <LoginForm callbackUrl={callbackUrl} variant="admin" />
          </div>

          <div className="mt-7 rounded-lg border border-dashed border-gold-300 bg-gold-50 p-4 text-sm">
            <p className="font-semibold text-navy-900">Demo credentials (prototype data)</p>
            <p className="mt-1 text-muted-foreground">
              Admin ID <code className="font-semibold text-navy-800">{DEMO_ADMIN.employeeId}</code> ·
              Password <code className="font-semibold text-navy-800">{DEMO_ADMIN.password}</code>
            </p>
          </div>

          <p className="mt-7 text-sm text-muted-foreground">
            Drivers:{" "}
            <Link href="/driver/login" className="font-semibold text-navy-700 hover:underline">
              driver sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
