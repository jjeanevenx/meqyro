import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  startQuizSession,
  getSessionQuestions,
  getActiveSessionByToken,
  saveAnswer,
  completeQuizSession,
} from "@/features/quiz-engine/session-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { createOrder, setPaymentProviderFactoryForTests } from "@/features/commerce/order-service";
import { fulfillOrder, refundOrder } from "@/features/commerce/fulfillment-service";
import { GET } from "@/app/api/sessions/[id]/report/route";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { ControlledPaymentProvider } from "./controlled-payment-provider";
import { acknowledgeMemory } from "./memory-helper";
import { isSupabaseAvailable } from "./db-check";

beforeAll(async () => {
  expect(await isSupabaseAvailable(2000)).toBe(true);
  setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
});
afterAll(() => setPaymentProviderFactoryForTests(null));

describe("Persisted memory, payment and downloadable result", () => {
  it.each(["brainrank", "focusstyle"])(
    "completes %s without mixing memory into its original score and protects its download",
    async (slug) => {
      const db = createSupabaseSecretClient();
      const { session, token } = await startQuizSession({
        quizSlug: slug,
        locale: "pt",
        market: "BR",
      });
      const questions = await getSessionQuestions(session.id, "pt");
      expect(questions).toHaveLength(slug === "brainrank" ? 24 : 20);
      expect(questions.filter((q) => q.memoryRecall)).toHaveLength(3);
      const { data: definitions, error } = await db
        .from("questions")
        .select("id,options(id,scoring_value)")
        .in(
          "id",
          questions.map((q) => q.id),
        );
      expect(error).toBeNull();
      for (const [index, question] of questions.entries()) {
        await acknowledgeMemory(question, session.id, token);
        const options = definitions?.find((q) => q.id === question.id)?.options ?? [];
        const correct = options.find((o) => (o.scoring_value as { isCorrect?: boolean }).isCorrect);
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: question.id,
          ...(question.kind === "LIKERT" ? { numericValue: 4 } : { optionId: correct?.id }),
          durationMs: 3000,
          nextPosition: index + 2,
        });
      }
      const resumed = await getActiveSessionByToken(token, slug);
      expect(resumed?.memorySeen).toEqual(["MEMORY_01", "MEMORY_02", "MEMORY_03"]);
      await completeQuizSession({ sessionId: session.id, token });
      const { data: result } = await db
        .from("results")
        .select("score")
        .eq("session_id", session.id)
        .single();
      const score = result?.score as {
        memoryRecall: { total: number; correct: number };
        rawCorrect?: number;
        overallScore?: number;
        dimensionScores?: Record<string, number>;
        totalResponses?: number;
        styleScores?: Record<string, number>;
      };
      expect(score.memoryRecall).toMatchObject({ total: 3, correct: 3 });
      if (slug === "brainrank") {
        expect(score).toMatchObject({ rawCorrect: 21, overallScore: 1000 });
        expect(Object.values(score.dimensionScores!)).toEqual([100, 100, 100, 100, 100, 100]);
      } else {
        expect(score.totalResponses).toBe(17);
        expect(Object.values(score.styleScores!)).toEqual([75, 75, 75, 75]);
      }
      const request = (credential?: string) =>
        new NextRequest(`http://localhost/api/sessions/${session.id}/report?locale=pt`, {
          headers: credential ? { cookie: `${anonymousSessionCookie}=${credential}` } : {},
        });
      const context = { params: Promise.resolve({ id: session.id }) };
      expect((await GET(request(), context)).status).toBe(401);
      expect((await GET(request("wrong-token"), context)).status).toBe(403);
      expect((await GET(request(token), context)).status).toBe(403);
      const { order } = await createOrder({
        sessionId: session.id,
        sessionToken: token,
        productCode: slug === "brainrank" ? "BRAINRANK" : "FOCUSSTYLE",
        customerEmail: "paid-report-memory@example.com",
        market: "BR",
        locale: "pt",
      });
      expect((await GET(request(token), context)).status).toBe(403);
      await fulfillOrder(order.id, "controlled-test");
      const download = await GET(request(token), context);
      expect(download.status).toBe(200);
      expect(download.headers.get("Content-Disposition")).toContain("attachment");
      expect(download.headers.get("Cache-Control")).toContain("no-store");
      const html = await download.text();
      expect(html).toContain("3/3 acertos");
      expect(html).toContain("Certificado digital de conclusão");
      const expiredGrant = await db
        .from("result_access_grants")
        .update({ created_at: "2023-01-01T00:00:00Z" })
        .eq("order_id", order.id);
      expect(expiredGrant.error).toBeNull();
      expect((await GET(request(token), context)).status).toBe(403);
      await db
        .from("result_access_grants")
        .update({ created_at: new Date().toISOString() })
        .eq("order_id", order.id);
      await refundOrder(order.id, "Controlled test refund");
      expect((await GET(request(token), context)).status).toBe(403);
    },
  );
});
