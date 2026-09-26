import { createHash } from "node:crypto";
import type {
  ExperimentDefinition,
  ResolvedVariant,
} from "./contracts";

export function getExperimentBucket(experimentKey: string, subjectId: string): number {
  const hash = createHash("sha256")
    .update(`${experimentKey}:${subjectId}`)
    .digest("hex");
  // Take first 8 chars of hex, parse as integer, modulo 100
  const intVal = parseInt(hash.slice(0, 8), 16);
  return intVal % 100; // 0 - 99
}

export function resolveExperimentVariant(
  experiment: ExperimentDefinition,
  subjectId: string,
): ResolvedVariant {
  if (!experiment.active || !experiment.variants || experiment.variants.length === 0) {
    return {
      experimentKey: experiment.key,
      variantId: experiment.variants?.[0]?.id ?? "control",
    };
  }

  const bucket = getExperimentBucket(experiment.key, subjectId);

  let cumulativeWeight = 0;
  for (const variant of experiment.variants) {
    cumulativeWeight += variant.weight;
    if (bucket < cumulativeWeight) {
      return {
        experimentKey: experiment.key,
        variantId: variant.id,
        payload: variant.payload,
      };
    }
  }

  // Fallback to last variant
  const fallback = experiment.variants[experiment.variants.length - 1];
  return {
    experimentKey: experiment.key,
    variantId: fallback.id,
    payload: fallback.payload,
  };
}
