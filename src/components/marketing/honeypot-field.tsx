"use client";

import * as React from "react";

import { HONEYPOT_FIELD } from "@/lib/spam/honeypot";

/**
 * Bot trap. Hidden from sighted users by position rather than `display: none`
 * (which some bots detect), and hidden from assistive tech with aria-hidden
 * plus tabIndex -1, so no real person can land on it by keyboard.
 *
 * The form reads its value through the forwarded ref at submit time.
 */
export const HoneypotField = React.forwardRef<HTMLInputElement>(function HoneypotField(
  _props,
  ref
) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
    >
      <label htmlFor={HONEYPOT_FIELD}>Company website (leave this field blank)</label>
      <input
        ref={ref}
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
});
