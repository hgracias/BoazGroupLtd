import type { Currency } from "@/lib/data/types";

/**
 * PLACEHOLDER indicative rates (units of TZS per 1 unit of currency).
 * Replace with a rates feed or an admin-editable table before go-live —
 * every expense stores the rate used at submission, so changing these
 * never rewrites historical totals.
 */
export const RATES_TO_TZS: Record<Currency, number> = {
  TZS: 1,
  KES: 20.2,
  RWF: 1.87,
  BIF: 0.88,
  UGX: 0.7,
};

export const CURRENCIES: { code: Currency; label: string; country: string }[] = [
  { code: "TZS", label: "Tanzanian Shilling", country: "Tanzania" },
  { code: "KES", label: "Kenyan Shilling", country: "Kenya" },
  { code: "RWF", label: "Rwandan Franc", country: "Rwanda" },
  { code: "BIF", label: "Burundian Franc", country: "Burundi" },
  { code: "UGX", label: "Ugandan Shilling", country: "Uganda" },
];

export function rateToTzs(currency: Currency) {
  return RATES_TO_TZS[currency];
}

export function toTzs(amount: number, currency: Currency) {
  return Math.round(amount * RATES_TO_TZS[currency]);
}

/** Formats in the original currency, e.g. "KES 12,400". */
export function formatMoney(amount: number, currency: Currency) {
  const value = new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: currency === "TZS" || currency === "BIF" || currency === "UGX" ? 0 : 2,
  }).format(amount);
  return `${currency} ${value}`;
}

export function formatTzs(amount: number) {
  return `TZS ${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
    Math.round(amount)
  )}`;
}
