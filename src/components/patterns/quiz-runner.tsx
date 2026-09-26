"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import type {
  PublicQuiz,
  ActiveSession,
  PartialResultSummary,
} from "@/features/quiz-engine/contracts";
import type { ProtectedResultResponse } from "@/features/results/contracts";
import { QuestionRenderer } from "./question-renderers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { LeadCaptureCard } from "./lead-capture-card";
import { ResultView } from "./result-view";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export type QuestionState = "UNANSWERED" | "ANSWERED" | "SAVING" | "ERROR" | "READY_TO_CONTINUE";

type QuizRunnerProps = {
  quiz: PublicQuiz;
  initialSession?: ActiveSession | null;
  locale: string;
  market: string;
  initialInviteCode?: string;
  initialReferralCode?: string;
};

export function QuizRunner({
  quiz,
  initialSession = null,
  locale,
  market,
  initialInviteCode,
  initialReferralCode,
}: QuizRunnerProps) {
  const safeLocale: Locale = locale === "en" || locale === "es" || locale === "fr" ? locale : "pt";
  const dict = getDictionary(safeLocale);

  const [session, setSession] = useState<ActiveSession | null>(initialSession);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialSession && initialSession.currentPosition > 1) {
      return Math.min(initialSession.currentPosition - 1, quiz.questions.length - 1);
    }
    return 0;
  });

  const [answers, setAnswers] = useState<
    Record<string, { optionId?: string; numericValue?: number; durationMs?: number }>
  >(() => initialSession?.answers ?? {});

  const [isInitializing, setIsInitializing] = useState(!initialSession);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [result, setResult] = useState<PartialResultSummary | null>(null);
  const [protectedResult, setProtectedResult] = useState<ProtectedResultResponse | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(true);

  // Distinct error channels
  const [validationError, setValidationError] = useState<string | null>(null);
  const [systemError, setSystemError] = useState<string | null>(null);

  // Double-click lock & timing refs
  const saveLockRef = useRef<boolean>(false);
  const questionStartTimeRef = useRef<number>(0);
  const cardRef = useRef<HTMLElement>(null);

  // Initialize session if not provided by server
  useEffect(() => {
    if (session) {
      return;
    }

    let isMounted = true;

    async function initSession() {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizSlug: quiz.slug,
            locale,
            market,
            referralCode: initialReferralCode,
            inviteCode: initialInviteCode,
          }),
        });

        if (!response.ok) {
          throw new Error(dict.quizRunner.initError);
        }

        const data = await response.json();
        if (isMounted) {
          setSession(data.session);
          if (data.session.currentPosition > 1) {
            setCurrentIndex(Math.min(data.session.currentPosition - 1, quiz.questions.length - 1));
          }
          if (data.session.answers) {
            setAnswers(data.session.answers);
          }
          setIsInitializing(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setSystemError(err instanceof Error ? err.message : dict.quizRunner.initError);
          setIsInitializing(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [
    quiz.slug,
    quiz.questions.length,
    locale,
    market,
    session,
    initialReferralCode,
    initialInviteCode,
    dict.quizRunner.initError,
  ]);

  // Reset timer on question change
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  const currentQuestion = quiz.questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasSelectedAnswer =
    Boolean(currentAnswer?.optionId) ||
    (typeof currentAnswer?.numericValue === "number" && currentAnswer.numericValue > 0);

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.values(answers).filter(
    (a) => Boolean(a?.optionId) || (typeof a?.numericValue === "number" && a.numericValue > 0),
  ).length;

  // Single derived source of truth for progress
  const progressPercent = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));
  const progressLabel = `${dict.common.question} ${currentIndex + 1} ${dict.common.of} ${totalQuestions}`;
  const quizKicker = dict.quizzes[quiz.slug]?.category || "MEQYRO";

  // Immediate state update & immediate error clearance on answer selection
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion || isSaving || isCompleting) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { optionId },
    }));
    setValidationError(null);
    setSystemError(null);
  };

  const handleSelectValue = (numericValue: number) => {
    if (!currentQuestion || isSaving || isCompleting) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { numericValue },
    }));
    setValidationError(null);
    setSystemError(null);
  };

  const handleContinue = async () => {
    if (!currentQuestion) return;

    // 1. Validation check
    if (!hasSelectedAnswer) {
      setValidationError(dict.quizRunner.selectOptionToContinue);
      return;
    }

    // 2. Prevent concurrent / double-click execution
    if (saveLockRef.current || isSaving || isCompleting) {
      return;
    }

    saveLockRef.current = true;
    setIsSaving(true);
    setValidationError(null);
    setSystemError(null);

    const durationMs =
      questionStartTimeRef.current > 0 ? Date.now() - questionStartTimeRef.current : 0;
    const isLastQuestion = currentIndex >= totalQuestions - 1;
    const nextPosition = isLastQuestion ? currentIndex + 1 : currentIndex + 2;

    try {
      const activeSession = session;
      if (!activeSession) {
        throw new Error(dict.quizRunner.initError);
      }

      // Save answer to server
      const saveResponse = await fetch(`/api/sessions/${activeSession.id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          optionId: currentAnswer?.optionId,
          numericValue: currentAnswer?.numericValue,
          durationMs,
          nextPosition,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error(dict.quizRunner.saveError);
      }

      if (!isLastQuestion) {
        setCurrentIndex((prev) => prev + 1);
        setIsSaving(false);
        saveLockRef.current = false;
        setValidationError(null);
        setSystemError(null);

        // Smooth scroll to top of card on question advance
        if (typeof window !== "undefined") {
          cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      // Complete quiz on server
      setIsCompleting(true);
      const completeResponse = await fetch(`/api/sessions/${activeSession.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json().catch(() => ({}));
        throw new Error(errorData.error ?? dict.quizRunner.saveError);
      }

      const completeData = await completeResponse.json();
      setResult(completeData.result);

      // Fetch protected result & paywall details
      try {
        const protectedRes = await fetch(
          `/api/sessions/${activeSession.id}/result?locale=${locale}&market=${market}`,
        );
        if (protectedRes.ok) {
          const protData = await protectedRes.json();
          setProtectedResult(protData.result);
        }
      } catch {
        // Continue with standard result
      }

      setIsCompleting(false);
      setIsSaving(false);
      saveLockRef.current = false;
    } catch (err: unknown) {
      setSystemError(err instanceof Error ? err.message : dict.quizRunner.saveError);
      setIsSaving(false);
      setIsCompleting(false);
      saveLockRef.current = false;
    }
  };

  const handleBack = () => {
    if (currentIndex > 0 && !isSaving && !isCompleting) {
      setCurrentIndex((prev) => prev - 1);
      setValidationError(null);
      setSystemError(null);

      if (typeof window !== "undefined") {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // 1. Initial loading state
  if (isInitializing) {
    return (
      <main className="quiz-runner quiz-runner--loading flex flex-col items-center justify-center p-12 min-h-screen">
        <Loader2 className="animate-spin text-stone-700" size={32} aria-hidden="true" />
        <p className="mt-4 text-sm text-stone-600 font-medium">{dict.common.loading}</p>
      </main>
    );
  }

  // 2. Completed / Result preview state
  if (result) {
    if (showLeadCapture) {
      return (
        <main className="result-preview-shell">
          <LeadCaptureCard
            sessionId={session?.id ?? result.sessionId}
            locale={locale}
            market={market}
            onSuccess={() => setShowLeadCapture(false)}
            onSkip={() => setShowLeadCapture(false)}
          />
        </main>
      );
    }

    return (
      <main className="result-preview-shell">
        <ResultView
          summary={protectedResult?.summary ?? result}
          accessLevel={protectedResult?.accessLevel ?? "FREE_PARTIAL"}
          paywall={protectedResult?.paywall}
          premiumReport={protectedResult?.premiumReport}
          locale={locale}
        />
      </main>
    );
  }

  // 3. Question Runner screen
  const questionKicker = `${dict.common.question.toUpperCase()} ${String(currentIndex + 1).padStart(2, "0")}`;
  const activeError = validationError || systemError;

  return (
    <main className="quiz-runner" ref={cardRef}>
      {/* Top Header */}
      <header className="quiz-runner__header">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIndex === 0 || isSaving || isCompleting}
          className="quiz-runner__nav-btn"
          aria-label={dict.common.previous}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>{dict.common.back}</span>
        </button>

        <span className="quiz-runner__wordmark">MEQYRO</span>

        <span className="quiz-runner__counter">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </header>

      {/* Progress */}
      <div className="quiz-runner__progress-wrapper">
        <ProgressBar value={progressPercent} label={progressLabel} kicker={quizKicker} />
      </div>

      {/* Question Content */}
      {currentQuestion ? (
        <section className="quiz-question-card" aria-labelledby="quiz-question-heading">
          <div className="quiz-question-meta">
            <span className="quiz-question-kicker">{questionKicker}</span>
            {currentQuestion.clue ? (
              <span className="quiz-question-clue">{currentQuestion.clue}</span>
            ) : null}
          </div>

          <h1 id="quiz-question-heading" className="quiz-question-title">
            {currentQuestion.prompt}
          </h1>

          {activeError ? (
            <div
              className={`quiz-error-banner ${validationError ? "quiz-error-banner--validation" : "quiz-error-banner--system"}`}
              role="alert"
              aria-live="polite"
            >
              <AlertCircle size={18} aria-hidden="true" />
              <span>{activeError}</span>
            </div>
          ) : null}

          <div className="quiz-options-wrapper">
            <QuestionRenderer
              question={currentQuestion}
              selectedOptionId={currentAnswer?.optionId}
              selectedValue={currentAnswer?.numericValue}
              locale={locale}
              onSelectOption={handleSelectOption}
              onSelectValue={handleSelectValue}
              disabled={isSaving || isCompleting}
            />
          </div>

          {/* Action Footer */}
          <footer className="quiz-runner__footer">
            <Button
              type="button"
              disabled={isSaving || isCompleting}
              onClick={handleContinue}
              className="quiz-runner__submit-btn"
              aria-busy={isSaving || isCompleting}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                  <span>{dict.quizRunner.calculatingScore}</span>
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                  <span>{dict.quizRunner.saving}</span>
                </>
              ) : (
                <>
                  <span>
                    {currentIndex >= totalQuestions - 1
                      ? dict.quizRunner.finishQuiz
                      : dict.common.continue}
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </Button>
          </footer>
        </section>
      ) : null}
    </main>
  );
}
