import Link from "next/link";

import { ExpenseTable } from "@/components/admin/expense-table";
import { EmptyState } from "@/components/driver/portal-ui";
import { Card, CardContent } from "@/components/ui/card";
import { formatTzs } from "@/lib/currency";
import { decorateWithDriver, listExpenses } from "@/lib/data";
import type { ApprovalStatus } from "@/lib/data/types";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Expenses" };

const FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default async function AdminExpensesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();

  const status = FILTERS.some((filter) => filter.value === searchParams.status)
    ? (searchParams.status as ApprovalStatus | "")
    : "";

  const rows = await decorateWithDriver(await listExpenses({ status: status || undefined }));
  const total = rows.reduce((sum, expense) => sum + expense.amountTzs, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy-900">
          Expense submissions
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {rows.length} record{rows.length === 1 ? "" : "s"} · {formatTzs(total)} total in TZS
          at the rate saved with each claim.
        </p>
      </div>

      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = status === filter.value;
          return (
            <Link
              key={filter.label}
              href={filter.value ? `/admin/expenses?status=${filter.value}` : "/admin/expenses"}
              aria-current={active ? "true" : undefined}
              className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                active
                  ? "border-navy-700 bg-navy-700 text-white"
                  : "border-border bg-white text-navy-800 hover:border-navy-200"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <Card>
        <CardContent className="px-0">
          {rows.length ? (
            <ExpenseTable rows={rows} />
          ) : (
            <div className="px-6">
              <EmptyState
                title="No expenses match that filter"
                description="Try a different status."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
