import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

/**
 * Receipt storage. Local disk for now — no third-party service and no API
 * keys. Vercel's filesystem is read-only, so swap this for Vercel Blob (or
 * S3/Supabase Storage) before deploying; only this file needs to change.
 */
export async function saveReceipt(file: File | null): Promise<
  { ok: true; url?: string } | { ok: false; error: string }
> {
  if (!file || file.size === 0) return { ok: true };

  if (!ALLOWED.includes(file.type)) {
    return { ok: false, error: "Receipt must be a JPG, PNG, WebP, HEIC or PDF file." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Receipt must be smaller than 5 MB." };
  }

  const extension = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
  const filename = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${extension}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

  return { ok: true, url: `/uploads/${filename}` };
}
