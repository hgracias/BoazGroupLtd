"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock, Loader2, LogIn, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clockInAction, clockOutAction, type ActionResult } from "@/app/driver/actions";

export type OpenShift = {
  clockInAt: string;
  clockInAtLabel: string;
  locationIn?: string;
  startOdometerKm?: number;
} | null;

function elapsedLabel(fromIso: string, now: number) {
  const minutes = Math.max(0, Math.floor((now - new Date(fromIso).getTime()) / 60000));
  const hours = Math.floor(minutes / 60);
  return `${String(hours).padStart(2, "0")}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export function ClockPanel({
  openShift,
  tripLabel,
  lastOdometerKm,
}: {
  openShift: OpenShift;
  tripLabel?: string;
  lastOdometerKm?: number;
}) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [pending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<ActionResult | null>(null);

  // Live shift timer, mounted-guarded so server and client markup match.
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!openShift) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, [openShift]);

  function submit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const action = openShift ? clockOutAction : clockInAction;
      const response = await action(formData);
      setResult(response);
      if (response.ok) {
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      <Card className={openShift ? "border-emerald-500/30 bg-emerald-500/10" : ""}>
        <CardContent className="flex items-center gap-4 p-6">
          <span
            className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
              openShift ? "bg-emerald-600 text-white" : "bg-white/10 text-blue-300"
            }`}
          >
            <Clock className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-foreground">
              {openShift ? "On shift" : "Off duty"}
            </p>
            {openShift ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Since {openShift.clockInAtLabel}
                {now ? ` · ${elapsedLabel(openShift.clockInAt, now)} elapsed` : ""}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Your last shift is closed. Clock in to start a new one.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-md border p-4 text-sm ${
            result.ok
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <p>{result.ok ? result.message : result.error}</p>
        </div>
      ) : null}

      <Card>
        <CardContent className="p-6">
          <form ref={formRef} action={submit} className="space-y-5">
            {tripLabel ? (
              <p className="rounded-md bg-white/[0.05] px-4 py-3 text-sm text-slate-200">
                This will be recorded against <span className="font-semibold">{tripLabel}</span>.
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="location">
                {openShift ? "Where are you finishing?" : "Where are you starting?"}
                <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Vingunguti Yard, Namanga, Kigali"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometer">
                Odometer reading (km)
                <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="odometer"
                name={openShift ? "endOdometerKm" : "startOdometerKm"}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder={lastOdometerKm ? String(lastOdometerKm) : "e.g. 486320"}
              />
              {lastOdometerKm ? (
                <p className="text-xs text-muted-foreground">
                  Last recorded: {lastOdometerKm.toLocaleString()} km
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">
                Note<span className="ml-1 font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="note"
                name="note"
                rows={3}
                placeholder={
                  openShift
                    ? "e.g. Offloaded at consignee, POD signed"
                    : "e.g. Loaded at yard, pre-trip inspection done"
                }
              />
            </div>

            <Button
              type="submit"
              size="touch"
              variant={openShift ? "destructive" : "success"}
              className="w-full"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : openShift ? (
                <>
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  Clock out
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" aria-hidden="true" />
                  Clock in
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
