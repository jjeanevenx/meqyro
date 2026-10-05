import type { BrainRankDimension, BrainRankDifficulty } from "@/features/scoring/brainrank";
import type { QuestionKind, VisualScene, VisualStimulus } from "@/features/quiz-engine/contracts";

export type BrainRankQuestionDef = {
  stableKey: string;
  position: number;
  dimension: BrainRankDimension;
  difficulty: BrainRankDifficulty;
  kind?: QuestionKind;
  visualType?:
    | "VISUAL_PATTERN"
    | "VISUAL_SEQUENCE"
    | "SPATIAL"
    | "ROTATION"
    | "REFLECTION"
    | "SYMMETRY"
    | "MATRIX"
    | "COUNTING"
    | "DIRECTION"
    | "MIXED";
  stimulus?: VisualStimulus;
  clue?: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  prompt: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  options: {
    stableKey: string;
    position: number;
    isCorrect: boolean;
    label: {
      pt: string;
      en: string;
      es: string;
      fr: string;
    };
    visual?: VisualScene;
  }[];
};

export const brainRankPool: readonly BrainRankQuestionDef[] = [
  // --- 1. PATTERN RECOGNITION (4 items) ---
  {
    stableKey: "BR_PAT_01",
    position: 1,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "EASY",
    prompt: {
      pt: "Qual número completa a sequência lógica?",
      en: "Which number completes the logical sequence?",
      es: "¿Qué número completa la secuencia lógica?",
      fr: "Quel nombre complète la suite logique ?",
    },
    clue: {
      pt: "2 · 6 · 12 · 20 · ?",
      en: "2 · 6 · 12 · 20 · ?",
      es: "2 · 6 · 12 · 20 · ?",
      fr: "2 · 6 · 12 · 20 · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "26", en: "26", es: "26", fr: "26" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "28", en: "28", es: "28", fr: "28" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "30", en: "30", es: "30", fr: "30" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "32", en: "32", es: "32", fr: "32" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_02",
    position: 2,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "MEDIUM",
    kind: "VISUAL_CHOICE",
    visualType: "ROTATION",
    prompt: {
      pt: "Qual figura vem a seguir?",
      en: "Which figure comes next?",
      es: "¿Qué figura viene a continuación?",
      fr: "Quelle figure vient ensuite ?",
    },
    stimulus: {
      kind: "sequence",
      items: [
        { elements: [{ shape: "arrow", rotation: 0 }] },
        { elements: [{ shape: "arrow", rotation: 45 }] },
        { elements: [{ shape: "arrow", rotation: -45 }] },
        { elements: [{ shape: "arrow", rotation: 90 }] },
        null,
      ],
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "Opção A", en: "Option A", es: "Opción A", fr: "Option A" },
        visual: { elements: [{ shape: "arrow", rotation: 180 }] },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "Opção B", en: "Option B", es: "Opción B", fr: "Option B" },
        visual: { elements: [{ shape: "arrow", rotation: -90 }] },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "Opção C", en: "Option C", es: "Opción C", fr: "Option C" },
        visual: { elements: [{ shape: "arrow", rotation: 135 }] },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "Opção D", en: "Option D", es: "Opción D", fr: "Option D" },
        visual: { elements: [{ shape: "arrow", rotation: 90 }] },
      },
    ],
  },
  {
    stableKey: "BR_PAT_03",
    position: 3,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "MEDIUM",
    kind: "VISUAL_CHOICE",
    visualType: "MATRIX",
    prompt: {
      pt: "Qual opção completa o espaço vazio?",
      en: "Which option completes the missing space?",
      es: "¿Qué opción completa el espacio vacío?",
      fr: "Quelle option complète l'espace vide ?",
    },
    stimulus: {
      kind: "matrix",
      rows: [
        [
          { elements: [{ shape: "triangle", filled: true }] },
          { elements: [{ shape: "triangle", filled: true }] },
          { elements: [{ shape: "circle", filled: true }] },
        ],
        [
          { elements: [{ shape: "circle", filled: true }] },
          { elements: [{ shape: "triangle", filled: true }] },
          { elements: [{ shape: "triangle", filled: true }] },
        ],
        [
          { elements: [{ shape: "triangle", filled: true }] },
          { elements: [{ shape: "circle", filled: true }] },
          null,
        ],
      ],
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: { pt: "Opção A", en: "Option A", es: "Opción A", fr: "Option A" },
        visual: { elements: [{ shape: "triangle", filled: true }] },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "Opção B", en: "Option B", es: "Opción B", fr: "Option B" },
        visual: { elements: [{ shape: "circle", filled: true }] },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "Opção C", en: "Option C", es: "Opción C", fr: "Option C" },
        visual: { elements: [{ shape: "square", filled: true }] },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "Opção D", en: "Option D", es: "Opción D", fr: "Option D" },
        visual: { elements: [{ shape: "diamond", filled: true }] },
      },
    ],
  },
  {
    stableKey: "BR_PAT_04",
    position: 4,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "HARD",
    kind: "VISUAL_CHOICE",
    visualType: "MIXED",
    prompt: {
      pt: "Qual figura vem a seguir?",
      en: "Which figure comes next?",
      es: "¿Qué figura viene a continuación?",
      fr: "Quelle figure vient ensuite ?",
    },
    stimulus: {
      kind: "sequence",
      items: [
        { elements: [{ shape: "triangle", marker: "top" }] },
        { elements: [{ shape: "square", marker: "bottom" }] },
        { elements: [{ shape: "pentagon", marker: "top" }] },
        null,
      ],
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "Opção A", en: "Option A", es: "Opción A", fr: "Option A" },
        visual: { elements: [{ shape: "pentagon", marker: "bottom" }] },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "Opção B", en: "Option B", es: "Opción B", fr: "Option B" },
        visual: { elements: [{ shape: "hexagon", marker: "bottom" }] },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "Opção C", en: "Option C", es: "Opción C", fr: "Option C" },
        visual: { elements: [{ shape: "hexagon", marker: "top" }] },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "Opção D", en: "Option D", es: "Opción D", fr: "Option D" },
        visual: { elements: [{ shape: "octagon", marker: "bottom" }] },
      },
    ],
  },

  // --- 2. LOGICAL REASONING (4 items) ---
  {
    stableKey: "BR_LOG_01",
    position: 5,
    dimension: "LOGICAL_REASONING",
    difficulty: "EASY",
    prompt: {
      pt: "Se todo Nilo é Vero e nenhum Vero é Mero, qual conclusão é estritamente necessária?",
      en: "If all Nilos are Veros and no Vero is Mero, which conclusion is strictly necessary?",
      es: "Si todo Nilo es Vero y ningún Vero es Mero, ¿qué conclusión es estrictamente necesaria?",
      fr: "Si tout Nilo est Vero et aucun Vero n'est Mero, quelle conclusion est strictement nécessaire ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "Algum Nilo é Mero",
          en: "Some Nilo is Mero",
          es: "Algún Nilo es Mero",
          fr: "Certains Nilos sont Meros",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "Nenhum Nilo é Mero",
          en: "No Nilo is Mero",
          es: "Ningún Nilo es Mero",
          fr: "Aucun Nilo n'est Mero",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Todo Mero é Nilo",
          en: "All Meros are Nilos",
          es: "Todo Mero es Nilo",
          fr: "Tout Mero est Nilo",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Algum Vero não é Nilo",
          en: "Some Vero is not Nilo",
          es: "Algún Vero no es Nilo",
          fr: "Certains Veros ne sont pas Nilos",
        },
      },
    ],
  },
  {
    stableKey: "BR_LOG_02",
    position: 6,
    dimension: "LOGICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Se chove, a pista molha. A pista não está molhada. O que podemos deduzir?",
      en: "If it rains, the track gets wet. The track is not wet. What can we deduce?",
      es: "Si llueve, la pista se moja. La pista no está mojada. ¿Qué podemos deducir?",
      fr: "S'il pleut, la piste est mouillée. La piste n'est pas mouillée. Que peut-on déduire ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: { pt: "Não choveu", en: "It did not rain", es: "No llovió", fr: "Il n'a pas plu" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "Vai chover em breve",
          en: "It will rain soon",
          es: "Lloverá pronto",
          fr: "Il va bientôt pleuvoir",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "A pista secou rapidamente",
          en: "The track dried fast",
          es: "La pista se secó rápido",
          fr: "La piste a séché vite",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "A chuva foi fraca",
          en: "The rain was light",
          es: "La lluvia fue suave",
          fr: "La pluie était faible",
        },
      },
    ],
  },
  {
    stableKey: "BR_LOG_03",
    position: 7,
    dimension: "LOGICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Quatro caixas rotuladas: apenas uma diz a verdade. Caixa 1: 'O ouro está aqui'. Caixa 2: 'O ouro não está aqui'. Caixa 3: 'O ouro está na Caixa 2'. Onde está o ouro se Caixa 1 e 3 mentem?",
      en: "Four boxes labeled: only one tells the truth. Box 1: 'Gold is here'. Box 2: 'Gold is not here'. Box 3: 'Gold is in Box 2'. Where is the gold if Box 1 and 3 lie?",
      es: "Cuatro cajas con etiquetas: solo una dice la verdad. Caja 1: 'El oro está aquí'. Caja 2: 'El oro no está aquí'. Caja 3: 'El oro está en Caja 2'. ¿Dónde está el oro si Caja 1 y 3 mienten?",
      fr: "Quatre boîtes étiquetées : une seule dit la vérité. Boîte 1 : 'L'or est ici'. Boîte 2 : 'L'or n'est pas ici'. Boîte 3 : 'L'or est dans la boîte 2'. Où est l'or si 1 et 3 mentent ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "Na Caixa 1", en: "In Box 1", es: "En Caja 1", fr: "Dans la Boîte 1" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "Na Caixa 2", en: "In Box 2", es: "En Caja 2", fr: "Dans la Boîte 2" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "Na Caixa 4", en: "In Box 4", es: "En Caja 4", fr: "Dans la Boîte 4" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Impossível saber",
          en: "Cannot be determined",
          es: "Imposible saber",
          fr: "Indéterminé",
        },
      },
    ],
  },
  {
    stableKey: "BR_LOG_04",
    position: 8,
    dimension: "LOGICAL_REASONING",
    difficulty: "HARD",
    prompt: {
      pt: "A negação lógica estrita de 'Todas as manhãs são frias ou ensolaradas' é:",
      en: "The strict logical negation of 'All mornings are cold or sunny' is:",
      es: "La negación lógica estricta de 'Todas las mañanas son frías o soleadas' es:",
      fr: "La négation logique stricte de 'Toutes les matinées sont froides ou ensoleillées' est :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "Nenhuma manhã é fria e ensolarada",
          en: "No morning is cold and sunny",
          es: "Ninguna mañana es fría y soleada",
          fr: "Aucune matinée n'est froide et ensoleillée",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "Existe ao menos uma manhã que não é fria nem ensolarada",
          en: "There is at least one morning that is neither cold nor sunny",
          es: "Existe al menos una mañana que no es ni fría ni soleada",
          fr: "Il existe au moins une matinée qui n'est ni froide ni ensoleillée",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Todas as manhãs são quentes e chuvosas",
          en: "All mornings are warm and rainy",
          es: "Todas las mañanas son cálidas y lluviosas",
          fr: "Toutes les matinées sont chaudes et pluvieuses",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Algumas manhãs são frias e ensolaradas",
          en: "Some mornings are cold and sunny",
          es: "Algunas mañanas son frías y soleadas",
          fr: "Certaines matinées sont froides et ensoleillées",
        },
      },
    ],
  },

  // --- 3. NUMERICAL REASONING (4 items) ---
  {
    stableKey: "BR_NUM_01",
    position: 9,
    dimension: "NUMERICAL_REASONING",
    difficulty: "EASY",
    prompt: {
      pt: "Qual valor preenche a interrogação? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?",
      en: "Which value replaces the question mark? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?",
      es: "¿Qué valor sustituye la interrogación? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?",
      fr: "Quelle valeur remplace le point d'interrogation ? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "36", en: "36", es: "36", fr: "36" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "41", en: "41", es: "41", fr: "41" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "45", en: "45", es: "45", fr: "45" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "51", en: "51", es: "51", fr: "51" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_02",
    position: 10,
    dimension: "NUMERICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Um produto aumentou 20% e depois teve desconto de 20%. Em relação ao preço original, o valor final:",
      en: "A price increased by 20% and then received a 20% discount. Compared to the original price, the final value is:",
      es: "Un producto aumentó un 20% y luego tuvo un descuento del 20%. En relación al precio original, el valor final:",
      fr: "Un prix a augmenté de 20 % puis a bénéficié d'une remise de 20 %. Par rapport au prix initial, le prix final :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "É igual ao original",
          en: "Is equal to original",
          es: "Es igual al original",
          fr: "Est égal à l'original",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "É 4% menor", en: "Is 4% lower", es: "Es 4% menor", fr: "Est 4 % inférieur" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "É 2% maior", en: "Is 2% higher", es: "Es 2% mayor", fr: "Est 2 % supérieur" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "É 4% maior", en: "Is 4% higher", es: "Es 4% mayor", fr: "Est 4 % supérieur" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_03",
    position: 11,
    dimension: "NUMERICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Qual número completa a matriz? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]",
      en: "Which number completes the matrix? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]",
      es: "¿Qué número completa la matriz? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]",
      fr: "Quel nombre complète la matrice ? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]",
    },
    clue: {
      pt: "Observe a soma dos quadrados: x² + y²",
      en: "Observe sum of squares: x² + y²",
      es: "Observe la suma de cuadrados: x² + y²",
      fr: "Observez la somme des carrés : x² + y²",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "21", en: "21", es: "21", fr: "21" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "25", en: "25", es: "25", fr: "25" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "27", en: "27", es: "27", fr: "27" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "29", en: "29", es: "29", fr: "29" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_04",
    position: 12,
    dimension: "NUMERICAL_REASONING",
    difficulty: "HARD",
    prompt: {
      pt: "Em uma progressão harmônica de termos positivos, se x1 = 1/2 e x2 = 1/5, qual é o valor de x4?",
      en: "In a harmonic progression of positive terms, if x1 = 1/2 and x2 = 1/5, what is x4?",
      es: "En una progresión armónica de términos positivos, si x1 = 1/2 y x2 = 1/5, ¿cuál es x4?",
      fr: "Dans une progression harmonique de termes positifs, si x1 = 1/2 et x2 = 1/5, quelle est x4 ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "1/8", en: "1/8", es: "1/8", fr: "1/8" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "1/11", en: "1/11", es: "1/11", fr: "1/11" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "1/14", en: "1/14", es: "1/14", fr: "1/14" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "1/17", en: "1/17", es: "1/17", fr: "1/17" },
      },
    ],
  },

  // --- 4. ATTENTION (4 items) ---
  {
    stableKey: "BR_ATT_01",
    position: 13,
    dimension: "ATTENTION",
    difficulty: "EASY",
    prompt: {
      pt: "Qual palavra destoa do conjunto semântico?",
      en: "Which word does not belong to the semantic group?",
      es: "¿Qué palabra no pertenece al grupo semántico?",
      fr: "Quel mot n'appartient pas au groupe sémantique ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "Círculo", en: "Circle", es: "Círculo", fr: "Cercle" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "Quadrado", en: "Square", es: "Cuadrado", fr: "Carré" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "Azul", en: "Blue", es: "Azul", fr: "Bleu" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "Triângulo", en: "Triangle", es: "Triángulo", fr: "Triangle" },
      },
    ],
  },
  {
    stableKey: "BR_ATT_02",
    position: 14,
    dimension: "ATTENTION",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Quantas vezes a letra 'R' aparece no texto: 'RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS'?",
      en: "How many times does 'R' appear in: 'RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS'?",
      es: "¿Cuántas veces aparece la letra 'R' en: 'RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS'?",
      fr: "Combien de fois la lettre 'R' apparaît-elle dans : 'RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS' ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "6", en: "6", es: "6", fr: "6" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "7", en: "7", es: "7", fr: "7" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "12", en: "12", es: "12", fr: "12" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "9", en: "9", es: "9", fr: "9" },
      },
    ],
  },
  {
    stableKey: "BR_ATT_03",
    position: 15,
    dimension: "ATTENTION",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Identifique o par que NÃO é exatamente idêntico:",
      en: "Identify the pair that is NOT an exact match:",
      es: "Identifique el par que NO es exactamente idéntico:",
      fr: "Identifiez la paire qui N'EST PAS exactement identique :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "KX-94817 / KX-94817",
          en: "KX-94817 / KX-94817",
          es: "KX-94817 / KX-94817",
          fr: "KX-94817 / KX-94817",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "MW-38291 / MW-38219",
          en: "MW-38291 / MW-38219",
          es: "MW-38291 / MW-38219",
          fr: "MW-38291 / MW-38219",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "PL-77340 / PL-77340",
          en: "PL-77340 / PL-77340",
          es: "PL-77340 / PL-77340",
          fr: "PL-77340 / PL-77340",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "QR-10526 / QR-10526",
          en: "QR-10526 / QR-10526",
          es: "QR-10526 / QR-10526",
          fr: "QR-10526 / QR-10526",
        },
      },
    ],
  },
  {
    stableKey: "BR_ATT_04",
    position: 16,
    dimension: "ATTENTION",
    difficulty: "HARD",
    prompt: {
      pt: "Qual sequência contém uma quebra na regra de alternância Maiúscula/Minúscula?",
      en: "Which sequence contains a break in the Upper/Lower case alternating rule?",
      es: "¿Qué secuencia contiene una ruptura en la regla de mayúsculas/minúsculas alternadas?",
      fr: "Quelle séquence présente une rupture dans l'alternance majuscule/minuscule ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "a B c D e F g",
          en: "a B c D e F g",
          es: "a B c D e F g",
          fr: "a B c D e F g",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "Z y X w V u T",
          en: "Z y X w V u T",
          es: "Z y X w V u T",
          fr: "Z y X w V u T",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: {
          pt: "M n P q R S t",
          en: "M n P q R S t",
          es: "M n P q R S t",
          fr: "M n P q R S t",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "j K l M n O p",
          en: "j K l M n O p",
          es: "j K l M n O p",
          fr: "j K l M n O p",
        },
      },
    ],
  },

  // --- 5. PROBLEM SOLVING (4 items) ---
  {
    stableKey: "BR_PRB_01",
    position: 17,
    dimension: "PROBLEM_SOLVING",
    difficulty: "EASY",
    prompt: {
      pt: "Três lâmpadas no teto são controladas por 3 interruptores na sala ao lado. Você pode entrar na sala das lâmpadas apenas uma vez. Como identificar qual interruptor controla qual lâmpada?",
      en: "Three lamps in a room are controlled by 3 switches outside. You can enter the lamp room only once. How do you identify which switch controls which lamp?",
      es: "Tres lámparas son controladas por 3 interruptores fuera. Puedes entrar a la habitación solo una vez. ¿Cómo identificar qué interruptor corresponde a cada lámpara?",
      fr: "Trois lampes sont contrôlées par 3 interrupteurs extérieurs. Vous ne pouvez entrer dans la pièce qu'une fois. Comment identifier chaque interrupteur ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: {
          pt: "Ligar um por 10 min, desligar e ligar o segundo (calor e luz)",
          en: "Turn one on for 10 min, turn off and turn on the second (heat and light)",
          es: "Encender uno 10 min, apagarlo y encender el segundo (calor y luz)",
          fr: "En allumer un 10 min, l'éteindre et allumer le second (chaleur et lumière)",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "Ligar os três ao mesmo tempo",
          en: "Turn all three on together",
          es: "Encender los tres a la vez",
          fr: "Allumer les trois en même temps",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Alternar rapidamente dois interruptores",
          en: "Toggle two switches rapidly",
          es: "Alternar dos interruptores rápido",
          fr: "Basculer rapidement deux interrupteurs",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "É matematicamente impossível",
          en: "It is mathematically impossible",
          es: "Es matemáticamente imposible",
          fr: "C'est mathématiquement impossible",
        },
      },
    ],
  },
  {
    stableKey: "BR_PRB_02",
    position: 18,
    dimension: "PROBLEM_SOLVING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Você tem dois baldes sem marcação: 5 litros e 3 litros. Como medir exatamente 4 litros de água usando uma torneira?",
      en: "You have two unmarked buckets: 5L and 3L. How can you measure exactly 4 liters using a tap?",
      es: "Tienes dos cubos sin marcas: 5L y 3L. ¿Cómo medir exactamente 4 litros usando un grifo?",
      fr: "Vous avez deux seaux non gradués : 5L et 3L. Comment mesurer exactement 4 litres avec un robinet ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: {
          pt: "Encher o de 5L, despejar 3L no balde menor, esvaziar o menor, transferir os 2L restantes e encher 5L novamente até completar o menor",
          en: "Fill 5L, pour into 3L, empty 3L, transfer remaining 2L, fill 5L and top off 3L",
          es: "Llenar 5L, verter en 3L, vaciar 3L, transferir los 2L restantes, llenar 5L y completar 3L",
          fr: "Remplir 5L, verser dans 3L, vider 3L, transférer 2L restants, remplir 5L et compléter 3L",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "Encher o de 3L até a metade duas vezes",
          en: "Fill 3L halfway twice",
          es: "Llenar 3L a la mitad dos veces",
          fr: "Remplir 3L à moitié deux fois",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Encher 5L e despejar aproximadamente 1L fora",
          en: "Fill 5L and pour roughly 1L out",
          es: "Llenar 5L y tirar aprox. 1L",
          fr: "Remplir 5L et vider environ 1L",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Não é possível obter 4 litros exatos",
          en: "Cannot obtain exact 4L",
          es: "No es posible obtener 4L exactos",
          fr: "Impossible d'obtenir 4L exacts",
        },
      },
    ],
  },
  {
    stableKey: "BR_PRB_03",
    position: 19,
    dimension: "PROBLEM_SOLVING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Três pessoas precisam atravessar uma ponte à noite com uma única tocha. Ela suporta no máximo 2 pessoas. Tempos individuais: 1 min, 2 min e 5 min. O grupo viaja na velocidade do mais lento. Menor tempo total:",
      en: "Three people cross a bridge at night with one torch (max 2 people). Times: 1 min, 2 min, 5 min. Pair walks at slower pace. Minimum total time:",
      es: "Tres personas cruzan un puente de noche con una antorcha (máx 2). Tiempos: 1 min, 2 min, 5 min. Pareja va al ritmo del más lento. Tiempo mínimo total:",
      fr: "Trois personnes traversent un pont de nuit avec une torche (max 2). Temps : 1 min, 2 min, 5 min. Rythme du plus lent. Temps minimal :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "7 minutos", en: "7 minutes", es: "7 minutos", fr: "7 minutes" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "8 minutos", en: "8 minutes", es: "8 minutos", fr: "8 minutes" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "9 minutos", en: "9 minutes", es: "9 minutos", fr: "9 minutes" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "10 minutos", en: "10 minutes", es: "10 minutos", fr: "10 minutes" },
      },
    ],
  },
  {
    stableKey: "BR_PRB_04",
    position: 20,
    dimension: "PROBLEM_SOLVING",
    difficulty: "HARD",
    prompt: {
      pt: "Você tem 9 moedas idênticas na aparência, mas uma é ligeiramente mais pesada. Usando uma balança de dois pratos, qual é o número MÍNIMO de pesagens garantidas para encontrar a moeda falsa?",
      en: "You have 9 identical-looking coins, one slightly heavier. Using a balance scale, what is the MINIMUM number of weighings guaranteed to find the fake coin?",
      es: "Tienes 9 monedas idénticas en apariencia, una ligeramente más pesada. Con balanza de dos platos, ¿cuál es el MÍNIMO de pesadas seguras?",
      fr: "Vous avez 9 pièces identiques en apparence, l'une est plus lourde. Avec une balance à plateaux, quel est le nombre MINIMUM de pesées garanties ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "1 pesagem", en: "1 weighing", es: "1 pesada", fr: "1 pesée" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "2 pesagens", en: "2 weighings", es: "2 pesadas", fr: "2 pesées" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "3 pesagens", en: "3 weighings", es: "3 pesadas", fr: "3 pesées" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "4 pesagens", en: "4 weighings", es: "4 pesadas", fr: "4 pesées" },
      },
    ],
  },

  // --- 6. SPEED (4 items) ---
  {
    stableKey: "BR_SPD_01",
    position: 21,
    dimension: "SPEED",
    difficulty: "EASY",
    kind: "VISUAL_CHOICE",
    visualType: "COUNTING",
    prompt: {
      pt: "Qual figura aparece menos vezes?",
      en: "Which figure appears the fewest times?",
      es: "¿Qué figura aparece menos veces?",
      fr: "Quelle figure apparaît le moins souvent ?",
    },
    stimulus: {
      kind: "group",
      scene: {
        elements: [
          { shape: "diamond", x: 8, y: 50, size: 8, filled: true },
          { shape: "triangle", x: 18.5, y: 50, size: 8, filled: true },
          { shape: "circle", x: 29, y: 50, size: 8, filled: true },
          { shape: "diamond", x: 39.5, y: 50, size: 8, filled: true },
          { shape: "diamond", x: 50, y: 50, size: 8, filled: true },
          { shape: "circle", x: 60.5, y: 50, size: 8, filled: true },
          { shape: "triangle", x: 71, y: 50, size: 8, filled: true },
          { shape: "diamond", x: 81.5, y: 50, size: 8, filled: true },
          { shape: "circle", x: 92, y: 50, size: 8, filled: true },
        ],
      },
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "Opção A", en: "Option A", es: "Opción A", fr: "Option A" },
        visual: { elements: [{ shape: "diamond", filled: true }] },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "Opção B", en: "Option B", es: "Opción B", fr: "Option B" },
        visual: { elements: [{ shape: "triangle", filled: true }] },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "Opção C", en: "Option C", es: "Opción C", fr: "Option C" },
        visual: { elements: [{ shape: "circle", filled: true }] },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "Todos iguais", en: "All equal", es: "Todos iguales", fr: "Tous égaux" },
        visual: {
          elements: [
            { shape: "diamond", x: 25, y: 50, size: 18, filled: true },
            { shape: "triangle", x: 50, y: 50, size: 18, filled: true },
            { shape: "circle", x: 75, y: 50, size: 18, filled: true },
          ],
        },
      },
    ],
  },
  {
    stableKey: "BR_SPD_02",
    position: 22,
    dimension: "SPEED",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Resolva mentalmente o mais rápido possível: (15 × 4) - (12 × 3) + 7 = ?",
      en: "Solve mentally as fast as possible: (15 × 4) - (12 × 3) + 7 = ?",
      es: "Resuelva mentalmente lo más rápido posible: (15 × 4) - (12 × 3) + 7 = ?",
      fr: "Résolvez mentalement le plus vite possible : (15 × 4) - (12 × 3) + 7 = ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "29", en: "29", es: "29", fr: "29" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "31", en: "31", es: "31", fr: "31" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "33", en: "33", es: "33", fr: "33" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "35", en: "35", es: "35", fr: "35" },
      },
    ],
  },
  {
    stableKey: "BR_SPD_03",
    position: 23,
    dimension: "SPEED",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Qual palavra é o anagrama direto de 'ROMA'?",
      en: "Which word is an exact anagram of 'AMOR'?",
      es: "¿Qué palabra es anagrama directo de 'ROMA'?",
      fr: "Quel mot est un anagramme exact de 'AMOR' ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: { pt: "AMOR", en: "ROMA", es: "AMOR", fr: "RAMO" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "MORA", en: "ROAM", es: "MORA", fr: "MORA" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "AROMA", en: "ARMOR", es: "AROMA", fr: "AROME" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "RAMAL", en: "MORAL", es: "RAMAL", fr: "MORAL" },
      },
    ],
  },
  {
    stableKey: "BR_SPD_04",
    position: 24,
    dimension: "SPEED",
    difficulty: "HARD",
    prompt: {
      pt: "Identifique rapidamente a única combinação cujos algarismos somam um número primo:",
      en: "Quickly identify the only combination whose digits sum to a prime number:",
      es: "Identifique rápidamente la única combinación cuyos dígitos suman un número primo:",
      fr: "Identifiez rapidement la seule combinaison dont les chiffres forment une somme première :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "4 + 5 + 6 = 15",
          en: "4 + 5 + 6 = 15",
          es: "4 + 5 + 6 = 15",
          fr: "4 + 5 + 6 = 15",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "3 + 7 + 8 = 18",
          en: "3 + 7 + 8 = 18",
          es: "3 + 7 + 8 = 18",
          fr: "3 + 7 + 8 = 18",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: {
          pt: "2 + 6 + 9 = 17",
          en: "2 + 6 + 9 = 17",
          es: "2 + 6 + 9 = 17",
          fr: "2 + 6 + 9 = 17",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "5 + 7 + 9 = 21",
          en: "5 + 7 + 9 = 21",
          es: "5 + 7 + 9 = 21",
          fr: "5 + 7 + 9 = 21",
        },
      },
    ],
  },

  // --- PATTERN RECOGNITION (Items 5 - 10) ---
  {
    stableKey: "BR_PAT_05",
    position: 25,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "EASY",
    prompt: {
      pt: "Qual número completa a sequência lógica?",
      en: "Which number completes the logical sequence?",
      es: "¿Qué número completa la secuencia lógica?",
      fr: "Quel nombre complète la suite logique ?",
    },
    clue: {
      pt: "3 · 7 · 11 · 15 · ?",
      en: "3 · 7 · 11 · 15 · ?",
      es: "3 · 7 · 11 · 15 · ?",
      fr: "3 · 7 · 11 · 15 · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "17", en: "17", es: "17", fr: "17" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "18", en: "18", es: "18", fr: "18" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "19", en: "19", es: "19", fr: "19" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "20", en: "20", es: "20", fr: "20" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_06",
    position: 26,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "EASY",
    prompt: {
      pt: "Identifique o próximo elemento da série quadrada:",
      en: "Identify the next element in the square series:",
      es: "Identifique el siguiente elemento de la serie cuadrada:",
      fr: "Identifiez l'élément suivant de la série des carrés :",
    },
    clue: {
      pt: "1 · 4 · 9 · 16 · ?",
      en: "1 · 4 · 9 · 16 · ?",
      es: "1 · 4 · 9 · 16 · ?",
      fr: "1 · 4 · 9 · 16 · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "20", en: "20", es: "20", fr: "20" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "25", en: "25", es: "25", fr: "25" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "27", en: "27", es: "27", fr: "27" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "30", en: "30", es: "30", fr: "30" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_07",
    position: 27,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Qual número preenche a interrogação?",
      en: "Which number replaces the question mark?",
      es: "¿Qué número reemplaza el signo de interrogación?",
      fr: "Quel nombre remplace le point d'interrogation ?",
    },
    clue: {
      pt: "3 · 6 · 11 · 18 · 27 · ?",
      en: "3 · 6 · 11 · 18 · 27 · ?",
      es: "3 · 6 · 11 · 18 · 27 · ?",
      fr: "3 · 6 · 11 · 18 · 27 · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "36", en: "36", es: "36", fr: "36" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "38", en: "38", es: "38", fr: "38" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "39", en: "39", es: "39", fr: "39" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "42", en: "42", es: "42", fr: "42" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_08",
    position: 28,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Complete a progressão geométrica:",
      en: "Complete the geometric progression:",
      es: "Complete la progresión geométrica:",
      fr: "Complétez la progression géométrique :",
    },
    clue: {
      pt: "5 · 10 · 20 · 40 · ?",
      en: "5 · 10 · 20 · 40 · ?",
      es: "5 · 10 · 20 · 40 · ?",
      fr: "5 · 10 · 20 · 40 · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "60", en: "60", es: "60", fr: "60" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "70", en: "70", es: "70", fr: "70" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "80", en: "80", es: "80", fr: "80" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "90", en: "90", es: "90", fr: "90" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_09",
    position: 29,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "HARD",
    prompt: {
      pt: "Qual valor completa a sequência cúbica?",
      en: "Which value completes the cubic sequence?",
      es: "¿Qué valor completa la secuencia cúbica?",
      fr: "Quelle valeur complète la suite cubique ?",
    },
    clue: {
      pt: "8 · 27 · 64 · 125 · ?",
      en: "8 · 27 · 64 · 125 · ?",
      es: "8 · 27 · 64 · 125 · ?",
      fr: "8 · 27 · 64 · 125 · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: { pt: "216", en: "216", es: "216", fr: "216" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "243", en: "243", es: "243", fr: "243" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "256", en: "256", es: "256", fr: "256" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "343", en: "343", es: "343", fr: "343" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_10",
    position: 30,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "HARD",
    prompt: {
      pt: "Qual número completa a sequência com diferenças quadradas crescentes?",
      en: "Which number completes the sequence with growing square differences?",
      es: "¿Qué número completa la secuencia con diferencias cuadradas crecientes?",
      fr: "Quel nombre complète la suite aux différences de carrés croissants ?",
    },
    clue: {
      pt: "2 · 3 · 7 · 16 · 32 · ?",
      en: "2 · 3 · 7 · 16 · 32 · ?",
      es: "2 · 3 · 7 · 16 · 32 · ?",
      fr: "2 · 3 · 7 · 16 · 32 · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "52", en: "52", es: "52", fr: "52" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "55", en: "55", es: "55", fr: "55" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "57", en: "57", es: "57", fr: "57" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "64", en: "64", es: "64", fr: "64" },
      },
    ],
  },

  // --- LOGICAL REASONING (Items 5 - 10) ---
  {
    stableKey: "BR_LOG_05",
    position: 31,
    dimension: "LOGICAL_REASONING",
    difficulty: "EASY",
    prompt: {
      pt: "Se todos os gatos são mamíferos e Mia é um gato, o que se conclui necessariamente?",
      en: "If all cats are mammals and Mia is a cat, what must necessarily be true?",
      es: "Si todos los gatos son mamíferos y Mía es un gato, ¿qué se concluye necesariamente?",
      fr: "Si tous les chats sont des mammifères et que Mia est un chat, que conclut-on nécessairement ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: {
          pt: "Mia é um mamífero",
          en: "Mia is a mammal",
          es: "Mía es un mamífero",
          fr: "Mia est un mammifère",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "Mia tem quatro patas",
          en: "Mia has four legs",
          es: "Mía tiene cuatro patas",
          fr: "Mia a quatre pattes",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Todos os mamíferos são gatos",
          en: "All mammals are cats",
          es: "Todos los mamíferos son gatos",
          fr: "Tous les mammifères sont des chats",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Mia é um felino selvagem",
          en: "Mia is a wild feline",
          es: "Mía es un felino salvaje",
          fr: "Mia est un félin sauvage",
        },
      },
    ],
  },
  {
    stableKey: "BR_LOG_06",
    position: 32,
    dimension: "LOGICAL_REASONING",
    difficulty: "EASY",
    prompt: {
      pt: "Se chover, o trânsito atrasa. Choveu. Logo:",
      en: "If it rains, traffic is delayed. It rained. Therefore:",
      es: "Si llueve, el tráfico se retrasa. Llovió. Por lo tanto:",
      fr: "S'il pleut, la circulation est ralentie. Il a plu. Donc :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "Não houve atraso",
          en: "There was no delay",
          es: "No hubo retraso",
          fr: "Il n'y a pas eu de retard",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "O trânsito atrasou",
          en: "Traffic was delayed",
          es: "El tráfico se retrasó",
          fr: "La circulation a été ralentie",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "O trânsito fluiu melhor",
          en: "Traffic flowed faster",
          es: "El tráfico fluyó mejor",
          fr: "La circulation s'est améliorée",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "A chuva parou rápido",
          en: "The rain stopped quickly",
          es: "La lluvia paró rápido",
          fr: "La pluie s'est arrêtée vite",
        },
      },
    ],
  },
  {
    stableKey: "BR_LOG_07",
    position: 33,
    dimension: "LOGICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Lucas é mais velho que Pedro, e Pedro é mais velho que Mateus. Logo:",
      en: "Lucas is older than Pedro, and Pedro is older than Mateo. Therefore:",
      es: "Lucas es mayor que Pedro, y Pedro es mayor que Mateo. Por lo tanto:",
      fr: "Lucas est plus âgé que Pierre, et Pierre est plus âgé que Mathieu. Donc :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "Mateus é o mais velho",
          en: "Mateo is the oldest",
          es: "Mateo es el mayor",
          fr: "Mathieu est le plus âgé",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "Lucas é mais novo que Mateus",
          en: "Lucas is younger than Mateo",
          es: "Lucas es menor que Mateo",
          fr: "Lucas est plus jeune que Mathieu",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: {
          pt: "Lucas é mais velho que Mateus",
          en: "Lucas is older than Mateo",
          es: "Lucas es mayor que Mateo",
          fr: "Lucas est plus âgé que Mathieu",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Pedro é o mais velho",
          en: "Pedro is the oldest",
          es: "Pedro es el mayor",
          fr: "Pierre est le plus âgé",
        },
      },
    ],
  },
  {
    stableKey: "BR_LOG_08",
    position: 34,
    dimension: "LOGICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Em um grupo de 40 pessoas, 25 gostam de café e 20 de chá. Todos gostam de pelo menos um. Quantos gostam de ambos?",
      en: "In a group of 40 people, 25 like coffee and 20 like tea. Everyone likes at least one. How many like both?",
      es: "En un grupo de 40 personas, 25 gustan del café y 20 del té. A todos les gusta al menos uno. ¿Cuántos gustan de ambos?",
      fr: "Dans un groupe de 40 personnes, 25 aiment le café et 20 le thé. Tous aiment au moins l'un des deux. Combien aiment les deux ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "3", en: "3", es: "3", fr: "3" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "5", en: "5", es: "5", fr: "5" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "7", en: "7", es: "7", fr: "7" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "10", en: "10", es: "10", fr: "10" },
      },
    ],
  },
  {
    stableKey: "BR_LOG_09",
    position: 35,
    dimension: "LOGICAL_REASONING",
    difficulty: "HARD",
    prompt: {
      pt: "Nenhum réptil tem pelos. Todos os jacarés são répteis. Alguns animais de zoológico têm pelos. Logo:",
      en: "No reptile has fur. All alligators are reptiles. Some zoo animals have fur. Therefore:",
      es: "Ningún reptil tiene pelo. Todos los caimanes son reptiles. Algunos animales del zoológico tienen pelo. Por lo tanto:",
      fr: "Aucun reptile n'a de poils. Tous les alligators sont des reptiles. Certains animaux de zoo ont des poils. Donc :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "Alguns jacarés têm pelos",
          en: "Some alligators have fur",
          es: "Algunos caimanes tienen pelo",
          fr: "Certains alligators ont des poils",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "Nenhum jacaré tem pelos",
          en: "No alligator has fur",
          es: "Ningún caimán tiene pelo",
          fr: "Aucun alligator n'a de poils",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Todos os animais do zoológico são répteis",
          en: "All zoo animals are reptiles",
          es: "Todos los animales del zoológico son reptiles",
          fr: "Tous les animaux du zoo sont des reptiles",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Nenhum réptil está no zoológico",
          en: "No reptiles are in the zoo",
          es: "Ningún reptil está en el zoológico",
          fr: "Aucun reptile n'est dans le zoo",
        },
      },
    ],
  },
  {
    stableKey: "BR_LOG_10",
    position: 36,
    dimension: "LOGICAL_REASONING",
    difficulty: "HARD",
    prompt: {
      pt: "Se a afirmação 'Nem todo pássaro voa' é verdadeira, o que é logicamente equivalente?",
      en: "If the statement 'Not every bird flies' is true, which is logically equivalent?",
      es: "Si la afirmación 'No todo pájaro vuela' es verdadera, ¿qué es lógicamente equivalente?",
      fr: "Si l'affirmation 'Tous les oiseaux ne volent pas' est vraie, laquelle est logiquement équivalente ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "Nenhum pássaro voa",
          en: "No birds fly",
          es: "Ningún pájaro vuela",
          fr: "Aucun oiseau ne vole",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "Existe pelo menos um pássaro que não voa",
          en: "There is at least one bird that does not fly",
          es: "Existe al menos un pájaro que no vuela",
          fr: "Il existe au moins un oiseau qui ne vole pas",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Todos os pássaros voam",
          en: "All birds fly",
          es: "Todos los pájaros vuelan",
          fr: "Tous les oiseaux volent",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "A maioria dos pássaros voa",
          en: "Most birds fly",
          es: "La mayoría de los pájaros vuela",
          fr: "La plupart des oiseaux volent",
        },
      },
    ],
  },

  // --- NUMERICAL REASONING (Items 5 - 10) ---
  {
    stableKey: "BR_NUM_05",
    position: 37,
    dimension: "NUMERICAL_REASONING",
    difficulty: "EASY",
    prompt: {
      pt: "Se 4 maçãs custam R$ 12,00, quanto custam 7 maçãs?",
      en: "If 4 apples cost $12.00, how much do 7 apples cost?",
      es: "Si 4 manzanas cuestan 12,00 €, ¿cuánto cuestan 7 manzanas?",
      fr: "Si 4 pommes coûtent 12,00 €, combien coûtent 7 pommes ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "R$ 18,00", en: "$18.00", es: "18,00 €", fr: "18,00 €" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "R$ 21,00", en: "$21.00", es: "21,00 €", fr: "21,00 €" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "R$ 24,00", en: "$24.00", es: "24,00 €", fr: "24,00 €" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "R$ 28,00", en: "$28.00", es: "28,00 €", fr: "28,00 €" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_06",
    position: 38,
    dimension: "NUMERICAL_REASONING",
    difficulty: "EASY",
    prompt: {
      pt: "Qual é o valor de 25% de 240?",
      en: "What is 25% of 240?",
      es: "¿Cuánto es el 25% de 240?",
      fr: "Combien font 25 % de 240 ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "50", en: "50", es: "50", fr: "50" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "60", en: "60", es: "60", fr: "60" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "70", en: "70", es: "70", fr: "70" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "80", en: "80", es: "80", fr: "80" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_07",
    position: 39,
    dimension: "NUMERICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Um carro percorre 180 km a 60 km/h e volta a 90 km/h. Qual a velocidade média de todo o percurso?",
      en: "A car drives 180 km at 60 km/h and returns at 90 km/h. What is the average speed of the round trip?",
      es: "Un automóvil recorre 180 km a 60 km/h y regresa a 90 km/h. ¿Cuál es la velocidad promedio de todo el recorrido?",
      fr: "Une voiture parcourt 180 km à 60 km/h et revient à 90 km/h. Quelle est la vitesse moyenne sur l'aller-retour ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: { pt: "72 km/h", en: "72 km/h", es: "72 km/h", fr: "72 km/h" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "75 km/h", en: "75 km/h", es: "75 km/h", fr: "75 km/h" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "78 km/h", en: "78 km/h", es: "78 km/h", fr: "78 km/h" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "80 km/h", en: "80 km/h", es: "80 km/h", fr: "80 km/h" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_08",
    position: 40,
    dimension: "NUMERICAL_REASONING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Um produto de R$ 200 teve aumento de 20% e depois desconto de 20%. Qual seu preço final?",
      en: "A $200 item increased by 20% and then was discounted by 20%. What is its final price?",
      es: "Un artículo de 200 € aumentó un 20% y luego tuvo un descuento del 20%. ¿Cuál es su precio final?",
      fr: "Un article à 200 € augmente de 20 % puis bénéficie d'une réduction de 20 %. Quel est son prix final ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "R$ 200", en: "$200", es: "200 €", fr: "200 €" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "R$ 192", en: "$192", es: "192 €", fr: "192 €" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "R$ 190", en: "$190", es: "190 €", fr: "190 €" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "R$ 188", en: "$188", es: "188 €", fr: "188 €" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_09",
    position: 41,
    dimension: "NUMERICAL_REASONING",
    difficulty: "HARD",
    prompt: {
      pt: "A soma de dois números é 70 e sua diferença é 14. Qual é o produto desses dois números?",
      en: "The sum of two numbers is 70 and their difference is 14. What is their product?",
      es: "La suma de dos números es 70 y su diferencia es 14. ¿Cuál es su producto?",
      fr: "La somme de deux nombres est 70 et leur différence est 14. Quel est leur produit ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "1126", en: "1126", es: "1126", fr: "1126" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "1176", en: "1176", es: "1176", fr: "1176" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "1200", en: "1200", es: "1200", fr: "1200" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "1244", en: "1244", es: "1244", fr: "1244" },
      },
    ],
  },
  {
    stableKey: "BR_NUM_10",
    position: 42,
    dimension: "NUMERICAL_REASONING",
    difficulty: "HARD",
    prompt: {
      pt: "Uma torneira enche um reservatório em 3 horas e outra em 6 horas. Juntas, em quantas horas encherão o tanque?",
      en: "One tap fills a tank in 3 hours and another in 6 hours. Together, how many hours will they take to fill the tank?",
      es: "Un grifo llena un depósito en 3 horas y otro en 6 horas. Juntos, ¿en cuántas horas llenarán el tanque?",
      fr: "Un robinet remplit un réservoir en 3 heures et un autre en 6 heures. Ensemble, en combien d'heures rempliront-ils le réservoir ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "1,5 hora", en: "1.5 hours", es: "1,5 horas", fr: "1,5 heure" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "2,0 horas", en: "2.0 hours", es: "2,0 horas", fr: "2,0 heures" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "2,5 horas", en: "2.5 hours", es: "2,5 horas", fr: "2,5 heures" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "4,5 horas", en: "4.5 hours", es: "4,5 horas", fr: "4,5 heures" },
      },
    ],
  },

  // --- ATTENTION (Items 5 - 10) ---
  {
    stableKey: "BR_ATT_05",
    position: 43,
    dimension: "ATTENTION",
    difficulty: "EASY",
    prompt: {
      pt: "Quantas letras 'T' aparecem na sequência: T L T F T E T L T ?",
      en: "How many letters 'T' appear in the sequence: T L T F T E T L T ?",
      es: "¿Cuántas letras 'T' aparecen en la secuencia: T L T F T E T L T ?",
      fr: "Combien de lettres 'T' apparaissent dans la suite : T L T F T E T L T ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "4", en: "4", es: "4", fr: "4" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "5", en: "5", es: "5", fr: "5" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "6", en: "6", es: "6", fr: "6" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "7", en: "7", es: "7", fr: "7" },
      },
    ],
  },
  {
    stableKey: "BR_ATT_06",
    position: 44,
    dimension: "ATTENTION",
    difficulty: "EASY",
    prompt: {
      pt: "Qual das opções é perfeitamente idêntica à palavra de referência: ELEFANTÍASE",
      en: "Which option is perfectly identical to the reference word: ELEPHANTIASIS",
      es: "¿Cuál de las opciones es perfectamente idéntica a la palabra de referencia: ELEFANTIASIS",
      fr: "Quelle option est parfaitement identique au mot de référence : ÉLÉPHANTIASIS",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "ELEFANTIASE", en: "ELEPHANTIASIS", es: "ELEFANTIASIS", fr: "ELEPHANTIASIS" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "ELEFANTÍASE", en: "ELEPHANTIASIS", es: "ELEFANTIASIS", fr: "ÉLÉPHANTIASIS" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "ELEFANTÍASI", en: "ELEPHANTIASS", es: "ELEFANTIASS", fr: "ÉLÉPHANTIASS" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "ELEFONTÍASE", en: "ELEPHONTASIS", es: "ELEFONTÍASIS", fr: "ÉLÉPHONTIASIS" },
      },
    ],
  },
  {
    stableKey: "BR_ATT_07",
    position: 45,
    dimension: "ATTENTION",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Identifique o único par de códigos que NÃO é idêntico:",
      en: "Identify the only pair of codes that is NOT identical:",
      es: "Identifique el único par de códigos que NO es idéntico:",
      fr: "Identifiez la seule paire de codes qui n'est PAS identique :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "9834-X7B / 9834-X7B",
          en: "9834-X7B / 9834-X7B",
          es: "9834-X7B / 9834-X7B",
          fr: "9834-X7B / 9834-X7B",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: {
          pt: "4521-M9Q / 4521-M9Q",
          en: "4521-M9Q / 4521-M9Q",
          es: "4521-M9Q / 4521-M9Q",
          fr: "4521-M9Q / 4521-M9Q",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: {
          pt: "7319-K2W / 7319-K2V",
          en: "7319-K2W / 7319-K2V",
          es: "7319-K2W / 7319-K2V",
          fr: "7319-K2W / 7319-K2V",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "6108-P4Z / 6108-P4Z",
          en: "6108-P4Z / 6108-P4Z",
          es: "6108-P4Z / 6108-P4Z",
          fr: "6108-P4Z / 6108-P4Z",
        },
      },
    ],
  },
  {
    stableKey: "BR_ATT_08",
    position: 46,
    dimension: "ATTENTION",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Quantos números pares existem na lista: 13, 22, 37, 48, 55, 64, 71, 86, 99?",
      en: "How many even numbers exist in the list: 13, 22, 37, 48, 55, 64, 71, 86, 99?",
      es: "¿Cuántos números pares existen en la lista: 13, 22, 37, 48, 55, 64, 71, 86, 99?",
      fr: "Combien de nombres pairs se trouvent dans la liste : 13, 22, 37, 48, 55, 64, 71, 86, 99 ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "3", en: "3", es: "3", fr: "3" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "4", en: "4", es: "4", fr: "4" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "5", en: "5", es: "5", fr: "5" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "6", en: "6", es: "6", fr: "6" },
      },
    ],
  },
  {
    stableKey: "BR_ATT_09",
    position: 47,
    dimension: "ATTENTION",
    difficulty: "HARD",
    prompt: {
      pt: "Qual linha contém exatamente 4 ocorrências do símbolo '#':",
      en: "Which line contains exactly 4 occurrences of the symbol '#':",
      es: "¿Qué línea contiene exactamente 4 ocurrencias del símbolo '#':",
      fr: "Quelle ligne contient exactement 4 occurrences du symbole '#' :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "##--#--#--", en: "##--#--#--", es: "##--#--#--", fr: "##--#--#--" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "#-#-#-#-#", en: "#-#-#-#-#", es: "#-#-#-#-#", fr: "#-#-#-#-#" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "#--#--#--#", en: "#--#--#--#", es: "#--#--#--#", fr: "#--#--#--#" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "##--##--#", en: "##--##--#", es: "##--##--#", fr: "##--##--#" },
      },
    ],
  },
  {
    stableKey: "BR_ATT_10",
    position: 48,
    dimension: "ATTENTION",
    difficulty: "HARD",
    prompt: {
      pt: "Encontre o par de palavras com grafia perfeitamente invertida (palíndromo mútuo):",
      en: "Find the pair of words with perfectly mirrored spelling (mutual palindrome):",
      es: "Encuentre el par de palabras con grafía perfectamente invertida:",
      fr: "Trouvez la paire de mots à l'orthographe exactement inversée (palindrome mutuel) :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: { pt: "ROMA / AMOR", en: "ROMA / AMOR", es: "ROMA / AMOR", fr: "ROMA / AMOR" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "LIVRO / ORVIL", en: "BOOK / KOOB", es: "LIBRO / ORBIL", fr: "LIVRE / ERVIL" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "CASA / ASAC", en: "HOME / EMOH", es: "CASA / ASAC", fr: "MAISON / NOSIAM" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "MESA / ASEM", en: "TABLE / ELBAT", es: "MESA / ASEM", fr: "TABLE / ELBAT" },
      },
    ],
  },

  // --- PROBLEM SOLVING (Items 5 - 10) ---
  {
    stableKey: "BR_PRB_05",
    position: 49,
    dimension: "PROBLEM_SOLVING",
    difficulty: "EASY",
    prompt: {
      pt: "Três amigos dividiram uma conta de R$ 150 em partes iguais. Um deles pagou com uma nota de R$ 100. Quanto deve receber de troco?",
      en: "Three friends split a $150 bill equally. One pays with a $100 bill. How much change should they receive?",
      es: "Tres amigos dividieron una cuenta de 150 € a partes iguales. Uno pagó con un billete de 100 €. ¿Cuánto cambio debe recibir?",
      fr: "Trois amis partagent une facture de 150 € en parts égales. L'un paie avec un billet de 100 €. Combien de monnaie doit-il recevoir ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "R$ 40", en: "$40", es: "40 €", fr: "40 €" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "R$ 50", en: "$50", es: "50 €", fr: "50 €" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "R$ 60", en: "$60", es: "60 €", fr: "60 €" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "R$ 70", en: "$70", es: "70 €", fr: "70 €" },
      },
    ],
  },
  {
    stableKey: "BR_PRB_06",
    position: 50,
    dimension: "PROBLEM_SOLVING",
    difficulty: "EASY",
    prompt: {
      pt: "Um elevador suporta até 600 kg. Se 5 pessoas pesam juntas 420 kg, quanto peso adicional ainda é permitido?",
      en: "An elevator holds up to 600 kg. If 5 people together weigh 420 kg, how much additional weight is allowed?",
      es: "Un ascensor soporta hasta 600 kg. Si 5 personas pesan juntas 420 kg, ¿cuánto peso adicional se permite?",
      fr: "Un ascenseur supporte jusqu'à 600 kg. Si 5 personnes pèsent ensemble 420 kg, quelle charge supplémentaire est encore autorisée ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "160 kg", en: "160 kg", es: "160 kg", fr: "160 kg" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "180 kg", en: "180 kg", es: "180 kg", fr: "180 kg" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "200 kg", en: "200 kg", es: "200 kg", fr: "200 kg" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "220 kg", en: "220 kg", es: "220 kg", fr: "220 kg" },
      },
    ],
  },
  {
    stableKey: "BR_PRB_07",
    position: 51,
    dimension: "PROBLEM_SOLVING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Você precisa transportar 100 caixas em vans com capacidade máxima de 18 caixas cada. Qual o número mínimo de vans necessárias?",
      en: "You need to transport 100 boxes in vans with a maximum capacity of 18 boxes each. What is the minimum number of vans needed?",
      es: "Necesita transportar 100 cajas en furgonetas con capacidad máxima de 18 cajas cada una. ¿Cuál es el número mínimo de furgonetas necesarias?",
      fr: "Vous devez transporter 100 cartons dans des camionnettes d'une capacité maximale de 18 cartons chacune. Quel est le nombre minimum de camionnettes requises ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "5", en: "5", es: "5", fr: "5" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "6", en: "6", es: "6", fr: "6" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "7", en: "7", es: "7", fr: "7" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "8", en: "8", es: "8", fr: "8" },
      },
    ],
  },
  {
    stableKey: "BR_PRB_08",
    position: 52,
    dimension: "PROBLEM_SOLVING",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Em um teste com 20 perguntas, cada acerto soma 5 pontos e cada erro retira 2 pontos. Se um candidato obteve 72 pontos respondendo a todas, quantas acertou?",
      en: "In a 20-question test, each correct answer adds 5 points and each error subtracts 2 points. If an applicant scored 72 points answering all, how many were correct?",
      es: "En un examen de 20 preguntas, cada acierto suma 5 puntos y cada error resta 2 puntos. Si un candidato obtuvo 72 puntos respondiendo todas, ¿cuántas acertó?",
      fr: "Lors d'un test de 20 questions, chaque bonne réponse rapporte 5 points et chaque erreur retire 2 points. Si un candidat a obtenu 72 points en répondant à tout, combien de bonnes réponses a-t-il eues ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "14", en: "14", es: "14", fr: "14" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "16", en: "16", es: "16", fr: "16" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "17", en: "17", es: "17", fr: "17" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "18", en: "18", es: "18", fr: "18" },
      },
    ],
  },
  {
    stableKey: "BR_PRB_09",
    position: 53,
    dimension: "PROBLEM_SOLVING",
    difficulty: "HARD",
    prompt: {
      pt: "Cinco pessoas estão em uma reunião e todas apertam as mãos entre si exatamente uma vez. Quantos apertos de mão ocorreram?",
      en: "Five people meet and everyone shakes hands with everyone else exactly once. How many handshakes occurred?",
      es: "Cinco personas están en una reunión y todas se dan la mano exactamente una vez. ¿Cuántos apretones de manos ocurrieron?",
      fr: "Cinq personnes participent à une réunion et se serrent toutes la main exactement une fois. Combien de poignées de main ont eu lieu ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "8", en: "8", es: "8", fr: "8" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "10", en: "10", es: "10", fr: "10" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "15", en: "15", es: "15", fr: "15" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "20", en: "20", es: "20", fr: "20" },
      },
    ],
  },
  {
    stableKey: "BR_PRB_10",
    position: 54,
    dimension: "PROBLEM_SOLVING",
    difficulty: "HARD",
    prompt: {
      pt: "Um relógio adianta 2 minutos a cada 3 horas. Quantos minutos ele terá adiantado ao final de 24 horas?",
      en: "A watch gains 2 minutes every 3 hours. How many minutes will it have gained after 24 hours?",
      es: "Un reloj se adelanta 2 minutos cada 3 horas. ¿Cuántos minutos se habrá adelantado al cabo de 24 horas?",
      fr: "Une montre avance de 2 minutes toutes les 3 heures. De combien de minutes aura-t-elle avancé au bout de 24 heures ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "12 minutos", en: "12 minutes", es: "12 minutos", fr: "12 minutes" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "16 minutos", en: "16 minutes", es: "16 minutos", fr: "16 minutes" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "18 minutos", en: "18 minutes", es: "18 minutes", fr: "18 minutes" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "20 minutos", en: "20 minutes", es: "20 minutes", fr: "20 minutes" },
      },
    ],
  },

  // --- SPEED (Items 5 - 10) ---
  {
    stableKey: "BR_SPD_05",
    position: 55,
    dimension: "SPEED",
    difficulty: "EASY",
    prompt: {
      pt: "Qual é o resultado rápido de: 15 × 6?",
      en: "What is the rapid calculation of: 15 × 6?",
      es: "¿Cuál es el resultado rápido de: 15 × 6?",
      fr: "Quel est le résultat rapide de : 15 × 6 ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "80", en: "80", es: "80", fr: "80" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "85", en: "85", es: "85", fr: "85" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "90", en: "90", es: "90", fr: "90" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "95", en: "95", es: "95", fr: "95" },
      },
    ],
  },
  {
    stableKey: "BR_SPD_06",
    position: 56,
    dimension: "SPEED",
    difficulty: "EASY",
    prompt: {
      pt: "Qual número é o dobro de 47?",
      en: "Which number is double of 47?",
      es: "¿Qué número es el doble de 47?",
      fr: "Quel nombre est le double de 47 ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "84", en: "84", es: "84", fr: "84" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "92", en: "92", es: "92", fr: "92" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "94", en: "94", es: "94", fr: "94" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "96", en: "96", es: "96", fr: "96" },
      },
    ],
  },
  {
    stableKey: "BR_SPD_07",
    position: 57,
    dimension: "SPEED",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Resolva rapidamente: 250 - 87 = ?",
      en: "Solve quickly: 250 - 87 = ?",
      es: "Resuelva rápidamente: 250 - 87 = ?",
      fr: "Résolvez rapidement : 250 - 87 = ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "153", en: "153", es: "153", fr: "153" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "163", en: "163", es: "163", fr: "163" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "173", en: "173", es: "173", fr: "173" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "183", en: "183", es: "183", fr: "183" },
      },
    ],
  },
  {
    stableKey: "BR_SPD_08",
    position: 58,
    dimension: "SPEED",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Identifique rapidamente qual fração é maior que 1/2:",
      en: "Identify quickly which fraction is greater than 1/2:",
      es: "Identifique rápidamente qué fracción es mayor que 1/2:",
      fr: "Identifiez rapidement quelle fraction est supérieure à 1/2 :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "3/7", en: "3/7", es: "3/7", fr: "3/7" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "4/9", en: "4/9", es: "4/9", fr: "4/9" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: true,
        label: { pt: "5/9", en: "5/9", es: "5/9", fr: "5/9" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "5/11", en: "5/11", es: "5/11", fr: "5/11" },
      },
    ],
  },
  {
    stableKey: "BR_SPD_09",
    position: 59,
    dimension: "SPEED",
    difficulty: "HARD",
    prompt: {
      pt: "Calcule com velocidade: 18 × 12 - 16 = ?",
      en: "Calculate swiftly: 18 × 12 - 16 = ?",
      es: "Calcule con rapidez: 18 × 12 - 16 = ?",
      fr: "Calculez avec rapidité : 18 × 12 - 16 = ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "196", en: "196", es: "196", fr: "196" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "200", en: "200", es: "200", fr: "200" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "204", en: "204", es: "204", fr: "204" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "216", en: "216", es: "216", fr: "216" },
      },
    ],
  },
  {
    stableKey: "BR_SPD_10",
    position: 60,
    dimension: "SPEED",
    difficulty: "HARD",
    prompt: {
      pt: "Identifique rapidamente qual dos números abaixo é divisível por 7 e por 9 simultaneamente:",
      en: "Quickly identify which number below is divisible by both 7 and 9 simultaneously:",
      es: "Identifique rápidamente qué número es divisible por 7 y por 9 simultáneamente:",
      fr: "Identifiez rapidement quel nombre ci-dessous est divisible par 7 et par 9 simultanément :",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "567", en: "567", es: "567", fr: "567" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "630", en: "630", es: "630", fr: "630" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "693", en: "693", es: "693", fr: "693" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "720", en: "720", es: "720", fr: "720" },
      },
    ],
  },
];

export const brainRankQuestions: readonly BrainRankQuestionDef[] = brainRankPool.slice(0, 24);
