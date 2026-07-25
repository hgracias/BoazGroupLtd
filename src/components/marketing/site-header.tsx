"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";
import { company, mainNav } from "@/lib/company";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close the mobile menu whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden bg-navy-900 text-white/80 lg:block">
        <div className="container flex h-10 items-center justify-between text-xs">
          <p className="tracking-wide">
            Dar es Salaam · Central Corridor operations desk ·{" "}
            <span className="text-white/60">{company.hours.weekday}</span>
          </p>
          <div className="flex items-center gap-6">
            <a href={company.phoneHref} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {company.phone}
            </a>
            <a
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              WhatsApp
            </a>
            <Link href="/driver/login" className="flex items-center gap-1.5 hover:text-white">
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              Driver Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-navy-900"
                          : "text-muted-foreground hover:text-navy-900"
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-gold-500" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Button asChild variant="gold">
              <Link href="/quote">Get a Quote</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-navy-800 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-b border-border bg-background shadow-lift lg:hidden"
        >
          <nav aria-label="Mobile" className="container py-4">
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-14 items-center border-b border-border/70 text-base font-medium text-navy-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/driver/login"
                  className="flex h-14 items-center gap-2 border-b border-border/70 text-base font-medium text-muted-foreground"
                >
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                  Driver Portal
                </Link>
              </li>
            </ul>
            <div className="mt-4 flex flex-col gap-3">
              <Button asChild variant="gold" size="touch">
                <Link href="/quote">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="touch">
                <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
