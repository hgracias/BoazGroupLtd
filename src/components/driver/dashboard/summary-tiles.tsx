import Link from "next/link";
import { ArrowRight, ClipboardCheck, MessagesSquare, Receipt } from "lucide-react";

import { formatMoney, formatTzs } from "@/lib/currency";
import type { DriverMessage, ExpenseReport, Inspection } from "@/lib/data/types";
import {
  approvalLabels,
  dateTime,
  expenseCategoryLabels,
  inspectionResultLabels,
  inspectionTypeLabels,
} from "@/lib/format";
import { cn } from "@/lib/utils";

function TileShell({
  icon,
  title,
  children,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="portal-panel flex flex-col p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{title}</p>
      </div>
      <div className="mt-3 flex-1">{children}</div>
      {/* Compact pill, left-aligned — matches the reference, still a 44px
          touch target on phones. */}
      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-blue-600 sm:h-9"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function InspectionSummaryCard({ inspection }: { inspection: Inspection | null }) {
  const tone =
    inspection?.result === "FAIL"
      ? "text-red-400"
      : inspection?.result === "PASS_WITH_DEFECTS"
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <TileShell
      icon={<ClipboardCheck className="h-4 w-4" aria-hidden="true" />}
      title="Inspection"
      href="/driver/inspections"
      linkLabel="View"
    >
      {inspection ? (
        <>
          <p className={cn("text-sm font-semibold", tone)}>
            {inspectionTypeLabels[inspection.type]} · {inspectionResultLabels[inspection.result]}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{dateTime(inspection.performedAt)}</p>
          {inspection.defects.length > 0 ? (
            <p className="mt-2 text-xs text-amber-300">
              {inspection.defects.length} defect{inspection.defects.length === 1 ? "" : "s"} noted
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          No inspection logged yet for your current unit.
        </p>
      )}
    </TileShell>
  );
}

export function MessageSummaryCard({
  unreadCount,
  latest,
}: {
  unreadCount: number;
  latest: DriverMessage | null;
}) {
  return (
    <TileShell
      icon={<MessagesSquare className="h-4 w-4" aria-hidden="true" />}
      title="Messages"
      href="/driver/messages"
      linkLabel="View"
    >
      <p className="text-sm font-semibold text-foreground">
        {unreadCount > 0
          ? `You have ${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
          : "No unread messages"}
      </p>
      {latest ? (
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
          {latest.from}: {latest.subject}
        </p>
      ) : null}
    </TileShell>
  );
}

export function ExpenseSummaryCard({ expense }: { expense: ExpenseReport | null }) {
  const tone =
    expense?.status === "APPROVED"
      ? "text-emerald-400"
      : expense?.status === "REJECTED"
        ? "text-red-400"
        : "text-amber-400";

  return (
    <TileShell
      icon={<Receipt className="h-4 w-4" aria-hidden="true" />}
      title="Fuel expense"
      href="/driver/expenses"
      linkLabel="View"
    >
      {expense ? (
        <>
          <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {formatMoney(expense.amount, expense.currency)}
          </p>
          {expense.currency !== "TZS" ? (
            <p className="text-xs text-muted-foreground">≈ {formatTzs(expense.amountTzs)}</p>
          ) : null}
          <p className={cn("mt-1.5 text-xs font-semibold", tone)}>
            {approvalLabels[expense.status]} · {expenseCategoryLabels[expense.category]}
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No expenses submitted yet.</p>
      )}
    </TileShell>
  );
}
