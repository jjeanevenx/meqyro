"use client";

import type { PublicQuestion } from "@/features/quiz-engine/contracts";
import { SingleChoiceRenderer } from "./single-choice";
import { LikertScaleRenderer } from "./likert-scale";

export { SingleChoiceRenderer, LikertScaleRenderer };

type QuestionRendererProps = {
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

  // Fallback to SINGLE_CHOICE for SINGLE_CHOICE, VISUAL_CHOICE, SCENARIO
  return (
    <SingleChoiceRenderer
      options={question.options}
      selectedOptionId={selectedOptionId}
      onSelect={onSelectOption}
      disabled={disabled}
    />
  );
}
