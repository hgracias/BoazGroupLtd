import { cn } from "@/lib/utils";

const ARC_LENGTH = 157.08; // π × r, r = 50

type FuelState = { tone: string; track: string; label: string; className: string };

function stateFor(percent: number): FuelState {
  if (percent < 15) {
    return { tone: "#DC2626", track: "Critical", label: "Critical", className: "text-red-400" };
  }
  if (percent < 30) {
    return { tone: "#F59E0B", track: "Low", label: "Low", className: "text-amber-400" };
  }
  return { tone: "#22C55E", track: "Healthy", label: "Healthy", className: "text-emerald-400" };
}

/**
 * Semi-circular fuel gauge. Colour alone never carries the meaning — the
 * state is also written out ("Low", "Critical") and exposed via ARIA.
 */
export function FuelGauge({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const state = stateFor(clamped);

  return (
    <div
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${clamped} percent — ${state.label}`}
      aria-label="Fuel level"
      className={cn("flex items-center gap-3", className)}
    >
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 66" className="h-[54px] w-[96px]" aria-hidden="true">
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="currentColor"
            className="text-white/10"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={state.tone}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(clamped / 100) * ARC_LENGTH} ${ARC_LENGTH}`}
          />
        </svg>
        <span className="absolute inset-x-0 bottom-0 text-center font-display text-2xl font-semibold leading-none text-foreground">
          {clamped}
          <span className="text-base font-medium text-muted-foreground">%</span>
        </span>
      </div>

      {/* Never colour alone — the state is spelled out too. */}
      <p className={cn("text-sm font-semibold", state.className)}>{state.label}</p>
    </div>
  );
}
