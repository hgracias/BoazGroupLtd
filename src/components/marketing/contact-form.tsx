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
import { submitContactAction } from "@/app/(marketing)/actions";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "quote", name: "", email: "", phone: "", message: "" },
  });

  function onSubmit(values: ContactValues) {
    setServerError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value == null ? "" : String(value));
    });

    startTransition(async () => {
      const result = await submitContactAction(formData);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      setReference(result.reference);
      reset();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

      <Field id="message" label="Message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={5}
          placeholder="Origin, destination, cargo and timing help us answer in one reply."
          {...register("message")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
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
