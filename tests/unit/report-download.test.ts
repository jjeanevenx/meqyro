import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import { GET } from "@/app/api/sessions/[id]/report/route";
import { getProtectedResult } from "@/features/results/result-service";
import { reportPdf } from "@/features/results/report-pdf";
import type { ComprehensiveReport } from "@/features/results/contracts";

vi.mock("@/features/results/result-service", () => ({ getProtectedResult: vi.fn() }));
const report: ComprehensiveReport = {
  bandLabel: "Visão analítica",
  executiveSummary: "Você tem atenção e comunicação fortes.",
  sections: [
    {
      id: "one",
      title: "Próximos passos",
      summary: "Síntese",
      paragraphs: ["Ação diária"],
      keyTakeaways: ["Reflexão"],
      actionItems: ["Pratique"],
    },
  ],
  comparativeBenchmark: { cohort: "none", description: "Análise individual" },
};
const request = (authenticated = true) =>
  new NextRequest("http://localhost/api/sessions/session/report?locale=pt", {
    headers: authenticated ? { cookie: "meqyro_session=secret" } : {},
  });
const context = { params: Promise.resolve({ id: "session" }) };

describe("Premium report download", () => {
  beforeEach(() => vi.resetAllMocks());
  it("rejects unauthenticated downloads before accessing results", async () => {
    expect((await GET(request(false), context)).status).toBe(401);
    expect(getProtectedResult).not.toHaveBeenCalled();
  });
  it("blocks downloads without paid access even if a premium payload is present", async () => {
    vi.mocked(getProtectedResult).mockResolvedValue({
      sessionId: "session",
      quizSlug: "brainrank",
      accessLevel: "FREE_PARTIAL",
      summary: {
        sessionId: "session",
        quizSlug: "brainrank",
        quizVersion: "1.0",
        scoringVersion: "1.0",
      },
      premiumReport: report,
    });
    const response = await GET(request(), context);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Payment required" });
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
  it("fails closed when session or payment verification fails", async () => {
    vi.mocked(getProtectedResult).mockRejectedValue(new Error("Invalid session"));
    expect((await GET(request(), context)).status).toBe(403);
  });
  it("delivers a real PDF only after premium authorization", async () => {
    vi.mocked(getProtectedResult).mockResolvedValue({
      sessionId: "session",
      quizSlug: "brainrank",
      accessLevel: "PREMIUM_UNLOCKED",
      summary: {
        sessionId: "session",
        quizSlug: "brainrank",
        quizVersion: "1.0",
        scoringVersion: "1.0",
      },
      premiumReport: report,
    });
    const response = await GET(request(), context);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="meqyro-brainrank-resultado.pdf"',
    );
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThan(0);
    expect(getProtectedResult).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: "session", sessionToken: "secret" }),
    );
  });
  it("paginates long reports with accented text", async () => {
    const pdf = await reportPdf(
      { ...report, executiveSummary: "Atenção, ação, réflexion, español. ".repeat(1500) },
      "brainrank",
    );
    expect((await PDFDocument.load(pdf)).getPageCount()).toBeGreaterThan(1);
  });
});
