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
  litres,
  className,
}: {
  percent: number;
  litres?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const state = stateFor(clamped);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 68" className="h-[62px] w-[110px]" aria-hidden="true">
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="currentColor"
            className="text-white/10"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={state.tone}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${(clamped / 100) * ARC_LENGTH} ${ARC_LENGTH}`}
          />
        </svg>
        <span className="absolute inset-x-0 bottom-0 text-center font-display text-xl font-semibold text-foreground">
          {clamped}%
        </span>
      </div>

      <div
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${clamped} percent — ${state.label}`}
        aria-label="Fuel level"
        className="min-w-0"
      >
        <p className={cn("text-sm font-semibold", state.className)}>{state.label}</p>
        {litres ? (
          <p className="text-xs text-muted-foreground">
            ≈ {Math.round((clamped / 100) * litres).toLocaleString()} L of{" "}
            {litres.toLocaleString()} L
          </p>
        ) : null}
      </div>
    </div>
  );
}
