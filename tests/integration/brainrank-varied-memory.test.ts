import { describe, expect, it } from "vitest";
import { startQuizSession, getSessionQuestions } from "@/features/quiz-engine/session-service";
import { isSupabaseAvailable } from "./db-check";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import fs from "node:fs";
import path from "node:path";
import { startCompletedCommerceSession } from "./commerce-fixtures";
import { ControlledPaymentProvider } from "./controlled-payment-provider";
import { createOrder, setPaymentProviderFactoryForTests } from "@/features/commerce/order-service";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { getProtectedResult } from "@/features/results/result-service";
import { reportHtml } from "@/features/results/report-document";

describe("BrainRank varied recall on the database", () => {
  it("delivers a clear paid report from the actual saved result in every locale", async () => {
    expect(await isSupabaseAvailable()).toBe(true);
    setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
    try {
      const { session, token } = await startCompletedCommerceSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });
      const input = {
        sessionId: session.id,
        sessionToken: token,
        locale: "pt",
        market: "BR" as const,
      };
      expect((await getProtectedResult(input)).premiumReport).toBeUndefined();
      const { order } = await createOrder({
        ...input,
        productCode: "BRAINRANK",
        customerEmail: "varied-report-qa@example.com",
      });
      await fulfillOrder(order.id, "varied-report-qa");
      for (const locale of ["pt", "en", "es", "fr"] as const) {
        const result = await getProtectedResult({ ...input, locale });
        expect(result.accessLevel).toBe("PREMIUM_UNLOCKED");
        const memory = result.premiumReport?.sections.find((s) => s.id === "delayed-memory");
        expect(memory?.paragraphs[0].length).toBeGreaterThan(40);
        const html = reportHtml(result.premiumReport!, "brainrank", locale);
        expect(html).not.toMatch(/\b(?:EASY|MEDIUM|HARD|UNKNOWN|undefined|NaN)\b|[Cc]ertific/);
        if (process.env.QA_REPORT_OUTPUT_DIR) {
          fs.mkdirSync(process.env.QA_REPORT_OUTPUT_DIR, { recursive: true });
          fs.writeFileSync(
            path.join(process.env.QA_REPORT_OUTPUT_DIR, `brainrank-report-${locale}.html`),
            html,
          );
        }
      }
    } finally {
      setPaymentProviderFactoryForTests(null);
    }
  });

  it("persists different sets and resumes each immutable plan in all locales", async () => {
    expect(await isSupabaseAvailable()).toBe(true);
    const triples: string[] = [];
    for (let i = 0; i < 6; i++) {
      const { session } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });
      expect(session.quizVersion).toBe("1.2");
      const first = await getSessionQuestions(session.id, "pt");
      const memory = first.filter((q) => q.memoryRecall);
      expect(first).toHaveLength(24);
      expect(memory.map((q) => q.position)).toEqual([8, 18, 24]);
      expect(first.filter((q) => q.memoryCue).map((q) => q.position)).toEqual([1, 13, 20]);
      expect(new Set(memory.map((q) => q.id)).size).toBe(3);
      expect(
        memory.every((q) => !["MEMORY_01", "MEMORY_02", "MEMORY_03"].includes(q.stableKey)),
      ).toBe(true);
      triples.push(memory.map((q) => q.id).join(","));
      for (const locale of ["pt", "en", "es", "fr"] as const) {
        const resumed = await getSessionQuestions(session.id, locale);
        expect(resumed.map((q) => q.id)).toEqual(first.map((q) => q.id));
        expect(resumed.filter((q) => q.memoryCue).map((q) => q.memoryCue?.id)).toEqual(
          memory.map((q) => q.stableKey),
        );
        expect(resumed.every((q) => q.prompt.trim().length > 0)).toBe(true);
      }
    }
    expect(new Set(triples).size).toBeGreaterThan(1);
    const db = createSupabaseSecretClient();
    const { data, error } = await db
      .from("quiz_versions")
      .select("id,version,quizzes!inner(slug)")
      .eq("quizzes.slug", "brainrank")
      .in("version", ["1.0", "1.1"]);
    expect(error).toBeNull();
    for (const v of data ?? []) {
      const { count, error: countError } = await db
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("quiz_version_id", v.id);
      expect(countError).toBeNull();
      expect(count).toBe(63);
    }
  });
});
