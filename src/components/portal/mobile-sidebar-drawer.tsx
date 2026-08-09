"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { SidebarContent, type SidebarDriver } from "@/components/portal/sidebar-content";

/**
 * Mobile navigation. Radix Dialog gives focus trapping, escape-to-close and
 * scroll locking; the panel itself reuses the desktop sidebar content.
 */
export function MobileSidebarDrawer({
  driver,
  unreadMessages,
}: {
  driver: SidebarDriver;
  unreadMessages: number;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-white/[0.04] text-foreground transition-colors hover:bg-white/[0.08] lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="portal-shell fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in lg:hidden" />
        <Dialog.Content
          className="portal-shell fixed inset-y-0 left-0 z-50 w-[86%] max-w-[300px] border-r border-border/70 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:hidden"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Driver portal navigation</Dialog.Title>
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-3 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Close>

          <SidebarContent
            driver={driver}
            unreadMessages={unreadMessages}
            onNavigate={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
