export const memoryExercises = [
  {
    key: "MEMORY_01",
    cue: {
      pt: "Observe esta sequência: lua → chave → árvore → barco.",
      en: "Look at this sequence: moon → key → tree → boat.",
      es: "Observa esta secuencia: luna → llave → árbol → barco.",
      fr: "Observez cette suite : lune → clé → arbre → bateau.",
    },
    prompt: {
      pt: "Na sequência que você viu, o que vinha logo depois da chave?",
      en: "In the sequence you saw, what came right after the key?",
      es: "En la secuencia que viste, ¿qué venía justo después de la llave?",
      fr: "Dans la suite présentée, qu’est-ce qui venait juste après la clé ?",
    },
    options: [
      { pt: "Lua", en: "Moon", es: "Luna", fr: "Lune" },
      { pt: "Árvore", en: "Tree", es: "Árbol", fr: "Arbre" },
      { pt: "Barco", en: "Boat", es: "Barco", fr: "Bateau" },
      { pt: "Chave", en: "Key", es: "Llave", fr: "Clé" },
    ],
    correct: 1,
  },
  {
    key: "MEMORY_02",
    cue: {
      pt: "Ana deixou um caderno verde na segunda gaveta e marcou um encontro para quinta-feira.",
      en: "Ana left a green notebook in the second drawer and arranged a meeting for Thursday.",
      es: "Ana dejó un cuaderno verde en el segundo cajón y acordó una reunión para el jueves.",
      fr: "Ana a laissé un carnet vert dans le deuxième tiroir et prévu une rencontre jeudi.",
    },
    prompt: {
      pt: "Qual combinação corresponde ao que você leu sobre Ana?",
      en: "Which combination matches what you read about Ana?",
      es: "¿Qué combinación corresponde a lo que leíste sobre Ana?",
      fr: "Quelle combinaison correspond à ce que vous avez lu sur Ana ?",
    },
    options: [
      {
        pt: "Verde · primeira gaveta · quinta",
        en: "Green · first drawer · Thursday",
        es: "Verde · primer cajón · jueves",
        fr: "Vert · premier tiroir · jeudi",
      },
      {
        pt: "Azul · segunda gaveta · quinta",
        en: "Blue · second drawer · Thursday",
        es: "Azul · segundo cajón · jueves",
        fr: "Bleu · deuxième tiroir · jeudi",
      },
      {
        pt: "Verde · segunda gaveta · quinta",
        en: "Green · second drawer · Thursday",
        es: "Verde · segundo cajón · jueves",
        fr: "Vert · deuxième tiroir · jeudi",
      },
      {
        pt: "Verde · segunda gaveta · terça",
        en: "Green · second drawer · Tuesday",
        es: "Verde · segundo cajón · martes",
        fr: "Vert · deuxième tiroir · mardi",
      },
    ],
    correct: 2,
  },
  {
    key: "MEMORY_03",
    cue: {
      pt: "Observe estas associações: círculo = 4; triângulo = 7; quadrado = 2.",
      en: "Look at these pairs: circle = 4; triangle = 7; square = 2.",
      es: "Observa estas asociaciones: círculo = 4; triángulo = 7; cuadrado = 2.",
      fr: "Observez ces associations : cercle = 4 ; triangle = 7 ; carré = 2.",
    },
    prompt: {
      pt: "Qual número estava associado ao triângulo?",
      en: "Which number was paired with the triangle?",
      es: "¿Qué número estaba asociado al triángulo?",
      fr: "Quel nombre était associé au triangle ?",
    },
    options: [
      { pt: "2", en: "2", es: "2", fr: "2" },
      { pt: "4", en: "4", es: "4", fr: "4" },
      { pt: "9", en: "9", es: "9", fr: "9" },
      { pt: "7", en: "7", es: "7", fr: "7" },
    ],
    correct: 3,
  },
] as const;
