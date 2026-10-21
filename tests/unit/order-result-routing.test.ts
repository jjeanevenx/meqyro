import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOrderById } from "@/features/commerce/order-service";
import { hashAnonymousSessionToken } from "@/lib/security/anonymous-session";
const db = vi.hoisted(() => ({ queue: [] as unknown[] }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: () => {
      const result = db.queue.shift();
      const chain = { select: () => chain, eq: () => chain, single: async () => result };
      return chain;
    },
  }),
}));
describe("Authenticated checkout result routing", () => {
  beforeEach(() => {
    db.queue.length = 0;
  });
  it.each(["brainrank", "moneydna", "coupledna"])(
    "returns the persisted %s assessment rather than a default quiz",
    async (slug) => {
      db.queue.push(
        {
          data: {
            id: "order",
            session_id: "attempt",
            status: "FULFILLED",
            product_code: slug.toUpperCase(),
            quiz_sessions: { quiz_versions: { quizzes: { slug } } },
          },
        },
        { data: { access_token_hash: hashAnonymousSessionToken("owner") } },
      );
      await expect(getOrderById("order", { sessionToken: "owner" })).resolves.toMatchObject({
        sessionId: "attempt",
        quizSlug: slug,
        productCode: slug.toUpperCase(),
        status: "FULFILLED",
      });
    },
  );
  it("does not return a report destination to another participant", async () => {
    db.queue.push(
      {
        data: {
          id: "order",
          session_id: "attempt",
          quiz_sessions: { quiz_versions: { quizzes: { slug: "coupledna" } } },
        },
      },
      { data: { access_token_hash: hashAnonymousSessionToken("owner") } },
    );
    await expect(getOrderById("order", { sessionToken: "stranger" })).resolves.toBeNull();
  });
});
