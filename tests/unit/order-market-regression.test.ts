import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { createOrder } from "@/features/commerce/order-service";

const db = vi.hoisted(() => ({ filters: [] as unknown[][], calls: 0 }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: () => {
      const call = db.calls++;
      const chain = {
        select: () => chain,
        eq: (...args: unknown[]) => {
          db.filters.push(args);
          return chain;
        },
        single: async () =>
          call === 0
            ? {
                data: {
                  access_token_hash: hashAnonymousSessionToken("access"),
                  market: "US",
                  locale: "pt",
                  quiz_versions: { quiz_id: "quiz", quizzes: { product_code: "BRAINRANK" } },
                },
              }
            : { data: null, error: { message: "No configured price" } },
      };
      return chain;
    },
  }),
}));

describe("Checkout pricing for legacy sessions", () => {
  beforeEach(() => {
    db.calls = 0;
    db.filters.length = 0;
  });
  it.each([
    ["pt", "BR"],
    ["en", "US"],
  ] as const)("queries the %s storefront's authoritative price in %s", async (locale, market) => {
    // Stop at price resolution: this test never creates an order or calls Stripe.
    await expect(
      createOrder({
        sessionId: "session",
        sessionToken: "access",
        locale,
        market: "US",
        productCode: "BRAINRANK",
        customerEmail: "test@example.com",
      }),
    ).rejects.toThrow(`Preço não configurado para o mercado ${market}.`);
    expect(db.filters).toContainEqual(["market", market]);
  });
});
