import { experiences } from "@/content/experiences";

// Restrict new sales only. Historical quizzes and purchased entitlements remain intact.
export const commercialQuizSlugs = ["brainrank", "moneydna", "coupledna"] as const;
export const commercialProductCodes = [
  "BRAINRANK",
  "MONEYDNA",
  "COUPLEDNA",
  "COUPLEDNA_INVITE",
] as const;

export function isCommercialProduct(code: string): boolean {
  return commercialProductCodes.some((product) => product === code);
}

export const commercialExperiences = experiences.filter((experience) =>
  commercialQuizSlugs.some((slug) => slug === experience.slug),
);
