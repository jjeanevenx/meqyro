"use client";

import type { KeyboardEvent } from "react";

export type LikertScaleProps = {
  selectedValue?: number;
  onSelect: (value: number) => void;
  locale?: string;
  disabled?: boolean;
};

const labelsByLocale: Record<string, [string, string, string, string, string]> = {
  pt: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
  en: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
  es: [
    "Totalmente en desacuerdo",
    "En desacuerdo",
    "Neutral",
    "De acuerdo",
    "Totalmente de acuerdo",
  ],
  fr: ["Pas du tout d'accord", "Pas d'accord", "Neutre", "D'accord", "Tout à fait d'accord"],
};

export function LikertScaleRenderer({
  selectedValue,
  onSelect,
  locale = "pt",
  disabled = false,
}: LikertScaleProps) {
  const labels = labelsByLocale[locale] ?? labelsByLocale.pt;
  const values = [1, 2, 3, 4, 5] as const;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % values.length;
      onSelect(values[nextIndex]);
      const nextEl = document.getElementById(`likert-option-${values[nextIndex]}`);
      nextEl?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + values.length) % values.length;
      onSelect(values[prevIndex]);
      const prevEl = document.getElementById(`likert-option-${values[prevIndex]}`);
      prevEl?.focus();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onSelect(values[index]);
    }
  };

  return (
    <div className="likert-group" role="radiogroup" aria-label="Escala de concordância">
      {values.map((val, idx) => {
        const isSelected = selectedValue === val;
        const labelText = labels[idx];
        const isFocusable = isSelected || (!selectedValue && idx === 0);

        return (
          <button
            key={val}
            id={`likert-option-${val}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isFocusable ? 0 : -1}
            disabled={disabled}
            className={`likert-card ${isSelected ? "likert-card--selected" : ""}`}
            onClick={() => onSelect(val)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            <span className="likert-card__number" aria-hidden="true">
              {val}
            </span>
            <span className="likert-card__label">{labelText}</span>
          </button>
        );
      })}
    </div>
  );
}

export const LikertQuestion = LikertScaleRenderer;
