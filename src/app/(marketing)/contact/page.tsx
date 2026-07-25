import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Boaz Group Ltd in Dar es Salaam — operations desk phone, WhatsApp, email, head office and port liaison desk addresses.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Talk to us"
        title="One desk, and it answers."
        description="Rates, a shipment already on the road, or a customs question — send it here and a transit controller will pick it up."
      />

      <section className="section bg-background">
        <div className="container grid gap-10 lg:grid-cols-[1fr_380px]">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-navy-900">
                Send a message
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fields marked optional can be left blank. For a formal rate, the{" "}
                <Link href="/quote" className="font-semibold text-navy-700 hover:underline">
                  quote form
                </Link>{" "}
                collects what we need in one go.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold text-navy-900">
                  Direct lines
                </h2>
                <ul className="mt-5 space-y-4 text-sm">
                  <li>
                    <a
                      href={company.phoneHref}
                      className="flex items-start gap-3 text-navy-900 hover:text-navy-600"
                    >
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                      <span>
                        <span className="block font-semibold">{company.phone}</span>
                        <span className="text-muted-foreground">Operations desk</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={company.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-3 text-navy-900 hover:text-navy-600"
                    >
                      <MessageCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="block font-semibold">{company.whatsapp}</span>
                        <span className="text-muted-foreground">WhatsApp — fastest reply</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={company.emailHref}
                      className="flex items-start gap-3 text-navy-900 hover:text-navy-600"
                    >
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                      <span>
                        <span className="block font-semibold">{company.email}</span>
                        <span className="text-muted-foreground">General enquiries</span>
                      </span>
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-navy-900">
                        {company.hours.weekday}
                      </span>
                      <span className="block text-muted-foreground">{company.hours.saturday}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {company.hours.note}
                      </span>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {company.offices.map((office) => (
              <Card key={office.id}>
                <CardContent className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {office.label}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-navy-900">
                    {office.city}, {office.country}
                  </h3>
                  <address className="mt-3 not-italic text-sm text-muted-foreground">
                    {office.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <p className="mt-3 text-sm font-semibold text-navy-900">{office.phone}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      office.mapQuery
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:underline"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Open in Google Maps
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </CardContent>
              </Card>
            ))}

            <div className="rounded-xl border border-dashed border-gold-300 bg-gold-50 p-5 text-sm">
              <p className="font-semibold text-navy-900">Placeholder details</p>
              <p className="mt-1.5 text-muted-foreground">
                Phone numbers, email and addresses on this page are placeholders held in{" "}
                <code className="text-xs">src/lib/company.ts</code>. An embedded map can be
                added once you confirm the exact location.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
