import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n/config";
import type { PublicQuiz, PublicQuestion, PublicOption, QuestionKind } from "./contracts";
import { brainRankQuestions } from "@/content/quizzes/brainrank";
import { assertVisualQuestion, isVisualScene, isVisualStimulus } from "./visual-question-schema";

/**
 * Detects encoding corruption in text content.
 * Common patterns: "n??mero" (replacement), "nÃºmero" (mojibake from UTF-8 read as Latin-1)
 */
function hasEncodingCorruption(text: string | null | undefined): boolean {
  if (!text || typeof text !== "string") return false;

  // Check for common corruption patterns
  // "??" appearing where accented characters should be (replacement character)
  if (text.includes("??") && /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(text)) {
    return true;
  }

  // Mojibake patterns: UTF-8 bytes interpreted as Latin-1
  // Examples: Ã¡, Ã , Ã©, Ã, ãƒ
  if (/[Ã][àáâãèéêìíòóõùúçÃ]/u.test(text)) {
    return true;
  }

  // Unicode replacement character
  if (text.includes("\uFFFD")) {
    return true;
  }

  return false;
}

/**
 * Validates quiz content for encoding corruption.
 * Returns true if data is valid, false if corrupted.
 */
function validateQuizContent(quiz: PublicQuiz): boolean {
  for (const question of quiz.questions) {
    if (hasEncodingCorruption(question.prompt)) {
      console.warn(
        `[encoding] Corrupted prompt in question ${question.stableKey}: ${question.prompt}`,
      );
      return false;
    }
    if (hasEncodingCorruption(question.clue)) {
      console.warn(`[encoding] Corrupted clue in question ${question.stableKey}: ${question.clue}`);
      return false;
    }
    for (const option of question.options) {
      if (hasEncodingCorruption(option.label)) {
        console.warn(`[encoding] Corrupted label in option ${option.stableKey}: ${option.label}`);
        return false;
      }
    }
  }
  return true;
}
import { personalityMapQuestions } from "@/content/quizzes/personality-map";
import { careerFitQuestions } from "@/content/quizzes/careerfit";
import { moneyDnaQuestions } from "@/content/quizzes/moneydna";
import { focusStyleQuestions } from "@/content/quizzes/focusstyle";
import { decisionDnaScenarios } from "@/content/quizzes/decisiondna";
import { coupleDnaQuestions } from "@/content/quizzes/coupledna";
import { getSessionQuestions } from "./session-service";
import { ASSESSMENT_SELECTION_CONFIGS } from "./selection-config";
import { attachMemoryCues, distributeMemoryItems } from "./delayed-memory";
import { memoryExercises } from "@/content/quizzes/memory-exercises";

export async function getPublicQuiz(
  slug: string,
  locale: Locale,
  sessionId?: string,
): Promise<PublicQuiz | null> {
  const supabase = createSupabaseSecretClient();

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select(
      "id, slug, product_code, active, quiz_versions!inner(id, version, scoring_version, status)",
    )
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (quizError || !quiz) {
    // Fallback to in-memory content if database is not reachable
    return getFallbackPublicQuiz(slug, locale);
  }

  const activeVersion = Array.isArray(quiz.quiz_versions)
    ? (quiz.quiz_versions.find(
        (v: { status: string }) => v.status === "APPROVED" || v.status === "PUBLISHED",
      ) ?? quiz.quiz_versions[0])
    : quiz.quiz_versions;

  if (!activeVersion) return null;

  if (sessionId) {
    const sessionQs = await getSessionQuestions(sessionId, locale);
    if (sessionQs.length > 0) {
      return {
        id: activeVersion.id,
        slug: quiz.slug,
        productCode: quiz.product_code,
        version: activeVersion.version,
        scoringVersion: activeVersion.scoring_version,
        totalQuestions: sessionQs.length,
        questions: sessionQs,
      };
    }
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select(
      `
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
        metadata,
        option_translations!inner(locale, label, image_alt)
      )
    `,
    )
    .eq("quiz_version_id", activeVersion.id)
    .eq("active", true)
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
    metadata?: Record<string, unknown> | null;
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
      ? (q.question_translations.find((t) => t.locale === locale) ?? q.question_translations[0])
      : q.question_translations;

    const clue =
      q.metadata && typeof q.metadata === "object" && "clue" in q.metadata
        ? ((q.metadata.clue as Record<string, string>)[locale] ?? null)
        : null;

    const rawOptions = Array.isArray(q.options) ? q.options : [];
    const publicOptions: PublicOption[] = rawOptions
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((opt) => {
        const optTrans = Array.isArray(opt.option_translations)
          ? (opt.option_translations.find((t) => t.locale === locale) ?? opt.option_translations[0])
          : opt.option_translations;

        return {
          id: opt.id,
          stableKey: opt.stable_key,
          position: opt.position,
          label: optTrans?.label ?? opt.stable_key,
          imageAlt: optTrans?.image_alt ?? null,
          visual: isVisualScene(opt.metadata?.visual) ? opt.metadata.visual : null,
        };
      });

    const publicQuestion: PublicQuestion = {
      id: q.id,
      stableKey: q.stable_key,
      position: q.position,
      kind: q.kind as QuestionKind,
      prompt: translation?.prompt ?? q.stable_key,
      accessibilityText: translation?.accessibility_text ?? null,
      clue,
      ...(q.metadata?.memoryCue && typeof q.metadata.memoryCue === "object"
        ? {
            memoryRecall: {
              id: q.stable_key,
              cue: String((q.metadata.memoryCue as Record<string, unknown>)[locale] ?? ""),
            },
          }
        : {}),
      visualType:
        typeof q.metadata?.visualType === "string"
          ? (q.metadata.visualType as PublicQuestion["visualType"])
          : null,
      stimulus: isVisualStimulus(q.metadata?.stimulus) ? q.metadata.stimulus : null,
      options: publicOptions,
    };
    assertVisualQuestion(publicQuestion);
    return publicQuestion;
  });

  const maxQuestions = ASSESSMENT_SELECTION_CONFIGS[slug]?.totalQuestions ?? 24;
  const ordinary = publicQuestions.filter((q) => !q.memoryRecall).slice(0, maxQuestions);
  const recall = publicQuestions.filter((q) => q.memoryRecall);
  const slicedQuestions = recall.length
    ? attachMemoryCues(distributeMemoryItems(ordinary, recall))
    : ordinary;

  const quizContent: PublicQuiz = {
    id: activeVersion.id,
    slug: quiz.slug,
    productCode: quiz.product_code,
    version: activeVersion.version,
    scoringVersion: activeVersion.scoring_version,
    totalQuestions: slicedQuestions.length,
    questions: slicedQuestions,
  };

  // Validate encoding - if corrupted, fallback to in-memory content
  if (!validateQuizContent(quizContent)) {
    console.warn(
      `[encoding] Detected corruption in DB quiz "${slug}" for locale "${locale}". Using fallback.`,
    );
    return getFallbackPublicQuiz(slug, locale);
  }

  return quizContent;
}

export function getFallbackPublicQuiz(slug: string, locale: Locale): PublicQuiz | null {
  if (slug === "brainrank") {
    const questions: PublicQuestion[] = brainRankQuestions.map((q) => {
      const question: PublicQuestion = {
        id: `brainrank-${q.position}`,
        stableKey: q.stableKey,
        position: q.position,
        kind: q.kind ?? "SINGLE_CHOICE",
        prompt: q.prompt[locale] ?? q.prompt.pt,
        accessibilityText: null,
        clue: q.clue ? (q.clue[locale] ?? q.clue.pt) : null,
        visualType: q.visualType ?? null,
        stimulus: q.stimulus ?? null,
        options: q.options.map((opt) => ({
          id: `opt-${q.position}-${opt.stableKey}`,
          stableKey: opt.stableKey,
          position: opt.position,
          label: opt.label[locale] ?? opt.label.pt,
          imageAlt: null,
          visual: opt.visual ?? null,
        })),
      };
      assertVisualQuestion(question);
      return question;
    });

    return {
      id: "fallback-brainrank-id",
      slug: "brainrank",
      productCode: "BRAINRANK",
      version: "1.0",
      scoringVersion: "1.0",
      totalQuestions: 24,
      questions: withFallbackMemory(questions, locale),
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
      questions: withFallbackMemory(questions, locale),
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

function withFallbackMemory(questions: PublicQuestion[], locale: Locale): PublicQuestion[] {
  const recall: PublicQuestion[] = memoryExercises.map((exercise) => ({
    id: exercise.key,
    stableKey: exercise.key,
    position: 0,
    kind: "SINGLE_CHOICE",
    prompt: exercise.prompt[locale],
    memoryRecall: { id: exercise.key, cue: exercise.cue[locale] },
    options: exercise.options.map((labels, index) => ({
      id: `${exercise.key}-${index}`,
      stableKey: String.fromCharCode(65 + index),
      position: index + 1,
      label: labels[locale],
    })),
  }));
  return attachMemoryCues(distributeMemoryItems(questions, recall)).map((q, index) => ({
    ...q,
    position: index + 1,
  }));
}
