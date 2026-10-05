import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { getProtectedResult } from "@/features/results/result-service";
vi.mock("@/features/commerce/entitlement-service", () => ({
  findPaidEntitlement: async () => null,
}));
vi.mock("@/features/couple/couple-service", () => ({
  getCoupleState: async () => ({ state: "NO_INVITE", inviteCode: null, consentGiven: false }),
}));

const db = vi.hoisted(() => ({ results: [] as unknown[], filters: [] as unknown[][] }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: () => {
      const result = db.results.shift();
      const chain = {
        select: () => chain,
        eq: (...args: unknown[]) => {
          db.filters.push(args);
          return chain;
        },
        in: () => chain,
        single: async () => result,
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve),
      };
      return chain;
    },
  }),
}));

describe("Protected result uses the assessment's own dimensions", () => {
  beforeEach(() => {
    db.results.length = 0;
    db.filters.length = 0;
  });
  it("prices an old US session in BRL on the Portuguese result page", async () => {
    db.results.push(
      {
        data: {
          access_token_hash: hashAnonymousSessionToken("access"),
          market: "US",
          quiz_versions: {
            quiz_id: "quiz",
            quizzes: { slug: "brainrank", product_code: "BRAINRANK" },
          },
        },
      },
      { data: { score: { overallScore: 458 } } },
      { data: { amount: 1290, currency: "BRL" } },
    );
    const result = await getProtectedResult({
      sessionId: "session",
      sessionToken: "access",
      locale: "pt",
      market: "US",
    });
    expect(db.filters).toContainEqual(["market", "BR"]);
    expect(db.filters).not.toContainEqual(["market", "US"]);
    expect(result.paywall).toMatchObject({ market: "BR", currency: "BRL", amount: 1290 });
    expect(result.paywall?.formattedPrice).toMatch(/R\$\s*12,90/);
  });
  it.each([
    ["personality-map", { OPENNESS: 20, EXTRAVERSION: 80 }, "EXTRAVERSION"],
    ["coupledna", { COMMUNICATION: 90, FINANCES: 25 }, "COMMUNICATION"],
  ])("derives the strongest dimension for %s", async (slug, dimensionScores, strongest) => {
    db.results.push(
      {
        data: {
          access_token_hash: hashAnonymousSessionToken("access"),
          market: "BR",
          quiz_versions: { quiz_id: "quiz", quizzes: { slug, product_code: slug } },
        },
      },
      { data: { score: { dimensionScores } } },
      { data: { amount: 1290, currency: "BRL" } },
    );
    const result = await getProtectedResult({
      sessionId: "session",
      sessionToken: "access",
      locale: "pt",
      market: "BR",
    });
    expect(result.summary.strongestDimension).toBe(strongest);
    expect(result.summary.dimensionScores).toEqual(dimensionScores);
    expect(result.premiumReport).toBeUndefined();
  });
});
