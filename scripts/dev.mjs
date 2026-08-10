#!/usr/bin/env node
/**
 * Starts `next dev` with the operating system's certificate store trusted.
 *
 * Why: security products that inspect TLS (Avast, Kaspersky, corporate
 * proxies) re-sign HTTPS traffic with a private root CA. Windows trusts it,
 * but Node ships its own CA bundle that does not, so server-side fetches to
 * Supabase fail with UNABLE_TO_VERIFY_LEAF_SIGNATURE while the same request
 * succeeds from the browser.
 *
 * `--use-system-ca` makes Node read the OS trust store. It is a no-op on
 * machines without interception, and is skipped on Node versions that do not
 * support the flag. TLS verification stays fully on either way — never set
 * NODE_TLS_REJECT_UNAUTHORIZED=0 to work around this.
 */
import { spawn } from "node:child_process";

const [major, minor] = process.versions.node.split(".").map(Number);
const supportsSystemCa = major > 22 || (major === 22 && minor >= 15);

const nodeOptions = [process.env.NODE_OPTIONS, supportsSystemCa ? "--use-system-ca" : null]
  .filter(Boolean)
  .join(" ");

if (!supportsSystemCa) {
  console.warn(
    `[dev] Node ${process.versions.node} has no --use-system-ca. If Supabase requests fail with ` +
      "UNABLE_TO_VERIFY_LEAF_SIGNATURE, set NODE_EXTRA_CA_CERTS to your proxy's root certificate."
  );
}

const child = spawn("next", ["dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_OPTIONS: nodeOptions },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
