import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/marketing/logo";
import { company, footerNav } from "@/lib/company";
import { corridors } from "@/lib/content/corridors";

export function SiteFooter() {
  const hq = company.offices[0];

  return (
    <footer className="border-t border-navy-800 bg-navy-900 text-white/70">
      <div className="container py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              {company.positioning} Licensed clearing and forwarding, company-owned
              fleet, and a transit controller on every consignment.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                <span>
                  {hq.address[0]}, {hq.city}, {hq.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                <a href={company.phoneHref} className="hover:text-white">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                <a
                  href={company.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  {company.whatsapp} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                <a href={company.emailHref} className="hover:text-white">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn title="Company" links={footerNav.company} />
          <FooterColumn title="For Customers" links={footerNav.customers} />

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Corridors
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {corridors.map((corridor) => (
                <li key={corridor.slug}>
                  <Link href={`/routes#${corridor.slug}`} className="hover:text-white">
                    Dar es Salaam → {corridor.destination}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Internal
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {footerNav.internal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>
            Registered in Tanzania · TIN and licence numbers to be confirmed ·{" "}
            <span className="text-white/70">{company.tagline}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
