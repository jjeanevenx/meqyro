import "server-only";

export type DimensionGuidance = Readonly<{ meaning: string; try: string; watch: string }>;
/** Plain descriptions: tendencies and tasks, never diagnoses or population comparisons. */
export const dimensionGuidance = {
  PATTERN_RECOGNITION: {
    meaning: "Reconhecer a regra que se repete entre formas ou sequências.",
    try: "Compare o que muda e o que permanece igual antes de escolher uma resposta.",
    watch: "Uma semelhança visual pode esconder uma regra diferente.",
  },
  LOGICAL_REASONING: {
    meaning: "Tirar conclusões a partir das informações dadas.",
    try: "Separe o que o enunciado afirma do que você está supondo.",
    watch: "Uma conclusão plausível nem sempre é uma conclusão demonstrada.",
  },
  NUMERICAL_REASONING: {
    meaning: "Entender relações entre quantidades, proporções e números.",
    try: "Escreva a relação entre os números antes de fazer a conta.",
    watch: "Pressa nos cálculos pode esconder um erro de interpretação.",
  },
  ATTENTION: {
    meaning: "Perceber detalhes relevantes e distinguir informações parecidas.",
    try: "Faça uma segunda leitura procurando apenas o detalhe que diferencia as opções.",
    watch: "Interrupções e cansaço podem mudar seu desempenho nesta tarefa.",
  },
  PROBLEM_SOLVING: {
    meaning: "Organizar informações para encontrar uma solução.",
    try: "Divida o problema em passos pequenos e confira uma condição de cada vez.",
    watch: "Insistir na primeira estratégia pode dificultar enxergar outra saída.",
  },
  SPEED: {
    meaning:
      "Resolver os itens associados a esta dimensão. O índice resume acertos; não é uma medida isolada da sua velocidade mental.",
    try: "Priorize entender a regra; depois tente reduzir o tempo mantendo a precisão.",
    watch: "Responder rápido não é necessariamente responder bem.",
  },
  OPENNESS: {
    meaning: "Sua preferência declarada por explorar ideias e experiências novas.",
    try: "Experimente uma abordagem nova em uma tarefa pequena e compare com a habitual.",
    watch: "Buscar novidade o tempo todo pode dificultar concluir o que começou.",
  },
  CONSCIENTIOUSNESS: {
    meaning: "Sua preferência por organização, planejamento e acompanhamento das tarefas.",
    try: "Escolha três prioridades realistas para o dia e revise o que funcionou.",
    watch: "Um plano muito rígido pode aumentar a frustração quando algo muda.",
  },
  EXTRAVERSION: {
    meaning: "Quanto você se identifica com interação social e estímulos externos.",
    try: "Observe se uma conversa ou um período de silêncio ajuda mais a recuperar sua energia.",
    watch: "Seu jeito pode variar com as pessoas e o ambiente.",
  },
  AGREEABLENESS: {
    meaning: "Sua preferência por cooperação e consideração pelas outras pessoas.",
    try: "Pratique dizer o que precisa com clareza, preservando o respeito pelo outro.",
    watch: "Evitar todo conflito pode deixar suas necessidades sem espaço.",
  },
  EMOTIONAL_STABILITY: {
    meaning: "Como você descreveu suas reações a pressão e imprevistos.",
    try: "Identifique uma situação que costuma gerar tensão e planeje uma pausa antes de reagir.",
    watch: "Este índice não avalia saúde mental nem permite um diagnóstico.",
  },
  TECHNICAL: {
    meaning: "Seu interesse por aprofundar conhecimentos e resolver problemas especializados.",
    try: "Reserve tempo para desenvolver uma habilidade e produzir algo que mostre seu progresso.",
    watch: "Aprofundar tudo pode competir com prazos e prioridades.",
  },
  MANAGERIAL: {
    meaning: "Seu interesse por coordenar pessoas, decisões e resultados.",
    try: "Defina responsabilidades claras em um projeto e combine como acompanhar o resultado.",
    watch: "Assumir todas as decisões pode sobrecarregar você e reduzir a autonomia do grupo.",
  },
  CREATIVE: {
    meaning: "Seu interesse por criar, experimentar e transformar ideias em projetos.",
    try: "Teste uma ideia em pequena escala antes de investir muito tempo nela.",
    watch: "Ter muitas ideias ao mesmo tempo pode dificultar a execução.",
  },
  AUTONOMOUS: {
    meaning: "Sua preferência por liberdade para organizar o próprio trabalho.",
    try: "Negocie o resultado esperado e o prazo, deixando explícita a liberdade de execução.",
    watch: "Autonomia funciona melhor quando expectativas e limites estão claros.",
  },
  SECURITY: {
    meaning: "Quanto previsibilidade e estabilidade pesam nas suas escolhas profissionais.",
    try: "Liste as condições mínimas de segurança que você precisa antes de considerar uma mudança.",
    watch: "Evitar toda incerteza pode impedir oportunidades compatíveis com seus objetivos.",
  },
  CAUSE: {
    meaning: "A importância de propósito e contribuição nas suas escolhas profissionais.",
    try: "Conecte uma tarefa concreta ao impacto que você deseja produzir.",
    watch: "Identificação com uma causa não elimina a necessidade de limites e descanso.",
  },
  BUILDER: {
    meaning: "Sua identificação com construir recursos e projetos ao longo do tempo.",
    try: "Transforme um objetivo em etapas e acompanhe uma pequena ação semanal.",
    watch: "Ambição sem prioridades pode espalhar seus recursos por projetos demais.",
  },
  GUARDIAN: {
    meaning: "Sua identificação com cuidado, proteção e previsibilidade ao lidar com recursos.",
    try: "Defina critérios claros para decidir, sem precisar reconsiderar tudo a cada escolha.",
    watch: "Este perfil não indica qual investimento é adequado para você.",
  },
  STRATEGIST: {
    meaning: "Sua preferência por comparar alternativas e planejar antes de decidir.",
    try: "Escreva os critérios da decisão e estabeleça um momento para concluir a análise.",
    watch: "Buscar informação sem um limite pode adiar decisões simples.",
  },
  ADVENTURER: {
    meaning: "Sua identificação com experimentar possibilidades e aceitar incerteza.",
    try: "Antes de experimentar, defina quanto tempo e recursos você aceita comprometer.",
    watch: "Entusiasmo não substitui a avaliação das consequências.",
  },
  BALANCER: {
    meaning: "Sua preferência por equilibrar necessidades de hoje e objetivos futuros.",
    try: "Revise suas prioridades e escolha um compromisso concreto para esta semana.",
    watch: "Equilíbrio depende do contexto, não de uma proporção perfeita.",
  },
  IMMERSIVE_HYPERFOCUS: {
    meaning: "Sua preferência por mergulhar em uma tarefa com poucas interrupções.",
    try: "Experimente um bloco de trabalho protegido, com início, pausa e objetivo definidos.",
    watch: "Imersão prolongada pode fazer você adiar descanso ou outras prioridades.",
  },
  MODULAR_SERIAL: {
    meaning: "Sua preferência por etapas curtas, listas e uma tarefa por vez.",
    try: "Divida uma tarefa em etapas pequenas e confira se o ritmo ajuda a avançar.",
    watch: "Organizar a lista não deve ocupar mais tempo que executar a tarefa.",
  },
  COLLABORATIVE: {
    meaning: "Sua preferência por trocar ideias e construir soluções com outras pessoas.",
    try: "Combine uma conversa curta para destravar uma decisão e reserve tempo para executar depois.",
    watch: "Conversas sem objetivo podem interromper o trabalho em vez de ajudar.",
  },
  REACTIVE_SPRINT: {
    meaning: "Sua identificação com períodos curtos de energia e resposta a demandas imediatas.",
    try: "Use um bloco curto com uma prioridade definida e reserve uma pausa ao final.",
    watch:
      "Depender sempre de urgência pode aumentar desgaste e deixar tarefas importantes para depois.",
  },
  ANALYTICAL: {
    meaning: "Sua preferência por decidir comparando informações e critérios.",
    try: "Escolha os três critérios que mais importam e um prazo para decidir.",
    watch: "Mais informação nem sempre muda a decisão.",
  },
  INTUITIVE: {
    meaning: "Sua preferência por decidir a partir de impressões e experiências anteriores.",
    try: "Escreva sua primeira impressão e confira pelo menos um fato que a apoie ou contrarie.",
    watch: "Uma impressão forte também pode refletir um viés.",
  },
  PRAGMATIC: {
    meaning: "Sua preferência por soluções práticas e ação rápida.",
    try: "Defina um passo reversível que permita testar a escolha antes de avançar.",
    watch: "Resolver o imediato pode deixar consequências futuras sem análise.",
  },
  COMMUNICATION: {
    meaning: "Como você descreveu sua forma de conversar e ouvir na relação.",
    try: "Converse sobre uma situação concreta usando o que você sentiu e o que precisa.",
    watch: "Sua resposta individual não permite concluir como seu parceiro sente a relação.",
  },
  LIFE_VALUES: {
    meaning: "Como você descreveu temas e prioridades importantes na vida a dois.",
    try: "Cada pessoa pode listar três prioridades e conversar sobre as diferenças sem tentar vencê-las.",
    watch: "Concordar com uma frase não garante que ambos entendam a mesma coisa.",
  },
  CONFLICT_MANAGEMENT: {
    meaning: "Como você descreveu suas reações diante de diferenças e conflitos.",
    try: "Combine uma pausa e um momento para retomar conversas difíceis.",
    watch: "O teste não identifica segurança ou qualidade de uma relação.",
  },
  FINANCES: {
    meaning: "Como você descreveu a organização de recursos e conversas financeiras na relação.",
    try: "Conversem sobre uma decisão concreta, explicitando expectativas e limites.",
    watch: "Não use uma pontuação para decidir quem está certo.",
  },
  FUTURE_PLANS: {
    meaning: "Como você descreveu expectativas e planejamento compartilhado.",
    try: "Conversem sobre uma meta próxima e o que cada pessoa espera fazer para alcançá-la.",
    watch: "Expectativas mudam; vale revisitá-las ao longo do tempo.",
  },
} as const satisfies Record<string, DimensionGuidance>;
