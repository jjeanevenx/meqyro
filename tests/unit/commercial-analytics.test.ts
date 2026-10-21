import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/analytics/events/route";
import { clearRateLimitStore } from "@/lib/security/rate-limit";

const record = vi.hoisted(() => vi.fn());
vi.mock("@/features/analytics/analytics-service", () => ({ recordFunnelEvent: record }));
beforeEach(() => {
  clearRateLimitStore();
  record.mockReset();
  record.mockResolvedValue({ id: "event" });
});
function request(body: unknown) {
  return new Request("http://localhost/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
describe("Public analytics integrity", () => {
  it.each(["payment_completed", "payment_failed", "checkout_completed", "result_unlocked"])(
    "rejects forged financial event %s",
    async (eventName) => {
      expect((await POST(request({ eventName }))).status).toBe(403);
      expect(record).not.toHaveBeenCalled();
    },
  );
  it("validates session IDs before writing to Postgres", async () => {
    expect((await POST(request({ eventName: "result_viewed", sessionId: "invalid" }))).status).toBe(
      400,
    );
    expect(record).not.toHaveBeenCalled();
  });
  it("records a quiz view without collecting personal answers", async () => {
    expect(
      (await POST(request({ eventName: "quiz_viewed", quizSlug: "moneydna", locale: "fr" })))
        .status,
    ).toBe(200);
    expect(record).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: "quiz_viewed", quizSlug: "moneydna" }),
    );
  });
});
