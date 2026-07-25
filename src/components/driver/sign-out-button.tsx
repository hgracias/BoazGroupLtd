"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignOutButton({
  callbackUrl = "/driver/login",
  className,
  label = "Sign out",
  full = false,
}: {
  callbackUrl?: string;
  className?: string;
  label?: string;
  full?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size={full ? "touch" : "sm"}
      className={cn(full && "w-full", className)}
      onClick={() => signOut({ callbackUrl })}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
