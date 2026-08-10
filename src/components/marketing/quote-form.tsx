"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";

import { Field, FormBanner } from "@/components/driver/field";
import { HoneypotField } from "@/components/marketing/honeypot-field";
import {
  TurnstileWidget,
  type TurnstileHandle,
} from "@/components/marketing/turnstile-widget";
import { HONEYPOT_FIELD } from "@/lib/spam/honeypot";
import { TURNSTILE_FIELD, isTurnstileClientEnabled } from "@/lib/spam/turnstile-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitQuoteAction } from "@/app/(marketing)/actions";
import { corridors } from "@/lib/content/corridors";
import { services } from "@/lib/content/services";
import { dateOnly } from "@/lib/format";
import { quoteSchema, type QuoteValues } from "@/lib/validations";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Route", fields: ["originCity", "destinationCountry", "destinationCity", "service"] },
  {
    title: "Cargo",
    fields: ["cargoType", "cargoDescription", "weightKg", "unitCount", "readyDate", "needsCustoms"],
  },
  {
    title: "Contact",
    fields: ["contactName", "companyName", "email", "phone", "preferredContact", "notes"],
  },
] as const;

const ORIGIN_CITIES = [
  "Dar es Salaam",
  "Dar es Salaam Port",
  "Arusha",
  "Dodoma",
  "Mwanza",
  "Tanga",
  "Mbeya",
  "Isaka Dry Port",
];

const CARGO_TYPES = [
  "Containerised (20ft / 40ft)",
  "Palletised general cargo",
  "Loose / break-bulk",
  "Construction materials",
  "Bulk (tipper)",
  "Project / abnormal load",
  "Perishable",
];

export function QuoteForm({
  defaultService,
  defaultDestination,
}: {
  defaultService?: string;
  defaultDestination?: string;
}) {
  const [step, setStep] = React.useState(0);
  const [pending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [reference, setReference] = React.useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState("");
  const turnstileRef = React.useRef<TurnstileHandle>(null);
  const honeypotRef = React.useRef<HTMLInputElement>(null);
  const onFinalStep = step === STEPS.length - 1;
  const awaitingChallenge = isTurnstileClientEnabled() && onFinalStep && !turnstileToken;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: {
      originCity: "Dar es Salaam",
      destinationCountry: (defaultDestination as QuoteValues["destinationCountry"]) ?? "rwanda",
      destinationCity: "",
      service: defaultService ?? services[0].slug,
      cargoType: CARGO_TYPES[0],
      cargoDescription: "",
      needsCustoms: "yes",
      preferredContact: "phone",
      notes: "",
    },
  });

  async function next() {
    const valid = await trigger(STEPS[step].fields as unknown as (keyof QuoteValues)[]);
    if (valid) setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function onSubmit(values: QuoteValues) {
    setServerError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value == null ? "" : String(value));
    });
    // Honeypot stays empty for real people; the widget supplies the token.
    formData.append(HONEYPOT_FIELD, honeypotRef.current?.value ?? "");
    formData.append(TURNSTILE_FIELD, turnstileToken);

    startTransition(async () => {
      const result = await submitQuoteAction(formData);
      if (!result.ok) {
        setServerError(result.error);
        // A token is single-use — get a fresh one before the next attempt.
        turnstileRef.current?.reset();
        return;
      }
      setReference(result.reference);
    });
  }

  if (reference) {
    const values = getValues();
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">
          Request received — {reference}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          A transit controller will come back to {values.email} with a written rate,
          usually within one working day. Quote the reference above if you call the
          operations desk in the meantime.
        </p>
        <dl className="mx-auto mt-8 max-w-md divide-y divide-emerald-200 text-left">
          <Summary label="Route" value={`${values.originCity} → ${values.destinationCity}`} />
          <Summary label="Cargo" value={values.cargoDescription} />
          <Summary label="Weight" value={`${Number(values.weightKg).toLocaleString()} kg`} />
          <Summary label="Ready" value={dateOnly(values.readyDate)} />
        </dl>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/routes">See corridor detail</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {STEPS.map((item, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <li key={item.title} className="flex flex-1 items-center gap-2">
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  active
                    ? "bg-navy-700 text-white"
                    : done
                      ? "bg-gold-500 text-navy-900"
                      : "bg-sand-200 text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-semibold sm:block",
                  active ? "text-navy-900" : "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
              {index < STEPS.length - 1 ? (
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
              ) : null}
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} className="relative mt-8 space-y-5" noValidate>
        {serverError ? <FormBanner tone="error">{serverError}</FormBanner> : null}

        {step === 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="originCity" label="Loading from (Tanzania)" error={errors.originCity?.message}>
                <Select id="originCity" {...register("originCity")}>
                  {ORIGIN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                id="destinationCountry"
                label="Destination country"
                error={errors.destinationCountry?.message}
              >
                <Select id="destinationCountry" {...register("destinationCountry")}>
                  {corridors.map((corridor) => (
                    <option key={corridor.slug} value={corridor.slug}>
                      {corridor.country}
                    </option>
                  ))}
                  <option value="other">Elsewhere in the region</option>
                </Select>
              </Field>
            </div>

            <Field
              id="destinationCity"
              label="Delivery city or town"
              error={errors.destinationCity?.message}
              hint="e.g. Kigali, Nairobi, Bujumbura, Kampala, or an upcountry town."
            >
              <Input id="destinationCity" placeholder="Kigali" {...register("destinationCity")} />
            </Field>

            <Field id="service" label="Service needed" error={errors.service?.message}>
              <Select id="service" {...register("service")}>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.title}
                  </option>
                ))}
              </Select>
            </Field>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Field id="cargoType" label="Cargo type" error={errors.cargoType?.message}>
              <Select id="cargoType" {...register("cargoType")}>
                {CARGO_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              id="cargoDescription"
              label="What is the cargo"
              error={errors.cargoDescription?.message}
              hint="Commodity, packaging, anything hazardous or temperature-sensitive."
            >
              <Textarea
                id="cargoDescription"
                rows={3}
                placeholder="e.g. 2 x 40ft containers of galvanised roofing sheets"
                {...register("cargoDescription")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="weightKg" label="Total weight (kg)" error={errors.weightKg?.message}>
                <Input
                  id="weightKg"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="24000"
                  {...register("weightKg")}
                />
              </Field>

              <Field
                id="unitCount"
                label="Containers / pallets"
                optional
                error={errors.unitCount?.message}
              >
                <Input
                  id="unitCount"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="2"
                  {...register("unitCount")}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="readyDate" label="Cargo ready date" error={errors.readyDate?.message}>
                <Input id="readyDate" type="date" {...register("readyDate")} />
              </Field>

              <Field
                id="needsCustoms"
                label="Do you need customs clearance?"
                error={errors.needsCustoms?.message}
              >
                <Select id="needsCustoms" {...register("needsCustoms")}>
                  <option value="yes">Yes — handle clearance for me</option>
                  <option value="no">No — my own agent clears it</option>
                  <option value="unsure">Not sure, advise me</option>
                </Select>
              </Field>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="contactName" label="Your name" error={errors.contactName?.message}>
                <Input id="contactName" autoComplete="name" {...register("contactName")} />
              </Field>
              <Field id="companyName" label="Company" error={errors.companyName?.message}>
                <Input id="companyName" autoComplete="organization" {...register("companyName")} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="email" label="Email" error={errors.email?.message}>
                <Input id="email" type="email" autoComplete="email" {...register("email")} />
              </Field>
              <Field id="phone" label="Phone / WhatsApp" error={errors.phone?.message}>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+255 …"
                  {...register("phone")}
                />
              </Field>
            </div>

            <Field
              id="preferredContact"
              label="How should we reply?"
              error={errors.preferredContact?.message}
            >
              <Select id="preferredContact" {...register("preferredContact")}>
                <option value="phone">Phone call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </Select>
            </Field>

            <Field id="notes" label="Anything else" optional error={errors.notes?.message}>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Deadlines, consignee details, previous reference numbers…"
                {...register("notes")}
              />
            </Field>
          </>
        ) : null}

        <HoneypotField ref={honeypotRef} />
        {onFinalStep ? (
          <TurnstileWidget ref={turnstileRef} action="quote" onToken={setTurnstileToken} />
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            disabled={step === 0 || pending}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" size="lg" onClick={next}>
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="gold"
              size="lg"
              // Blocked until the anti-spam check has issued a token, so a
              // quick click cannot produce a confusing rejection.
              disabled={pending || awaitingChallenge}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : awaitingChallenge ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Checking you are human…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send request
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
