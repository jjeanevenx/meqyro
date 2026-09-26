import type { FocusStyleType } from "@/features/scoring/focusstyle";

export type FocusStyleQuestionDef = {
  stableKey: string;
  position: number;
  style: FocusStyleType;
  prompt: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
};

export const focusStyleQuestions: readonly FocusStyleQuestionDef[] = [
  // IMMERSIVE_HYPERFOCUS (5)
  {
    stableKey: "FS_HYPER_01",
    position: 1,
    style: "IMMERSIVE_HYPERFOCUS",
    prompt: {
      pt: "Entro em estado de fluxo profundo e perco a noção do tempo quando mergulho em uma única tarefa complexa.",
      en: "I enter deep flow and lose track of time when fully immersed in a single complex task.",
      es: "Entro en un estado de flujo profundo y pierdo la noción del tiempo ante una tarea compleja.",
      fr: "J'entre en état de flow profond et perds la notion du temps sur une tâche complexe.",
    },
  },
  {
    stableKey: "FS_HYPER_02",
    position: 2,
    style: "IMMERSIVE_HYPERFOCUS",
    prompt: {
      pt: "Interrupções constantes enquanto estou concentrado me custam muita energia para retomar o raciocínio.",
      en: "Frequent interruptions while in the zone cost me significant cognitive energy to resume.",
      es: "Las interrupciones cuando estoy concentrado me cuestan mucha energía para reanudar el hilo.",
      fr: "Les interruptions en pleine concentration me coûtent une énergie mentale considérable.",
    },
  },
  {
    stableKey: "FS_HYPER_03",
    position: 3,
    style: "IMMERSIVE_HYPERFOCUS",
    prompt: {
      pt: "Prefiro blocos contínuos de 3 a 4 horas de silêncio absoluto para trabalhar com qualidade.",
      en: "I thrive best with 3 to 4 uninterrupted hours of quiet for high-depth output.",
      es: "Rindo mucho mejor en bloques continuos de 3 a 4 horas de silencio para trabajar a fondo.",
      fr: "Je donne le meilleur de moi-même avec des plages continues de 3 à 4 heures de calme.",
    },
  },
  {
    stableKey: "FS_HYPER_04",
    position: 4,
    style: "IMMERSIVE_HYPERFOCUS",
    prompt: {
      pt: "Quando resolvo um problema difícil, continuo pensando nele mesmo longe do computador.",
      en: "When tackling a hard problem, it stays running in the back of my mind even off-screen.",
      es: "Al afrontar un problema difícil, sigo reflexionando en él incluso lejos del escritorio.",
      fr: "Face à un problème complexe, mon esprit continue d'y travailler même loin de l'écran.",
    },
  },
  {
    stableKey: "FS_HYPER_05",
    position: 5,
    style: "IMMERSIVE_HYPERFOCUS",
    prompt: {
      pt: "Gosto de esgotar todas as nuances de um tópico antes de passar para o assunto seguinte.",
      en: "I prefer exhausting every nuance of a subject before moving on to the next topic.",
      es: "Me gusta explorar todos los matices de un tema antes de pasar al siguiente asunto.",
      fr: "J'aime épuiser chaque nuance d'un sujet avant de basculer vers un autre thème.",
    },
  },
  // MODULAR_SERIAL (5)
  {
    stableKey: "FS_MOD_01",
    position: 6,
    style: "MODULAR_SERIAL",
    prompt: {
      pt: "Divido meu dia em blocos estruturados e sinto satisfação em ticar tarefas concluídas.",
      en: "I structure my day into modular timeblocks and love checking off completed items.",
      es: "Organizo mi jornada en bloques estructurados y disfruto tachando tareas terminadas.",
      fr: "J'organise mes journées en blocs structurés et apprécie cocher les tâches accomplies.",
    },
  },
  {
    stableKey: "FS_MOD_02",
    position: 7,
    style: "MODULAR_SERIAL",
    prompt: {
      pt: "Utilizo listas de pendências e técnicas de ritmo (como Pomodoro) com naturalidade.",
      en: "I naturally use structured task backlogs and interval pacing (like Pomodoro).",
      es: "Uso listas de pendientes y técnicas de intervalos estructurados con fluidez.",
      fr: "J'utilise naturellement des listes ordonnées et des rythmes par intervalles (type Pomodoro).",
    },
  },
  {
    stableKey: "FS_MOD_03",
    position: 8,
    style: "MODULAR_SERIAL",
    prompt: {
      pt: "Prefiro alternar entre 2 ou 3 tipos diferentes de atividades ao longo do dia para não cansar.",
      en: "I prefer rotating across 2 or 3 distinct task types throughout the day to stay fresh.",
      es: "Prefiero alternar entre 2 o 3 tipos de actividad a lo largo del día para no saturarme.",
      fr: "J'alterne volontiers entre 2 ou 3 types d'activités dans la journée pour garder ma fraîcheur.",
    },
  },
  {
    stableKey: "FS_MOD_04",
    position: 9,
    style: "MODULAR_SERIAL",
    prompt: {
      pt: "Definir marcos claros e entregáveis parciais me mantém motivado e disciplinado.",
      en: "Setting explicit milestones and incremental deliverables keeps me focused and on track.",
      es: "Fijar hitos claros y entregables parciales me mantiene constante y motivado.",
      fr: "Fixer des jalons explicites et des livrables partiels préserve ma discipline.",
    },
  },
  {
    stableKey: "FS_MOD_05",
    position: 10,
    style: "MODULAR_SERIAL",
    prompt: {
      pt: "Mantenho minha caixa de entrada, arquivos e ambiente de trabalho sempre organizados.",
      en: "I maintain an organized inbox, disciplined filing system, and tidy work desk.",
      es: "Mantengo mi bandeja de entrada, carpetas y mesa de trabajo ordenados metódicamente.",
      fr: "Je garde ma boîte de réception, mes dossiers et mon espace de travail soigneusement ordonnés.",
    },
  },
  // COLLABORATIVE (5)
  {
    stableKey: "FS_COL_01",
    position: 11,
    style: "COLLABORATIVE",
    prompt: {
      pt: "Penso melhor em voz alta, discutindo ideias e hipóteses com colegas em tempo real.",
      en: "I think best out loud, batting ideas and hypotheses around with peers in real time.",
      es: "Pienso mejor en voz alta, debatiendo ideas e hipótesis con colegas en tiempo real.",
      fr: "Je réfléchis mieux à voix haute, en échangeant des idées avec mes pairs en direct.",
    },
  },
  {
    stableKey: "FS_COL_02",
    position: 12,
    style: "COLLABORATIVE",
    prompt: {
      pt: "Sessões de cocriação e brainstorming coletivo elevam muito meu ritmo de entrega.",
      en: "Collaborative brainstorming and group workshops accelerate my productivity cadence.",
      es: "Las sesiones de cocreación y lluvia de ideas multiplican mi ritmo de trabajo.",
      fr: "Les sessions de co-création et ateliers collectifs démultiplient ma dynamique.",
    },
  },
  {
    stableKey: "FS_COL_03",
    position: 13,
    style: "COLLABORATIVE",
    prompt: {
      pt: "Trabalhar em isolamento total por muitos dias consecutivos me deixa desmotivado.",
      en: "Working in total isolation for extended periods drains my motivation.",
      es: "Trabajar en aislamiento total durante varios días seguidos me desmotiva.",
      fr: "Travailler dans un isolement complet plusieurs jours de suite érode ma motivation.",
    },
  },
  {
    stableKey: "FS_COL_04",
    position: 14,
    style: "COLLABORATIVE",
    prompt: {
      pt: "Receber feedback frequente e rápido me ajuda a calibrar prioridades com assertividade.",
      en: "Getting quick, iterative feedback helps me calibrate priorities effectively.",
      es: "Recibir retroalimentación frecuente y ágil me ayuda a calibrar el rumbo.",
      fr: "Recevoir des retours rapides et réguliers m'aide à bien ajuster mes priorités.",
    },
  },
  {
    stableKey: "FS_COL_05",
    position: 15,
    style: "COLLABORATIVE",
    prompt: {
      pt: "Gosto de construir consensos e engajar o grupo em torno de uma direção comum.",
      en: "I enjoy building alignment and galvanizing the team around a shared direction.",
      es: "Me entusiasma generar consensos y movilizar al equipo hacia un objetivo común.",
      fr: "J'aime fédérer les énergies et bâtir un consensus autour d'une vision partagée.",
    },
  },
  // REACTIVE_SPRINT (5)
  {
    stableKey: "FS_SPR_01",
    position: 16,
    style: "REACTIVE_SPRINT",
    prompt: {
      pt: "Produzo com intensidade máxima quando há prazos curtos e urgência real no ar.",
      en: "I produce at peak intensity when deadlines are tight and real urgency is present.",
      es: "Rindo al máximo nivel cuando hay plazos apretados y urgencia real en el ambiente.",
      fr: "Je délivre une intensité maximale lorsque les échéances sont courtes et l'urgence palpable.",
    },
  },
  {
    stableKey: "FS_SPR_02",
    position: 17,
    style: "REACTIVE_SPRINT",
    prompt: {
      pt: "Situações imprevistas e crises que exigem respostas rápidas me energizam.",
      en: "Unforeseen emergencies requiring swift, tactical responses bring out my best.",
      es: "Los imprevistos y las crisis que exigen respuestas rápidas despiertan mi energía.",
      fr: "Les imprévus et les crises exigeant une réaction rapide mobilisent toute mon énergie.",
    },
  },
  {
    stableKey: "FS_SPR_03",
    position: 18,
    style: "REACTIVE_SPRINT",
    prompt: {
      pt: "Prefiro semanas dinâmicas e imprevisíveis a rotinas perfeitamente planejadas com antecedência.",
      en: "I prefer fast-moving, dynamic weeks over rigidly scripted routines.",
      es: "Prefiero semanas dinámicas e impredecibles a calendarios monótonos hiperplanificados.",
      fr: "Je préfère les semaines dynamiques et mouvantes aux plannings rigides et prévisibles.",
    },
  },
  {
    stableKey: "FS_SPR_04",
    position: 19,
    style: "REACTIVE_SPRINT",
    prompt: {
      pt: "Tenho facilidade para tomar decisões com informações incompletas sob pressão de tempo.",
      en: "I readily make sound judgment calls under time crunch with incomplete data.",
      es: "Decido con agilidad incluso con información parcial y presión de reloj.",
      fr: "Je tranche sans hésiter même avec des données partielles et sous pression du temps.",
    },
  },
  {
    stableKey: "FS_SPR_05",
    position: 20,
    style: "REACTIVE_SPRINT",
    prompt: {
      pt: "Alterno períodos de esforço concentrado de alta carga com momentos de descompressão rápida.",
      en: "I alternate high-octane crunch sprints with deliberate quick decompression periods.",
      es: "Alterno picos de sprint de máxima exigencia con etapas de descompresión ágil.",
      fr: "J'alterne des sprints à haute intensité avec des phases de récupération ciblée.",
    },
  },
];
