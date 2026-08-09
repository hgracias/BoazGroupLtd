import { LeaveRequestForm } from "@/components/driver/leave-request-form";
import { EmptyState, PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import { listLeaveRequests } from "@/lib/data";
import type { ApprovalStatus } from "@/lib/data/types";
import { approvalLabels, dateOnly, isoDateInput, leaveTypeLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Leave Requests" };

const statusTone: Record<ApprovalStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-200",
  APPROVED: "bg-emerald-500/15 text-emerald-300",
  REJECTED: "bg-red-500/15 text-red-300",
};

export default async function LeavePage() {
  const driver = await requireDriver();
  const requests = await listLeaveRequests(driver.id);

  const approvedDays = requests
    .filter((request) => request.status === "APPROVED")
    .reduce((sum, request) => sum + request.days, 0);
  const pending = requests.filter((request) => request.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PortalHeader
        title="Leave requests"
        description="Ask for time off and track what operations has decided."
      />

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <PortalSection title="Request leave">
          <LeaveRequestForm minDate={isoDateInput(new Date().toISOString())} />
        </PortalSection>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <PortalSection>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Approved days taken
              </p>
              <p className="mt-2 font-display text-3xl font-semibold">{approvedDays}</p>
            </PortalSection>
            <PortalSection>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Awaiting decision
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-amber-400">{pending}</p>
            </PortalSection>
          </div>

          <PortalSection title="Your requests">
            {requests.length ? (
              <ul className="divide-y divide-border/60">
                {requests.map((request) => (
                  <li key={request.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {leaveTypeLabels[request.type]} · {request.days} day
                          {request.days === 1 ? "" : "s"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dateOnly(request.startDate)} → {dateOnly(request.endDate)}
                        </p>
                        {request.reason ? (
                          <p className="mt-2 max-w-xl text-sm text-slate-300">
                            {request.reason}
                          </p>
                        ) : null}
                        {request.reviewNote ? (
                          <p className="mt-2 rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                            {request.reviewNote}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[request.status]}`}
                      >
                        {approvalLabels[request.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No leave requested"
                description="Submit a request on the left and it will appear here for tracking."
              />
            )}
          </PortalSection>
        </div>
      </div>
    </div>
  );
}
