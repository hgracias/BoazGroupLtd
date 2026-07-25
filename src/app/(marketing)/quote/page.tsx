import type { Metadata } from "next";
import { Clock, FileCheck2, MessageCircle, Phone } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { QuoteForm } from "@/components/marketing/quote-form";
import { Card, CardContent } from "@/components/ui/card";
import { company } from "@/lib/company";
import { corridors } from "@/lib/content/corridors";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a written cross-border freight rate from Dar es Salaam to Rwanda, Kenya, Burundi or Uganda — freight, duties and border fees broken out separately.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage({
  searchParams,
}: {
  searchParams: { service?: string; destination?: string };
}) {
  const validDestination = corridors.some((c) => c.slug === searchParams.destination)
    ? searchParams.destination
    : undefined;

  return (
    <>
      <PageHero
        breadcrumb="Get a Quote"
        eyebrow="Request a rate"
        title="Tell us the load. We'll tell you the real landed cost."
        description="Three short steps. You get freight, duties and border fees itemised in writing — not a single bundled number that grows later."
      />

      <section className="section bg-background">
        <div className="container grid gap-10 lg:grid-cols-[1fr_340px]">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <QuoteForm
                defaultService={searchParams.service}
                defaultDestination={validDestination}
              />
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold text-navy-900">
                  What happens next
                </h2>
                <ul className="mt-5 space-y-5">
                  <Step
                    icon={<Clock className="h-4 w-4" aria-hidden="true" />}
                    title="Within one working day"
                    body="A transit controller reviews the lane and comes back with questions or a rate."
                  />
                  <Step
                    icon={<FileCheck2 className="h-4 w-4" aria-hidden="true" />}
                    title="Itemised in writing"
                    body="Freight, duties, border fees and any storage — separated, so you can check each line."
                  />
                  <Step
                    icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                    title="One named contact"
                    body="If the load goes ahead, the same person owns it from loading bay to delivery note."
                  />
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-navy-800 text-white">
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold">In a hurry?</h2>
                <p className="mt-2 text-sm text-white/70">
                  Time-critical loads are quoted faster over the phone. The operations
                  desk runs {company.hours.weekday}.
                </p>
                <div className="mt-5 space-y-3 text-sm">
                  <a
                    href={company.phoneHref}
                    className="flex items-center gap-3 font-semibold hover:text-gold-300"
                  >
                    <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {company.phone}
                  </a>
                  <a
                    href={company.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 font-semibold hover:text-gold-300"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {company.whatsapp}
                  </a>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-dashed border-gold-300 bg-gold-50 p-5 text-sm">
              <p className="font-semibold text-navy-900">Prototype note</p>
              <p className="mt-1.5 text-muted-foreground">
                Submissions are recorded server-side and given a reference, but no email
                is sent yet — that needs an email provider to be connected.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-navy-900">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
