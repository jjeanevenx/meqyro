export interface ExperimentVariant {
  id: string;
  weight: number; // Percentage (e.g. 50)
  payload?: Record<string, unknown>;
}

export interface ExperimentDefinition {
  key: string;
  variants: ExperimentVariant[];
  active: boolean;
}

export interface ResolvedVariant {
  experimentKey: string;
  variantId: string;
  payload?: Record<string, unknown>;
}
