"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { markAllMessagesReadAction, markMessageReadAction } from "@/app/driver/actions";

export function MarkReadButton({ messageId }: { messageId: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function markRead() {
    const formData = new FormData();
    formData.append("messageId", messageId);
    startTransition(async () => {
      await markMessageReadAction(formData);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline-inverse"
      size="sm"
      onClick={markRead}
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Check className="h-4 w-4" aria-hidden="true" />
      )}
      Mark as read
    </Button>
  );
}

export function MarkAllReadButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      variant="outline-inverse"
      size="touch"
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          await markAllMessagesReadAction();
          router.refresh();
        })
      }
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <CheckCheck className="h-4 w-4" aria-hidden="true" />
      )}
      Mark all as read
    </Button>
  );
}
