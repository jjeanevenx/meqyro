import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { createOrder } from "@/features/commerce/order-service";

const db = vi.hoisted(() => ({ filters: [] as unknown[][], calls: 0, status: "COMPLETED" }));
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
                  status: db.status,
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
    db.status = "COMPLETED";
    db.filters.length = 0;
  });
  it.each([
    "PERSONALITY_MAP",
    "CAREERFIT",
    "DECISIONDNA",
    "FOCUSSTYLE",
    "BUNDLE_ALL_ACCESS",
    "PROD_BRAINRANK",
  ])("rejects new checkout for %s before any database or Stripe operation", async (productCode) => {
    await expect(
      createOrder({
        sessionId: "session",
        sessionToken: "access",
        locale: "pt",
        market: "BR",
        productCode,
        customerEmail: "test@example.com",
      }),
    ).rejects.toThrow("Product unavailable");
    expect(db.calls).toBe(0);
  });
  it.each(["CREATED", "IN_PROGRESS", "EXPIRED"])(
    "refuses a %s session before resolving a price",
    async (status) => {
      db.status = status;
      await expect(
        createOrder({
          sessionId: "session",
          sessionToken: "access",
          locale: "pt",
          market: "BR",
          productCode: "BRAINRANK",
          customerEmail: "test@example.com",
        }),
      ).rejects.toThrow("Complete the assessment");
      expect(db.calls).toBe(1);
    },
  );
  it.each([
    ["pt", "US"],
    ["en", "US"],
  ] as const)(
    "uses persisted %s session market %s regardless of language",
    async (locale, market) => {
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
    },
  );
});
