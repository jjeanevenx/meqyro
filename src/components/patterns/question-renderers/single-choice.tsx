"use client";

import type { PublicOption } from "@/features/quiz-engine/contracts";

type SingleChoiceProps = {
  options: readonly PublicOption[];
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
};

export function SingleChoiceRenderer({
  options,
  selectedOptionId,
  onSelect,
  disabled = false,
}: SingleChoiceProps) {
  return (
    <div
      className="single-choice-group"
      role="radiogroup"
      aria-label="Opções de resposta"
    >
      {options.map((option, index) => {
        const isSelected = selectedOptionId === option.id;
        const letter = String.fromCharCode(65 + index);

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            className={`choice-card ${isSelected ? "choice-card--selected" : ""}`}
            onClick={() => onSelect(option.id)}
          >
            <span className="choice-card__indicator" aria-hidden="true">
              {letter}
            </span>
            <span className="choice-card__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
