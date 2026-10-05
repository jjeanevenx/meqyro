import "server-only";

import { dimensionGuidance, type DimensionGuidance } from "@/features/results/dimension-guidance";
import type { Locale } from "@/lib/i18n/config";

type GuidanceKey = keyof typeof dimensionGuidance;
type GuidanceTable = Readonly<Record<GuidanceKey, DimensionGuidance>>;

export const localizedDimensionGuidance: Readonly<Record<Locale, GuidanceTable>> = {
  pt: dimensionGuidance,
  en: {
    PATTERN_RECOGNITION: {
      meaning: "Recognising the rule that repeats across shapes or sequences.",
      try: "Compare what changes and what stays the same before choosing an answer.",
      watch: "A visual similarity can hide a different rule.",
    },
    LOGICAL_REASONING: {
      meaning: "Drawing conclusions from the information you are given.",
      try: "Separate what the question states from what you are assuming.",
      watch: "A plausible conclusion is not always a proven one.",
    },
    NUMERICAL_REASONING: {
      meaning: "Understanding relationships between quantities, proportions and numbers.",
      try: "Write down the relationship between the numbers before calculating.",
      watch: "Rushing a calculation can hide a misunderstanding of the question.",
    },
    ATTENTION: {
      meaning: "Noticing relevant details and distinguishing similar information.",
      try: "Read again, looking only for the detail that separates the options.",
      watch: "Interruptions and tiredness can affect your performance on this task.",
    },
    PROBLEM_SOLVING: {
      meaning: "Organising information to find a solution.",
      try: "Break the problem into small steps and check one condition at a time.",
      watch: "Sticking to your first strategy can make another solution harder to see.",
    },
    SPEED: {
      meaning:
        "Solving items assigned to this dimension. The index summarises correct answers; it does not measure mental speed on its own.",
      try: "Understand the rule first, then try reducing time while keeping accuracy.",
      watch: "Answering quickly does not necessarily mean answering well.",
    },
    OPENNESS: {
      meaning: "Your reported preference for exploring new ideas and experiences.",
      try: "Try a new approach on a small task and compare it with your usual one.",
      watch: "Always seeking something new can make it harder to finish what you start.",
    },
    CONSCIENTIOUSNESS: {
      meaning: "Your preference for organisation, planning and following tasks through.",
      try: "Choose three realistic priorities for today and review what worked.",
      watch: "A very rigid plan can increase frustration when things change.",
    },
    EXTRAVERSION: {
      meaning: "How much you identify with social interaction and external stimulation.",
      try: "Notice whether a conversation or some quiet time restores your energy more.",
      watch: "Your approach can vary with the people and setting.",
    },
    AGREEABLENESS: {
      meaning: "Your preference for cooperation and consideration of other people.",
      try: "Practise saying what you need clearly while respecting the other person.",
      watch: "Avoiding every disagreement can leave little space for your own needs.",
    },
    EMOTIONAL_STABILITY: {
      meaning: "How you described your reactions to pressure and unexpected events.",
      try: "Identify a situation that often creates tension and plan a pause before reacting.",
      watch: "This index does not assess mental health or provide a diagnosis.",
    },
    TECHNICAL: {
      meaning: "Your interest in deepening knowledge and solving specialised problems.",
      try: "Set aside time to develop a skill and make something that shows your progress.",
      watch: "Going deeply into everything can compete with deadlines and priorities.",
    },
    MANAGERIAL: {
      meaning: "Your interest in coordinating people, decisions and results.",
      try: "Set clear responsibilities for a project and agree how to track its outcome.",
      watch: "Taking every decision yourself can overload you and limit the group's autonomy.",
    },
    CREATIVE: {
      meaning: "Your interest in creating, experimenting and turning ideas into projects.",
      try: "Test an idea on a small scale before investing a lot of time in it.",
      watch: "Having many ideas at once can make execution harder.",
    },
    AUTONOMOUS: {
      meaning: "Your preference for freedom to organise your own work.",
      try: "Agree on the expected result and deadline, making freedom in execution explicit.",
      watch: "Autonomy works better when expectations and boundaries are clear.",
    },
    SECURITY: {
      meaning: "How much predictability and stability matter in your career choices.",
      try: "List the minimum conditions of stability you need before considering a change.",
      watch: "Avoiding all uncertainty can rule out opportunities that fit your goals.",
    },
    CAUSE: {
      meaning: "The importance of purpose and contribution in your career choices.",
      try: "Connect a specific task to the impact you would like to make.",
      watch: "Commitment to a cause still calls for boundaries and rest.",
    },
    BUILDER: {
      meaning: "How much you identify with building resources and projects over time.",
      try: "Break a goal into stages and follow through on one small weekly action.",
      watch: "Ambition without priorities can spread your resources across too many projects.",
    },
    GUARDIAN: {
      meaning:
        "How much you identify with care, protection and predictability when handling resources.",
      try: "Set clear decision criteria so you do not have to reconsider everything each time.",
      watch: "This profile does not tell you which investment is suitable for you.",
    },
    STRATEGIST: {
      meaning: "Your preference for comparing alternatives and planning before deciding.",
      try: "Write down your decision criteria and set a time to finish the analysis.",
      watch: "Looking for information without a limit can delay simple decisions.",
    },
    ADVENTURER: {
      meaning: "How much you identify with exploring possibilities and accepting uncertainty.",
      try: "Before experimenting, decide how much time and resources you are willing to commit.",
      watch: "Enthusiasm does not replace considering the consequences.",
    },
    BALANCER: {
      meaning: "Your preference for balancing today's needs with future goals.",
      try: "Review your priorities and choose one concrete commitment for this week.",
      watch: "Balance depends on your circumstances, rather than a perfect proportion.",
    },
    IMMERSIVE_HYPERFOCUS: {
      meaning: "Your preference for immersing yourself in a task with few interruptions.",
      try: "Try a protected work block with a clear start, break and goal.",
      watch: "Long immersion can lead you to postpone rest or other priorities.",
    },
    MODULAR_SERIAL: {
      meaning: "Your preference for short steps, lists and one task at a time.",
      try: "Break a task into small steps and see whether that rhythm helps you progress.",
      watch: "Organising the list should not take longer than doing the task.",
    },
    COLLABORATIVE: {
      meaning: "Your preference for exchanging ideas and building solutions with other people.",
      try: "Arrange a short conversation to unblock a decision, then reserve time to act on it.",
      watch: "Conversations without a goal can interrupt work instead of helping.",
    },
    REACTIVE_SPRINT: {
      meaning:
        "How much you identify with short bursts of energy and responding to immediate demands.",
      try: "Use a short block with one clear priority and plan a break afterwards.",
      watch: "Always relying on urgency can increase strain and leave important tasks for later.",
    },
    ANALYTICAL: {
      meaning: "Your preference for deciding by comparing information and criteria.",
      try: "Choose the three criteria that matter most and a deadline for deciding.",
      watch: "More information does not always change the decision.",
    },
    INTUITIVE: {
      meaning: "Your preference for deciding from impressions and previous experience.",
      try: "Write down your first impression and check at least one fact that supports or challenges it.",
      watch: "A strong impression can also reflect a bias.",
    },
    PRAGMATIC: {
      meaning: "Your preference for practical solutions and quick action.",
      try: "Choose a reversible step to test your choice before going further.",
      watch: "Solving the immediate problem can leave future consequences unexplored.",
    },
    COMMUNICATION: {
      meaning: "How you described talking and listening in your relationship.",
      try: "Discuss a specific situation by explaining what you felt and what you need.",
      watch:
        "Your individual answers cannot tell you how your partner experiences the relationship.",
    },
    LIFE_VALUES: {
      meaning: "How you described important topics and priorities in your life together.",
      try: "Each person can list three priorities and discuss differences without trying to win.",
      watch: "Agreeing with a statement does not guarantee you understand it in the same way.",
    },
    CONFLICT_MANAGEMENT: {
      meaning: "How you described your reactions to differences and disagreements.",
      try: "Agree on a pause and a time to return to difficult conversations.",
      watch: "The assessment does not determine the safety or quality of a relationship.",
    },
    FINANCES: {
      meaning: "How you described organising resources and discussing money in your relationship.",
      try: "Discuss a specific decision, making expectations and limits clear.",
      watch: "Do not use a score to decide who is right.",
    },
    FUTURE_PLANS: {
      meaning: "How you described expectations and shared planning.",
      try: "Discuss a near-term goal and what each of you expects to do to reach it.",
      watch: "Expectations change; revisit them over time.",
    },
  },
  es: {
    PATTERN_RECOGNITION: {
      meaning: "Reconocer la regla que se repite entre formas o secuencias.",
      try: "Compara qué cambia y qué permanece igual antes de elegir una respuesta.",
      watch: "Una semejanza visual puede ocultar una regla diferente.",
    },
    LOGICAL_REASONING: {
      meaning: "Sacar conclusiones a partir de la información proporcionada.",
      try: "Separa lo que afirma la pregunta de lo que estás suponiendo.",
      watch: "Una conclusión plausible no siempre es una conclusión demostrada.",
    },
    NUMERICAL_REASONING: {
      meaning: "Entender relaciones entre cantidades, proporciones y números.",
      try: "Escribe la relación entre los números antes de calcular.",
      watch: "La prisa al calcular puede ocultar un error de interpretación.",
    },
    ATTENTION: {
      meaning: "Percibir detalles relevantes y distinguir información parecida.",
      try: "Lee de nuevo buscando solo el detalle que diferencia las opciones.",
      watch: "Las interrupciones y el cansancio pueden afectar tu desempeño en esta tarea.",
    },
    PROBLEM_SOLVING: {
      meaning: "Organizar información para encontrar una solución.",
      try: "Divide el problema en pasos pequeños y comprueba una condición cada vez.",
      watch: "Insistir en la primera estrategia puede dificultar ver otra salida.",
    },
    SPEED: {
      meaning:
        "Resolver los ejercicios asignados a esta dimensión. El índice resume aciertos; no mide por sí solo tu velocidad mental.",
      try: "Primero entiende la regla; después intenta reducir el tiempo manteniendo la precisión.",
      watch: "Responder rápido no significa necesariamente responder bien.",
    },
    OPENNESS: {
      meaning: "Tu preferencia declarada por explorar ideas y experiencias nuevas.",
      try: "Prueba un enfoque nuevo en una tarea pequeña y compáralo con el habitual.",
      watch: "Buscar novedades constantemente puede dificultar terminar lo que empiezas.",
    },
    CONSCIENTIOUSNESS: {
      meaning: "Tu preferencia por la organización, la planificación y el seguimiento de tareas.",
      try: "Elige tres prioridades realistas para hoy y revisa qué funcionó.",
      watch: "Un plan muy rígido puede aumentar la frustración cuando algo cambia.",
    },
    EXTRAVERSION: {
      meaning: "Cuánto te identificas con la interacción social y los estímulos externos.",
      try: "Observa si una conversación o un rato de silencio te ayuda más a recuperar energía.",
      watch: "Tu forma de actuar puede variar según las personas y el entorno.",
    },
    AGREEABLENESS: {
      meaning: "Tu preferencia por cooperar y tener en cuenta a otras personas.",
      try: "Practica expresar lo que necesitas con claridad y respeto por la otra persona.",
      watch: "Evitar todo desacuerdo puede dejar poco espacio para tus necesidades.",
    },
    EMOTIONAL_STABILITY: {
      meaning: "Cómo describiste tus reacciones ante la presión y los imprevistos.",
      try: "Identifica una situación que suele generar tensión y prepara una pausa antes de reaccionar.",
      watch: "Este índice no evalúa la salud mental ni permite un diagnóstico.",
    },
    TECHNICAL: {
      meaning: "Tu interés por profundizar conocimientos y resolver problemas especializados.",
      try: "Reserva tiempo para desarrollar una habilidad y crear algo que muestre tu progreso.",
      watch: "Profundizar en todo puede competir con plazos y prioridades.",
    },
    MANAGERIAL: {
      meaning: "Tu interés por coordinar personas, decisiones y resultados.",
      try: "Define responsabilidades claras en un proyecto y acuerda cómo seguir el resultado.",
      watch: "Asumir todas las decisiones puede sobrecargarte y reducir la autonomía del grupo.",
    },
    CREATIVE: {
      meaning: "Tu interés por crear, experimentar y convertir ideas en proyectos.",
      try: "Prueba una idea a pequeña escala antes de dedicarle mucho tiempo.",
      watch: "Tener muchas ideas a la vez puede dificultar llevarlas a la práctica.",
    },
    AUTONOMOUS: {
      meaning: "Tu preferencia por la libertad para organizar tu propio trabajo.",
      try: "Acuerda el resultado esperado y el plazo, dejando clara la libertad para ejecutarlo.",
      watch: "La autonomía funciona mejor con expectativas y límites claros.",
    },
    SECURITY: {
      meaning: "Cuánto pesan la previsibilidad y la estabilidad en tus elecciones profesionales.",
      try: "Enumera las condiciones mínimas de estabilidad que necesitas antes de considerar un cambio.",
      watch: "Evitar toda incertidumbre puede cerrar oportunidades compatibles con tus objetivos.",
    },
    CAUSE: {
      meaning: "La importancia del propósito y la contribución en tus elecciones profesionales.",
      try: "Relaciona una tarea concreta con el impacto que deseas generar.",
      watch: "Identificarte con una causa no elimina la necesidad de límites y descanso.",
    },
    BUILDER: {
      meaning: "Cuánto te identificas con construir recursos y proyectos a lo largo del tiempo.",
      try: "Divide un objetivo en etapas y sigue una pequeña acción semanal.",
      watch: "La ambición sin prioridades puede dispersar tus recursos entre demasiados proyectos.",
    },
    GUARDIAN: {
      meaning:
        "Cuánto te identificas con el cuidado, la protección y la previsibilidad al manejar recursos.",
      try: "Define criterios claros para decidir sin reconsiderarlo todo en cada ocasión.",
      watch: "Este perfil no indica qué inversión es adecuada para ti.",
    },
    STRATEGIST: {
      meaning: "Tu preferencia por comparar alternativas y planificar antes de decidir.",
      try: "Escribe los criterios de la decisión y fija un momento para terminar el análisis.",
      watch: "Buscar información sin un límite puede retrasar decisiones sencillas.",
    },
    ADVENTURER: {
      meaning: "Cuánto te identificas con experimentar posibilidades y aceptar incertidumbre.",
      try: "Antes de experimentar, define cuánto tiempo y recursos estás dispuesto a comprometer.",
      watch: "El entusiasmo no sustituye la evaluación de las consecuencias.",
    },
    BALANCER: {
      meaning: "Tu preferencia por equilibrar las necesidades actuales y los objetivos futuros.",
      try: "Revisa tus prioridades y elige un compromiso concreto para esta semana.",
      watch: "El equilibrio depende del contexto, no de una proporción perfecta.",
    },
    IMMERSIVE_HYPERFOCUS: {
      meaning: "Tu preferencia por sumergirte en una tarea con pocas interrupciones.",
      try: "Prueba un bloque de trabajo protegido con inicio, pausa y objetivo definidos.",
      watch: "Una inmersión prolongada puede hacerte posponer el descanso u otras prioridades.",
    },
    MODULAR_SERIAL: {
      meaning: "Tu preferencia por etapas cortas, listas y una tarea a la vez.",
      try: "Divide una tarea en pasos pequeños y comprueba si ese ritmo te ayuda a avanzar.",
      watch: "Organizar la lista no debería llevar más tiempo que realizar la tarea.",
    },
    COLLABORATIVE: {
      meaning: "Tu preferencia por intercambiar ideas y construir soluciones con otras personas.",
      try: "Acuerda una conversación breve para desbloquear una decisión y reserva tiempo para actuar después.",
      watch: "Las conversaciones sin objetivo pueden interrumpir el trabajo en vez de ayudar.",
    },
    REACTIVE_SPRINT: {
      meaning:
        "Cuánto te identificas con periodos breves de energía y respuestas a demandas inmediatas.",
      try: "Usa un bloque corto con una prioridad definida y reserva una pausa al terminar.",
      watch:
        "Depender siempre de la urgencia puede aumentar el desgaste y aplazar tareas importantes.",
    },
    ANALYTICAL: {
      meaning: "Tu preferencia por decidir comparando información y criterios.",
      try: "Elige los tres criterios más importantes y un plazo para decidir.",
      watch: "Más información no siempre cambia la decisión.",
    },
    INTUITIVE: {
      meaning: "Tu preferencia por decidir a partir de impresiones y experiencias anteriores.",
      try: "Escribe tu primera impresión y comprueba al menos un hecho que la apoye o la contradiga.",
      watch: "Una impresión fuerte también puede reflejar un sesgo.",
    },
    PRAGMATIC: {
      meaning: "Tu preferencia por soluciones prácticas y acciones rápidas.",
      try: "Define un paso reversible que permita probar la elección antes de avanzar.",
      watch: "Resolver lo inmediato puede dejar consecuencias futuras sin analizar.",
    },
    COMMUNICATION: {
      meaning: "Cómo describiste tu forma de conversar y escuchar en la relación.",
      try: "Habla de una situación concreta explicando lo que sentiste y lo que necesitas.",
      watch: "Tus respuestas individuales no permiten saber cómo vive tu pareja la relación.",
    },
    LIFE_VALUES: {
      meaning: "Cómo describiste los temas y prioridades importantes en la vida en pareja.",
      try: "Cada persona puede enumerar tres prioridades y hablar de las diferencias sin intentar imponerse.",
      watch: "Estar de acuerdo con una frase no garantiza entenderla de la misma manera.",
    },
    CONFLICT_MANAGEMENT: {
      meaning: "Cómo describiste tus reacciones ante diferencias y conflictos.",
      try: "Acuerda una pausa y un momento para retomar conversaciones difíciles.",
      watch: "El test no determina la seguridad ni la calidad de una relación.",
    },
    FINANCES: {
      meaning:
        "Cómo describiste la organización de recursos y las conversaciones sobre dinero en la relación.",
      try: "Hablad de una decisión concreta, aclarando expectativas y límites.",
      watch: "No uses una puntuación para decidir quién tiene razón.",
    },
    FUTURE_PLANS: {
      meaning: "Cómo describiste las expectativas y la planificación compartida.",
      try: "Hablad de una meta cercana y de lo que cada persona espera hacer para alcanzarla.",
      watch: "Las expectativas cambian; conviene revisarlas con el tiempo.",
    },
  },
  fr: {
    PATTERN_RECOGNITION: {
      meaning: "Reconnaître la règle qui se répète entre des formes ou des suites.",
      try: "Comparez ce qui change et ce qui reste identique avant de choisir une réponse.",
      watch: "Une ressemblance visuelle peut cacher une règle différente.",
    },
    LOGICAL_REASONING: {
      meaning: "Tirer des conclusions à partir des informations fournies.",
      try: "Distinguez ce que l'énoncé affirme de ce que vous supposez.",
      watch: "Une conclusion plausible n'est pas toujours une conclusion démontrée.",
    },
    NUMERICAL_REASONING: {
      meaning: "Comprendre les relations entre quantités, proportions et nombres.",
      try: "Écrivez la relation entre les nombres avant de calculer.",
      watch: "Calculer trop vite peut masquer une erreur d'interprétation.",
    },
    ATTENTION: {
      meaning: "Repérer les détails pertinents et distinguer des informations similaires.",
      try: "Relisez en cherchant uniquement le détail qui différencie les options.",
      watch: "Les interruptions et la fatigue peuvent modifier votre performance sur cette tâche.",
    },
    PROBLEM_SOLVING: {
      meaning: "Organiser les informations pour trouver une solution.",
      try: "Divisez le problème en petites étapes et vérifiez une condition à la fois.",
      watch: "Rester sur votre première stratégie peut empêcher de voir une autre solution.",
    },
    SPEED: {
      meaning:
        "Résoudre les exercices attribués à cette dimension. L'indice résume les bonnes réponses ; il ne mesure pas à lui seul votre vitesse mentale.",
      try: "Comprenez d'abord la règle, puis essayez de réduire le temps en préservant la précision.",
      watch: "Répondre vite ne signifie pas nécessairement bien répondre.",
    },
    OPENNESS: {
      meaning: "Votre préférence déclarée pour explorer des idées et des expériences nouvelles.",
      try: "Essayez une nouvelle approche sur une petite tâche et comparez-la à votre méthode habituelle.",
      watch:
        "Chercher constamment la nouveauté peut rendre difficile de terminer ce que vous commencez.",
    },
    CONSCIENTIOUSNESS: {
      meaning: "Votre préférence pour l'organisation, la planification et le suivi des tâches.",
      try: "Choisissez trois priorités réalistes pour aujourd'hui et examinez ce qui a fonctionné.",
      watch: "Un plan trop rigide peut accentuer la frustration lorsque les choses changent.",
    },
    EXTRAVERSION: {
      meaning:
        "À quel point vous vous reconnaissez dans les interactions sociales et les stimulations extérieures.",
      try: "Observez si une conversation ou un moment calme vous aide davantage à retrouver de l'énergie.",
      watch: "Votre façon d'agir peut varier selon les personnes et le contexte.",
    },
    AGREEABLENESS: {
      meaning: "Votre préférence pour la coopération et la considération envers les autres.",
      try: "Entraînez-vous à exprimer clairement vos besoins tout en respectant l'autre personne.",
      watch: "Éviter tout désaccord peut laisser peu de place à vos propres besoins.",
    },
    EMOTIONAL_STABILITY: {
      meaning: "La manière dont vous avez décrit vos réactions à la pression et aux imprévus.",
      try: "Identifiez une situation qui crée souvent de la tension et prévoyez une pause avant de réagir.",
      watch: "Cet indice n'évalue pas la santé mentale et ne permet pas de diagnostic.",
    },
    TECHNICAL: {
      meaning:
        "Votre intérêt pour approfondir vos connaissances et résoudre des problèmes spécialisés.",
      try: "Réservez du temps pour développer une compétence et réaliser quelque chose qui montre vos progrès.",
      watch: "Tout approfondir peut entrer en concurrence avec les délais et les priorités.",
    },
    MANAGERIAL: {
      meaning: "Votre intérêt pour coordonner les personnes, les décisions et les résultats.",
      try: "Définissez des responsabilités claires dans un projet et convenez du suivi du résultat.",
      watch: "Prendre toutes les décisions peut vous surcharger et limiter l'autonomie du groupe.",
    },
    CREATIVE: {
      meaning: "Votre intérêt pour créer, expérimenter et transformer des idées en projets.",
      try: "Testez une idée à petite échelle avant d'y consacrer beaucoup de temps.",
      watch: "Avoir trop d'idées à la fois peut rendre leur réalisation difficile.",
    },
    AUTONOMOUS: {
      meaning: "Votre préférence pour la liberté d'organiser votre propre travail.",
      try: "Convenez du résultat attendu et du délai, en précisant la liberté de réalisation.",
      watch: "L'autonomie fonctionne mieux lorsque les attentes et les limites sont claires.",
    },
    SECURITY: {
      meaning: "Le poids de la prévisibilité et de la stabilité dans vos choix professionnels.",
      try: "Listez les conditions minimales de stabilité dont vous avez besoin avant d'envisager un changement.",
      watch:
        "Éviter toute incertitude peut écarter des possibilités compatibles avec vos objectifs.",
    },
    CAUSE: {
      meaning: "L'importance du sens et de la contribution dans vos choix professionnels.",
      try: "Reliez une tâche concrète à l'effet que vous souhaitez produire.",
      watch: "L'engagement pour une cause ne supprime pas le besoin de limites et de repos.",
    },
    BUILDER: {
      meaning:
        "À quel point vous vous reconnaissez dans la construction de ressources et de projets dans la durée.",
      try: "Divisez un objectif en étapes et suivez une petite action chaque semaine.",
      watch: "L'ambition sans priorités peut disperser vos ressources entre trop de projets.",
    },
    GUARDIAN: {
      meaning:
        "À quel point vous vous reconnaissez dans la prudence, la protection et la prévisibilité pour gérer des ressources.",
      try: "Fixez des critères de décision clairs pour ne pas tout réexaminer à chaque choix.",
      watch: "Ce profil n'indique pas quel investissement vous convient.",
    },
    STRATEGIST: {
      meaning: "Votre préférence pour comparer les options et planifier avant de décider.",
      try: "Écrivez les critères de décision et fixez un moment pour terminer l'analyse.",
      watch: "Chercher des informations sans limite peut retarder des décisions simples.",
    },
    ADVENTURER: {
      meaning:
        "À quel point vous vous reconnaissez dans l'exploration des possibilités et l'acceptation de l'incertitude.",
      try: "Avant d'expérimenter, définissez le temps et les ressources que vous êtes prêt à engager.",
      watch: "L'enthousiasme ne remplace pas l'examen des conséquences.",
    },
    BALANCER: {
      meaning: "Votre préférence pour équilibrer les besoins actuels et les objectifs futurs.",
      try: "Revoyez vos priorités et choisissez un engagement concret pour cette semaine.",
      watch: "L'équilibre dépend du contexte, plutôt que d'une proportion parfaite.",
    },
    IMMERSIVE_HYPERFOCUS: {
      meaning: "Votre préférence pour vous plonger dans une tâche avec peu d'interruptions.",
      try: "Essayez une plage de travail protégée avec un début, une pause et un objectif définis.",
      watch: "Une immersion prolongée peut vous faire repousser le repos ou d'autres priorités.",
    },
    MODULAR_SERIAL: {
      meaning: "Votre préférence pour des étapes courtes, des listes et une tâche à la fois.",
      try: "Divisez une tâche en petites étapes et vérifiez si ce rythme vous aide à avancer.",
      watch: "Organiser la liste ne devrait pas prendre plus de temps que réaliser la tâche.",
    },
    COLLABORATIVE: {
      meaning:
        "Votre préférence pour échanger des idées et construire des solutions avec d'autres personnes.",
      try: "Prévoyez une courte conversation pour débloquer une décision, puis du temps pour agir.",
      watch: "Les conversations sans objectif peuvent interrompre le travail au lieu d'aider.",
    },
    REACTIVE_SPRINT: {
      meaning:
        "À quel point vous vous reconnaissez dans de courtes périodes d'énergie et la réponse aux demandes immédiates.",
      try: "Utilisez une courte plage avec une priorité précise et prévoyez une pause ensuite.",
      watch:
        "Dépendre constamment de l'urgence peut accentuer l'épuisement et repousser des tâches importantes.",
    },
    ANALYTICAL: {
      meaning: "Votre préférence pour décider en comparant les informations et les critères.",
      try: "Choisissez les trois critères les plus importants et une échéance pour décider.",
      watch: "Davantage d'informations ne change pas toujours la décision.",
    },
    INTUITIVE: {
      meaning: "Votre préférence pour décider à partir d'impressions et d'expériences antérieures.",
      try: "Notez votre première impression et vérifiez au moins un fait qui l'appuie ou la contredit.",
      watch: "Une forte impression peut aussi refléter un biais.",
    },
    PRAGMATIC: {
      meaning: "Votre préférence pour les solutions pratiques et l'action rapide.",
      try: "Définissez une étape réversible pour tester votre choix avant d'aller plus loin.",
      watch: "Résoudre l'immédiat peut laisser les conséquences futures sans analyse.",
    },
    COMMUNICATION: {
      meaning: "La manière dont vous avez décrit vos échanges et votre écoute dans la relation.",
      try: "Parlez d'une situation précise en expliquant votre ressenti et vos besoins.",
      watch:
        "Vos réponses individuelles ne permettent pas de savoir comment votre partenaire vit la relation.",
    },
    LIFE_VALUES: {
      meaning:
        "La manière dont vous avez décrit les sujets et les priorités importants dans votre vie à deux.",
      try: "Chacun peut lister trois priorités et parler des différences sans chercher à l'emporter.",
      watch:
        "Être d'accord avec une phrase ne garantit pas que vous la comprenez de la même façon.",
    },
    CONFLICT_MANAGEMENT: {
      meaning: "La manière dont vous avez décrit vos réactions aux différences et aux conflits.",
      try: "Convenez d'une pause et d'un moment pour reprendre les conversations difficiles.",
      watch: "Le test ne détermine pas la sécurité ni la qualité d'une relation.",
    },
    FINANCES: {
      meaning:
        "La manière dont vous avez décrit l'organisation des ressources et les échanges sur l'argent dans la relation.",
      try: "Discutez d'une décision précise en clarifiant les attentes et les limites.",
      watch: "N'utilisez pas un score pour décider qui a raison.",
    },
    FUTURE_PLANS: {
      meaning: "La manière dont vous avez décrit les attentes et la planification commune.",
      try: "Parlez d'un objectif proche et de ce que chacun prévoit de faire pour l'atteindre.",
      watch: "Les attentes évoluent ; revenez-y au fil du temps.",
    },
  },
};

export function getDimensionGuidance(key: string, locale: Locale): DimensionGuidance | undefined {
  if (!Object.prototype.hasOwnProperty.call(dimensionGuidance, key)) return undefined;
  return localizedDimensionGuidance[locale][key as GuidanceKey];
}
