import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  icon: Icon,
  children,
  footer,
  className,
}: {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("portal-panel flex flex-col p-5", className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">{label}</p>
      </div>
      <div className="mt-3 flex-1">{children}</div>
      {footer ? (
        <p className="mt-3 text-xs leading-snug text-muted-foreground">{footer}</p>
      ) : null}
    </div>
  );
}

/** Circular icon badge sitting left of a value, as on the reference cards. */
export function MetricBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/15 text-blue-300"
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

export function MetricValue({
  value,
  unit,
  className,
}: {
  value: string;
  unit?: string;
  className?: string;
}) {
  return (
    <p className={cn("font-display text-3xl font-semibold tracking-tight", className)}>
      {value}
      {unit ? <span className="ml-1.5 text-base font-medium text-muted-foreground">{unit}</span> : null}
    </p>
  );
}
