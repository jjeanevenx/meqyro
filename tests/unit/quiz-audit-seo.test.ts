import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { getDimensionLabel } from "@/lib/i18n/dimension-labels";
import { ASSESSMENT_SELECTION_CONFIGS } from "@/features/quiz-engine/selection-config";
import { locales } from "@/lib/i18n/config";

describe("Quiz audit regressions", () => {
  it("references an existing share image", () => {
    const metadata = buildPageMetadata({
      locale: "pt",
      path: "/quizzes/brainrank",
      title: "BrainRank",
      description: "Test",
    });
    const images = metadata.twitter?.images as string[];
    expect(existsSync(resolve("public", new URL(images[0]).pathname.slice(1)))).toBe(true);
  });
  it("localizes all quiz dimensions and decision styles in four languages", () => {
    const keys = new Set(
      Object.values(ASSESSMENT_SELECTION_CONFIGS)
        .flatMap((config) => Object.keys(config.dimensions))
        .filter((key) => key !== "SCENARIOS"),
    );
    for (const key of ["ANALYTICAL", "INTUITIVE", "PRAGMATIC"]) keys.add(key);
    for (const locale of locales)
      for (const key of keys)
        expect(getDimensionLabel(key, locale)).not.toBe(key.replace(/_/g, " "));
    expect(getDimensionLabel("PATTERN_RECOGNITION", "pt")).toBe("Reconhecimento de padrões");
  });
});
