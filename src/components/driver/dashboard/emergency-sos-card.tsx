"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, CheckCircle2, Loader2, Phone, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { raiseEmergencyAction, type ActionResult } from "@/app/driver/actions";
import type { EmergencyKind } from "@/lib/data/types";

const KINDS: { value: EmergencyKind; label: string }[] = [
  { value: "BREAKDOWN", label: "Vehicle breakdown" },
  { value: "ACCIDENT", label: "Accident or collision" },
  { value: "MEDICAL", label: "Medical emergency" },
  { value: "SECURITY", label: "Security or theft" },
  { value: "OTHER", label: "Something else" },
];

/**
 * SOS control. A single tap only *opens* the confirmation dialog — the alert
 * is not raised until the driver explicitly confirms, so a knock in the cab
 * cannot fire it.
 */
export function EmergencySOSCard({ operationsPhone }: { operationsPhone: string }) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<ActionResult | null>(null);

  function confirm(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const response = await raiseEmergencyAction(formData);
      setResult(response);
    });
  }

  return (
    <div className="portal-panel flex flex-col items-center justify-center border-destructive/40 bg-gradient-to-b from-destructive/15 to-transparent p-5 text-center">
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setResult(null);
        }}
      >
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-destructive font-display text-xl font-bold text-white shadow-[0_0_0_6px_rgba(220,38,38,0.18),0_18px_36px_-16px_rgba(220,38,38,0.9)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400/60 active:scale-95"
            aria-label="Raise an emergency alert — opens a confirmation dialog"
          >
            SOS
          </button>
        </Dialog.Trigger>

        <p className="mt-4 font-semibold text-foreground">Emergency</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Tap for emergency assistance. You will be asked to confirm.
        </p>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in" />
          <Dialog.Content className="portal-shell fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-destructive/40 bg-popover p-6 text-left shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in">
            {result?.ok ? (
              <div className="text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </span>
                <Dialog.Title className="mt-4 font-display text-xl font-semibold text-foreground">
                  Alert logged
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                  {result.message}
                </Dialog.Description>
                <a
                  href={`tel:${operationsPhone.replace(/\s/g, "")}`}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-destructive px-5 text-sm font-semibold text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call operations now
                </a>
                <Dialog.Close asChild>
                  <Button variant="outline-inverse" size="touch" className="mt-3 w-full">
                    Close
                  </Button>
                </Dialog.Close>
              </div>
            ) : (
              <form action={confirm}>
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-red-400">
                    <ShieldAlert className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <Dialog.Title className="font-display text-xl font-semibold text-foreground">
                      Raise an emergency alert?
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                      This logs an alert against your driver record and your current trip
                      so the operations desk can see it.
                    </Dialog.Description>
                  </div>
                </div>

                <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    <strong>Prototype:</strong> no emergency service, SMS or control-room
                    system is connected. Nobody is contacted automatically — phone the
                    operations desk as well.
                  </span>
                </p>

                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="sos-kind" className="text-sm font-semibold text-foreground">
                      What is happening?
                    </label>
                    <Select id="sos-kind" name="kind" defaultValue="BREAKDOWN">
                      {KINDS.map((kind) => (
                        <option key={kind.value} value={kind.value}>
                          {kind.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="sos-note" className="text-sm font-semibold text-foreground">
                      Details and location
                      <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <Textarea
                      id="sos-note"
                      name="note"
                      rows={3}
                      placeholder="e.g. Blown front tyre, 20 km past Singida on the Nzega road."
                    />
                  </div>
                </div>

                {result && !result.ok ? (
                  <p role="alert" className="mt-4 text-sm text-red-400">
                    {result.error}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
                  <Button
                    type="submit"
                    variant="destructive"
                    size="touch"
                    className="sm:flex-1"
                    disabled={pending}
                  >
                    {pending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Logging…
                      </>
                    ) : (
                      "Confirm emergency"
                    )}
                  </Button>
                  <Dialog.Close asChild>
                    <Button
                      type="button"
                      variant="outline-inverse"
                      size="touch"
                      className="sm:flex-1"
                      disabled={pending}
                    >
                      Cancel
                    </Button>
                  </Dialog.Close>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
