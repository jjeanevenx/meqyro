import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashToken } from "@/features/privacy/consent-service";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { validateAndRecoverSession } from "@/features/quiz-engine/session-service";

const db = vi.hoisted(() => ({
  results: [] as unknown[],
  updates: [] as Record<string, unknown>[],
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: () => {
      const result = db.results.shift();
      const chain = {
        select: () => chain,
        eq: () => chain,
        single: async () => result,
        update: (value: Record<string, unknown>) => {
          db.updates.push(value);
          return chain;
        },
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve),
      };
      return chain;
    },
  }),
}));

function prepare(status = "IN_PROGRESS", expired = false) {
  db.results.push(
    {
      data: {
        id: "recovery",
        token_hash: hashToken("recovery-secret"),
        expires_at: new Date(Date.now() + 60000).toISOString(),
        usage_count: 0,
        max_uses: 10,
      },
    },
    { error: null },
    {
      data: {
        id: "session",
        status,
        expires_at: new Date(Date.now() + (expired ? -60000 : 60000)).toISOString(),
        locale: "pt",
        quiz_versions: { quizzes: { slug: "brainrank" } },
      },
    },
    { error: null },
    { data: [] },
  );
}

describe("Real recovery service credential regression", () => {
  beforeEach(() => {
    db.results.length = 0;
    db.updates.length = 0;
  });
  it("issues a credential that can authorize resumed answers", async () => {
    prepare();
    const result = await validateAndRecoverSession({
      sessionId: "session",
      recoveryToken: "recovery-secret",
      quizSlug: "brainrank",
    });
    expect(result.status).toBe("ACTIVE");
    expect(result.token).not.toBe("recovery-secret");
    expect(
      matchesAnonymousSessionToken(result.token, db.updates[1].access_token_hash as string),
    ).toBe(true);
  });
  it("authenticates completed results without placing the credential in their URL", async () => {
    prepare("COMPLETED");
    const result = await validateAndRecoverSession({
      sessionId: "session",
      recoveryToken: "recovery-secret",
      quizSlug: "brainrank",
    });
    expect(result.status).toBe("COMPLETED");
    if (result.status === "COMPLETED")
      expect(result.resultRedirectUrl).toBe("/pt/quizzes/brainrank/result?session=session");
    expect(
      matchesAnonymousSessionToken(result.token, db.updates[1].access_token_hash as string),
    ).toBe(true);
  });
  it("rejects expired sessions before issuing an access credential", async () => {
    prepare("IN_PROGRESS", true);
    await expect(
      validateAndRecoverSession({
        sessionId: "session",
        recoveryToken: "recovery-secret",
        quizSlug: "brainrank",
      }),
    ).rejects.toThrow("Sessão expirada");
    expect(db.updates).toHaveLength(1);
  });
});
