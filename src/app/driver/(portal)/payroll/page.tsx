import { EmptyState, PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTzs } from "@/lib/currency";
import { listPayroll } from "@/lib/data";
import type { PayrollStatus } from "@/lib/data/types";
import { dateOnly, payrollStatusLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Payroll" };

const statusTone: Record<PayrollStatus, string> = {
  PAID: "bg-emerald-500/15 text-emerald-300",
  PROCESSING: "bg-amber-500/15 text-amber-200",
  SCHEDULED: "bg-white/[0.07] text-slate-300",
};

export default async function PayrollPage() {
  const driver = await requireDriver();
  const entries = await listPayroll(driver.id);
  const current = entries.find((entry) => entry.status !== "PAID") ?? entries[0] ?? null;
  const paidThisYear = entries
    .filter((entry) => entry.status === "PAID")
    .reduce((sum, entry) => sum + entry.netTzs, 0);

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PortalHeader
        title="Payroll"
        description="Your pay periods, trip allowances and payment status."
      />

      {current ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <PortalSection>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {current.periodLabel}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">
              {formatTzs(current.netTzs)}
            </p>
            <span
              className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[current.status]}`}
            >
              {payrollStatusLabels[current.status]}
            </span>
          </PortalSection>
          <PortalSection>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Trip allowance
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">
              {formatTzs(current.tripAllowanceTzs)}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {current.tripsCompleted} trip{current.tripsCompleted === 1 ? "" : "s"} this period
            </p>
          </PortalSection>
          <PortalSection>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Paid to date
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">{formatTzs(paidThisYear)}</p>
            <p className="mt-3 text-sm text-muted-foreground">Across settled periods</p>
          </PortalSection>
        </div>
      ) : null}

      {entries.length ? (
        <PortalSection title="Pay history">
          <div className="-mx-5 sm:-mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Base</TableHead>
                  <TableHead className="text-right">Allowance</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {entry.periodLabel}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      {formatTzs(entry.baseAmountTzs)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      {formatTzs(entry.tripAllowanceTzs)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-muted-foreground">
                      {entry.deductionsTzs ? `− ${formatTzs(entry.deductionsTzs)}` : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold">
                      {formatTzs(entry.netTzs)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[entry.status]}`}
                      >
                        {payrollStatusLabels[entry.status]}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {entry.paidAt ? dateOnly(entry.paidAt) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PortalSection>
      ) : (
        <EmptyState
          title="No payroll records"
          description="Pay periods appear here once payroll has processed your first month."
        />
      )}

      <p className="text-xs text-muted-foreground">
        Payslip downloads arrive with the payroll-system integration. Query anything with
        the operations desk.
      </p>
    </div>
  );
}
