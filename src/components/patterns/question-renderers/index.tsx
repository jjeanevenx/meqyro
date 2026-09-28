"use client";

import type { PublicQuestion } from "@/features/quiz-engine/contracts";
import { SingleChoiceRenderer, SingleChoiceQuestion } from "./single-choice";
import { LikertScaleRenderer, LikertQuestion } from "./likert-scale";
import { VisualChoiceRenderer } from "./visual-choice";

export { SingleChoiceRenderer, SingleChoiceQuestion, LikertScaleRenderer, LikertQuestion };

export type QuestionRendererProps = {
  question: PublicQuestion;
  selectedOptionId?: string;
  selectedValue?: number;
  locale?: string;
  onSelectOption: (optionId: string) => void;
  onSelectValue: (value: number) => void;
  disabled?: boolean;
};

export function QuestionRenderer({
  question,
  selectedOptionId,
  selectedValue,
  locale = "pt",
  onSelectOption,
  onSelectValue,
  disabled = false,
}: QuestionRendererProps) {
  if (question.kind === "LIKERT") {
    return (
      <LikertScaleRenderer
        selectedValue={selectedValue}
        onSelect={onSelectValue}
        locale={locale}
        disabled={disabled}
      />
    );
  }

  if (question.kind === "VISUAL_CHOICE") {
    if (!question.stimulus) throw new Error(`Missing visual stimulus for ${question.stableKey}`);
    return (
      <VisualChoiceRenderer
        stimulus={question.stimulus}
        options={question.options}
        selectedOptionId={selectedOptionId}
        onSelect={onSelectOption}
        disabled={disabled}
      />
    );
  }

  // Fallback to SINGLE_CHOICE for SINGLE_CHOICE and SCENARIO
  return (
    <SingleChoiceRenderer
      options={question.options}
      selectedOptionId={selectedOptionId}
      onSelect={onSelectOption}
      disabled={disabled}
    />
  );
}
