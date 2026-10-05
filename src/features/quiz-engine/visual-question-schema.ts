import {
  visualShapeKinds,
  type VisualElement,
  type VisualScene,
  type VisualStimulus,
} from "./contracts";

const shapeKinds = new Set<string>(visualShapeKinds);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isVisualElement(value: unknown): value is VisualElement {
  if (!isRecord(value) || typeof value.shape !== "string" || !shapeKinds.has(value.shape)) {
    return false;
  }
  return ["x", "y", "size", "rotation", "opacity"].every(
    (key) => value[key] === undefined || typeof value[key] === "number",
  );
}

export function isVisualScene(value: unknown): value is VisualScene {
  return (
    isRecord(value) &&
    Array.isArray(value.elements) &&
    value.elements.length > 0 &&
    value.elements.every(isVisualElement)
  );
}

export function isVisualStimulus(value: unknown): value is VisualStimulus {
  if (!isRecord(value)) return false;
  if (value.kind === "sequence") {
    return (
      Array.isArray(value.items) &&
      value.items.length >= 2 &&
      value.items.every((item) => item === null || isVisualScene(item))
    );
  }
  if (value.kind === "matrix") {
    if (!Array.isArray(value.rows) || value.rows.length < 2) return false;
    const width = Array.isArray(value.rows[0]) ? value.rows[0].length : 0;
    return (
      width >= 2 &&
      value.rows.every(
        (row) =>
          Array.isArray(row) &&
          row.length === width &&
          row.every((cell) => cell === null || isVisualScene(cell)),
      )
    );
  }
  return value.kind === "group" && isVisualScene(value.scene);
}

export function assertVisualQuestion(input: {
  stableKey: string;
  kind: string;
  stimulus?: unknown;
  options: readonly { visual?: unknown }[];
}) {
  if (input.kind !== "VISUAL_CHOICE") return;
  if (!isVisualStimulus(input.stimulus))
    throw new Error(`Invalid visual stimulus for ${input.stableKey}`);
  if (input.options.length < 2 || input.options.some((option) => !isVisualScene(option.visual))) {
    throw new Error(`Invalid visual options for ${input.stableKey}`);
  }
}
