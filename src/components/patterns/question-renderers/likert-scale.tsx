"use client";

type LikertScaleProps = {
  selectedValue?: number;
  onSelect: (value: number) => void;
  locale?: string;
  disabled?: boolean;
};

const labelsByLocale: Record<string, [string, string, string, string, string]> = {
  pt: [
    "Discordo totalmente",
    "Discordo",
    "Neutro",
    "Concordo",
    "Concordo totalmente",
  ],
  en: [
    "Strongly disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly agree",
  ],
  es: [
    "Totalmente en desacuerdo",
    "En desacuerdo",
    "Neutral",
    "De acuerdo",
    "Totalmente de acuerdo",
  ],
  fr: [
    "Pas du tout d'accord",
    "Pas d'accord",
    "Neutre",
    "D'accord",
    "Tout à fait d'accord",
  ],
};

export function LikertScaleRenderer({
  selectedValue,
  onSelect,
  locale = "pt",
  disabled = false,
}: LikertScaleProps) {
  const labels = labelsByLocale[locale] ?? labelsByLocale.pt;

  return (
    <div
      className="likert-group"
      role="radiogroup"
      aria-label="Escala de concordância"
    >
      {[1, 2, 3, 4, 5].map((val, idx) => {
        const isSelected = selectedValue === val;
        const labelText = labels[idx];

        return (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            className={`likert-card ${isSelected ? "likert-card--selected" : ""}`}
            onClick={() => onSelect(val)}
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
