import { describe, it } from "vitest";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

describe("Audit DB Questions", () => {
  it("audits all questions in DB", async () => {
    const supabase = createSupabaseSecretClient();
    const { data: quizzes, error: qErr } = await supabase
      .from("quizzes")
      .select("id, slug, product_code, active, quiz_versions(id, version, scoring_version, status)");

    console.log("Quizzes:", JSON.stringify(quizzes, null, 2));

    for (const q of quizzes ?? []) {
      const v = q.quiz_versions[0];
      if (!v) continue;
      const { data: questions, error } = await supabase
        .from("questions")
        .select("id, stable_key, position, kind, scoring_key, metadata, active")
        .eq("quiz_version_id", v.id);

      console.log(`\n=== QUIZ ${q.slug} (Version: ${v.version}) ===`);
      console.log(`Total questions in DB: ${questions?.length}`);
      const active = questions?.filter((x) => x.active) ?? [];
      console.log(`Active questions: ${active.length}`);

      const dims: Record<string, number> = {};
      const diffs: Record<string, number> = {};
      const breakdowns: Record<string, number> = {};

      for (const item of active) {
        const dim =
          (item.scoring_key as any)?.dimension ||
          (item.scoring_key as any)?.archetype ||
          (item.metadata as any)?.dimension ||
          "UNKNOWN";
        const diff = (item.scoring_key as any)?.difficulty || "N/A";
        const dir = (item.scoring_key as any)?.direction || "N/A";
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
        .in("question_id", active.map((x) => x.id));
      
      const transByQ: Record<string, string[]> = {};
      for (const t of trans ?? []) {
        transByQ[t.question_id] = transByQ[t.question_id] || [];
        transByQ[t.question_id].push(t.locale);
      }
      const completeLocales = Object.values(transByQ).filter(
        (locs) => ["pt", "en", "es", "fr"].every((l) => locs.includes(l))
      ).length;
      console.log(`Questions with complete 4 translations (pt, en, es, fr): ${completeLocales} / ${active.length}`);
    }
  });
});
