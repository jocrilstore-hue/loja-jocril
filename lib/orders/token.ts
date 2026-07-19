import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

// Capability token for GUEST access to a single order (payment initiation +
// status polling + confirmation page). Issued once by POST /api/orders and
// bound to that order_number. Replaces the wide-open anon RLS access: after
// the RLS cutover these routes use the service client, so this token is the
// only thing standing between an anonymous caller and someone else's order.
//
// Signing key is derived from SUPABASE_SERVICE_ROLE_KEY (already a required
// server secret) so no new environment variable is needed. Deriving with a
// fixed label means the raw service key is never used directly as HMAC key.

const TOKEN_VERSION = "v1";
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days — covers the 24h Multibanco deadline with margin

function signingKey(): Buffer {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY (required to sign order tokens)");
  }
  return createHmac("sha256", secret).update("jocril-order-token-" + TOKEN_VERSION).digest();
}

function hmac(payload: string): string {
  return createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export function issueOrderToken(orderNumber: string, nowMs: number = Date.now()): string {
  const expires = Math.floor(nowMs / 1000) + TOKEN_TTL_SECONDS;
  const payload = `${TOKEN_VERSION}.${orderNumber}.${expires}`;
  return `${TOKEN_VERSION}.${expires}.${hmac(payload)}`;
}

export function verifyOrderToken(
  token: string | null | undefined,
  orderNumber: string,
  nowMs: number = Date.now()
): boolean {
  if (!token || !orderNumber) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_VERSION) return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires * 1000 < nowMs) return false;
  const expected = hmac(`${TOKEN_VERSION}.${orderNumber}.${expires}`);
  const a = Buffer.from(parts[2]);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
