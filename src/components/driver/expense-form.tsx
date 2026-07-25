"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";

import { Field, FormBanner } from "@/components/driver/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createExpenseAction } from "@/app/driver/actions";
import { CURRENCIES, RATES_TO_TZS, formatTzs } from "@/lib/currency";
import { expenseCategoryLabels } from "@/lib/format";
import { expenseSchema, type ExpenseValues } from "@/lib/validations";

const CATEGORIES = Object.keys(expenseCategoryLabels) as (keyof typeof expenseCategoryLabels)[];

export function ExpenseForm({
  trips,
  defaultTripId,
  todayIso,
}: {
  trips: { id: string; label: string }[];
  defaultTripId?: string;
  todayIso: string;
}) {
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [pending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExpenseValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      spentAt: todayIso,
      category: "FUEL",
      description: "",
      currency: "TZS",
      tripId: defaultTripId ?? "",
    },
  });

  const amount = watch("amount");
  const currency = watch("currency");
  const converted =
    currency && currency !== "TZS" && Number(amount) > 0
      ? Math.round(Number(amount) * RATES_TO_TZS[currency])
      : null;

  function onSubmit(values: ExpenseValues) {
    setServerError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value == null ? "" : String(value));
    });
    const file = fileRef.current?.files?.[0];
    if (file) formData.append("receipt", file);

    startTransition(async () => {
      const result = await createExpenseAction(formData);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      router.push("/driver/expenses?saved=1");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError ? <FormBanner tone="error">{serverError}</FormBanner> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="category" label="Category" error={errors.category?.message}>
          <Select id="category" aria-invalid={Boolean(errors.category)} {...register("category")}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {expenseCategoryLabels[category]}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="spentAt" label="Date of expense" error={errors.spentAt?.message}>
          <Input
            id="spentAt"
            type="date"
            max={todayIso}
            aria-invalid={Boolean(errors.spentAt)}
            {...register("spentAt")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <Field
          id="amount"
          label="Amount"
          error={errors.amount?.message}
          hint={converted ? `≈ ${formatTzs(converted)} at today's indicative rate` : undefined}
        >
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0"
            aria-invalid={Boolean(errors.amount)}
            {...register("amount")}
          />
        </Field>

        <Field id="currency" label="Currency" error={errors.currency?.message}>
          <Select id="currency" className="sm:w-44" {...register("currency")}>
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} — {item.country}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        id="description"
        label="What was it for"
        error={errors.description?.message}
        hint="e.g. Diesel 320 litres at Singida, or Namanga OSBP gate fee."
      >
        <Textarea
          id="description"
          rows={3}
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </Field>

      {trips.length ? (
        <Field id="tripId" label="Trip" optional error={errors.tripId?.message}>
          <Select id="tripId" {...register("tripId")}>
            <option value="">Not tied to a specific trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.label}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="receipt">
          Photo of receipt
          <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="receipt"
          name="receipt"
          type="file"
          accept="image/*,application/pdf"
          capture="environment"
          ref={fileRef}
          className="h-auto py-2.5"
        />
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP, HEIC or PDF, up to 5 MB. Photograph the receipt before you
          lose it — approvals move faster with one attached.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
        <Button type="submit" size="touch" className="sm:w-auto" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              <Send className="h-5 w-5" aria-hidden="true" />
              Submit expense
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="touch"
          className="sm:w-auto"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
