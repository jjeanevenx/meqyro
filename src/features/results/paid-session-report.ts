import "server-only";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { buildHumanReport } from "@/features/results/human-report";
import { buildCoupleReport } from "@/features/results/couple-report";
import { getCoupleState } from "@/features/couple/couple-service";
import type { ComprehensiveReport } from "@/features/results/contracts";

export async function buildPaidSessionReport(
  sessionId: string,
  locale: string,
): Promise<{ slug: string; report: ComprehensiveReport } | null> {
  const { data, error } = await createSupabaseSecretClient()
    .from("results")
    .select("score,quiz_sessions!inner(quiz_versions!inner(quizzes!inner(slug)))")
    .eq("session_id", sessionId)
    .single();
  if (error || !data) return null;
  const row = data as unknown as {
    score: Record<string, unknown>;
    quiz_sessions: { quiz_versions: { quizzes: { slug: string } } };
  };
  const slug = row.quiz_sessions.quiz_versions.quizzes.slug;
  if (slug === "coupledna") {
    const state = await getCoupleState(sessionId);
    return state.state === "READY"
      ? { slug, report: buildCoupleReport(state.comparison, locale) }
      : null;
  }
  return { slug, report: buildHumanReport(slug, row.score, locale) };
}
