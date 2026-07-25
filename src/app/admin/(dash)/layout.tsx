import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/driver/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { company } from "@/lib/company";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Operations Admin", template: "%s | Operations Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="border-b border-border bg-white">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-white">
              <Image src={company.logo} alt="" fill sizes="36px" className="object-cover" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold text-navy-900">
                Operations Admin
              </span>
              <span className="text-xs text-muted-foreground">{company.name}</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Badge variant="subtle" className="hidden sm:inline-flex">
              {admin.title ?? "Administrator"}
            </Badge>
            <span className="hidden text-sm font-semibold text-navy-900 sm:block">
              {admin.fullName}
            </span>
            <SignOutButton callbackUrl="/admin/login" />
          </div>
        </div>
      </header>

      <AdminNav />

      <main className="container py-8">{children}</main>
    </div>
  );
}
