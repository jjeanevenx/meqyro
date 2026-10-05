"use client";

import type { KeyboardEvent } from "react";
import type {
  PublicOption,
  VisualElement,
  VisualScene,
  VisualStimulus,
} from "@/features/quiz-engine/contracts";

type VisualChoiceProps = {
  stimulus: VisualStimulus;
  options: readonly PublicOption[];
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
};

function polygonPoints(sides: number, radius = 27, cx = 50, cy = 50) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / sides;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(" ");
}

function Shape({ element }: { element: VisualElement }) {
  const x = element.x ?? 50;
  const y = element.y ?? 50;
  const size = element.size ?? 54;
  const scale = size / 54;
  const transform = `translate(${x} ${y}) rotate(${element.rotation ?? 0}) scale(${element.flipX ? -scale : scale} ${element.flipY ? -scale : scale}) translate(-50 -50)`;
  const shared = {
    fill: element.filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  let graphic;
  switch (element.shape) {
    case "circle":
      graphic = <circle cx="50" cy="50" r="27" {...shared} />;
      break;
    case "dot":
      graphic = <circle cx="50" cy="50" r="9" fill="currentColor" />;
      break;
    case "ring":
      graphic = <circle cx="50" cy="50" r="19" {...shared} />;
      break;
    case "arrow":
      graphic = (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 78V22" />
          <path d="m32 40 18-18 18 18" />
        </g>
      );
      break;
    case "square":
      graphic = <rect x="23" y="23" width="54" height="54" rx="2" {...shared} />;
      break;
    case "diamond":
      graphic = <polygon points="50,20 80,50 50,80 20,50" {...shared} />;
      break;
    default: {
      const sides =
        element.shape === "triangle"
          ? 3
          : element.shape === "pentagon"
            ? 5
            : element.shape === "hexagon"
              ? 6
              : 8;
      graphic = <polygon points={polygonPoints(sides)} {...shared} />;
    }
  }

  const markerPosition = {
    top: [50, 12],
    bottom: [50, 88],
    left: [12, 50],
    right: [88, 50],
  } as const;
  const marker = element.marker ? markerPosition[element.marker] : null;

  return (
    <g transform={transform} opacity={element.opacity ?? 1}>
      {graphic}
      {marker ? (
        <circle
          cx={marker[0]}
          cy={marker[1]}
          r="5"
          fill="var(--mint-strong, #10b981)"
          stroke="white"
          strokeWidth="2"
        />
      ) : null}
    </g>
  );
}

export function VisualSceneSvg({
  scene,
  className = "",
  viewBox = "0 0 100 100",
}: {
  scene: VisualScene;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {scene.elements.map((element, index) => (
        <Shape key={`${element.shape}-${index}`} element={element} />
      ))}
    </svg>
  );
}

function MissingCell() {
  return (
    <span className="visual-missing" aria-hidden="true">
      ?
    </span>
  );
}

export function VisualStimulusView({ stimulus }: { stimulus: VisualStimulus }) {
  if (stimulus.kind === "sequence") {
    return (
      <div className="visual-stimulus visual-sequence" role="img" aria-label="Visual sequence">
        {stimulus.items.map((scene, index) => (
          <div className="visual-sequence__step" key={index}>
            <div className={`visual-cell ${scene ? "" : "visual-cell--missing"}`}>
              {scene ? <VisualSceneSvg scene={scene} /> : <MissingCell />}
            </div>
            {index < stimulus.items.length - 1 ? (
              <span className="visual-sequence__connector" aria-hidden="true">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  if (stimulus.kind === "matrix") {
    const columns = stimulus.rows[0]?.length ?? 1;
    return (
      <div
        className="visual-stimulus visual-matrix"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        role="img"
        aria-label="Visual matrix with one missing cell"
      >
        {stimulus.rows.flatMap((row, rowIndex) =>
          row.map((scene, columnIndex) => (
            <div
              className={`visual-cell visual-matrix__cell ${scene ? "" : "visual-cell--missing"}`}
              key={`${rowIndex}-${columnIndex}`}
            >
              {scene ? <VisualSceneSvg scene={scene} /> : <MissingCell />}
            </div>
          )),
        )}
      </div>
    );
  }

  return (
    <div className="visual-stimulus visual-group" role="img" aria-label="Group of figures">
      <VisualSceneSvg scene={stimulus.scene} viewBox="0 35 100 30" />
    </div>
  );
}

export function VisualChoiceRenderer({
  stimulus,
  options,
  selectedOptionId,
  onSelect,
  disabled = false,
}: VisualChoiceProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled) return;
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (direction) {
      event.preventDefault();
      const nextIndex = (index + direction + options.length) % options.length;
      onSelect(options[nextIndex].id);
      document.getElementById(`visual-option-${options[nextIndex].id}`)?.focus();
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onSelect(options[index].id);
    }
  };

  return (
    <div className="visual-question">
      <VisualStimulusView stimulus={stimulus} />
      <div className="visual-answer-grid" role="radiogroup" aria-labelledby="quiz-question-heading">
        {options.map((option, index) => {
          const selected = selectedOptionId === option.id;
          return (
            <button
              id={`visual-option-${option.id}`}
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.label}
              tabIndex={selected || (!selectedOptionId && index === 0) ? 0 : -1}
              disabled={disabled}
              className={`visual-option ${selected ? "visual-option--selected" : ""}`}
              onClick={() => onSelect(option.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span className="visual-option__letter" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              {option.visual ? (
                <VisualSceneSvg scene={option.visual} className="visual-option__figure" />
              ) : null}
              <span className="sr-only">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
