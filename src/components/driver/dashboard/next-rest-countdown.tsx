"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function splitRemaining(targetIso: string, now: number) {
  const diffMs = new Date(targetIso).getTime() - now;
  const overdue = diffMs <= 0;
  const totalMinutes = Math.floor(Math.abs(diffMs) / 60_000);
  return {
    overdue,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

/**
 * Live countdown to the driver's next mandatory rest.
 * `serverLabel` is rendered until the client mounts, so server and client
 * markup match and the value never flashes.
 */
export function NextRestCountdown({
  nextRestAt,
  serverLabel,
  requiredMinutes,
}: {
  nextRestAt: string;
  serverLabel: string;
  requiredMinutes: number;
}) {
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (now === null) {
    return (
      <>
        <p className="font-display text-3xl font-semibold tracking-tight">{serverLabel}</p>
        <p className="mt-2 text-xs text-muted-foreground">{requiredMinutes} min break required</p>
      </>
    );
  }

  const { overdue, hours, minutes } = splitRemaining(nextRestAt, now);
  const soon = !overdue && hours === 0 && minutes <= 30;

  return (
    <>
      <p
        className={cn(
          "font-display text-3xl font-semibold tracking-tight",
          overdue && "text-red-400",
          soon && "text-amber-400"
        )}
      >
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
      </p>
      <p
        className={cn(
          "mt-2 text-xs",
          overdue ? "font-semibold text-red-400" : soon ? "font-semibold text-amber-400" : "text-muted-foreground"
        )}
      >
        {overdue
          ? `Rest overdue — stop for ${requiredMinutes} min`
          : soon
            ? `Break due soon · ${requiredMinutes} min`
            : `Until ${requiredMinutes} min break`}
      </p>
    </>
  );
}
