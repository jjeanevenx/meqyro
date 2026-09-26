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
  const [session, setSession] = useState<ActiveSession | null>(initialSession);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialSession && initialSession.currentPosition > 1) {
      return Math.min(initialSession.currentPosition - 1, quiz.questions.length - 1);
    }
    return 0;
  });

  const [answers, setAnswers] = useState<Record<string, { optionId?: string; numericValue?: number }>>(
    () => initialSession?.answers ?? {},
  );

  const [isInitializing, setIsInitializing] = useState(!initialSession);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [result, setResult] = useState<PartialResultSummary | null>(null);
  const [protectedResult, setProtectedResult] = useState<ProtectedResultResponse | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const questionStartTimeRef = useRef<number>(0);

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
          throw new Error("Não foi possível iniciar a sessão.");
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
          setError(err instanceof Error ? err.message : "Erro ao iniciar o desafio.");
          setIsInitializing(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [quiz.slug, quiz.questions.length, locale, market, session, initialReferralCode, initialInviteCode]);

  // Reset timer on question change
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  const currentQuestion = quiz.questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasSelectedAnswer =
    Boolean(currentAnswer?.optionId) || (currentAnswer?.numericValue !== undefined && currentAnswer.numericValue > 0);

  const totalQuestions = quiz.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { optionId },
    }));
    setError(null);
  };

  const handleSelectValue = (numericValue: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { numericValue },
    }));
    setError(null);
  };

  const handleNext = async () => {
    if (!session || !currentQuestion || !hasSelectedAnswer) return;

    const durationMs =
      questionStartTimeRef.current > 0 ? Date.now() - questionStartTimeRef.current : 0;
    const isLastQuestion = currentIndex >= totalQuestions - 1;
    const nextPosition = isLastQuestion ? currentIndex + 1 : currentIndex + 2;

    setIsSaving(true);
    setError(null);

    try {
      // 1. Save answer to server
      const saveResponse = await fetch(`/api/sessions/${session.id}/answers`, {
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
        throw new Error("Erro ao salvar sua resposta. Tente novamente.");
      }

      if (!isLastQuestion) {
        setCurrentIndex((prev) => prev + 1);
        setIsSaving(false);
        return;
      }

      // 2. Complete quiz on server
      setIsCompleting(true);
      const completeResponse = await fetch(`/api/sessions/${session.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.error ?? "Erro ao calcular seu resultado.");
      }

      const completeData = await completeResponse.json();
      setResult(completeData.result);

      // Also fetch protected result & paywall details from server
      try {
        const protectedRes = await fetch(
          `/api/sessions/${session.id}/result?locale=${locale}&market=${market}`,
        );
        if (protectedRes.ok) {
          const protData = await protectedRes.json();
          setProtectedResult(protData.result);
        }
      } catch {
        // Continue with standard result if network error
      }

      setIsCompleting(false);
      setIsSaving(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao avançar.");
      setIsSaving(false);
      setIsCompleting(false);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setError(null);
    }
  };

  // 1. Initial loading state
  if (isInitializing) {
    return (
      <main className="quiz-runner quiz-runner--loading">
        <Loader2 className="animate-spin" size={32} />
        <p>Preparando seu desafio…</p>
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
  return (
    <main className="quiz-runner">
      {/* Top Header */}
      <header className="quiz-runner__header">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIndex === 0 || isSaving || isCompleting}
          className="quiz-runner__nav-btn"
          aria-label="Voltar para a questão anterior"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>

        <span className="quiz-runner__wordmark">MEQYRO</span>

        <span className="quiz-runner__counter">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </header>

      {/* Progress */}
      <div className="quiz-runner__progress-wrapper">
        <ProgressBar
          value={progressPercent}
          label={`Progresso: ${currentIndex + 1} de ${totalQuestions}`}
        />
      </div>

      {/* Question Content */}
      {currentQuestion ? (
        <section className="quiz-question-card">
          <div className="quiz-question-meta">
            <span className="quiz-question-kicker">
              QUESTÃO {String(currentIndex + 1).padStart(2, "0")}
            </span>
            {currentQuestion.clue ? (
              <span className="quiz-question-clue">{currentQuestion.clue}</span>
            ) : null}
          </div>

          <h1 className="quiz-question-title">{currentQuestion.prompt}</h1>

          {error ? (
            <div className="quiz-error-banner" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
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
              disabled={!hasSelectedAnswer || isSaving || isCompleting}
              onClick={handleNext}
              className="quiz-runner__submit-btn"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Calculando resultado…</span>
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Salvando…</span>
                </>
              ) : (
                <>
                  <span>{currentIndex >= totalQuestions - 1 ? "Finalizar desafio" : "Continuar"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </footer>
        </section>
      ) : null}
    </main>
  );
}
