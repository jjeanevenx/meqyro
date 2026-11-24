import type { Locale } from "@/lib/i18n/config";
import { personalityMapQuestions } from "./personality-map";
import { careerFitQuestions } from "./careerfit";
import { focusStyleQuestions } from "./focusstyle";

type Row = readonly [pt: string, en: string, es: string, fr: string];
export function localized([pt, en, es, fr]: Row): Record<Locale, string> {
  return { pt, en, es, fr };
}

// One idea per statement. Direction and dimensions stay pinned to the original blueprint.
const personality: readonly Row[] = [
  [
    "Gosto de conhecer ideias diferentes das minhas.",
    "I enjoy learning about ideas different from my own.",
    "Me gusta conocer ideas distintas de las mías.",
    "J’aime découvrir des idées différentes des miennes.",
  ],
  [
    "Gosto de explorar formas de arte que ainda não conheço.",
    "I enjoy exploring unfamiliar forms of art.",
    "Me gusta explorar formas de arte que aún no conozco.",
    "J’aime explorer des formes d’art que je ne connais pas encore.",
  ],
  [
    "Tenho curiosidade por maneiras pouco habituais de resolver problemas.",
    "I am curious about unusual ways of solving problems.",
    "Siento curiosidad por formas poco habituales de resolver problemas.",
    "Les façons inhabituelles de résoudre les problèmes éveillent ma curiosité.",
  ],
  [
    "Gosto de imaginar como as coisas poderiam ser diferentes.",
    "I enjoy imagining how things could be different.",
    "Me gusta imaginar cómo podrían ser distintas las cosas.",
    "J’aime imaginer comment les choses pourraient être différentes.",
  ],
  [
    "Prefiro atividades conhecidas a experimentar algo novo.",
    "I prefer familiar activities to trying something new.",
    "Prefiero las actividades conocidas a probar algo nuevo.",
    "Je préfère les activités familières à de nouvelles expériences.",
  ],
  [
    "Perco o interesse quando uma conversa fica muito abstrata.",
    "I lose interest when a conversation becomes very abstract.",
    "Pierdo el interés cuando una conversación se vuelve muy abstracta.",
    "Je perds de l’intérêt lorsqu’une conversation devient très abstraite.",
  ],
  [
    "Raramente procuro conhecer costumes diferentes dos meus.",
    "I rarely seek to learn about customs different from my own.",
    "Rara vez busco conocer costumbres distintas de las mías.",
    "Je cherche rarement à découvrir des coutumes différentes des miennes.",
  ],
  [
    "Tenho pouco interesse em explorar possibilidades que fogem da minha rotina.",
    "I have little interest in exploring possibilities outside my routine.",
    "Tengo poco interés en explorar posibilidades fuera de mi rutina.",
    "J’ai peu d’intérêt pour les possibilités qui sortent de ma routine.",
  ],
  [
    "Costumo cumprir os prazos com que me comprometo.",
    "I usually meet the deadlines I commit to.",
    "Suelo cumplir los plazos con los que me comprometo.",
    "Je respecte généralement les délais auxquels je m’engage.",
  ],
  [
    "Reviso detalhes importantes antes de dar uma tarefa por concluída.",
    "I check important details before considering a task finished.",
    "Reviso los detalles importantes antes de dar una tarea por terminada.",
    "Je vérifie les détails importants avant de considérer une tâche comme terminée.",
  ],
  [
    "Costumo terminar as tarefas que começo.",
    "I usually finish the tasks I start.",
    "Suelo terminar las tareas que empiezo.",
    "Je termine généralement les tâches que je commence.",
  ],
  [
    "Organizo com antecedência o que preciso fazer.",
    "I organise what I need to do in advance.",
    "Organizo con antelación lo que necesito hacer.",
    "J’organise à l’avance ce que j’ai à faire.",
  ],
  [
    "Deixo obrigações importantes para o último momento.",
    "I leave important obligations until the last moment.",
    "Dejo las obligaciones importantes para el último momento.",
    "Je remets les obligations importantes au dernier moment.",
  ],
  [
    "Tenho dificuldade para manter meus materiais organizados.",
    "I find it difficult to keep my materials organised.",
    "Me cuesta mantener mis materiales ordenados.",
    "J’ai du mal à garder mes affaires en ordre.",
  ],
  [
    "Abandono projetos quando eles deixam de ser novidade.",
    "I abandon projects once they are no longer new.",
    "Abandono los proyectos cuando dejan de ser una novedad.",
    "J’abandonne les projets lorsqu’ils n’ont plus l’attrait de la nouveauté.",
  ],
  [
    "Deixo de acompanhar os planos que fiz para minhas tarefas.",
    "I stop keeping track of the plans I made for my tasks.",
    "Dejo de seguir los planes que hice para mis tareas.",
    "Je cesse de suivre les plans que j’ai établis pour mes tâches.",
  ],
  [
    "Sinto mais energia depois de passar um tempo com outras pessoas.",
    "I feel more energetic after spending time with other people.",
    "Siento más energía después de pasar tiempo con otras personas.",
    "Je me sens plus énergique après avoir passé du temps avec d’autres personnes.",
  ],
  [
    "Costumo iniciar conversas em encontros sociais.",
    "I usually start conversations at social gatherings.",
    "Suelo iniciar conversaciones en reuniones sociales.",
    "J’engage généralement la conversation lors de rencontres sociales.",
  ],
  [
    "Gosto de participar de atividades com bastante gente.",
    "I enjoy taking part in activities with many people.",
    "Me gusta participar en actividades con mucha gente.",
    "J’aime participer à des activités réunissant beaucoup de personnes.",
  ],
  [
    "Costumo me expressar em conversas de grupo.",
    "I usually speak up in group conversations.",
    "Suelo expresarme en las conversaciones de grupo.",
    "Je prends généralement la parole dans les conversations de groupe.",
  ],
  [
    "Prefiro passar meu tempo livre sozinho.",
    "I prefer spending my free time alone.",
    "Prefiero pasar mi tiempo libre a solas.",
    "Je préfère passer mon temps libre seul.",
  ],
  [
    "Depois de encontros com muita gente, preciso ficar sozinho para recuperar energia.",
    "After large gatherings, I need time alone to recover my energy.",
    "Después de reuniones numerosas, necesito estar a solas para recuperar energía.",
    "Après des rencontres nombreuses, j’ai besoin de solitude pour retrouver mon énergie.",
  ],
  [
    "Em grupos, costumo ouvir mais do que falar.",
    "In groups, I usually listen more than I speak.",
    "En los grupos, suelo escuchar más que hablar.",
    "En groupe, j’écoute généralement plus que je ne parle.",
  ],
  [
    "Prefiro ficar em segundo plano em encontros sociais.",
    "I prefer staying in the background at social gatherings.",
    "Prefiero mantenerme en segundo plano en las reuniones sociales.",
    "Je préfère rester en retrait lors de rencontres sociales.",
  ],
  [
    "Levo em conta como minhas ações afetam outras pessoas.",
    "I consider how my actions affect other people.",
    "Tengo en cuenta cómo afectan mis acciones a otras personas.",
    "Je tiens compte de l’effet de mes actions sur les autres.",
  ],
  [
    "Procuro um acordo que considere os interesses de todos.",
    "I look for agreements that consider everyone’s interests.",
    "Busco acuerdos que tengan en cuenta los intereses de todos.",
    "Je cherche des accords qui tiennent compte des intérêts de chacun.",
  ],
  [
    "Consigo dar uma nova chance depois de um erro de outra pessoa.",
    "I can give someone another chance after a mistake.",
    "Puedo dar otra oportunidad a alguien después de un error.",
    "Je peux donner une nouvelle chance à quelqu’un après une erreur.",
  ],
  [
    "Geralmente começo confiando nas intenções das pessoas.",
    "I generally start by trusting people’s intentions.",
    "Generalmente empiezo confiando en las intenciones de las personas.",
    "J’accorde généralement d’abord ma confiance aux intentions des autres.",
  ],
  [
    "Costumo desconfiar das intenções das pessoas.",
    "I usually distrust people’s intentions.",
    "Suelo desconfiar de las intenciones de las personas.",
    "Je me méfie généralement des intentions des autres.",
  ],
  [
    "Falo de forma dura com quem discorda de mim.",
    "I speak harshly to people who disagree with me.",
    "Hablo con dureza a quienes discrepan conmigo.",
    "Je parle durement aux personnes qui ne sont pas d’accord avec moi.",
  ],
  [
    "Busco o que quero mesmo quando isso prejudica outras pessoas.",
    "I pursue what I want even when it harms other people.",
    "Busco lo que quiero incluso cuando perjudica a otras personas.",
    "Je poursuis ce que je veux même lorsque cela nuit aux autres.",
  ],
  [
    "Em disputas, ganhar é mais importante para mim do que preservar a cooperação.",
    "In a dispute, winning matters more to me than preserving cooperation.",
    "En una disputa, ganar me importa más que mantener la cooperación.",
    "Dans un différend, gagner compte davantage pour moi que préserver la coopération.",
  ],
  [
    "Consigo manter a calma diante de imprevistos cotidianos.",
    "I can stay calm when everyday surprises occur.",
    "Puedo mantener la calma ante los imprevistos cotidianos.",
    "Je parviens à rester calme face aux imprévus du quotidien.",
  ],
  [
    "Retomo meu equilíbrio depois de pequenos contratempos.",
    "I regain my balance after minor setbacks.",
    "Recupero mi equilibrio después de pequeños contratiempos.",
    "Je retrouve mon équilibre après de petits contretemps.",
  ],
  [
    "Consigo lidar com incertezas sem ficar muito preocupado.",
    "I can handle uncertainty without becoming very worried.",
    "Puedo afrontar la incertidumbre sin preocuparme demasiado.",
    "Je parviens à faire face à l’incertitude sans trop m’inquiéter.",
  ],
  [
    "Confio na minha capacidade de lidar com as dificuldades do dia a dia.",
    "I trust my ability to handle everyday difficulties.",
    "Confío en mi capacidad para afrontar las dificultades cotidianas.",
    "J’ai confiance en ma capacité à faire face aux difficultés quotidiennes.",
  ],
  [
    "Fico preocupado por muito tempo com situações que não posso controlar.",
    "I worry for a long time about situations I cannot control.",
    "Me preocupo durante mucho tiempo por situaciones que no puedo controlar.",
    "Je m’inquiète longtemps de situations que je ne peux pas contrôler.",
  ],
  [
    "Meu humor muda bastante ao longo de um dia comum.",
    "My mood changes considerably during an ordinary day.",
    "Mi estado de ánimo cambia bastante a lo largo de un día normal.",
    "Mon humeur change beaucoup au cours d’une journée ordinaire.",
  ],
  [
    "Sinto-me facilmente sobrecarregado quando várias demandas surgem juntas.",
    "I easily feel overwhelmed when several demands arise at once.",
    "Me siento fácilmente desbordado cuando surgen varias exigencias a la vez.",
    "Je me sens facilement dépassé lorsque plusieurs demandes arrivent ensemble.",
  ],
  [
    "Depois de receber uma crítica, tenho dificuldade para recuperar a confiança.",
    "After criticism, I find it difficult to regain my confidence.",
    "Después de una crítica, me cuesta recuperar la confianza.",
    "Après une critique, j’ai du mal à retrouver confiance.",
  ],
];

const career: readonly Row[] = [
  [
    "Quero desenvolver conhecimento aprofundado em uma especialidade.",
    "I want to develop deep knowledge in a speciality.",
    "Quiero desarrollar conocimientos profundos en una especialidad.",
    "Je souhaite acquérir des connaissances approfondies dans une spécialité.",
  ],
  [
    "Gostaria de ser uma referência técnica na minha área.",
    "I would like to be a technical reference in my field.",
    "Me gustaría ser una referencia técnica en mi área.",
    "J’aimerais être une référence technique dans mon domaine.",
  ],
  [
    "Sinto satisfação ao resolver um problema técnico difícil.",
    "I find satisfaction in solving a difficult technical problem.",
    "Me satisface resolver un problema técnico difícil.",
    "Résoudre un problème technique difficile me satisfait.",
  ],
  [
    "Tenho interesse em aprender novas técnicas da minha área.",
    "I am interested in learning new techniques in my field.",
    "Me interesa aprender nuevas técnicas de mi área.",
    "Je m’intéresse à l’apprentissage de nouvelles techniques dans mon domaine.",
  ],
  [
    "Gosto de coordenar o trabalho de uma equipe.",
    "I enjoy coordinating a team’s work.",
    "Me gusta coordinar el trabajo de un equipo.",
    "J’aime coordonner le travail d’une équipe.",
  ],
  [
    "Gostaria de assumir a responsabilidade pelo resultado de uma equipe.",
    "I would like to take responsibility for a team’s results.",
    "Me gustaría asumir la responsabilidad por los resultados de un equipo.",
    "J’aimerais assumer la responsabilité des résultats d’une équipe.",
  ],
  [
    "Tenho interesse em alinhar prioridades entre pessoas de áreas diferentes.",
    "I am interested in aligning priorities between people in different areas.",
    "Me interesa alinear prioridades entre personas de distintas áreas.",
    "J’aime chercher à accorder les priorités de personnes de différents domaines.",
  ],
  [
    "Ajudar outras pessoas a se desenvolver profissionalmente me motiva.",
    "Helping others develop professionally motivates me.",
    "Me motiva ayudar a otras personas a desarrollarse profesionalmente.",
    "Aider les autres à progresser professionnellement me motive.",
  ],
  [
    "Gosto de criar soluções que ainda não foram testadas.",
    "I enjoy creating solutions that have not yet been tested.",
    "Me gusta crear soluciones que aún no se han probado.",
    "J’aime créer des solutions qui n’ont pas encore été testées.",
  ],
  [
    "Gostaria de ter espaço no trabalho para experimentar ideias novas.",
    "I would like room at work to experiment with new ideas.",
    "Me gustaría tener espacio en el trabajo para experimentar con ideas nuevas.",
    "J’aimerais disposer de temps au travail pour expérimenter de nouvelles idées.",
  ],
  [
    "Valorizo poder propor abordagens originais para minhas tarefas.",
    "I value being able to propose original approaches to my tasks.",
    "Valoro poder proponer enfoques originales para mis tareas.",
    "J’apprécie de pouvoir proposer des approches originales pour mes tâches.",
  ],
  [
    "Gosto de combinar ideias de áreas diferentes para criar algo novo.",
    "I enjoy combining ideas from different fields to create something new.",
    "Me gusta combinar ideas de distintas áreas para crear algo nuevo.",
    "J’aime combiner des idées de différents domaines pour créer quelque chose de nouveau.",
  ],
  [
    "É importante para mim poder escolher como organizar meu horário de trabalho.",
    "Being able to choose how to organise my work schedule matters to me.",
    "Me importa poder elegir cómo organizar mi horario de trabajo.",
    "Il m’importe de pouvoir choisir comment organiser mes horaires de travail.",
  ],
  [
    "Valorizo poder definir a ordem das minhas tarefas.",
    "I value being able to decide the order of my tasks.",
    "Valoro poder decidir el orden de mis tareas.",
    "J’apprécie de pouvoir décider de l’ordre de mes tâches.",
  ],
  [
    "Gostaria de ter liberdade para escolher os projetos em que trabalho.",
    "I would like freedom to choose the projects I work on.",
    "Me gustaría tener libertad para elegir los proyectos en los que trabajo.",
    "J’aimerais avoir la liberté de choisir les projets sur lesquels je travaille.",
  ],
  [
    "Prefiro que me deem objetivos e liberdade para escolher o método.",
    "I prefer being given goals and freedom to choose my methods.",
    "Prefiero recibir objetivos y libertad para elegir el método.",
    "Je préfère recevoir des objectifs avec la liberté de choisir mes méthodes.",
  ],
  [
    "A previsibilidade da minha remuneração pesa na escolha de um trabalho.",
    "Predictable pay matters when I choose a job.",
    "La previsibilidad de mi remuneración pesa al elegir un trabajo.",
    "La prévisibilité de ma rémunération compte dans mon choix d’un emploi.",
  ],
  [
    "Dou prioridade a oportunidades com continuidade de trabalho previsível.",
    "I prioritise opportunities offering predictable continuity of work.",
    "Doy prioridad a oportunidades con una continuidad de trabajo previsible.",
    "Je privilégie les possibilités offrant une continuité de travail prévisible.",
  ],
  [
    "Valorizo benefícios que me ajudem a planejar o futuro.",
    "I value benefits that help me plan for the future.",
    "Valoro las prestaciones que me ayudan a planificar el futuro.",
    "J’apprécie les avantages qui m’aident à préparer l’avenir.",
  ],
  [
    "Prefiro conhecer com clareza as condições para continuar em uma função.",
    "I prefer clearly knowing the conditions for staying in a role.",
    "Prefiero conocer claramente las condiciones para continuar en un puesto.",
    "Je préfère connaître clairement les conditions pour rester dans un poste.",
  ],
  [
    "Quero que meu trabalho melhore a vida de outras pessoas.",
    "I want my work to improve other people’s lives.",
    "Quiero que mi trabajo mejore la vida de otras personas.",
    "Je souhaite que mon travail améliore la vie d’autres personnes.",
  ],
  [
    "O impacto social de uma atividade pesa nas minhas escolhas profissionais.",
    "An activity’s social impact matters in my career choices.",
    "El impacto social de una actividad pesa en mis decisiones profesionales.",
    "L’impact social d’une activité compte dans mes choix professionnels.",
  ],
  [
    "Procuro projetos que contribuam para uma causa em que acredito.",
    "I seek projects that contribute to a cause I believe in.",
    "Busco proyectos que contribuyan a una causa en la que creo.",
    "Je recherche des projets qui contribuent à une cause à laquelle je crois.",
  ],
  [
    "Sinto realização quando meu trabalho contribui para a comunidade.",
    "I feel fulfilled when my work contributes to the community.",
    "Me siento realizado cuando mi trabajo contribuye a la comunidad.",
    "Je me sens accompli lorsque mon travail contribue à la communauté.",
  ],
];

const focus: readonly Row[] = [
  [
    "Concentro-me melhor quando posso dedicar um período a uma única tarefa.",
    "I focus best when I can devote a period of time to a single task.",
    "Me concentro mejor cuando puedo dedicar un período a una sola tarea.",
    "Je me concentre mieux lorsque je peux consacrer un moment à une seule tâche.",
  ],
  [
    "Depois de uma interrupção, preciso de tempo para retomar uma tarefa complexa.",
    "After an interruption, I need time to return to a complex task.",
    "Después de una interrupción, necesito tiempo para retomar una tarea compleja.",
    "Après une interruption, j’ai besoin de temps pour reprendre une tâche complexe.",
  ],
  [
    "Prefiro reservar um período sem interrupções para tarefas que exigem concentração.",
    "I prefer setting aside uninterrupted time for tasks that require concentration.",
    "Prefiero reservar un período sin interrupciones para tareas que requieren concentración.",
    "Je préfère réserver un moment sans interruption aux tâches qui exigent de la concentration.",
  ],
  [
    "Gosto de manter minha atenção em um problema até entender seus detalhes.",
    "I like keeping my attention on a problem until I understand its details.",
    "Me gusta mantener la atención en un problema hasta entender sus detalles.",
    "J’aime rester attentif à un problème jusqu’à en comprendre les détails.",
  ],
  [
    "Prefiro aprofundar um assunto antes de passar para outro.",
    "I prefer exploring a topic deeply before moving to another.",
    "Prefiero profundizar en un tema antes de pasar a otro.",
    "Je préfère approfondir un sujet avant de passer à un autre.",
  ],
  [
    "Gosto de dividir tarefas grandes em etapas menores.",
    "I like dividing large tasks into smaller steps.",
    "Me gusta dividir las tareas grandes en pasos más pequeños.",
    "J’aime diviser les grandes tâches en étapes plus petites.",
  ],
  [
    "Uma lista de próximos passos me ajuda a manter a concentração.",
    "A list of next steps helps me stay focused.",
    "Una lista de próximos pasos me ayuda a concentrarme.",
    "Une liste des prochaines étapes m’aide à rester concentré.",
  ],
  [
    "Alternar entre etapas curtas me ajuda a manter o ritmo de trabalho.",
    "Alternating between short stages helps me maintain my work pace.",
    "Alternar entre etapas cortas me ayuda a mantener el ritmo de trabajo.",
    "Alterner entre de courtes étapes m’aide à maintenir mon rythme de travail.",
  ],
  [
    "Ter uma pequena entrega definida para cada etapa me ajuda a avançar.",
    "Having a small deliverable for each stage helps me make progress.",
    "Tener un pequeño resultado definido para cada etapa me ayuda a avanzar.",
    "Un petit résultat défini pour chaque étape m’aide à avancer.",
  ],
  [
    "Retomo uma atividade com mais facilidade quando deixo anotado o próximo passo.",
    "I resume an activity more easily when I write down the next step.",
    "Retomo una actividad con más facilidad cuando anoto el próximo paso.",
    "Je reprends plus facilement une activité lorsque j’ai noté la prochaine étape.",
  ],
  [
    "Conversar sobre uma tarefa me ajuda a organizar o raciocínio.",
    "Talking about a task helps me organise my thinking.",
    "Hablar sobre una tarea me ayuda a organizar mis ideas.",
    "Parler d’une tâche m’aide à organiser mon raisonnement.",
  ],
  [
    "Construir uma solução com outras pessoas me ajuda a manter o envolvimento.",
    "Building a solution with others helps me stay engaged.",
    "Construir una solución con otras personas me ayuda a mantener el interés.",
    "Construire une solution avec d’autres personnes m’aide à rester impliqué.",
  ],
  [
    "Trocar ideias durante uma atividade costuma renovar minha atenção.",
    "Exchanging ideas during an activity usually renews my attention.",
    "Intercambiar ideas durante una actividad suele renovar mi atención.",
    "Échanger des idées pendant une activité renouvelle généralement mon attention.",
  ],
  [
    "Receber uma opinião sobre o que estou fazendo me ajuda a seguir adiante.",
    "Getting feedback on what I am doing helps me move forward.",
    "Recibir una opinión sobre lo que hago me ayuda a seguir adelante.",
    "Recevoir un avis sur ce que je fais m’aide à poursuivre.",
  ],
  [
    "Trabalhar com alguém em um objetivo comum ajuda minha concentração.",
    "Working with someone towards a shared goal helps me concentrate.",
    "Trabajar con alguien en un objetivo común me ayuda a concentrarme.",
    "Travailler avec quelqu’un vers un objectif commun m’aide à me concentrer.",
  ],
  [
    "Um prazo próximo me ajuda a direcionar a atenção para uma tarefa.",
    "An approaching deadline helps me direct my attention to a task.",
    "Un plazo cercano me ayuda a dirigir la atención a una tarea.",
    "Une échéance proche m’aide à diriger mon attention vers une tâche.",
  ],
  [
    "Uma demanda inesperada com objetivo claro costuma mobilizar minha atenção.",
    "An unexpected request with a clear goal usually engages my attention.",
    "Una petición inesperada con un objetivo claro suele movilizar mi atención.",
    "Une demande imprévue avec un objectif clair mobilise généralement mon attention.",
  ],
  [
    "Gosto de adaptar meu plano de trabalho quando surgem novas prioridades.",
    "I enjoy adapting my work plan when new priorities arise.",
    "Me gusta adaptar mi plan de trabajo cuando surgen nuevas prioridades.",
    "J’aime adapter mon programme de travail lorsque de nouvelles priorités apparaissent.",
  ],
  [
    "Consigo me concentrar em escolher um próximo passo quando há pouco tempo.",
    "I can focus on choosing a next step when time is short.",
    "Puedo concentrarme en elegir el siguiente paso cuando hay poco tiempo.",
    "Je parviens à me concentrer sur le prochain pas à faire lorsque le temps manque.",
  ],
  [
    "Prefiro períodos curtos de esforço intenso seguidos de uma pausa.",
    "I prefer short periods of intense effort followed by a break.",
    "Prefiero períodos cortos de esfuerzo intenso seguidos de una pausa.",
    "Je préfère de courtes périodes d’effort intense suivies d’une pause.",
  ],
];

function revise<T extends { prompt: Record<Locale, string> }>(
  items: readonly T[],
  rows: readonly Row[],
): readonly T[] {
  if (items.length !== rows.length)
    throw new Error("Reviewed content does not match its blueprint");
  return items.map((item, index) => ({ ...item, prompt: localized(rows[index]) }));
}

export const reviewedPersonalityQuestions = revise(personalityMapQuestions, personality);
export const reviewedCareerQuestions = revise(careerFitQuestions, career);
export const reviewedFocusQuestions = revise(focusStyleQuestions, focus);
