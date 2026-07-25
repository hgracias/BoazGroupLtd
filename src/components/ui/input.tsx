import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        // h-12 keeps the tap target comfortable for drivers on phones.
        "flex h-12 w-full rounded-md border border-input bg-white px-3.5 py-2 text-base text-navy-900 shadow-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive",
        "file:mr-3 file:rounded file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-navy-700",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
