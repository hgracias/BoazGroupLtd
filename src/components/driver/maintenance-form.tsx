"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";

import { Field, FormBanner } from "@/components/driver/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createMaintenanceAction } from "@/app/driver/actions";
import { CURRENCIES } from "@/lib/currency";
import type { Truck } from "@/lib/data/types";
import { maintenanceTypeLabels } from "@/lib/format";
import { maintenanceSchema, type MaintenanceValues } from "@/lib/validations";

const TYPES = Object.keys(maintenanceTypeLabels) as (keyof typeof maintenanceTypeLabels)[];

export function MaintenanceForm({
  trucks,
  defaultTruckId,
  defaultOdometerKm,
  todayIso,
}: {
  trucks: Truck[];
  defaultTruckId?: string;
  defaultOdometerKm?: number;
  todayIso: string;
}) {
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [pending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      truckId: defaultTruckId ?? trucks[0]?.id ?? "",
      performedAt: todayIso,
      type: "GENERAL_SERVICE",
      description: "",
      costCurrency: "TZS",
      odometerKm: defaultOdometerKm,
      vendor: "",
    },
  });

  function onSubmit(values: MaintenanceValues) {
    setServerError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value == null ? "" : String(value));
    });
    const file = fileRef.current?.files?.[0];
    if (file) formData.append("receipt", file);

    startTransition(async () => {
      const result = await createMaintenanceAction(formData);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      router.push("/driver/maintenance?saved=1");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError ? <FormBanner tone="error">{serverError}</FormBanner> : null}

      <Field id="truckId" label="Truck" error={errors.truckId?.message}>
        <Select id="truckId" aria-invalid={Boolean(errors.truckId)} {...register("truckId")}>
          {trucks.map((truck) => (
            <option key={truck.id} value={truck.id}>
              {truck.plateNumber} — {truck.make} {truck.model}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="performedAt" label="Date of maintenance" error={errors.performedAt?.message}>
          <Input
            id="performedAt"
            type="date"
            max={todayIso}
            aria-invalid={Boolean(errors.performedAt)}
            {...register("performedAt")}
          />
        </Field>

        <Field id="type" label="Type of maintenance" error={errors.type?.message}>
          <Select id="type" aria-invalid={Boolean(errors.type)} {...register("type")}>
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {maintenanceTypeLabels[type]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        id="description"
        label="What was done"
        error={errors.description?.message}
        hint="Be specific — parts replaced, symptoms, anything operations should know."
      >
        <Textarea
          id="description"
          rows={4}
          placeholder="e.g. Replaced two rear drive tyres after sidewall damage on the Singida stretch."
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <Field id="costAmount" label="Cost" error={errors.costAmount?.message}>
          <Input
            id="costAmount"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0"
            aria-invalid={Boolean(errors.costAmount)}
            {...register("costAmount")}
          />
        </Field>

        <Field id="costCurrency" label="Currency" error={errors.costCurrency?.message}>
          <Select id="costCurrency" className="sm:w-40" {...register("costCurrency")}>
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.country}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="odometerKm"
          label="Odometer reading (km)"
          error={errors.odometerKm?.message}
          hint={
            defaultOdometerKm
              ? `Last recorded: ${defaultOdometerKm.toLocaleString()} km`
              : undefined
          }
        >
          <Input
            id="odometerKm"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            aria-invalid={Boolean(errors.odometerKm)}
            {...register("odometerKm")}
          />
        </Field>

        <Field id="vendor" label="Workshop / vendor" optional error={errors.vendor?.message}>
          <Input
            id="vendor"
            placeholder="e.g. Vingunguti Heavy Services"
            {...register("vendor")}
          />
        </Field>
      </div>

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
          JPG, PNG, WebP, HEIC or PDF, up to 5 MB. You can photograph it directly.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
        <Button type="submit" size="touch" className="sm:w-auto" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-5 w-5" aria-hidden="true" />
              Save maintenance record
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
