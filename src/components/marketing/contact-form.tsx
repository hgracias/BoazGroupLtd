"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Field, FormBanner } from "@/components/driver/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HoneypotField } from "@/components/marketing/honeypot-field";
import {
  TurnstileWidget,
  type TurnstileHandle,
} from "@/components/marketing/turnstile-widget";
import { submitContactAction } from "@/app/(marketing)/actions";
import { HONEYPOT_FIELD } from "@/lib/spam/honeypot";
import { TURNSTILE_FIELD, isTurnstileClientEnabled } from "@/lib/spam/turnstile-client";
import { contactSchema, type ContactValues } from "@/lib/validations";

const SUBJECTS: { value: ContactValues["subject"]; label: string }[] = [
  { value: "quote", label: "Freight rate / quote" },
  { value: "tracking", label: "An existing shipment" },
  { value: "customs", label: "Customs & clearance" },
  { value: "warehousing", label: "Warehousing & consolidation" },
  { value: "careers", label: "Driver & careers" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  const [pending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [reference, setReference] = React.useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState("");
  const turnstileRef = React.useRef<TurnstileHandle>(null);
  const honeypotRef = React.useRef<HTMLInputElement>(null);
  // Blocked until the anti-spam check has issued a token.
  const awaitingChallenge = isTurnstileClientEnabled() && !turnstileToken;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "quote",
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  function onSubmit(values: ContactValues) {
    setServerError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value == null ? "" : String(value));
    });
    // Honeypot stays empty for real people; the widget supplies the token.
    formData.append(HONEYPOT_FIELD, honeypotRef.current?.value ?? "");
    formData.append(TURNSTILE_FIELD, turnstileToken);

    startTransition(async () => {
      const result = await submitContactAction(formData);
      if (!result.ok) {
        setServerError(result.error);
        // A token is single-use — get a fresh one before the next attempt.
        turnstileRef.current?.reset();
        return;
      }
      setReference(result.reference);
      reset();
      turnstileRef.current?.reset();
    });
  }

  if (reference) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-navy-900">
          Message received — {reference}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The operations desk replies within one working day. For anything urgent, call
          or WhatsApp instead.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setReference(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5" noValidate>
      {serverError ? <FormBanner tone="error">{serverError}</FormBanner> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...register("name")} />
        </Field>
        <Field id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Phone / WhatsApp" optional error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+255 …" {...register("phone")} />
        </Field>
        <Field id="subject" label="What is this about" error={errors.subject?.message}>
          <Select id="subject" {...register("subject")}>
            {SUBJECTS.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        id="company"
        label="Company / Organization"
        optional
        error={errors.company?.message}
      >
        <Input
          id="company"
          autoComplete="organization"
          placeholder="Who are you enquiring on behalf of?"
          {...register("company")}
        />
      </Field>

      <Field id="message" label="Message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={5}
          placeholder="Origin, destination, cargo and timing help us answer in one reply."
          {...register("message")}
        />
      </Field>

      <HoneypotField ref={honeypotRef} />
      <TurnstileWidget ref={turnstileRef} action="contact" onToken={setTurnstileToken} />

      <Button type="submit" size="lg" disabled={pending || awaitingChallenge}>
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
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
