import { describe, expect, test, mock } from "bun:test";

// lib/orders/token.ts guards itself with `import "server-only"`, which throws
// outside a React Server environment — stub it for the test runtime.
mock.module("server-only", () => ({}));
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-signing-secret-not-a-real-key";

const { issueOrderToken, verifyOrderToken } = await import("../lib/orders/token");

const NOW = 1_800_000_000_000; // fixed epoch ms so expiry math is deterministic
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

describe("order capability token", () => {
  test("valid roundtrip for the same order", () => {
    const token = issueOrderToken("JOC-2026-0001", NOW);
    expect(verifyOrderToken(token, "JOC-2026-0001", NOW)).toBe(true);
  });

  test("token for order A must NOT verify for order B", () => {
    const token = issueOrderToken("JOC-2026-0001", NOW);
    expect(verifyOrderToken(token, "JOC-2026-0002", NOW)).toBe(false);
  });

  test("expired token is rejected", () => {
    const token = issueOrderToken("JOC-2026-0001", NOW);
    expect(verifyOrderToken(token, "JOC-2026-0001", NOW + WEEK_MS + 1000)).toBe(false);
  });

  test("still valid just before expiry", () => {
    const token = issueOrderToken("JOC-2026-0001", NOW);
    expect(verifyOrderToken(token, "JOC-2026-0001", NOW + WEEK_MS - 1000)).toBe(true);
  });

  test("tampered signature is rejected", () => {
    const token = issueOrderToken("JOC-2026-0001", NOW);
    const parts = token.split(".");
    const flipped = parts[2].endsWith("A") ? parts[2].slice(0, -1) + "B" : parts[2].slice(0, -1) + "A";
    expect(verifyOrderToken(`${parts[0]}.${parts[1]}.${flipped}`, "JOC-2026-0001", NOW)).toBe(false);
  });

  test("tampered expiry is rejected (signature covers it)", () => {
    const token = issueOrderToken("JOC-2026-0001", NOW);
    const parts = token.split(".");
    const laterExpiry = String(Number(parts[1]) + 3600);
    expect(verifyOrderToken(`${parts[0]}.${laterExpiry}.${parts[2]}`, "JOC-2026-0001", NOW)).toBe(false);
  });

  test("malformed inputs are rejected, never throw", () => {
    expect(verifyOrderToken(null, "JOC-2026-0001", NOW)).toBe(false);
    expect(verifyOrderToken("", "JOC-2026-0001", NOW)).toBe(false);
    expect(verifyOrderToken("v1.notanumber.sig", "JOC-2026-0001", NOW)).toBe(false);
    expect(verifyOrderToken("garbage", "JOC-2026-0001", NOW)).toBe(false);
    expect(verifyOrderToken("v2.123.sig", "JOC-2026-0001", NOW)).toBe(false);
    expect(verifyOrderToken(issueOrderToken("X", NOW), "", NOW)).toBe(false);
  });
});
