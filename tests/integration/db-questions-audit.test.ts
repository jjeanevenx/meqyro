import { describe, it, expect } from "vitest";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

describe("Audit DB Questions", () => {
  it("audits all questions in DB", async () => {
    const supabase = createSupabaseSecretClient();
    const { data: quizzes, error: qErr } = await supabase
      .from("quizzes")
      .select(
        "id, slug, product_code, active, quiz_versions(id, version, scoring_version, status)",
      );

    console.log("Quizzes:", JSON.stringify(quizzes, null, 2));
    expect(qErr).toBeNull();
    expect(quizzes?.length).toBeGreaterThanOrEqual(7);

    for (const q of quizzes ?? []) {
      const v = q.quiz_versions[0];
      if (!v) continue;
      const { data: questions, error } = await supabase
        .from("questions")
        .select("id, stable_key, position, kind, scoring_key, metadata, active")
        .eq("quiz_version_id", v.id);
      expect(error).toBeNull();

      console.log(`\n=== QUIZ ${q.slug} (Version: ${v.version}) ===`);
      console.log(`Total questions in DB: ${questions?.length}`);
      const active = questions?.filter((x) => x.active) ?? [];
      console.log(`Active questions: ${active.length}`);

      const dims: Record<string, number> = {};
      const diffs: Record<string, number> = {};
      const breakdowns: Record<string, number> = {};

      for (const item of active) {
        const scoring = item.scoring_key as Record<string, unknown> | null;
        const metadata = item.metadata as Record<string, unknown> | null;
        const dimension = scoring?.dimension ?? scoring?.archetype ?? metadata?.dimension;
        const dim = typeof dimension === "string" ? dimension : "UNKNOWN";
        const diff = typeof scoring?.difficulty === "string" ? scoring.difficulty : "N/A";
        const dir = typeof scoring?.direction === "string" ? scoring.direction : "N/A";
        dims[dim] = (dims[dim] || 0) + 1;
        diffs[diff] = (diffs[diff] || 0) + 1;
        const key = `${dim} | ${diff} | dir:${dir}`;
        breakdowns[key] = (breakdowns[key] || 0) + 1;
      }
      console.log("Dimensions:", dims);
      console.log("Difficulties:", diffs);
      console.log("Breakdowns:", breakdowns);

      // Check translations
      const { data: trans } = await supabase
        .from("question_translations")
        .select("question_id, locale")
        .in(
          "question_id",
          active.map((x) => x.id),
        );

      const transByQ: Record<string, string[]> = {};
      for (const t of trans ?? []) {
        transByQ[t.question_id] = transByQ[t.question_id] || [];
        transByQ[t.question_id].push(t.locale);
      }
      const completeLocales = Object.values(transByQ).filter((locs) =>
        ["pt", "en", "es", "fr"].every((l) => locs.includes(l)),
      ).length;
      expect(active.length).toBeGreaterThan(0);
      expect(completeLocales).toBe(active.length);
      console.log(
        `Questions with complete 4 translations (pt, en, es, fr): ${completeLocales} / ${active.length}`,
      );
    }
  });
});
