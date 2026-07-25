import { Paperclip } from "lucide-react";

import { ExpenseReview } from "@/components/admin/expense-review";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney, formatTzs } from "@/lib/currency";
import type { WithDriver } from "@/lib/data";
import type { ExpenseReport } from "@/lib/data/types";
import {
  approvalBadgeVariant,
  approvalLabels,
  dateOnly,
  expenseCategoryLabels,
} from "@/lib/format";

export function ExpenseTable({ rows }: { rows: WithDriver<ExpenseReport>[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">In TZS</TableHead>
          <TableHead>Receipt</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Review</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((expense) => (
          <TableRow key={expense.id} className="align-top">
            <TableCell className="whitespace-nowrap font-medium">
              {dateOnly(expense.spentAt)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <span className="block font-medium">{expense.driverName}</span>
              <span className="text-xs text-muted-foreground">{expense.driverEmployeeId}</span>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {expenseCategoryLabels[expense.category]}
            </TableCell>
            <TableCell className="max-w-xs text-muted-foreground">
              {expense.description}
              {expense.reviewNote ? (
                <span className="mt-1 block text-xs text-navy-800">
                  Note: {expense.reviewNote}
                </span>
              ) : null}
            </TableCell>
            <TableCell className="whitespace-nowrap text-right font-semibold">
              {formatMoney(expense.amount, expense.currency)}
            </TableCell>
            <TableCell className="whitespace-nowrap text-right text-muted-foreground">
              {formatTzs(expense.amountTzs)}
              {expense.currency !== "TZS" ? (
                <span className="block text-[11px]">@ {expense.rateToTzs}</span>
              ) : null}
            </TableCell>
            <TableCell>
              {expense.receiptUrl ? (
                <a
                  href={expense.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline"
                >
                  <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                  View
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={approvalBadgeVariant[expense.status]}>
                {approvalLabels[expense.status]}
              </Badge>
            </TableCell>
            <TableCell className="min-w-[220px]">
              {expense.status === "PENDING" ? (
                <ExpenseReview expenseId={expense.id} />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {expense.reviewedAt ? `Reviewed ${dateOnly(expense.reviewedAt)}` : "—"}
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
