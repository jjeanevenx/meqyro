import { describe, expect, it, vi } from "vitest";
import { logEvent } from "@/lib/observability/logger";

describe("structured logging", () => {
  it("redacts secrets and personal identifiers", () => {
    const output = vi.spyOn(console, "info").mockImplementation(() => undefined);
    logEvent("info", "checkout.started", {
      requestId: "req-safe",
      email: "person@example.com",
      nested: { accessToken: "top-secret" },
    });
    const payload = output.mock.calls[0][0] as string;
    expect(payload).toContain("req-safe");
    expect(payload).not.toContain("person@example.com");
    expect(payload).not.toContain("top-secret");
    output.mockRestore();
  });
});
