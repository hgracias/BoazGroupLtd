import type { Currency } from "@/lib/data/types";

/**
 * Currencies a driver can be out of pocket in across the corridors we run.
 * The amount and its currency are always stored together — nothing in the
 * system may assume an expense is in TZS.
 */
export const CURRENCIES: { code: Currency; label: string; country: string }[] = [
  { code: "TZS", label: "Tanzanian Shilling", country: "Tanzania" },
  { code: "KES", label: "Kenyan Shilling", country: "Kenya" },
  { code: "RWF", label: "Rwandan Franc", country: "Rwanda" },
  { code: "UGX", label: "Ugandan Shilling", country: "Uganda" },
  { code: "BIF", label: "Burundian Franc", country: "Burundi" },
  { code: "CDF", label: "Congolese Franc", country: "DR Congo" },
  { code: "USD", label: "US Dollar", country: "Regional / cross-border" },
];

/**
 * INDICATIVE rates only (TZS per 1 unit), and deliberately incomplete.
 *
 * These are placeholder figures, not a live FX feed. A currency listed here
 * gets an indicative TZS equivalent stored alongside the original amount at
 * submission time; a currency *absent* from this map is stored in its own
 * currency with no conversion at all — which is the correct behaviour until
 * the business supplies real rates or a rates provider is connected.
 *
 * CDF and USD are intentionally unrated: inventing a rate for them would put
 * fabricated numbers into expense reporting.
 */
export const INDICATIVE_RATES_TO_TZS: Partial<Record<Currency, number>> = {
  TZS: 1,
  KES: 20.2,
  RWF: 1.87,
  BIF: 0.88,
  UGX: 0.7,
};

/** The rate used at submission, or undefined when the currency is unrated. */
export function rateToTzs(currency: Currency): number | undefined {
  return INDICATIVE_RATES_TO_TZS[currency];
}

export function hasRate(currency: Currency) {
  return rateToTzs(currency) !== undefined;
}

export function toTzs(amount: number, currency: Currency): number | undefined {
  const rate = rateToTzs(currency);
  return rate === undefined ? undefined : Math.round(amount * rate);
}

/** Currencies conventionally written without decimal places. */
const ZERO_DECIMAL: Currency[] = ["TZS", "BIF", "UGX", "RWF", "CDF"];

/** Always renders the ISO code beside the amount, e.g. "CDF 42,000". */
export function formatMoney(amount: number, currency: Currency) {
  const value = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    maximumFractionDigits: ZERO_DECIMAL.includes(currency) ? 0 : 2,
  }).format(amount);
  return `${currency} ${value}`;
}

export function formatTzs(amount: number) {
  return formatMoney(Math.round(amount), "TZS");
}

export type CurrencyTotal = { currency: Currency; total: number; count: number };

/**
 * Totals grouped by the currency they were submitted in. No cross-currency
 * arithmetic — adding KES to TZS without a trustworthy rate produces a number
 * nobody should act on.
 */
export function totalsByCurrency(
  entries: { amount: number; currency: Currency }[]
): CurrencyTotal[] {
  const buckets = new Map<Currency, CurrencyTotal>();

  for (const entry of entries) {
    const bucket = buckets.get(entry.currency);
    if (bucket) {
      bucket.total += entry.amount;
      bucket.count += 1;
    } else {
      buckets.set(entry.currency, { currency: entry.currency, total: entry.amount, count: 1 });
    }
  }

  return Array.from(buckets.values()).sort((a, b) => b.total - a.total);
}

/**
 * Sum of the indicative TZS equivalents that exist, plus how many entries had
 * no rate — so the UI can say what the figure does and does not cover.
 */
export function indicativeTzsTotal(entries: { amountTzs?: number }[]) {
  let total = 0;
  let unconverted = 0;

  for (const entry of entries) {
    if (typeof entry.amountTzs === "number") total += entry.amountTzs;
    else unconverted += 1;
  }

  return { total, unconverted };
}
