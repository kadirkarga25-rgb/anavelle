import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "anavelle_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

export function adminConfiguration() {
  return {
    passwordConfigured: Boolean(process.env.ANAVELLE_ADMIN_PASSWORD),
    sessionSecretConfigured: Boolean(process.env.ANAVELLE_SESSION_SECRET),
    databaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    mediaConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  };
}

function signature(payload: string) {
  const secret = process.env.ANAVELLE_SESSION_SECRET;
  if (!secret) throw new Error("ANAVELLE_SESSION_SECRET is not configured.");
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expiresAt);
  return { token: payload + "." + signature(payload), maxAge: SESSION_SECONDS };
}

export function verifyAdminSession(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token || !process.env.ANAVELLE_SESSION_SECRET) return false;
  const [expiresAt, received, extra] = token.split(".");
  if (!expiresAt || !received || extra || !/^\d+$/.test(expiresAt) || Number(expiresAt) < Math.floor(Date.now()/1000)) return false;
  try {
    const expected = Buffer.from(signature(expiresAt), "hex");
    const actual = Buffer.from(received, "hex");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}

export function constantTimeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    const padded = Buffer.alloc(a.length);
    timingSafeEqual(a, padded);
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function supabaseRequest(path: string, init: RequestInit = {}) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are not configured.");
  const response = await fetch(url + path, {
    ...init,
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers || {})
    },
    cache: "no-store"
  });
  const body = await response.text();
  if (!response.ok) throw new Error("Supabase request failed (" + response.status + "): " + body.slice(0, 400));
  return body ? JSON.parse(body) as unknown : null;
}
