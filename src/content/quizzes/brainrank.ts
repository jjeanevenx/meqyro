import type { BrainRankDimension, BrainRankDifficulty } from "@/features/scoring/brainrank";

export type BrainRankQuestionDef = {
  stableKey: string;
  position: number;
  dimension: BrainRankDimension;
  difficulty: BrainRankDifficulty;
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
  }[];
};

export const brainRankQuestions: readonly BrainRankQuestionDef[] = [
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
    prompt: {
      pt: "Observe a rotação dos ponteiros e indique o próximo passo:",
      en: "Observe the rotation pattern and indicate the next step:",
      es: "Observe la rotación de las manecillas e indique el siguiente paso:",
      fr: "Observez le motif de rotation et indiquez l'étape suivante :",
    },
    clue: {
      pt: "45° horário · 90° anti-horário · 135° horário · ?",
      en: "45° clockwise · 90° counter-clockwise · 135° clockwise · ?",
      es: "45° horario · 90° antihorario · 135° horario · ?",
      fr: "45° horaire · 90° anti-horaire · 135° horaire · ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "180° horário", en: "180° clockwise", es: "180° horario", fr: "180° horaire" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "180° anti-horário",
          en: "180° counter-clockwise",
          es: "180° antihorario",
          fr: "180° anti-horaire",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "225° horário", en: "225° clockwise", es: "225° horario", fr: "225° horaire" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "90° horário", en: "90° clockwise", es: "90° horario", fr: "90° horaire" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_03",
    position: 3,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "MEDIUM",
    prompt: {
      pt: "Qual matriz de símbolos mantém a paridade de linhas e colunas?",
      en: "Which symbol matrix maintains row and column parity?",
      es: "¿Qué matriz de símbolos mantiene la paridad de filas y columnas?",
      fr: "Quelle matrice de symboles maintient la parité des lignes et colonnes ?",
    },
    clue: {
      pt: "Linha 1: ▲ ▲ ● | Linha 2: ● ▲ ▲ | Linha 3: ▲ ● ?",
      en: "Row 1: ▲ ▲ ● | Row 2: ● ▲ ▲ | Row 3: ▲ ● ?",
      es: "Fila 1: ▲ ▲ ● | Fila 2: ● ▲ ▲ | Fila 3: ▲ ● ?",
      fr: "Ligne 1 : ▲ ▲ ● | Ligne 2 : ● ▲ ▲ | Ligne 3 : ▲ ● ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: true,
        label: { pt: "▲", en: "▲", es: "▲", fr: "▲" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: false,
        label: { pt: "●", en: "●", es: "●", fr: "●" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "■", en: "■", es: "■", fr: "■" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: { pt: "◆", en: "◆", es: "◆", fr: "◆" },
      },
    ],
  },
  {
    stableKey: "BR_PAT_04",
    position: 4,
    dimension: "PATTERN_RECOGNITION",
    difficulty: "HARD",
    prompt: {
      pt: "Qual elemento preserva a transformação bidimensional combinada?",
      en: "Which element preserves the combined two-dimensional transformation?",
      es: "¿Qué elemento conserva la transformación bidimensional combinada?",
      fr: "Quel élément préserve la transformation bidimensionnelle combinée ?",
    },
    clue: {
      pt: "Inversão vertical com incremento de vértices: 3→4, 4→5, 5→?",
      en: "Vertical flip with vertex increment: 3→4, 4→5, 5→?",
      es: "Inversión vertical con incremento de vértices: 3→4, 4→5, 5→?",
      fr: "Inversion verticale avec incrément de sommets : 3→4, 4→5, 5→?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: {
          pt: "Pentágono invertido",
          en: "Inverted pentagon",
          es: "Pentágono invertido",
          fr: "Pentagone inversé",
        },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: {
          pt: "Hexágono invertido",
          en: "Inverted hexagon",
          es: "Hexágono invertido",
          fr: "Hexagone inversé",
        },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: {
          pt: "Heptágono direto",
          en: "Direct heptagon",
          es: "Heptágono directo",
          fr: "Heptagone direct",
        },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Octógono duplo",
          en: "Double octagon",
          es: "Octágono doble",
          fr: "Octogone double",
        },
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
        label: { pt: "8", en: "8", es: "8", fr: "8" },
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
    prompt: {
      pt: "Qual símbolo aparece com MENOR frequência na linha: ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?",
      en: "Which symbol appears with LOWEST frequency: ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?",
      es: "¿Qué símbolo aparece con MENOR frecuencia: ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?",
      fr: "Quel symbole apparaît avec la PLUS FAIBLE fréquence : ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?",
    },
    options: [
      {
        stableKey: "A",
        position: 1,
        isCorrect: false,
        label: { pt: "◆ (losango)", en: "◆ (diamond)", es: "◆ (rombo)", fr: "◆ (losange)" },
      },
      {
        stableKey: "B",
        position: 2,
        isCorrect: true,
        label: { pt: "▲ (triângulo)", en: "▲ (triangle)", es: "▲ (triángulo)", fr: "▲ (triangle)" },
      },
      {
        stableKey: "C",
        position: 3,
        isCorrect: false,
        label: { pt: "● (círculo)", en: "● (circle)", es: "● (círculo)", fr: "● (cercle)" },
      },
      {
        stableKey: "D",
        position: 4,
        isCorrect: false,
        label: {
          pt: "Todos aparecem igual",
          en: "All appear equal",
          es: "Todos aparecen igual",
          fr: "Tous apparaissent également",
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
];
