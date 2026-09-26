import { describe, expect, it } from "vitest";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import {
  startQuizSession,
  saveAnswer,
  completeQuizSession,
} from "@/features/quiz-engine/session-service";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();

describe.skipIf(!isOnline)(
  "End-to-End Flow Verification Across All 7 Quizzes (DB Integration)",
  () => {
    const quizzes = [
      { slug: "brainrank", type: "SINGLE_CHOICE" },
      { slug: "personality-map", type: "LIKERT" },
      { slug: "careerfit", type: "LIKERT" },
      { slug: "moneydna", type: "LIKERT" },
      { slug: "focusstyle", type: "LIKERT" },
      { slug: "decisiondna", type: "SINGLE_CHOICE" },
      { slug: "coupledna", type: "LIKERT" },
    ] as const;

    for (const { slug, type } of quizzes) {
      it(`executes start -> answer -> continue -> complete for ${slug} (${type})`, async () => {
        // 1. Start session
        const { session, token } = await startQuizSession({
          quizSlug: slug,
          locale: "pt",
          market: "BR",
        });

        expect(session.id).toBeDefined();
        expect(session.status).toBe("CREATED");

        // 2. Fetch public questions
        const quiz = await getPublicQuiz(slug, "pt");
        expect(quiz).not.toBeNull();
        expect(quiz!.questions.length).toBeGreaterThan(0);

        // 3. Answer all questions sequentially
        for (let i = 0; i < quiz!.questions.length; i++) {
          const q = quiz!.questions[i];
          const payload: {
            sessionId: string;
            token: string;
            questionId: string;
            optionId?: string;
            numericValue?: number;
            durationMs: number;
            nextPosition: number;
          } = {
            sessionId: session.id,
            token,
            questionId: q.id,
            durationMs: 1500,
            nextPosition: i + 2,
          };

          if (q.kind === "LIKERT") {
            payload.numericValue = 4; // Agree
          } else {
            payload.optionId = q.options[0].id;
          }

          const saveResult = await saveAnswer(payload);
          expect(saveResult.success).toBe(true);
        }

        // 4. Complete session
        const completion = await completeQuizSession({
          sessionId: session.id,
          token,
        });

        expect(completion.sessionId).toBe(session.id);
        expect(completion.strongestDimension).toBeDefined();
        expect(completion.strongestDimensionLabel).toBeDefined();
        expect(completion.dimensionScores).toBeDefined();
        expect(Object.keys(completion.dimensionScores ?? {}).length).toBeGreaterThan(0);
        if (slug === "brainrank") {
          expect(completion.overallScore).toBeDefined();
        }
      });
    }
  },
);
