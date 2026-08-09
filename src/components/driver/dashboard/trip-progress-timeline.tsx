import { Check, Flag, MapPin } from "lucide-react";

import type { RouteStop } from "@/lib/data/types";
import { dateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

function stopTime(stop: RouteStop) {
  if (stop.departedAt && stop.status === "COMPLETED") return `Departed ${dateTime(stop.departedAt)}`;
  if (stop.arrivedAt) return `Arrived ${dateTime(stop.arrivedAt)}`;
  if (stop.scheduledAt) return `ETA ${dateTime(stop.scheduledAt)}`;
  return "Time to be confirmed";
}

const statusText: Record<RouteStop["status"], string> = {
  COMPLETED: "Completed",
  CURRENT: "Current position",
  UPCOMING: "Upcoming",
};

/**
 * Horizontal route timeline. Works for any number of stops (2–8 comfortably);
 * progress is derived from the data, never from fixed pixel offsets.
 */
export function TripProgressTimeline({ stops }: { stops: RouteStop[] }) {
  if (stops.length === 0) return null;

  const lastDoneIndex = stops.reduce(
    (last, stop, index) => (stop.status === "COMPLETED" || stop.status === "CURRENT" ? index : last),
    0
  );
  const progressPercent =
    stops.length > 1 ? (lastDoneIndex / (stops.length - 1)) * 100 : 100;

  return (
    <div className="overflow-x-auto pb-2">
      <ol
        className="relative grid min-w-[640px] gap-4"
        style={{ gridTemplateColumns: `repeat(${stops.length}, minmax(0, 1fr))` }}
      >
        {/* Track sits behind the nodes, inset by half a column each side. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[11px] h-[3px] rounded-full bg-white/10"
          style={{
            left: `calc(${100 / stops.length / 2}%)`,
            right: `calc(${100 / stops.length / 2}%)`,
          }}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-[width] duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {stops.map((stop) => {
          const completed = stop.status === "COMPLETED";
          const current = stop.status === "CURRENT";

          return (
            <li key={stop.id} className="relative flex flex-col items-center text-center">
              <span
                className={cn(
                  "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2",
                  completed && "border-emerald-400 bg-emerald-500 text-white",
                  current && "border-blue-300 bg-blue-500 text-white ring-4 ring-blue-500/25",
                  !completed && !current && "border-slate-600 bg-slate-800 text-slate-400"
                )}
              >
                {completed ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : current ? (
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                ) : stop.kind === "DESTINATION" ? (
                  <Flag className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>

              <p
                className={cn(
                  "mt-3 text-sm font-semibold",
                  current ? "text-foreground" : completed ? "text-slate-200" : "text-muted-foreground"
                )}
              >
                {stop.name}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{stopTime(stop)}</p>
              <p
                className={cn(
                  "mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  completed && "bg-emerald-500/15 text-emerald-300",
                  current && "bg-blue-500/20 text-blue-200",
                  !completed && !current && "bg-white/5 text-slate-400"
                )}
              >
                {statusText[stop.status]}
              </p>
              {stop.note ? (
                <p className="mt-1.5 max-w-[180px] text-[11px] leading-relaxed text-muted-foreground">
                  {stop.note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
