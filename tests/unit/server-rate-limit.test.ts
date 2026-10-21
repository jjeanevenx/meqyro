import { afterEach, describe, expect, it, vi } from "vitest";
import { checkServerRateLimit } from "@/lib/security/server-rate-limit";

const rpc = vi.hoisted(() => vi.fn());
vi.mock("@/lib/supabase/server", () => ({ createSupabaseSecretClient: () => ({ rpc }) }));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
describe("Shared server rate limits", () => {
  it("uses an opaque salted key and enforces the shared count", async () => {
    vi.stubEnv("NODE_ENV", "production");
    rpc.mockResolvedValue({
      data: [{ count: 16, expires_at: new Date(Date.now() + 60000).toISOString() }],
      error: null,
    });
    const result = await checkServerRateLimit("203.0.113.1", "session_start");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.headers["Retry-After"]).toBeDefined();
    const args = rpc.mock.calls[0][1] as { p_key: string; p_window_ms: number };
    expect(args.p_key).toMatch(/^[a-f0-9]{64}$/);
    expect(args.p_key).not.toContain("203.0.113.1");
    expect(args.p_window_ms).toBe(60000);
  });
  it("fails closed on a database outage in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    rpc.mockResolvedValue({ data: null, error: { message: "offline" } });
    await expect(checkServerRateLimit("203.0.113.1", "checkout")).rejects.toThrow(
      "Rate limit service unavailable",
    );
  });
});
