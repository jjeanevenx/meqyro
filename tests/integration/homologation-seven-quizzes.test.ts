import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { transpileModule, ModuleKind } from "typescript";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import {
  startQuizSession,
  getSessionQuestions,
  saveAnswer,
  completeQuizSession,
  getActiveSession,
  validateAndRecoverSession,
} from "@/features/quiz-engine/session-service";
import { getProtectedResult } from "@/features/results/result-service";
import { createOrder, setPaymentProviderFactoryForTests } from "@/features/commerce/order-service";
import { handleWebhook } from "@/features/commerce/webhook-handler";
import { fulfillOrder, refundOrder } from "@/features/commerce/fulfillment-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { GET as downloadReport } from "@/app/api/sessions/[id]/report/route";
import { acknowledgeMemory } from "./memory-helper";
import { ControlledPaymentProvider } from "./controlled-payment-provider";
import { isSupabaseAvailable } from "./db-check";
import {
  createCoupleInvite,
  getCoupleComparison,
  setCoupleConsent,
} from "@/features/couple/couple-service";
import { BUNDLE_ITEMS } from "@/lib/market/prices";
import { deliverCompletedReports } from "@/features/email/completed-report-delivery";
import { sendPurchaseConfirmationForOrder } from "@/features/commerce/webhook-handler";

const products = [
  ["brainrank", "BRAINRANK", 24],
  ["personality-map", "PERSONALITY_MAP", 40],
  ["careerfit", "CAREERFIT", 24],
  ["moneydna", "MONEYDNA", 20],
  ["focusstyle", "FOCUSSTYLE", 20],
  ["decisiondna", "DECISIONDNA", 4],
  ["coupledna", "COUPLEDNA", 20],
] as const;
const languages = ["pt", "en", "es", "fr"] as const;
const evidence: Record<string, unknown>[] = [];
const nativeFetch = globalThis.fetch;
let edgeHandler: (request: Request) => Promise<Response>;
type Mail = { to: string; text: string; attachments: { filename: string; content: string }[] };
const messages: Mail[] = [];

beforeAll(async () => {
  expect(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname).toBe("127.0.0.1");
  expect(await isSupabaseAvailable(2000)).toBe(true);
  const secret = "homologation-local-only-secret-32-characters";
  vi.stubEnv("REPORT_DELIVERY_SECRET", secret);
  setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
  const denoEnv: Record<string, string> = {
    REPORT_DELIVERY_SECRET: secret,
    RESEND_API_KEY: "fake-local-provider",
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SECRET_KEY!,
  };
  const providerFetch: typeof fetch = async (input, init) => {
    expect(String(input)).toBe("https://api.resend.com/emails");
    messages.push(JSON.parse(String(init?.body)) as Mail);
    return Response.json({ id: `local-email-${randomUUID()}` });
  };
  const source = readFileSync("supabase/functions/deliver-report/index.ts", "utf8").replace(
    /^import .*;\r?\n/,
    "",
  );
  new Function(
    "Deno",
    "createClient",
    "fetch",
    transpileModule(source, { compilerOptions: { module: ModuleKind.None } }).outputText,
  )(
    {
      env: { get: (key: string) => denoEnv[key] },
      serve: (handler: typeof edgeHandler) => {
        edgeHandler = handler;
      },
    },
    createClient,
    providerFetch,
  );
  vi.stubGlobal("fetch", ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.endsWith("/functions/v1/deliver-report")) return edgeHandler(new Request(input, init));
    if (!url.startsWith("http://127.0.0.1:54321"))
      throw new Error("External requests forbidden in local audit");
    return nativeFetch(input, init);
  }) satisfies typeof fetch);
});

afterAll(() => {
  writeFileSync(
    "docs/audits/homologation-flow-evidence-2026-10-04.json",
    JSON.stringify(
      {
        scope:
          "Local Supabase; controlled payment provider; real Edge handler in-process; simulated mail provider. No real charge or external email.",
        cases: evidence,
      },
      null,
      2,
    ),
  );
  setPaymentProviderFactoryForTests(null);
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Homologation audit: complete paid delivery for seven quizzes in four languages", () => {
  it.each(
    languages.flatMap((locale) =>
      products.map(([slug, productCode, total]) => ({ slug, productCode, total, locale })),
    ),
  )(
    "$slug / $locale: persisted answers → webhook → report → Edge email → recovery → refund",
    async ({ slug, productCode, total, locale }) => {
      const market = locale === "pt" ? "BR" : locale === "en" ? "US" : "EU";
      const { session, token } = await startQuizSession({ quizSlug: slug, locale, market });
      const questions = await getSessionQuestions(session.id, locale);
      expect(questions).toHaveLength(total);
      for (const [index, question] of questions.entries()) {
        expect(question.prompt.trim()).not.toBe("");
        expect(question.position).toBe(index + 1);
        expect(JSON.stringify(question)).not.toMatch(/isCorrect|scoring_key/);
        await acknowledgeMemory(question, session.id, token);
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: question.id,
          ...(question.kind === "LIKERT"
            ? { numericValue: 4 }
            : { optionId: question.options[0].id }),
          durationMs: 3000,
          nextPosition: index + 2,
        });
      }
      expect(
        (await getActiveSession(session.id, token))?.answers &&
          Object.keys((await getActiveSession(session.id, token))!.answers),
      ).toHaveLength(total);
      await completeQuizSession({ sessionId: session.id, token });
      if (slug === "coupledna") {
        const invite = await createCoupleInvite(session.id, token, locale, true);
        const partner = await startQuizSession({
          quizSlug: slug,
          locale,
          market,
          inviteCode: invite!.inviteCode,
          comparisonConsent: true,
        });
        for (const [index, question] of (
          await getSessionQuestions(partner.session.id, locale)
        ).entries()) {
          await saveAnswer({
            sessionId: partner.session.id,
            token: partner.token,
            questionId: question.id,
            numericValue: 1,
            nextPosition: index + 2,
          });
        }
        await completeQuizSession({ sessionId: partner.session.id, token: partner.token });
        expect(
          (await getCoupleComparison(invite!.inviteCode, session.id, token))?.bilateralUnlocked,
        ).toBe(false);
      }
      const request = (credential = token) =>
        new NextRequest(`http://localhost/api/sessions/${session.id}/report?locale=${locale}`, {
          headers: { cookie: `${anonymousSessionCookie}=${credential}` },
        });
      const context = { params: Promise.resolve({ id: session.id }) };
      expect((await downloadReport(request(), context)).status).toBe(403);
      expect((await downloadReport(request("wrong-token"), context)).status).toBe(403);
      const recipient = `audit-${slug}-${locale}-${randomUUID()}@example.com`;
      const { order } = await createOrder({
        sessionId: session.id,
        sessionToken: token,
        productCode,
        customerEmail: recipient,
        market,
        locale,
      });
      expect((await downloadReport(request(), context)).status).toBe(403);
      const before = messages.length;
      const payload = {
        id: `audit-${randomUUID()}`,
        type: "checkout.session.completed",
        data: {
          object: {
            client_reference_id: order.id,
            amount_total: order.amount,
            currency: order.currency.toLowerCase(),
            metadata: { order_number: order.orderNumber },
          },
        },
      };
      expect((await handleWebhook("stripe", { payload, headers: {} })).handled).toBe(true);
      expect(messages).toHaveLength(before + 1);
      const message = messages.at(-1)!;
      expect(message.to).toBe(recipient);
      expect(message.attachments[0].filename).toBe(`meqyro-${slug}-resultado.html`);
      const response = await downloadReport(request(), context);
      expect(response.status).toBe(200);
      const html = await response.text();
      expect(Buffer.from(message.attachments[0].content, "base64").toString("utf8")).toBe(html);
      const report = await getProtectedResult({
        sessionId: session.id,
        sessionToken: token,
        locale,
        market,
      });
      expect(report.premiumReport!.sections.length).toBeGreaterThan(0);
      expect(message.text).toContain(report.premiumReport!.executiveSummary);
      expect((await handleWebhook("stripe", { payload, headers: {} })).duplicate).toBe(true);
      expect(messages).toHaveLength(before + 1);
      const accessUrl = message.text.trim().split("\n").at(-1)!;
      const recovered = await validateAndRecoverSession({
        sessionId: session.id,
        recoveryToken: new URL(accessUrl).pathname.split("/").at(-1)!,
        quizSlug: slug,
      });
      expect(recovered.status).toBe("COMPLETED");
      expect((await downloadReport(request(recovered.token), context)).status).toBe(200);
      await refundOrder(order.id, "Local homologation audit");
      expect((await downloadReport(request(recovered.token), context)).status).toBe(403);
      evidence.push({
        slug,
        locale,
        market,
        totalQuestions: total,
        memoryQuestions: questions.filter((q) => q.memoryRecall).length,
        reportSections: report.premiumReport!.sections.length,
        persistedFlow: "PASS",
        paidDownload: "PASS",
        edgeHandlerAttachment: "PASS (simulated mail provider)",
        duplicateWebhook: "PASS",
        recovery: "PASS",
        refund: "PASS",
        reportKind: slug === "coupledna" ? "Bilateral, consented, paid" : "Individual",
      });
    },
  );

  it("measures whether an advertised bundle reaches another quiz session", async () => {
    const db = createSupabaseSecretClient();
    const first = await startQuizSession({ quizSlug: "brainrank", locale: "pt", market: "BR" });
    const { order } = await createOrder({
      sessionId: first.session.id,
      sessionToken: first.token,
      productCode: "BUNDLE_DISCOVER",
      customerEmail: `audit-bundle-${randomUUID()}@example.com`,
      market: "BR",
      locale: "pt",
    });
    await fulfillOrder(order.id, "local-bundle-audit");
    const second = await startQuizSession({
      quizSlug: "personality-map",
      locale: "pt",
      market: "BR",
      existingToken: first.token,
    });
    for (const [index, q] of (await getSessionQuestions(second.session.id, "pt")).entries())
      await saveAnswer({
        sessionId: second.session.id,
        token: second.token,
        questionId: q.id,
        numericValue: 4,
        nextPosition: index + 2,
      });
    await completeQuizSession({ sessionId: second.session.id, token: second.token });
    const result = await getProtectedResult({
      sessionId: second.session.id,
      sessionToken: second.token,
      locale: "pt",
      market: "BR",
    });
    expect(result.accessLevel).toBe("PREMIUM_UNLOCKED");
    const { data: grants, error } = await db
      .from("result_access_grants")
      .select("product_code,session_id")
      .eq("order_id", order.id);
    expect(error).toBeNull();
    expect(grants).toHaveLength(3);
    evidence.push({
      scenario: "Bundle Discover → another included quiz",
      expected: "PREMIUM_UNLOCKED",
      actual: result.accessLevel,
      grantsAttachedOnlyToPurchaseSession: grants!.every(
        (grant) => grant.session_id === first.session.id,
      ),
      status: result.accessLevel === "PREMIUM_UNLOCKED" ? "PASS" : "FAIL",
    });
  });

  it("measures bilateral comparison against the report sold for CoupleDNA", async () => {
    const first = await startQuizSession({ quizSlug: "coupledna", locale: "pt", market: "BR" });
    const invite = await createCoupleInvite(first.session.id, first.token, "pt", true);
    expect(invite).not.toBeNull();
    expect(
      (await getCoupleComparison(invite!.inviteCode, first.session.id, first.token))!
        .bilateralUnlocked,
    ).toBe(false);
    const second = await startQuizSession({
      quizSlug: "coupledna",
      locale: "pt",
      market: "BR",
      inviteCode: invite!.inviteCode,
      comparisonConsent: true,
    });
    for (const [participant, value] of [
      [first, 5],
      [second, 1],
    ] as const) {
      for (const [index, question] of (
        await getSessionQuestions(participant.session.id, "pt")
      ).entries()) {
        await saveAnswer({
          sessionId: participant.session.id,
          token: participant.token,
          questionId: question.id,
          numericValue: value,
          nextPosition: index + 2,
        });
      }
      await completeQuizSession({ sessionId: participant.session.id, token: participant.token });
    }
    expect(
      (await getCoupleComparison(invite!.inviteCode, first.session.id, first.token))!
        .bilateralUnlocked,
    ).toBe(false);
    const { order } = await createOrder({
      sessionId: first.session.id,
      sessionToken: first.token,
      productCode: "COUPLEDNA",
      customerEmail: `audit-couple-${randomUUID()}@example.com`,
      market: "BR",
      locale: "pt",
    });
    await fulfillOrder(order.id, "local-bilateral-audit");
    const comparison = await getCoupleComparison(invite!.inviteCode, first.session.id, first.token);
    expect(comparison!.bilateralUnlocked).toBe(true);
    expect(comparison!.overallAlignmentPercentage).toBe(0);
    const report = await getProtectedResult({
      sessionId: first.session.id,
      sessionToken: first.token,
      locale: "pt",
      market: "BR",
    });
    const sections = report.premiumReport!.sections;
    expect(sections.find((section) => section.id === "bilateral-communication")?.summary).toContain(
      "0/100",
    );
    const partnerReport = await getProtectedResult({
      sessionId: second.session.id,
      sessionToken: second.token,
      locale: "pt",
      market: "BR",
    });
    expect(partnerReport.premiumReport).toEqual(report.premiumReport);
    const download = (id: string, token: string) =>
      downloadReport(
        new NextRequest(`http://localhost/api/sessions/${id}/report?locale=pt`, {
          headers: { "x-session-token": token },
        }),
        { params: Promise.resolve({ id }) },
      );
    expect((await download(second.session.id, second.token)).status).toBe(200);
    const before = messages.length;
    await sendPurchaseConfirmationForOrder(order.id);
    expect(messages).toHaveLength(before + 1);
    expect(Buffer.from(messages.at(-1)!.attachments[0].content, "base64").toString("utf8")).toBe(
      await (await download(first.session.id, first.token)).text(),
    );
    await setCoupleConsent(second.session.id, second.token, false);
    expect((await download(first.session.id, first.token)).status).toBe(403);
    expect(
      (await getCoupleComparison(invite!.inviteCode, first.session.id, first.token))!
        .bilateralUnlocked,
    ).toBe(false);
    await setCoupleConsent(second.session.id, second.token, true);
    expect((await download(first.session.id, first.token)).status).toBe(200);
    await refundOrder(order.id, "Bilateral refund audit");
    expect((await download(second.session.id, second.token)).status).toBe(403);
    evidence.push({
      scenario: "CoupleDNA bilateral product",
      backendConsentAndComparison: "PASS",
      overallAlignmentPercentage: comparison!.overallAlignmentPercentage,
      deliveredCommunicationSummary: sections.find(
        (section) => section.id === "bilateral-communication",
      )?.summary,
      usesPartnerComparison: sections.some(
        (section) => section.id.includes("alignment") || section.id.includes("bilateral"),
      ),
      status: "PASS",
    });
  });

  it("waits for the partner, rejects expired or reused invitations, and sends the bilateral report after completion", async () => {
    const first = await startQuizSession({ quizSlug: "coupledna", locale: "pt", market: "BR" });
    expect(await createCoupleInvite(first.session.id, first.token, "pt")).toBeNull();
    for (const [index, q] of (await getSessionQuestions(first.session.id, "pt")).entries())
      await saveAnswer({
        sessionId: first.session.id,
        token: first.token,
        questionId: q.id,
        numericValue: 5,
        nextPosition: index + 2,
      });
    await completeQuizSession({ sessionId: first.session.id, token: first.token });
    const invite = await createCoupleInvite(first.session.id, first.token, "pt", true);
    const db = createSupabaseSecretClient();
    await db
      .from("couple_invites")
      .update({ expires_at: "2020-01-01T00:00:00Z" })
      .eq("id", invite!.inviteId);
    await expect(
      startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        inviteCode: invite!.inviteCode,
        comparisonConsent: true,
      }),
    ).rejects.toThrow("expired");
    const fresh = await createCoupleInvite(first.session.id, first.token, "pt", true);
    expect(fresh!.inviteCode).not.toBe(invite!.inviteCode);
    await expect(
      startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        inviteCode: fresh!.inviteCode,
      }),
    ).rejects.toThrow("consent");
    await expect(
      startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
        inviteCode: fresh!.inviteCode,
        comparisonConsent: true,
      }),
    ).rejects.toThrow();
    const { order } = await createOrder({
      sessionId: first.session.id,
      sessionToken: first.token,
      productCode: "COUPLEDNA",
      customerEmail: `pending-couple-${randomUUID()}@example.com`,
      market: "BR",
      locale: "pt",
    });
    await fulfillOrder(order.id, "pending-partner-payment");
    const pending = await getProtectedResult({
      sessionId: first.session.id,
      sessionToken: first.token,
      locale: "pt",
      market: "BR",
    });
    expect(pending.accessLevel).toBe("PREMIUM_UNLOCKED");
    expect(pending.premiumReport).toBeUndefined();
    expect(pending.couple?.state).toBe("WAITING_PARTNER");
    const before = messages.length;
    await sendPurchaseConfirmationForOrder(order.id);
    expect(messages).toHaveLength(before);
    const joins = await Promise.allSettled(
      [1, 2].map(() =>
        startQuizSession({
          quizSlug: "coupledna",
          locale: "pt",
          market: "BR",
          inviteCode: fresh!.inviteCode,
          comparisonConsent: true,
        }),
      ),
    );
    expect(joins.filter((join) => join.status === "fulfilled")).toHaveLength(1);
    const joined = joins.find((join) => join.status === "fulfilled")!;
    if (joined.status !== "fulfilled") throw new Error("Partner missing");
    const partner = joined.value;
    await expect(
      startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        inviteCode: fresh!.inviteCode,
        comparisonConsent: true,
      }),
    ).rejects.toThrow("unavailable");
    expect((await getSessionQuestions(partner.session.id, "pt")).map((q) => q.id)).toEqual(
      (await getSessionQuestions(first.session.id, "pt")).map((q) => q.id),
    );
    for (const [index, q] of (await getSessionQuestions(partner.session.id, "pt")).entries())
      await saveAnswer({
        sessionId: partner.session.id,
        token: partner.token,
        questionId: q.id,
        numericValue: 1,
        nextPosition: index + 2,
      });
    await completeQuizSession({ sessionId: partner.session.id, token: partner.token });
    await deliverCompletedReports(5, partner.session.id);
    expect(messages).toHaveLength(before + 1);
    const ready = await getProtectedResult({
      sessionId: first.session.id,
      sessionToken: first.token,
      locale: "pt",
      market: "BR",
    });
    expect(ready.couple?.state).toBe("READY");
    expect(ready.premiumReport?.sections[0].summary).toBe("0/100");
    const outsider = await startQuizSession({ quizSlug: "coupledna", locale: "pt", market: "BR" });
    expect(
      await getCoupleComparison(fresh!.inviteCode, outsider.session.id, outsider.token),
    ).toBeNull();
    expect(await setCoupleConsent(first.session.id, "invalid-token", false)).toBe(false);
    evidence.push({
      scenario:
        "CoupleDNA pending purchase, expired invite, concurrent acceptance and automatic email",
      status: "PASS",
    });
  });

  it.each(Object.keys(BUNDLE_ITEMS))(
    "%s covers new and recovered sessions, delivers each completed result and refunds independently",
    async (bundle) => {
      const db = createSupabaseSecretClient();
      const sourceSlug = bundle === "BUNDLE_LIFE" ? "careerfit" : "brainrank";
      const source = await startQuizSession({ quizSlug: sourceSlug, locale: "pt", market: "BR" });
      const recipient = `bundle-${randomUUID()}@example.com`;
      const { order } = await createOrder({
        sessionId: source.session.id,
        sessionToken: source.token,
        productCode: bundle,
        customerEmail: recipient,
        market: "BR",
        locale: "pt",
      });
      await fulfillOrder(order.id, "bundle-regression");
      const recovery = randomUUID();
      const { hashToken } = await import("@/features/privacy/consent-service");
      await db.from("recovery_tokens").insert({
        session_id: source.session.id,
        token_hash: hashToken(recovery),
        expires_at: new Date(Date.now() + 86400_000).toISOString(),
        max_uses: 10,
        usage_count: 0,
      });
      const recovered = await validateAndRecoverSession({
        sessionId: source.session.id,
        recoveryToken: recovery,
        quizSlug: sourceSlug,
      });
      expect(recovered.token).not.toBe(source.token);
      let previousToken = recovered.token;
      const completed: { id: string; token: string; productCode: string }[] = [];
      for (const productCode of BUNDLE_ITEMS[bundle]) {
        const slug = products.find((row) => row[1] === productCode)![0];
        const current = await startQuizSession({
          quizSlug: slug,
          locale: "pt",
          market: "BR",
          existingToken: previousToken,
        });
        previousToken = current.token;
        for (const [index, q] of (await getSessionQuestions(current.session.id, "pt")).entries()) {
          await acknowledgeMemory(q, current.session.id, current.token);
          await saveAnswer({
            sessionId: current.session.id,
            token: current.token,
            questionId: q.id,
            ...(q.kind === "LIKERT" ? { numericValue: 4 } : { optionId: q.options[0].id }),
            nextPosition: index + 2,
          });
        }
        await completeQuizSession({ sessionId: current.session.id, token: current.token });
        if (slug === "coupledna") {
          const invitation = await createCoupleInvite(
            current.session.id,
            current.token,
            "pt",
            true,
          );
          const partner = await startQuizSession({
            quizSlug: slug,
            locale: "pt",
            market: "BR",
            inviteCode: invitation!.inviteCode,
            comparisonConsent: true,
          });
          for (const [index, q] of (await getSessionQuestions(partner.session.id, "pt")).entries())
            await saveAnswer({
              sessionId: partner.session.id,
              token: partner.token,
              questionId: q.id,
              numericValue: 1,
              nextPosition: index + 2,
            });
          await completeQuizSession({ sessionId: partner.session.id, token: partner.token });
        }
        const result = await getProtectedResult({
          sessionId: current.session.id,
          sessionToken: current.token,
          locale: "pt",
          market: "BR",
        });
        expect(result.accessLevel).toBe("PREMIUM_UNLOCKED");
        expect(result.premiumReport).toBeDefined();
        expect(result.includedQuizzes).toHaveLength(BUNDLE_ITEMS[bundle].length);
        const before = messages.length;
        await deliverCompletedReports(5, current.session.id);
        expect(messages).toHaveLength(before + 1);
        expect(messages.at(-1)!.to).toBe(recipient);
        await deliverCompletedReports(5, current.session.id);
        expect(messages).toHaveLength(before + 1);
        completed.push({ id: current.session.id, token: current.token, productCode });
      }
      const separate = completed[0];
      const { order: independent } = await createOrder({
        sessionId: separate.id,
        sessionToken: separate.token,
        productCode: separate.productCode,
        customerEmail: recipient,
        market: "BR",
        locale: "pt",
      });
      await fulfillOrder(independent.id, "independent-purchase");
      await refundOrder(order.id, "Refund package only");
      for (const session of completed) {
        const result = await getProtectedResult({
          sessionId: session.id,
          sessionToken: session.token,
          locale: "pt",
          market: "BR",
        });
        expect(result.accessLevel).toBe(
          session.productCode === separate.productCode ? "PREMIUM_UNLOCKED" : "FREE_PARTIAL",
        );
      }
      const stranger = await startQuizSession({
        quizSlug: sourceSlug,
        locale: "pt",
        market: "BR",
        existingToken: "invalid-token",
      });
      const { findPaidEntitlement } = await import("@/features/commerce/entitlement-service");
      expect(await findPaidEntitlement(stranger.session.id, separate.productCode)).toBeNull();
      evidence.push({
        scenario: bundle,
        includedProducts: BUNDLE_ITEMS[bundle],
        crossSession: "PASS",
        recoveredIdentity: "PASS",
        perResultEmail: "PASS",
        independentRefund: "PASS",
        invalidTokenIsolation: "PASS",
      });
    },
    120_000,
  );
});
