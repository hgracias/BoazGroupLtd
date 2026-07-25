import { randomBytes } from "node:crypto";

/**
 * Demo account passwords for the mock data layer.
 *
 * Nothing usable is committed. Resolution order:
 *   1. DEMO_DRIVER_PASSWORD / DEMO_ADMIN_PASSWORD from the environment.
 *   2. Otherwise a random per-process password.
 *
 * In development the resolved passwords are printed to the server console and
 * shown on the login pages, so the prototype stays one click away. In a
 * production build they are never displayed anywhere — so if the env vars are
 * unset, the seeded accounts hold a password nobody knows and cannot be used.
 *
 * Delete this file once real accounts live in the database.
 */

type DemoPasswords = { driver: string; admin: string; generated: boolean };

const globalDemo = globalThis as unknown as { __boazDemoPasswords?: DemoPasswords };

export const isProduction = process.env.NODE_ENV === "production";

function randomPassword() {
  return randomBytes(12).toString("base64url");
}

function resolve(): DemoPasswords {
  if (!globalDemo.__boazDemoPasswords) {
    const driverFromEnv = process.env.DEMO_DRIVER_PASSWORD?.trim();
    const adminFromEnv = process.env.DEMO_ADMIN_PASSWORD?.trim();
    const generated = !driverFromEnv || !adminFromEnv;

    globalDemo.__boazDemoPasswords = {
      driver: driverFromEnv || randomPassword(),
      admin: adminFromEnv || randomPassword(),
      generated,
    };

    if (generated && !isProduction) {
      const { driver, admin } = globalDemo.__boazDemoPasswords;
      console.info(
        [
          "",
          "  Demo portal passwords for this session (no env vars set):",
          `    Driver  BGL-0142  ${driver}`,
          `    Admin   ADM-001   ${admin}`,
          "  Set DEMO_DRIVER_PASSWORD / DEMO_ADMIN_PASSWORD in .env.local to pin them.",
          "",
        ].join("\n")
      );
    }
  }

  return globalDemo.__boazDemoPasswords;
}

export function demoPasswords() {
  return resolve();
}

export type DemoAccount = { employeeId: string; password: string };

/**
 * Credentials to show on a login page — null in production, so a deployed
 * build never publishes a working login.
 */
export function demoAccountForDisplay(role: "driver" | "admin"): DemoAccount | null {
  if (isProduction) return null;
  const passwords = resolve();
  return role === "driver"
    ? { employeeId: "BGL-0142", password: passwords.driver }
    : { employeeId: "ADM-001", password: passwords.admin };
}
