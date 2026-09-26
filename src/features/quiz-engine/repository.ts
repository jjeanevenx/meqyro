import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n/config";
import type { PublicQuiz, PublicQuestion, PublicOption, QuestionKind } from "./contracts";
import { brainRankQuestions } from "@/content/quizzes/brainrank";
import { personalityMapQuestions } from "@/content/quizzes/personality-map";
import { careerFitQuestions } from "@/content/quizzes/careerfit";
import { moneyDnaQuestions } from "@/content/quizzes/moneydna";
import { focusStyleQuestions } from "@/content/quizzes/focusstyle";
import { decisionDnaScenarios } from "@/content/quizzes/decisiondna";
import { coupleDnaQuestions } from "@/content/quizzes/coupledna";

export async function getPublicQuiz(slug: string, locale: Locale): Promise<PublicQuiz | null> {
  const supabase = createSupabaseSecretClient();

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, slug, product_code, active, quiz_versions!inner(id, version, scoring_version, status)")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (quizError || !quiz) {
    // Fallback to in-memory content if database is not reachable
    return getFallbackPublicQuiz(slug, locale);
  }

  const activeVersion = Array.isArray(quiz.quiz_versions)
    ? quiz.quiz_versions.find((v: { status: string }) => v.status === "APPROVED" || v.status === "PUBLISHED") ?? quiz.quiz_versions[0]
    : quiz.quiz_versions;

  if (!activeVersion) return null;

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select(`
      id,
      stable_key,
      position,
      kind,
      metadata,
      question_translations!inner(locale, prompt, accessibility_text),
      options(
        id,
        stable_key,
        position,
        option_translations!inner(locale, label, image_alt)
      )
    `)
    .eq("quiz_version_id", activeVersion.id)
    .eq("question_translations.locale", locale)
    .order("position", { ascending: true });

  if (questionsError || !questions || questions.length === 0) {
    return getFallbackPublicQuiz(slug, locale);
  }

type DbTranslation = {
  locale: string;
  prompt?: string;
  label?: string;
  accessibility_text?: string | null;
  image_alt?: string | null;
};

type DbOption = {
  id: string;
  stable_key: string;
  position: number;
  option_translations?: DbTranslation[] | DbTranslation;
};

type DbQuestion = {
  id: string;
  stable_key: string;
  position: number;
  kind: string;
  metadata?: Record<string, unknown> | null;
  question_translations?: DbTranslation[] | DbTranslation;
  options?: DbOption[];
};

  const rawQuestions = questions as unknown as DbQuestion[];

  const publicQuestions: PublicQuestion[] = rawQuestions.map((q) => {
    const translation = Array.isArray(q.question_translations)
      ? q.question_translations.find((t) => t.locale === locale) ?? q.question_translations[0]
      : q.question_translations;

    const clue = q.metadata && typeof q.metadata === "object" && "clue" in q.metadata
      ? (q.metadata.clue as Record<string, string>)[locale] ?? null
      : null;

    const rawOptions = Array.isArray(q.options) ? q.options : [];
    const publicOptions: PublicOption[] = rawOptions
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((opt) => {
        const optTrans = Array.isArray(opt.option_translations)
          ? opt.option_translations.find((t) => t.locale === locale) ?? opt.option_translations[0]
          : opt.option_translations;

        return {
          id: opt.id,
          stableKey: opt.stable_key,
          position: opt.position,
          label: optTrans?.label ?? opt.stable_key,
          imageAlt: optTrans?.image_alt ?? null,
        };
      });

    return {
      id: q.id,
      stableKey: q.stable_key,
      position: q.position,
      kind: q.kind as QuestionKind,
      prompt: translation?.prompt ?? q.stable_key,
      accessibilityText: translation?.accessibility_text ?? null,
      clue,
      options: publicOptions,
    };
  });

  return {
    id: activeVersion.id,
    slug: quiz.slug,
    productCode: quiz.product_code,
    version: activeVersion.version,
    scoringVersion: activeVersion.scoring_version,
    totalQuestions: publicQuestions.length,
    questions: publicQuestions,
  };
}

export function getFallbackPublicQuiz(slug: string, locale: Locale): PublicQuiz | null {
  if (slug === "brainrank") {
    const questions: PublicQuestion[] = brainRankQuestions.map((q) => ({
      id: `brainrank-${q.position}`,
      stableKey: q.stableKey,
      position: q.position,
      kind: "SINGLE_CHOICE",
      prompt: q.prompt[locale] ?? q.prompt.pt,
      accessibilityText: null,
      clue: q.clue ? q.clue[locale] ?? q.clue.pt : null,
      options: q.options.map((opt) => ({
        id: `opt-${q.position}-${opt.stableKey}`,
        stableKey: opt.stableKey,
        position: opt.position,
        label: opt.label[locale] ?? opt.label.pt,
        imageAlt: null,
      })),
    }));

    return {
      id: "fallback-brainrank-id",
      slug: "brainrank",
      productCode: "BRAINRANK",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 24,
      questions,
    };
  }

  if (slug === "personality-map") {
    const questions: PublicQuestion[] = personalityMapQuestions.map((q) => ({
      id: `personality-${q.position}`,
      stableKey: q.stableKey,
      position: q.position,
      kind: "LIKERT",
      prompt: q.prompt[locale] ?? q.prompt.en,
      accessibilityText: null,
      clue: null,
      options: [],
    }));

    return {
      id: "fallback-personality-id",
      slug: "personality-map",
      productCode: "PERSONALITY_MAP",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 40,
      questions,
    };
  }

  if (slug === "careerfit") {
    const questions: PublicQuestion[] = careerFitQuestions.map((q) => ({
      id: `careerfit-${q.position}`,
      stableKey: q.stableKey,
      position: q.position,
      kind: "LIKERT",
      prompt: q.prompt[locale] ?? q.prompt.pt,
      accessibilityText: null,
      clue: null,
      options: [],
    }));

    return {
      id: "fallback-careerfit-id",
      slug: "careerfit",
      productCode: "CAREERFIT",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 24,
      questions,
    };
  }

  if (slug === "moneydna") {
    const questions: PublicQuestion[] = moneyDnaQuestions.map((q) => ({
      id: `moneydna-${q.position}`,
      stableKey: q.stableKey,
      position: q.position,
      kind: "LIKERT",
      prompt: q.prompt[locale] ?? q.prompt.pt,
      accessibilityText: null,
      clue: null,
      options: [],
    }));

    return {
      id: "fallback-moneydna-id",
      slug: "moneydna",
      productCode: "MONEYDNA",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 20,
      questions,
    };
  }

  if (slug === "focusstyle") {
    const questions: PublicQuestion[] = focusStyleQuestions.map((q) => ({
      id: `focusstyle-${q.position}`,
      stableKey: q.stableKey,
      position: q.position,
      kind: "LIKERT",
      prompt: q.prompt[locale] ?? q.prompt.pt,
      accessibilityText: null,
      clue: null,
      options: [],
    }));

    return {
      id: "fallback-focusstyle-id",
      slug: "focusstyle",
      productCode: "FOCUSSTYLE",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 20,
      questions,
    };
  }

  if (slug === "decisiondna") {
    const questions: PublicQuestion[] = decisionDnaScenarios.map((s) => ({
      id: `decisiondna-${s.position}`,
      stableKey: s.stableKey,
      position: s.position,
      kind: "SCENARIO",
      prompt: s.prompt[locale] ?? s.prompt.pt,
      accessibilityText: null,
      clue: null,
      options: s.options.map((opt, idx) => ({
        id: `opt-${s.position}-${opt.stableKey}`,
        stableKey: opt.stableKey,
        position: idx + 1,
        label: opt.label[locale] ?? opt.label.pt,
        imageAlt: null,
      })),
    }));

    return {
      id: "fallback-decisiondna-id",
      slug: "decisiondna",
      productCode: "DECISIONDNA",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 4,
      questions,
    };
  }

  if (slug === "coupledna") {
    const questions: PublicQuestion[] = coupleDnaQuestions.map((q) => ({
      id: `coupledna-${q.position}`,
      stableKey: q.stableKey,
      position: q.position,
      kind: "LIKERT",
      prompt: q.prompt[locale] ?? q.prompt.pt,
      accessibilityText: null,
      clue: null,
      options: [],
    }));

    return {
      id: "fallback-coupledna-id",
      slug: "coupledna",
      productCode: "COUPLEDNA",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 20,
      questions,
    };
  }

  return null;
}
