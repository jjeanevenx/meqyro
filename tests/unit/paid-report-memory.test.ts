import { describe, expect, it } from "vitest";
import { buildHumanReport } from "@/features/results/human-report";
import { reportHtml } from "@/features/results/report-document";
import { attachMemoryCues, distributeMemoryItems } from "@/features/quiz-engine/delayed-memory";
import type { PublicQuestion } from "@/features/quiz-engine/contracts";

describe("Paid reports and delayed recall", () => {
  it("does not praise a low BrainRank score as high performance or invent percentiles", () => {
    const low = buildHumanReport(
      "brainrank",
      { overallScore: 125, dimensionScores: { ATTENTION: 0 } },
      "pt",
    );
    const high = buildHumanReport(
      "brainrank",
      { overallScore: 1000, dimensionScores: { ATTENTION: 100 } },
      "pt",
    );
    expect(low.executiveSummary).toContain("125/1000");
    expect(low.sections[0].summary).toContain("mais difíceis");
    expect(high.sections[0].summary).toContain("maior parte");
    expect(low.percentileRank).toBeUndefined();
    expect(high.comparativeBenchmark.percentile).toBeUndefined();
  });
  it("keeps FocusStyle preferences separate from actual memory exercises", () => {
    const report = buildHumanReport(
      "focusstyle",
      {
        styleScores: { MODULAR_SERIAL: 90, IMMERSIVE_HYPERFOCUS: 20 },
        memoryRecall: { correct: 1, total: 3 },
      },
      "pt",
    );
    expect(report.sections[0].summary).not.toEqual(report.sections[1].summary);
    expect(report.sections.at(-1)?.summary).toContain("1/3");
    expect(report.sections.at(-1)?.paragraphs.join()).toContain("não altera seu perfil");
  });
  it.each([24, 20])("distributes exactly three recall tasks among %i ordinary items", (count) => {
    const ordinary: PublicQuestion[] = Array.from({ length: count }, (_, index) => ({
      id: `q-${index}`,
      stableKey: `Q_${index}`,
      position: index + 1,
      kind: "LIKERT",
      prompt: "Ordinary",
      options: [],
    }));
    const memory: PublicQuestion[] = Array.from({ length: 3 }, (_, index) => ({
      id: `m-${index}`,
      stableKey: `M_${index}`,
      position: 0,
      kind: "SINGLE_CHOICE",
      prompt: "Recall",
      memoryRecall: { id: `m-${index}`, cue: `Secret-${index}` },
      options: [],
    }));
    const questions = attachMemoryCues(distributeMemoryItems(ordinary, memory));
    const recalls = questions.flatMap((q, index) => (q.memoryRecall ? [index] : []));
    const cues = questions.flatMap((q, index) => (q.memoryCue ? [index] : []));
    expect(questions).toHaveLength(count);
    expect(recalls).toEqual(count === 24 ? [7, 15, 23] : [6, 13, 19]);
    expect(cues).toEqual(count === 24 ? [0, 8, 16] : [0, 7, 14]);
    expect(new Set(questions.map((q) => q.id)).size).toBe(count);
    recalls.forEach((index) => expect(questions[index].memoryCue).toBeUndefined());
  });
  it("produces an offline document with escaped content and the promised certificate", () => {
    const report = buildHumanReport(
      "brainrank",
      { overallScore: 500, dimensionScores: { ATTENTION: 50 } },
      "pt",
    );
    report.executiveSummary = '<script>alert("x")</script>';
    const html = reportHtml(report, "brainrank", "pt");
    expect(html).toContain('charset="utf-8"');
    expect(html).toContain("Certificado digital de conclusão");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});
