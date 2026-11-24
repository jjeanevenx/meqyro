import "server-only";
import type { Locale } from "@/lib/i18n/config";
import { getDimensionLabel } from "@/lib/i18n/dimension-labels";

type Translation = readonly [string, string, string, string];
const pick = (row: Translation, locale: Locale) =>
  row[({ pt: 0, en: 1, es: 2, fr: 3 } as const)[locale]];

// Low and high describe the observed construct, never a diagnosis or a value judgement.
const readings: Readonly<Record<string, readonly [Translation, Translation]>> = {
  PATTERN_RECOGNITION: [
    [
      "As regras das sequências foram uma dificuldade nesta tentativa.",
      "Sequence rules were difficult in this attempt.",
      "Las reglas de las secuencias resultaron difíciles en este intento.",
      "Les règles des suites ont posé difficulté lors de cet essai.",
    ],
    [
      "Você identificou a maioria das regras apresentadas nas sequências.",
      "You identified most rules presented in the sequences.",
      "Identificaste la mayoría de las reglas de las secuencias.",
      "Vous avez identifié la plupart des règles des suites proposées.",
    ],
  ],
  LOGICAL_REASONING: [
    [
      "Distinguir conclusões necessárias de suposições merece prática nesta área.",
      "Separating necessary conclusions from assumptions deserves practice here.",
      "Conviene practicar la distinción entre conclusiones necesarias y suposiciones.",
      "Distinguer les conclusions nécessaires des suppositions mérite ici de la pratique.",
    ],
    [
      "Suas respostas sustentaram a maior parte das inferências pedidas.",
      "Your answers supported most of the requested inferences.",
      "Tus respuestas sostuvieron la mayoría de las inferencias solicitadas.",
      "Vos réponses ont étayé la plupart des inférences demandées.",
    ],
  ],
  NUMERICAL_REASONING: [
    [
      "As relações entre quantidades exigiram mais esforço nesta tentativa.",
      "Relationships between quantities required more effort in this attempt.",
      "Las relaciones entre cantidades exigieron más esfuerzo en este intento.",
      "Les relations entre quantités ont demandé plus d’effort lors de cet essai.",
    ],
    [
      "Você resolveu a maioria das relações numéricas propostas.",
      "You solved most of the numerical relationships presented.",
      "Resolviste la mayoría de las relaciones numéricas propuestas.",
      "Vous avez résolu la plupart des relations numériques proposées.",
    ],
  ],
  ATTENTION: [
    [
      "A discriminação dos detalhes pedidos foi uma dificuldade nas tarefas realizadas.",
      "Distinguishing the requested details was difficult in these tasks.",
      "Distinguir los detalles solicitados resultó difícil en estas tareas.",
      "La distinction des détails demandés a posé difficulté dans ces tâches.",
    ],
    [
      "Você distinguiu corretamente a maioria dos detalhes pedidos.",
      "You correctly distinguished most of the requested details.",
      "Distinguiste correctamente la mayoría de los detalles solicitados.",
      "Vous avez correctement distingué la plupart des détails demandés.",
    ],
  ],
  PROBLEM_SOLVING: [
    [
      "Organizar as condições dos problemas merece atenção na prática seguinte.",
      "Organising problem constraints deserves attention in your next practice.",
      "Organizar las condiciones de los problemas merece atención en la próxima práctica.",
      "Organiser les contraintes des problèmes mérite de l’attention lors du prochain exercice.",
    ],
    [
      "Você conciliou corretamente a maioria das condições dos problemas apresentados.",
      "You correctly reconciled most constraints in the problems presented.",
      "Conciliaste correctamente la mayoría de las condiciones de los problemas.",
      "Vous avez correctement concilié la plupart des contraintes des problèmes proposés.",
    ],
  ],
  SPEED: [
    [
      "Houve menos acertos nos itens desta área; confira a precisão antes de aumentar o ritmo.",
      "There were fewer correct answers here; check accuracy before increasing pace.",
      "Hubo menos aciertos en esta área; revisa la precisión antes de acelerar.",
      "Il y a eu moins de réponses justes ici ; vérifiez la précision avant d’accélérer.",
    ],
    [
      "Você acertou a maioria destes itens; o tempo deve ser lido nas métricas separadas.",
      "You answered most of these items correctly; read time in the separate metrics.",
      "Acertaste la mayoría de estos ítems; consulta el tiempo en las métricas separadas.",
      "Vous avez réussi la plupart de ces items ; consultez le temps dans les mesures séparées.",
    ],
  ],
  BUILDER: [
    [
      "Avançar projetos de longo prazo foi menos escolhido quando outras prioridades estavam disponíveis.",
      "Advancing long-term projects was chosen less when other priorities were available.",
      "Avanzar proyectos a largo plazo se eligió menos cuando había otras prioridades.",
      "Faire avancer les projets à long terme a été moins choisi face aux autres priorités.",
    ],
    [
      "Você priorizou construir projetos quando essa alternativa estava disponível.",
      "You prioritised building projects when that alternative was available.",
      "Priorizaste construir proyectos cuando esa alternativa estaba disponible.",
      "Vous avez privilégié la construction de projets quand cette option était disponible.",
    ],
  ],
  GUARDIAN: [
    [
      "Preservar uma margem para imprevistos apareceu menos nas escolhas disponíveis.",
      "Preserving a cushion for surprises appeared less in the available choices.",
      "Preservar un margen para imprevistos apareció menos entre las elecciones disponibles.",
      "Préserver une marge pour les imprévus est moins apparu dans les choix disponibles.",
    ],
    [
      "Preservar recursos diante de imprevistos foi uma prioridade recorrente nas suas escolhas.",
      "Preserving resources for surprises was a recurring priority in your choices.",
      "Conservar recursos ante imprevistos fue una prioridad recurrente en tus elecciones.",
      "Préserver des ressources face aux imprévus a été une priorité récurrente dans vos choix.",
    ],
  ],
  STRATEGIST: [
    [
      "Comparar alternativas antes de alocar recursos foi menos escolhido nestes cenários.",
      "Comparing alternatives before allocating resources was chosen less in these scenarios.",
      "Comparar alternativas antes de asignar recursos se eligió menos en estos escenarios.",
      "Comparer les options avant d’affecter les ressources a été moins choisi dans ces scénarios.",
    ],
    [
      "Você escolheu comparar custos e consequências com frequência nas oportunidades oferecidas.",
      "You frequently chose to compare costs and consequences when offered the opportunity.",
      "Elegiste comparar costes y consecuencias con frecuencia cuando se ofrecía esa opción.",
      "Vous avez souvent choisi de comparer coûts et conséquences lorsque cette option était proposée.",
    ],
  ],
  ADVENTURER: [
    [
      "Experiências no presente cederam espaço a outras prioridades nas suas escolhas.",
      "Present experiences gave way to other priorities in your choices.",
      "Las experiencias presentes cedieron espacio a otras prioridades en tus elecciones.",
      "Les expériences présentes ont cédé la place à d’autres priorités dans vos choix.",
    ],
    [
      "Você deu espaço frequente a experiências presentes; isso não estima risco de investimento.",
      "You often made room for present experiences; this does not estimate investment risk.",
      "Diste espacio frecuente a experiencias presentes; esto no estima riesgo de inversión.",
      "Vous avez souvent privilégié les expériences présentes ; cela n’estime pas le risque d’investissement.",
    ],
  ],
  BALANCER: [
    [
      "Dividir recursos entre o presente e o futuro foi menos escolhido; outras prioridades podem estar conduzindo suas decisões.",
      "Splitting resources between present and future was chosen less; other priorities may be guiding your decisions.",
      "Repartir recursos entre presente y futuro se eligió menos; otras prioridades pueden guiar tus decisiones.",
      "Répartir les ressources entre présent et avenir a été moins choisi ; d’autres priorités peuvent guider vos décisions.",
    ],
    [
      "Você escolheu conciliar necessidades atuais e metas futuras em boa parte das oportunidades.",
      "You chose to reconcile current needs and future goals in many available opportunities.",
      "Elegiste conciliar necesidades actuales y metas futuras en muchas oportunidades.",
      "Vous avez choisi de concilier besoins actuels et objectifs futurs dans de nombreuses situations.",
    ],
  ],
};

const coupleTopics: Readonly<Record<string, Translation>> = {
  COMMUNICATION: ["a comunicação", "communication", "la comunicación", "la communication"],
  LIFE_VALUES: [
    "os valores e limites pessoais",
    "personal values and boundaries",
    "los valores y límites personales",
    "les valeurs et limites personnelles",
  ],
  CONFLICT_MANAGEMENT: ["os desacordos", "disagreements", "los desacuerdos", "les désaccords"],
  FINANCES: [
    "as decisões financeiras do casal",
    "shared financial decisions",
    "las decisiones financieras de pareja",
    "les décisions financières du couple",
  ],
  FUTURE_PLANS: ["os planos futuros", "future plans", "los planes futuros", "les projets futurs"],
};

export function resultReading(
  dimension: string,
  value: number,
  locale: Locale,
): string | undefined {
  const topic = coupleTopics[dimension];
  if (topic) {
    const approach =
      value < 40
        ? pick(
            [
              "Você preferiu organizar individualmente suas necessidades antes de abordar",
              "You preferred to organise your needs individually before addressing",
              "Preferiste ordenar individualmente tus necesidades antes de abordar",
              "Vous avez préféré clarifier individuellement vos besoins avant d’aborder",
            ],
            locale,
          )
        : value >= 70
          ? pick(
              [
                "Você preferiu elaborar explicitamente em conjunto",
                "You preferred explicit joint discussion of",
                "Preferiste elaborar explícitamente en conjunto",
                "Vous avez préféré élaborer explicitement ensemble",
              ],
              locale,
            )
          : pick(
              [
                "Suas escolhas combinaram reflexão individual e ajustes conjuntos ao abordar",
                "Your choices combined individual reflection and joint adjustments in",
                "Tus elecciones combinaron reflexión individual y ajustes conjuntos al abordar",
                "Vos choix ont combiné réflexion individuelle et ajustements communs pour",
              ],
              locale,
            );
    return `${approach} ${pick(topic, locale)}.`;
  }
  const row = readings[dimension];
  if (!row) return undefined;
  if (value < 40) return pick(row[0], locale);
  if (
    value >=
    (!["BUILDER", "GUARDIAN", "STRATEGIST", "ADVENTURER", "BALANCER"].includes(dimension) ? 75 : 70)
  )
    return pick(row[1], locale);
  return pick(
    [
      `Em ${getDimensionLabel(dimension, locale)}, as respostas ficaram na faixa intermediária; examine os contextos antes de generalizar.`,
      `For ${getDimensionLabel(dimension, locale)}, responses fell in the middle range; examine the contexts before generalising.`,
      `En ${getDimensionLabel(dimension, locale)}, las respuestas quedaron en la franja intermedia; examina los contextos antes de generalizar.`,
      `Pour ${getDimensionLabel(dimension, locale)}, les réponses se situent dans la zone intermédiaire ; examinez les contextes avant de généraliser.`,
    ],
    locale,
  );
}

/** A concrete review method accompanies the dimension-specific exercise. */
export function resultAction(
  slug: string,
  value: number,
  exercise: string,
  locale: Locale,
): string {
  const row: Translation =
    slug === "brainrank"
      ? value < 40
        ? [
            "Em três sessões curtas nesta semana, resolva cinco itens sem cronômetro, registre a regra e revise cada erro.",
            "In three short sessions this week, solve five items without a timer, record the rule and review every error.",
            "En tres sesiones breves esta semana, resuelve cinco ítems sin cronómetro, anota la regla y revisa cada error.",
            "Lors de trois courtes séances cette semaine, résolvez cinq items sans chronomètre, notez la règle et revoyez chaque erreur.",
          ]
        : value >= 75
          ? [
              "Nesta semana, experimente cinco itens novos de maior complexidade. Registre acertos e tempo separadamente e mantenha a precisão antes de acelerar.",
              "This week, try five new items of greater complexity. Record accuracy and time separately and maintain accuracy before accelerating.",
              "Esta semana prueba cinco ítems nuevos de mayor complejidad. Registra aciertos y tiempo por separado y mantén la precisión antes de acelerar.",
              "Cette semaine, essayez cinq nouveaux items plus complexes. Consignez précision et temps séparément et préservez la précision avant d’accélérer.",
            ]
          : [
              "Faça duas sessões com cinco itens novos nesta semana. Agrupe os erros por tipo e confira se o mesmo tipo reaparece na segunda sessão.",
              "Do two sessions of five new items this week. Group errors by type and check whether the same type returns in the second session.",
              "Haz dos sesiones de cinco ítems nuevos esta semana. Agrupa los errores por tipo y comprueba si se repiten en la segunda sesión.",
              "Faites deux séances de cinq nouveaux items cette semaine. Classez les erreurs par type et vérifiez si le même type revient à la seconde séance.",
            ]
      : slug === "moneydna"
        ? value < 40
          ? [
              "Antes da próxima decisão, teste esta prioridade em uma alternativa de baixo custo. Em sete dias, confira o efeito no orçamento e na meta escolhida.",
              "Before your next decision, test this priority in a low-cost alternative. In seven days, check its effect on your budget and chosen goal.",
              "Antes de tu próxima decisión, prueba esta prioridad en una alternativa de bajo coste. En siete días revisa el efecto en tu presupuesto y meta.",
              "Avant votre prochaine décision, testez cette priorité avec une option peu coûteuse. Dans sept jours, vérifiez son effet sur le budget et l’objectif choisi.",
            ]
          : value >= 70
            ? [
                "Na próxima decisão, escreva também o que esta prioridade deixa em segundo plano. Defina um limite de gasto e revise em sete dias se o equilíbrio funcionou.",
                "In your next decision, also write down what this priority puts second. Set a spending limit and review the balance in seven days.",
                "En tu próxima decisión anota también qué deja en segundo plano esta prioridad. Fija un límite de gasto y revisa el equilibrio en siete días.",
                "Lors de votre prochaine décision, notez aussi ce que cette priorité relègue au second plan. Fixez un plafond de dépense et revoyez l’équilibre dans sept jours.",
              ]
            : [
                "Compare duas decisões recentes: quando esta prioridade ajudou e quando outra foi mais útil? Escolha um critério para a próxima semana e revise o resultado no orçamento.",
                "Compare two recent decisions: when did this priority help and when was another more useful? Pick a criterion for next week and review the budget outcome.",
                "Compara dos decisiones recientes: ¿cuándo ayudó esta prioridad y cuándo otra fue más útil? Elige un criterio para la próxima semana y revisa el resultado presupuestario.",
                "Comparez deux décisions récentes : quand cette priorité a-t-elle aidé, et quand une autre a-t-elle été plus utile ? Choisissez un critère pour la semaine et revoyez le résultat budgétaire.",
              ]
        : value < 40
          ? [
              "Combine um momento para retomar o assunto depois da sua reflexão. Expresse uma necessidade e um limite, pergunte a preferência da outra pessoa e revisitem o acordo em uma semana.",
              "Agree a time to return to the topic after reflecting. Express one need and one boundary, ask your partner’s preference and revisit the agreement in a week.",
              "Acuerda cuándo retomar el tema después de reflexionar. Expresa una necesidad y un límite, pregunta la preferencia de tu pareja y revisad el acuerdo en una semana.",
              "Convenez d’un moment pour reprendre le sujet après réflexion. Exprimez un besoin et une limite, demandez la préférence de l’autre et revoyez l’accord dans une semaine.",
            ]
          : value >= 70
            ? [
                "Antes da conversa, pergunte se a outra pessoa precisa de tempo individual. Combinem um ajuste pequeno e verificável, sem exigir concordância imediata, e revisitem em uma semana.",
                "Before talking, ask whether your partner needs individual time. Agree a small observable adjustment without demanding immediate agreement, then review it in a week.",
                "Antes de hablar, pregunta si tu pareja necesita tiempo individual. Acordad un ajuste pequeño y observable sin exigir acuerdo inmediato y revisadlo en una semana.",
                "Avant l’échange, demandez si l’autre a besoin d’un temps individuel. Convenez d’un petit ajustement observable sans exiger d’accord immédiat, puis revoyez-le dans une semaine.",
              ]
            : [
                "Escolham uma situação concreta e combinem o que cada um pode decidir sozinho e o que pede conversa conjunta. Em uma semana, verifiquem se o combinado respeitou os dois.",
                "Choose one concrete situation and agree what each person can decide alone and what needs joint discussion. In a week, check whether the agreement respected both people.",
                "Elegid una situación concreta y acordad qué puede decidir cada persona a solas y qué pide conversación conjunta. En una semana comprobad si el acuerdo respetó a ambas.",
                "Choisissez une situation précise et convenez de ce que chacun peut décider seul et de ce qui demande un échange commun. Dans une semaine, vérifiez le respect des deux personnes.",
              ];
  return `${exercise} ${pick(row, locale)}`;
}

export function resultOverview(
  slug: string,
  dimensions: readonly (readonly [string, number])[],
  locale: Locale,
): string {
  if (!dimensions.length) return "";
  const sorted = [...dimensions].sort((a, b) => b[1] - a[1]);
  const max = sorted[0][1],
    min = sorted[sorted.length - 1][1];
  const format = (entries: readonly (readonly [string, number])[]) =>
    entries.map(([d, v]) => `${getDimensionLabel(d, locale)} (${v}/100)`).join(", ");
  if (max === min)
    return pick(
      [
        `${slug}: todos os indicadores ficaram em ${max}/100. Não há uma dimensão predominante nesta tentativa.`,
        `${slug}: all indicators were ${max}/100. No dimension predominates in this attempt.`,
        `${slug}: todos los indicadores quedaron en ${max}/100. Ninguna dimensión predomina en este intento.`,
        `${slug} : tous les indicateurs sont à ${max}/100. Aucune dimension ne prédomine lors de cet essai.`,
      ],
      locale,
    );
  const top = format(sorted.filter(([, v]) => v === max)),
    bottom = format(sorted.filter(([, v]) => v === min));
  return slug === "coupledna"
    ? pick(
        [
          `Você escolheu mais elaboração conjunta em ${top}, e mais reflexão individual em ${bottom}. Nenhum polo indica qualidade do relacionamento; considere o contexto e os limites de cada pessoa.`,
          `You chose more joint discussion in ${top}, and more individual reflection in ${bottom}. Neither pole indicates relationship quality; consider context and each person’s boundaries.`,
          `Elegiste más elaboración conjunta en ${top} y más reflexión individual en ${bottom}. Ningún polo indica calidad de relación; considera el contexto y los límites de cada persona.`,
          `Vous avez choisi davantage d’élaboration commune pour ${top}, et de réflexion individuelle pour ${bottom}. Aucun pôle n’indique la qualité de la relation ; considérez le contexte et les limites de chacun.`,
        ],
        locale,
      )
    : pick(
        [
          `Os maiores índices foram ${top}. Os menores foram ${bottom}. ${slug === "brainrank" ? "Comece a prática pelas áreas com menos acertos." : "Compare as prioridades mais e menos escolhidas nas decisões abaixo; um índice menor não representa deficiência."}`,
          `The highest indices were ${top}. The lowest were ${bottom}. ${slug === "brainrank" ? "Start practising the areas with fewer correct answers." : "Compare more and less selected priorities in the decisions below; a lower index is not a deficiency."}`,
          `Los índices más altos fueron ${top}. Los más bajos fueron ${bottom}. ${slug === "brainrank" ? "Empieza a practicar las áreas con menos aciertos." : "Compara las prioridades más y menos elegidas en las decisiones siguientes; un índice menor no representa una carencia."}`,
          `Les indices les plus élevés sont ${top}. Les plus faibles sont ${bottom}. ${slug === "brainrank" ? "Commencez par les domaines avec moins de réponses justes." : "Comparez les priorités plus et moins choisies dans les décisions ci-dessous ; un indice faible n’est pas une déficience."}`,
        ],
        locale,
      );
}
