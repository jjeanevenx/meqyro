"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import type {
  PublicQuiz,
  PublicQuestion,
  ActiveSession,
  PartialResultSummary,
} from "@/features/quiz-engine/contracts";
import type { ProtectedResultResponse } from "@/features/results/contracts";
import { MemoryObservation } from "./memory-observation";
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
  const [questions, setQuestions] = useState<readonly PublicQuestion[]>(quiz.questions);
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
  const [initAttempt, setInitAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [result, setResult] = useState<PartialResultSummary | null>(null);
  const [protectedResult, setProtectedResult] = useState<ProtectedResultResponse | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(true);
  const [comparisonConsent, setComparisonConsent] = useState(false);

  // Distinct error channels
  const [validationError, setValidationError] = useState<string | null>(null);
  const [systemError, setSystemError] = useState<string | null>(null);

  // Double-click lock & timing refs
  const saveLockRef = useRef<boolean>(false);
  const sessionInitPromiseRef = useRef<Promise<{
    session: ActiveSession;
    questions?: PublicQuestion[];
  }> | null>(null);
  const questionStartTimeRef = useRef<number>(0);
  const cardRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Initialize session if not provided by server
  useEffect(() => {
    if (session || (initialInviteCode && !comparisonConsent)) {
      return;
    }

    let isMounted = true;

    async function initSession() {
      try {
        sessionInitPromiseRef.current ??= fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizSlug: quiz.slug,
            locale,
            market,
            referralCode: initialReferralCode,
            inviteCode: initialInviteCode,
            comparisonConsent,
          }),
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error(dict.quizRunner.initError);
          }

          const data = (await response.json()) as {
            session: ActiveSession;
            questions?: PublicQuestion[];
          };
          return data;
        });

        const data = await sessionInitPromiseRef.current;
        const activeSession = data.session;
        if (isMounted) {
          setSession(activeSession);
          const currentQs =
            data.questions && data.questions.length > 0 ? data.questions : questions;
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          }
          if (activeSession.currentPosition > 1) {
            setCurrentIndex(Math.min(activeSession.currentPosition - 1, currentQs.length - 1));
          }
          if (activeSession.answers) {
            setAnswers(activeSession.answers);
          }
          setIsInitializing(false);
        }
      } catch (err: unknown) {
        sessionInitPromiseRef.current = null;
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
    locale,
    market,
    session,
    questions,
    initialReferralCode,
    initialInviteCode,
    comparisonConsent,
    dict.quizRunner.initError,
    initAttempt,
  ]);

  // Reset timer on question change
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    if (!isInitializing && session) headingRef.current?.focus({ preventScroll: true });
  }, [currentIndex, isInitializing, session]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasSelectedAnswer =
    Boolean(currentAnswer?.optionId) ||
    (typeof currentAnswer?.numericValue === "number" && currentAnswer.numericValue > 0);

  const totalQuestions = questions.length;
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
          const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          cardRef.current?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
          });
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
      window.history.replaceState(
        null,
        "",
        `/${locale}/quizzes/${quiz.slug}/result?session=${encodeURIComponent(activeSession.id)}`,
      );

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
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        cardRef.current?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  };

  // 1. Initial loading state
  if (initialInviteCode && !session && !comparisonConsent) {
    const consentCopy = dict.coupleInviteStart;
    return (
      <main className="result-preview-shell">
        <section className="result-preview-card space-y-4">
          <h1>{consentCopy[0]}</h1>
          <p>{consentCopy[1]}</p>
          <Button onClick={() => setComparisonConsent(true)}>{consentCopy[2]}</Button>
          <Link href={`/${safeLocale}/quizzes/coupledna`}>{dict.common.back}</Link>
        </section>
      </main>
    );
  }
  if (isInitializing) {
    return (
      <main className="quiz-runner quiz-runner--loading flex flex-col items-center justify-center p-12 min-h-screen">
        <Loader2 className="animate-spin text-stone-700" size={32} aria-hidden="true" />
        <p className="mt-4 text-sm text-stone-600 font-medium">{dict.common.loading}</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="quiz-runner quiz-runner--loading">
        <h1>{dict.common.error}</h1>
        <p role="alert">{systemError ?? dict.quizRunner.initError}</p>
        <Button
          type="button"
          onClick={() => {
            setSystemError(null);
            setIsInitializing(true);
            setInitAttempt((attempt) => attempt + 1);
          }}
        >
          {dict.common.retry}
        </Button>
        <Link href={`/${locale}/quizzes/${quiz.slug}`}>{dict.common.back}</Link>
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
          couple={protectedResult?.couple}
          includedQuizzes={protectedResult?.includedQuizzes}
          locale={locale}
        />
      </main>
    );
  }

  // 3. Question Runner screen
  const questionKicker = `${dict.common.question.toUpperCase()} ${String(currentIndex + 1).padStart(2, "0")}`;
  const activeError = validationError || systemError;

  const memoryCue = currentQuestion?.memoryCue;
  if (memoryCue && session && !session.memorySeen?.includes(memoryCue.id)) {
    return (
      <MemoryObservation
        key={memoryCue.id}
        sessionId={session.id}
        cueId={memoryCue.id}
        text={memoryCue.text}
        locale={safeLocale}
        onComplete={(memorySeen) => {
          setSession((previous) => (previous ? { ...previous, memorySeen } : previous));
          questionStartTimeRef.current = Date.now();
        }}
      />
    );
  }

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

        <Link
          href={`/${locale}/quizzes/${quiz.slug}`}
          className="quiz-runner__wordmark"
          aria-label={`${dict.common.back} — ${dict.quizzes[quiz.slug]?.name ?? "MEQYRO"}`}
        >
          MEQYRO
        </Link>

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
        <section
          className={`quiz-question-card ${currentQuestion.kind === "VISUAL_CHOICE" ? "quiz-question-card--visual" : ""}`}
          aria-labelledby="quiz-question-heading"
        >
          <div className="quiz-question-meta">
            <span className="quiz-question-kicker">{questionKicker}</span>
            {currentQuestion.clue ? (
              <span className="quiz-question-clue">{currentQuestion.clue}</span>
            ) : null}
          </div>

          <h1
            id="quiz-question-heading"
            className="quiz-question-title"
            ref={headingRef}
            tabIndex={-1}
          >
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
              key={currentQuestion.id}
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
              disabled={!hasSelectedAnswer || isSaving || isCompleting}
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
