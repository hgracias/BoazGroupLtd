"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

import { FormBanner } from "@/components/driver/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createLeaveRequestAction, type ActionResult } from "@/app/driver/actions";
import { leaveTypeLabels } from "@/lib/format";

const TYPES = Object.keys(leaveTypeLabels) as (keyof typeof leaveTypeLabels)[];

export function LeaveRequestForm({ minDate }: { minDate: string }) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [pending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<ActionResult | null>(null);

  function submit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const response = await createLeaveRequestAction(formData);
      setResult(response);
      if (response.ok) {
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  return (
    <form ref={formRef} action={submit} className="space-y-4">
      {result ? (
        <FormBanner tone={result.ok ? "success" : "error"}>
          {result.ok ? result.message : result.error}
        </FormBanner>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="leave-type">Leave type</Label>
        <Select id="leave-type" name="type" defaultValue="ANNUAL">
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {leaveTypeLabels[type]}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="leave-start">First day</Label>
          <Input id="leave-start" name="startDate" type="date" min={minDate} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="leave-end">Last day</Label>
          <Input id="leave-end" name="endDate" type="date" min={minDate} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="leave-reason">
          Reason<span className="ml-1 font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="leave-reason"
          name="reason"
          rows={3}
          placeholder="Helps operations plan cover for your trips."
        />
      </div>

      <Button type="submit" size="touch" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit request
          </>
        )}
      </Button>
    </form>
  );
}
