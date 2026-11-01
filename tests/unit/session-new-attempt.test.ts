import { beforeEach, describe, expect, it, vi } from "vitest";
import { startQuizSession } from "@/features/quiz-engine/session-service";
import { hashAnonymousSessionToken } from "@/lib/security/anonymous-session";

const db = vi.hoisted(() => ({
  results: [] as unknown[],
  inserted: [] as Record<string, unknown>[],
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: () => {
      const result = db.results.shift();
      const chain = {
        select: () => chain,
        eq: () => chain,
        neq: () => chain,
        gt: () => chain,
        order: () => chain,
        limit: () => chain,
        maybeSingle: async () => result,
        single: async () => result,
        insert: (row: Record<string, unknown>) => {
          db.inserted.push(row);
          return chain;
        },
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve),
      };
      return chain;
    },
  }),
}));
const token = "authenticated-browser-credential";
function prepare(hasSession = true) {
  db.results.push(
    { data: { buyer_id: "buyer" } },
    {
      data: hasSession
        ? [
            {
              id: "old",
              quiz_version: "v1.0.0",
              status: "IN_PROGRESS",
              quizzes: { quizzes: { slug: "coupledna" } },
              current_position: 3,
            },
          ]
        : [],
    },
  );
  if (hasSession) db.results.push({ data: [{ question_id: "old-question", numeric_value: 4 }] });
  db.results.push(
    {
      data: {
        quiz_versions: [
          { id: "v1", version: "v1.0.0", scoring_version: "1.0", status: "PUBLISHED" },
          { id: "v2", version: "v2.0.0", scoring_version: "behavioral-v2", status: "APPROVED" },
        ],
      },
    },
    { error: { message: "stop-after-insert" } },
  );
}
describe("Explicit new attempt with a preserved historical credential", () => {
  beforeEach(() => {
    db.results.length = 0;
    db.inserted.length = 0;
  });
  it("resumes without creating or changing the old answers by default", async () => {
    prepare();
    const result = await startQuizSession({
      quizSlug: "coupledna",
      locale: "pt",
      market: "BR",
      existingToken: token,
    });
    expect(result.session.id).toBe("old");
    expect(result.session.answers["old-question"].numericValue).toBe(4);
    expect(db.inserted).toHaveLength(0);
  });
  it("creates the latest instrument with the authenticated credential, leaving the old attempt untouched", async () => {
    prepare();
    await expect(
      startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        existingToken: token,
        forceNew: true,
      }),
    ).rejects.toThrow("stop-after-insert");
    expect(db.inserted).toHaveLength(1);
    expect(db.inserted[0]).toMatchObject({
      quiz_version_id: "v2",
      scoring_version: "behavioral-v2",
      current_position: 1,
      access_token_hash: hashAnonymousSessionToken(token),
      buyer_id: "buyer",
    });
  });
  it("does not retain an unrecognized cookie credential", async () => {
    prepare(false);
    await expect(
      startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        existingToken: token,
        forceNew: true,
      }),
    ).rejects.toThrow("stop-after-insert");
    expect(db.inserted[0].access_token_hash).not.toBe(hashAnonymousSessionToken(token));
  });
});
