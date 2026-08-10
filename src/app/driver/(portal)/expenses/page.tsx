import Link from "next/link";
import { Paperclip, Plus } from "lucide-react";

import { CurrencyTotals } from "@/components/driver/currency-totals";
import { FormBanner } from "@/components/driver/field";
import { EmptyState, PortalHeader } from "@/components/driver/portal-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney, formatTzs } from "@/lib/currency";
import { listExpenses } from "@/lib/data";
import type { ApprovalStatus } from "@/lib/data/types";
import {
  approvalBadgeVariant,
  approvalLabels,
  dateOnly,
  expenseCategoryLabels,
} from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Expenses" };

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: { status?: string; saved?: string };
}) {
  const driver = await requireDriver();
  const status = FILTERS.some((filter) => filter.value === searchParams.status)
    ? (searchParams.status as ApprovalStatus | "")
    : "";

  const [all, expenses] = await Promise.all([
    listExpenses({ driverId: driver.id }),
    listExpenses({ driverId: driver.id, status: status || undefined }),
  ]);

  const pendingExpenses = all.filter((expense) => expense.status === "PENDING");
  const approvedExpenses = all.filter((expense) => expense.status === "APPROVED");

  return (
    <div>
      <PortalHeader
        title="Expense reports"
        description="Logged in the currency you actually paid. Totals are grouped per currency — nothing is converted unless a rate is configured for it."
        action={
          <Button asChild size="touch">
            <Link href="/driver/expenses/new">
              <Plus className="h-5 w-5" aria-hidden="true" />
              Add expense
            </Link>
          </Button>
        }
      />

      <div className="space-y-6">
        {searchParams.saved ? (
          <FormBanner tone="success">
            Expense submitted. Operations will review it shortly.
          </FormBanner>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyTotals label="Pending approval" expenses={pendingExpenses} />
          <CurrencyTotals label="Approved to date" expenses={approvedExpenses} />
        </div>

        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const active = status === filter.value;
            return (
              <Link
                key={filter.label}
                href={filter.value ? `/driver/expenses?status=${filter.value}` : "/driver/expenses"}
                aria-current={active ? "true" : undefined}
                className={`inline-flex h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white/[0.04] text-slate-200 hover:border-white/25"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        {expenses.length ? (
          <Card>
            <CardContent className="px-0 py-0">
              <ul className="divide-y divide-border sm:hidden">
                {expenses.map((expense) => (
                  <li key={expense.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {expenseCategoryLabels[expense.category]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateOnly(expense.spentAt)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-foreground">
                          {formatMoney(expense.amount, expense.currency)}
                        </p>
                        {expense.currency !== "TZS" ? (
                          <p className="text-xs text-muted-foreground">
                            {expense.amountTzs !== undefined
                              ? `≈ ${formatTzs(expense.amountTzs)}`
                              : "No TZS rate configured"}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{expense.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Badge variant={approvalBadgeVariant[expense.status]}>
                        {approvalLabels[expense.status]}
                      </Badge>
                      {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:underline"
                        >
                          <Paperclip className="h-3 w-3" aria-hidden="true" />
                          Receipt
                        </a>
                      ) : null}
                    </div>
                    {expense.reviewNote ? (
                      <p className="mt-2 rounded bg-white/[0.05] px-3 py-2 text-xs text-slate-200">
                        {expense.reviewNote}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Indicative TZS</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="whitespace-nowrap font-medium">
                          {dateOnly(expense.spentAt)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {expenseCategoryLabels[expense.category]}
                        </TableCell>
                        <TableCell className="max-w-sm text-muted-foreground">
                          {expense.description}
                          {expense.reviewNote ? (
                            <span className="mt-1 block text-xs text-slate-200">
                              Note: {expense.reviewNote}
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right font-semibold">
                          {formatMoney(expense.amount, expense.currency)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right text-muted-foreground">
                          {expense.amountTzs !== undefined ? formatTzs(expense.amountTzs) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={approvalBadgeVariant[expense.status]}>
                            {approvalLabels[expense.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {expense.receiptUrl ? (
                            <a
                              href={expense.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-300 hover:underline"
                            >
                              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                              View
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="Submit fuel, tolls, border fees and lodging as you go — it is far easier than reconstructing a trip at the end."
            action={
              <Button asChild size="touch">
                <Link href="/driver/expenses/new">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  Add expense
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
