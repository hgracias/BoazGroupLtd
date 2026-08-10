"use client";

import * as React from "react";

import { TURNSTILE_FIELD, TURNSTILE_SITE_KEY } from "@/lib/spam/turnstile-client";

/**
 * Cloudflare Turnstile. Renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is
 * set, so the forms keep working before Turnstile is configured — the server
 * only enforces the check once TURNSTILE_SECRET_KEY exists.
 *
 * The site key is public by design. The secret never reaches this file.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          action?: string;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cf-turnstile-script";

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("turnstile")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(script);
  });
}

export type TurnstileHandle = { reset: () => void };

export const TurnstileWidget = React.forwardRef<
  TurnstileHandle,
  { action?: string; onToken: (token: string) => void }
>(function TurnstileWidget({ action, onToken }, ref) {
  const siteKey = TURNSTILE_SITE_KEY;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  // Keep the latest callback without re-rendering the widget.
  const onTokenRef = React.useRef(onToken);
  onTokenRef.current = onToken;

  React.useImperativeHandle(ref, () => ({
    reset() {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        onTokenRef.current("");
      }
    },
  }));

  React.useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        if (widgetIdRef.current) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "light",
          callback: (token) => onTokenRef.current(token),
          "error-callback": () => {
            setFailed(true);
            onTokenRef.current("");
          },
          // Tokens are short-lived. Clear ours and ask for a fresh one so a
          // slow form-filler is not blocked at the last moment.
          "expired-callback": () => {
            onTokenRef.current("");
            if (window.turnstile && widgetIdRef.current) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action]);

  if (!siteKey) return null;

  return (
    <div className="space-y-2">
      <div ref={containerRef} data-testid={TURNSTILE_FIELD} />
      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          The anti-spam check could not load. Disable any content blocker for this page,
          or contact us by phone.
        </p>
      ) : null}
    </div>
  );
});
