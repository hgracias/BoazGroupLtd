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
    <div className={cn("portal-panel p-5", className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</p>
      </div>
      <div className="mt-3">{children}</div>
      {footer ? <div className="mt-2 text-xs text-muted-foreground">{footer}</div> : null}
    </div>
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
