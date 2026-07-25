"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewExpenseAction } from "@/app/admin/actions";

export function ExpenseReview({ expenseId }: { expenseId: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [rejecting, setRejecting] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function review(decision: "APPROVED" | "REJECTED") {
    setError(null);
    const formData = new FormData();
    formData.append("expenseId", expenseId);
    formData.append("decision", decision);
    formData.append("reviewNote", decision === "REJECTED" ? note : "");

    startTransition(async () => {
      const result = await reviewExpenseAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRejecting(false);
      setNote("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="success"
          disabled={pending}
          onClick={() => review("APPROVED")}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="h-4 w-4" aria-hidden="true" />
          )}
          Approve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => setRejecting((value) => !value)}
          aria-expanded={rejecting}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Reject
        </Button>
      </div>

      {rejecting ? (
        <div className="space-y-2">
          <label htmlFor={`note-${expenseId}`} className="text-xs font-semibold text-navy-900">
            Reason for rejection (the driver sees this)
          </label>
          <Textarea
            id={`note-${expenseId}`}
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Not pre-authorised — resubmit with the client's written approval."
            className="min-h-[72px] text-sm"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() => review("REJECTED")}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Confirm rejection
          </Button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
