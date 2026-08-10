import {
  formatMoney,
  formatTzs,
  indicativeTzsTotal,
  totalsByCurrency,
} from "@/lib/currency";
import type { ExpenseReport } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/**
 * Expense totals shown per submitted currency. Amounts in different
 * currencies are never added together — a combined figure would depend on
 * rates the business has not supplied.
 */
export function CurrencyTotals({
  label,
  expenses,
  className,
  showIndicative = true,
}: {
  label: string;
  expenses: ExpenseReport[];
  className?: string;
  showIndicative?: boolean;
}) {
  const totals = totalsByCurrency(expenses);
  const { total: tzsTotal, unconverted } = indicativeTzsTotal(expenses);

  return (
    <div className={cn("portal-panel p-5", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      {totals.length ? (
        <>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {totals.map((entry) => (
              <li key={entry.currency}>
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {formatMoney(entry.total, entry.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.count} claim{entry.count === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>

          {showIndicative && tzsTotal > 0 ? (
            <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              Indicative {formatTzs(tzsTotal)} combined
              {unconverted > 0
                ? ` — excludes ${unconverted} claim${unconverted === 1 ? "" : "s"} in a currency with no configured rate`
                : ""}
              .
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Nothing recorded.</p>
      )}
    </div>
  );
}
