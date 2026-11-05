import type { BrainRankQuestionDef } from "./brainrank";
import { localized } from "./reviewed-likert";

/** Editorial clarifications within the unserved 1.3 draft, never applied to historical versions. */
export function clarifyReviewedBrainRank(q: BrainRankQuestionDef): BrainRankQuestionDef {
  if (q.stableKey === "BR_PRB_02")
    return {
      ...q,
      options: q.options.map((o) =>
        o.isCorrect
          ? {
              ...o,
              label: localized([
                "Encher 5 L e transferir 3 L ao menor; esvaziar o menor e passar os 2 L restantes para ele; encher o maior de novo e completar o menor com 1 L, deixando 4 L no maior.",
                "Fill the 5 L bucket and pour 3 L into the smaller one; empty the smaller one and transfer the remaining 2 L into it; refill the larger bucket and top up the smaller with 1 L, leaving 4 L in the larger.",
                "Llenar el de 5 L y pasar 3 L al pequeño; vaciar el pequeño y pasarle los 2 L restantes; volver a llenar el grande y completar el pequeño con 1 L, dejando 4 L en el grande.",
                "Remplir le seau de 5 L et verser 3 L dans le petit ; vider le petit et y transférer les 2 L restants ; remplir à nouveau le grand et compléter le petit avec 1 L, en laissant 4 L dans le grand.",
              ]),
            }
          : o,
      ),
    };
  if (q.stableKey === "BR_LOG_02")
    return {
      ...q,
      prompt: localized([
        "Considere uma regra sem exceções: se está chovendo agora, a pista está molhada agora. A pista não está molhada. Qual conclusão é necessária?",
        "Assume a rule without exceptions: if it is raining now, the track is wet now. The track is not wet. Which conclusion is necessary?",
        "Considera una regla sin excepciones: si está lloviendo ahora, la pista está mojada ahora. La pista no está mojada. ¿Qué conclusión es necesaria?",
        "Considérez une règle sans exception : s’il pleut maintenant, la piste est mouillée maintenant. La piste n’est pas mouillée. Quelle conclusion est nécessaire ?",
      ]),
      options: q.options.map((o) =>
        o.isCorrect
          ? {
              ...o,
              label: localized([
                "Não está chovendo agora.",
                "It is not raining now.",
                "No está lloviendo ahora.",
                "Il ne pleut pas maintenant.",
              ]),
            }
          : o,
      ),
    };
  if (q.stableKey === "BR_NUM_04")
    return {
      ...q,
      prompt: localized([
        "Em uma sequência, os inversos dos termos aumentam sempre pela mesma diferença. Os dois primeiros termos são 1/2 e 1/5. Qual é o quarto termo?",
        "In a sequence, the reciprocals of the terms increase by the same difference each time. The first two terms are 1/2 and 1/5. What is the fourth term?",
        "En una secuencia, los inversos de los términos aumentan siempre con la misma diferencia. Los dos primeros términos son 1/2 y 1/5. ¿Cuál es el cuarto término?",
        "Dans une suite, les inverses des termes augmentent toujours du même écart. Les deux premiers termes sont 1/2 et 1/5. Quel est le quatrième terme ?",
      ]),
    };
  if (q.stableKey === "BR_PAT_02")
    return {
      ...q,
      prompt: localized([
        "Qual figura vem a seguir? Observe as posições ímpares e pares separadamente.",
        "Which figure comes next? Consider the odd and even positions separately.",
        "¿Qué figura viene a continuación? Observa por separado las posiciones impares y pares.",
        "Quelle figure vient ensuite ? Examinez séparément les positions impaires et paires.",
      ]),
    };
  if (q.stableKey === "BR_SPD_01")
    return {
      ...q,
      prompt: localized([
        "Qual figura aparece exatamente duas vezes no quadro?",
        "Which shape appears exactly twice in the display?",
        "¿Qué figura aparece exactamente dos veces en el cuadro?",
        "Quelle figure apparaît exactement deux fois dans le tableau ?",
      ]),
      options: q.options.map((o) =>
        o.stableKey === "D"
          ? { ...o, visual: { elements: [{ shape: "square", filled: true }] } }
          : o,
      ),
    };
  return q;
}
