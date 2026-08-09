import { AlertTriangle, MessageCircle, Phone, ShieldAlert } from "lucide-react";

import { EmergencySOSCard } from "@/components/driver/dashboard/emergency-sos-card";
import { PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import { company } from "@/lib/company";
import { listEmergencyAlerts } from "@/lib/data";
import type { EmergencyKind } from "@/lib/data/types";
import { dateTime } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Emergency" };

const kindLabels: Record<EmergencyKind, string> = {
  BREAKDOWN: "Vehicle breakdown",
  ACCIDENT: "Accident or collision",
  MEDICAL: "Medical emergency",
  SECURITY: "Security or theft",
  OTHER: "Other",
};

const steps = [
  "Make yourself safe first — warning triangle out, hazards on, off the carriageway if you can.",
  "Call the operations desk. A person answers faster than any form.",
  "Log the alert here so the desk has it in writing with your trip attached.",
  "Do not leave the cargo unattended unless staying is unsafe.",
];

export default async function EmergencyPage() {
  const driver = await requireDriver();
  const alerts = await listEmergencyAlerts(driver.id);

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PortalHeader
        title="Emergency"
        description="Raise an alert and reach the operations desk fast."
      />

      <PortalSection className="border-amber-500/30 bg-amber-500/[0.07]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-amber-100">
              This prototype does not contact anyone automatically
            </p>
            <p className="mt-1 text-sm text-amber-200/80">
              Logging an alert records it against your driver record and trip. No SMS,
              control room or emergency service is connected yet — always phone as well.
            </p>
          </div>
        </div>
      </PortalSection>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <EmergencySOSCard operationsPhone={company.phone} />

        <div className="space-y-5">
          <PortalSection title="Reach a person now">
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={company.phoneHref}
                className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border/70 bg-white/[0.04] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.09]"
              >
                <Phone className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                <span>
                  Operations desk
                  <span className="block text-xs font-normal text-muted-foreground">
                    {company.phone}
                  </span>
                </span>
              </a>
              <a
                href={company.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border/70 bg-white/[0.04] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.09]"
              >
                <MessageCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                <span>
                  WhatsApp
                  <span className="block text-xs font-normal text-muted-foreground">
                    {company.whatsapp}
                  </span>
                </span>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              For police, fire or ambulance in Tanzania dial <strong>112</strong>. In Kenya,
              Uganda, Rwanda and Burundi use the local emergency number displayed at the
              border post.
            </p>
          </PortalSection>

          <PortalSection title="What to do first">
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-xs font-bold">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </PortalSection>
        </div>
      </div>

      <PortalSection title="Alerts you have raised">
        {alerts.length ? (
          <ul className="divide-y divide-border/60">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {kindLabels[alert.kind]}
                    <span className="ml-2 rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      {alert.acknowledged ? "Acknowledged" : "Logged"}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{dateTime(alert.raisedAt)}</p>
                  {alert.note ? (
                    <p className="mt-1.5 text-sm text-slate-300">{alert.note}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have not raised any alerts. Alerts stay listed here for the duration of
            the session.
          </p>
        )}
      </PortalSection>
    </div>
  );
}
