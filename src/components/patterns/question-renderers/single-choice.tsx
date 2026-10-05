"use client";

import type { KeyboardEvent } from "react";
import type { PublicOption } from "@/features/quiz-engine/contracts";

export type SingleChoiceProps = {
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
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      onSelect(options[nextIndex].id);
      const nextEl = document.getElementById(`choice-option-${options[nextIndex].id}`);
      nextEl?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      onSelect(options[prevIndex].id);
      const prevEl = document.getElementById(`choice-option-${options[prevIndex].id}`);
      prevEl?.focus();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onSelect(options[index].id);
    }
  };

  return (
    <div className="single-choice-group" role="radiogroup" aria-labelledby="quiz-question-heading">
      {options.map((option, index) => {
        const isSelected = selectedOptionId === option.id;
        const letter = String.fromCharCode(65 + index);
        const isFocusable = isSelected || (!selectedOptionId && index === 0);

        return (
          <button
            key={option.id}
            id={`choice-option-${option.id}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isFocusable ? 0 : -1}
            disabled={disabled}
            className={`choice-card ${isSelected ? "choice-card--selected" : ""}`}
            onClick={() => onSelect(option.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
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

export const SingleChoiceQuestion = SingleChoiceRenderer;
