import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverPaidReport } from "@/features/email/paid-report-delivery";
import { pdfText } from "../pdf-text";

vi.mock("@/features/results/paid-session-report", () => ({
  buildPaidSessionReport: async () => ({
    slug: "brainrank",
    report: {
      bandLabel: "Relatório de atenção",
      executiveSummary: "Você acertou parte das perguntas.",
      sections: [],
      comparativeBenchmark: { cohort: "individual", description: "Não é um diagnóstico." },
    },
  }),
}));
vi.mock("@/features/commerce/entitlement-service", () => ({
  findPaidEntitlement: async () => ({
    id: "grant",
    orderId: "paid-order",
    sourceSessionId: "session",
  }),
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: (table: string) => {
      const result = {
        data: table === "orders" ? { status: "FULFILLED", session_id: "session" } : null,
        error: null,
      };
      const chain = {
        select: () => chain,
        eq: () => chain,
        update: () => chain,
        upsert: () => chain,
        single: async () => result,
        maybeSingle: async () => result,
        then: (resolve: (value: typeof result) => unknown) => Promise.resolve(result).then(resolve),
      };
      return chain;
    },
  }),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("Paid report PDF delivery contract", () => {
  it("sends a readable PDF and its full text to the delivery function", async () => {
    vi.stubEnv("REPORT_DELIVERY_SECRET", "test-only-secret-at-least-32-characters");
    const fetchMock = vi.fn(async () => Response.json({ messageId: "smtp-message" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(deliverPaidReport("paid-order", "pt", "http://localhost/result")).resolves.toEqual(
      { messageId: "smtp-message" },
    );
    const calls = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(calls).toHaveLength(1);
    const payload = JSON.parse(calls[0][1].body as string);
    expect(payload.filename).toBe("meqyro-brainrank-resultado.pdf");
    expect(payload.html).toBeUndefined();
    const bytes = Buffer.from(payload.pdfBase64, "base64");
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    const text = await pdfText(bytes);
    expect(text).toContain(payload.text.replace(/\s+/gu, " ").trim());
    expect(text).toContain("Não é um diagnóstico.");
  });
});
