import type { BlogArticle } from "@/content/articles/types";

// Paragraph breaks keep long-form copy readable in source and in the page.
function section(heading: string, text: string): BlogArticle["sections"][number] {
  return {
    heading,
    paragraphs: text
      .trim()
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim()),
  };
}

const articles: Omit<BlogArticle, "publishedAt" | "readingTimeMinutes">[] = [
  {
    slug: "how-logical-reasoning-works",
    relatedQuizSlug: "brainrank",
    title: "Raciocínio lógico: o que é e como desenvolver no dia a dia",
    subtitle:
      "Exemplos simples, exercícios comentados e um jeito mais útil de olhar para o seu desempenho.",
    excerpt:
      "Entenda o que é raciocínio lógico, pratique com exemplos e saiba como um teste online pode ajudar você a explorar sua forma de resolver problemas.",
    sections: [
      section(
        "O que é raciocínio lógico?",
        `Você já comparou dois planos de celular e percebeu que o mais barato ficaria mais caro com o seu uso? Isso também é raciocínio lógico. Ele aparece quando você organiza informações, identifica relações e verifica se uma conclusão faz sentido. Não depende apenas de fazer contas ou resolver sequências difíceis.

      Na prática, raciocinar envolve separar o que você sabe do que está supondo. Se uma entrega atrasou, por exemplo, a causa pode ser o transporte, o estoque ou uma informação incompleta. Escolher uma explicação antes de conferir as evidências é diferente de investigar o problema.

      Essa distinção ajuda nos estudos, no trabalho e nas compras. Você não precisa transformar toda escolha em uma investigação. Basta reconhecer os momentos em que uma conclusão apressada pode custar tempo, dinheiro ou retrabalho.`,
      ),
      section(
        "Três formas de raciocinar que você já usa",
        `Na dedução, você parte de uma regra e verifica uma consequência. Se todos os arquivos daquela pasta precisam de revisão e este arquivo está nela, ele também precisa ser revisado. O cuidado é conferir se a regra e a informação inicial são verdadeiras.

      Na indução, você observa casos e propõe um padrão. Se o ônibus atrasou nos últimos dias de chuva, pode esperar um atraso na próxima chuva. Isso é uma hipótese útil, mas não uma certeza: mudanças no trânsito ou na operação podem alterar o resultado.

      Já no raciocínio por hipóteses, você busca explicações possíveis. Um computador lento pode estar com muitos programas abertos ou pouco espaço disponível. Testar uma hipótese por vez costuma ajudar mais do que mexer em tudo ao mesmo tempo.`,
      ),
      section(
        "Exercícios de raciocínio lógico com resposta comentada",
        `Observe a sequência 3, 6, 12, 24. Uma regra simples é multiplicar cada termo por dois; por essa regra, o próximo é 48. Antes de responder, tente explicar a transformação. Sequências curtas podem admitir outras regras, por isso o contexto do exercício importa.

      Agora pense: todas as pessoas da equipe de revisão leem os relatórios. Paula lê os relatórios. Isso prova que Paula faz parte da equipe de revisão? Não. Outras pessoas também podem ler os documentos. Esse exemplo mostra como é fácil inverter uma relação e chegar a uma conclusão que os dados não sustentam.

      Por fim, uma loja oferece desconto de 20% em um produto de R$ 100 e cobra R$ 25 de frete. Outra vende o mesmo produto por R$ 95 com entrega incluída. O primeiro total é R$ 105. Comparar o custo completo evita que a palavra “desconto” decida por você.`,
      ),
      section(
        "Como desenvolver o raciocínio lógico sem complicar a rotina",
        `Escolha um problema pequeno por dia e escreva como chegou à resposta. Pode ser um exercício, uma comparação de preços ou a organização de uma tarefa. Depois pergunte: usei todas as informações? Inventei alguma condição? Minha resposta funciona se eu mudar um detalhe?

      Quando errar, identifique o tipo de erro. Você interpretou mal o enunciado, calculou errado ou seguiu uma regra que não se aplicava? Cada situação pede um ajuste diferente. Repetir muitos desafios sem revisar o processo pode apenas tornar o mesmo erro mais familiar.

      Experimente praticar por dez minutos em alguns dias da semana, sem prometer a si mesmo uma transformação imediata. A familiaridade pode melhorar seu desempenho naquele tipo de tarefa, mas isso não garante ganhos em todas as habilidades ou situações da vida.`,
      ),
      section(
        "O que um teste de raciocínio online pode mostrar?",
        `Um teste reúne desafios em condições específicas e registra seu desempenho nessas tarefas. Isso pode ajudar você a observar quais problemas pareceram mais fáceis e quais exigiram mais tempo ou esforço. Sono, interrupções, ansiedade e familiaridade com o formato também influenciam a experiência.

      O BrainRank, da Meqyro, propõe desafios de raciocínio e oferece um resultado inicial gratuito. Para quem deseja aprofundar a leitura, existe a opção de comprar o relatório completo apresentado após o teste. Use essa leitura como ponto de partida para refletir sobre o seu desempenho.

      Um resultado online não resume sua inteligência, não define seu valor e não substitui uma avaliação profissional. Se você precisa de um documento clínico ou de uma investigação de dificuldades cognitivas, procure um profissional habilitado e confirme quais instrumentos são adequados.`,
      ),
      section(
        "Dúvidas frequentes sobre raciocínio lógico",
        `Preciso ser bom em matemática? Não. Existem problemas verbais, visuais e de relações entre informações. A matemática participa de alguns exercícios, mas não esgota o raciocínio lógico.

      Resolver rápido significa raciocinar melhor? Nem sempre. Velocidade e precisão são aspectos diferentes. Às vezes, conferir uma condição evita um erro que uma resposta imediata deixaria passar.

      Vale repetir o mesmo teste para acompanhar evolução? A repetição pode aumentar a familiaridade com as perguntas. Por isso, uma pontuação maior não comprova, sozinha, uma mudança ampla na capacidade cognitiva. Observe também como você explica e revisa soluções novas.`,
      ),
    ],
    keyTakeaways: [
      "Raciocinar envolve conferir evidências e testar conclusões.",
      "Revisar o motivo de um erro ajuda a escolher o próximo exercício.",
      "O teste oferece uma leitura do desempenho, sem definir sua inteligência.",
    ],
    cta: {
      title: "Explore sua forma de resolver desafios",
      description:
        "Faça o BrainRank, veja o resultado inicial gratuito e conheça a opção de comprar o relatório completo para aprofundar sua leitura.",
      label: "Conhecer o BrainRank",
    },
  },
  {
    slug: "what-are-big-five-personality-traits",
    relatedQuizSlug: "moneydna",
    title: "Big Five: o que os cinco traços de personalidade dizem sobre você",
    subtitle: "Um guia para entender tendências de comportamento sem se prender a um rótulo.",
    excerpt:
      "Conheça os cinco fatores do Big Five, veja exemplos do cotidiano e entenda a diferença entre personalidade e comportamento financeiro.",
    sections: [
      section(
        "O que é o modelo Big Five?",
        `Você pode gostar de conhecer pessoas e ainda precisar de silêncio depois de um encontro. Pode ser organizado no trabalho e deixar a casa para depois. O comportamento humano tem essas nuances, e o Big Five é uma forma de descrever diferenças de personalidade sem colocar todo mundo em caixas fechadas.

      O modelo reúne cinco grandes dimensões: abertura à experiência, conscienciosidade, extroversão, amabilidade e neuroticismo. Cada pessoa pode apresentar tendências em diferentes pontos dessas dimensões. Não existe um conjunto de resultados que represente a personalidade ideal.

      O Big Five é uma referência de pesquisa sobre traços, mas isso não significa que qualquer questionário que use esse nome tenha a mesma qualidade. A utilidade de um instrumento depende de como ele foi construído, estudado e aplicado. Um modelo conhecido não valida automaticamente um teste comercial.`,
      ),
      section(
        "Abertura e conscienciosidade: novidade e organização",
        `Abertura à experiência descreve tendências ligadas à curiosidade, à imaginação e ao interesse por ideias novas. Uma pessoa pode gostar de experimentar receitas e rotinas; outra prefere métodos já conhecidos. Ter mais abertura não torna alguém superior, assim como preferir o familiar não significa falta de capacidade.

      Conscienciosidade envolve aspectos como organização, persistência e cuidado com compromissos. Pense em duas pessoas que precisam entregar um projeto: uma divide o trabalho em etapas; outra começa perto do prazo. A situação também pesa, pois sobrecarga e recursos disponíveis podem mudar a forma de agir.

      Em vez de concluir “sou desorganizado”, experimente uma pergunta mais específica: em quais tarefas eu perco o acompanhamento? Um calendário compartilhado pode resolver um problema de rotina melhor do que transformar um traço em uma crítica pessoal.`,
      ),
      section(
        "Extroversão, amabilidade e sensibilidade emocional",
        `Extroversão envolve tendências de sociabilidade, assertividade e busca de estímulos. Ela não é sinônimo de competência social. Uma pessoa mais reservada pode se comunicar muito bem e preferir conversas individuais a grupos grandes.

      Amabilidade descreve aspectos de cooperação, confiança e consideração pelos outros. Na rotina, ela pode aparecer na disposição para conciliar interesses. Ainda assim, colaborar não exige concordar com tudo. Colocar um limite claro também pode fazer parte de uma relação respeitosa.

      Neuroticismo se refere à tendência de vivenciar emoções como preocupação e tensão. Alguns instrumentos apresentam a dimensão pelo polo da estabilidade emocional. Nenhum desses nomes constitui diagnóstico. Um período difícil pode afetar respostas, e sofrimento persistente merece atenção profissional, independentemente de qualquer pontuação.`,
      ),
      section(
        "Como interpretar um perfil sem transformar tendência em destino",
        `Imagine que você prefere planejar com antecedência e seu colega gosta de improvisar. O resultado útil dessa observação é combinar prazos e responsabilidades. O resultado pouco útil seria decidir que um dos dois está sempre certo e o outro precisa mudar de personalidade.

      Pergunte se a descrição aparece em diferentes contextos e busque exemplos que a contradigam. Você pode ser espontâneo nas férias e cuidadoso com compromissos financeiros. Reconhecer essas diferenças deixa o autoconhecimento mais próximo da vida real.

      Também evite usar o perfil de alguém para prever honestidade, competência ou compatibilidade. Traços descrevem tendências amplas; não revelam toda a história, as condições de vida ou as escolhas futuras de uma pessoa.`,
      ),
      section(
        "Personalidade e dinheiro: onde os assuntos se encontram?",
        `Organização, interesse por novidades e reações emocionais podem participar de escolhas financeiras. Mas o orçamento também depende de renda, dívidas, responsabilidades familiares e acesso a oportunidades. Explicar uma dificuldade financeira apenas pela personalidade pode esconder o problema concreto.

      Se sua dúvida é “por que compro quando estou frustrado?” ou “por que adio olhar minhas contas?”, vale observar situações financeiras específicas. Anote o que aconteceu antes da escolha, o que você esperava sentir e o efeito da decisão depois. Esse registro costuma gerar perguntas mais úteis do que um rótulo genérico.

      O MoneyDNA aborda padrões de comportamento financeiro, como planejamento, impulsividade e tolerância a risco. Ele não é um teste Big Five. Na Meqyro, você pode conhecer o resultado inicial gratuito e avaliar a compra do relatório completo se quiser aprofundar essa reflexão sobre dinheiro.`,
      ),
      section(
        "Perguntas frequentes sobre os cinco traços",
        `O Big Five diz qual profissão devo escolher? Não. Preferências de trabalho também envolvem habilidades, valores, condições e experiências. Um perfil pode alimentar perguntas, mas não oferece uma carreira obrigatória.

      A personalidade pode mudar? Traços apresentam alguma continuidade, mas comportamentos e tendências podem mudar ao longo da vida. Uma única aplicação não determina como você será no futuro.

      Um teste online serve como diagnóstico? Não por ser online ou por citar o Big Five. Diagnóstico exige avaliação apropriada por profissional habilitado. Para uso pessoal, leia as limitações do instrumento e trate descrições como convites à reflexão, sem transformar a pontuação em identidade.`,
      ),
    ],
    keyTakeaways: [
      "O Big Five descreve cinco dimensões contínuas de personalidade.",
      "Traços não definem valor, diagnóstico ou destino profissional.",
      "O MoneyDNA explora comportamento financeiro e não substitui um instrumento Big Five.",
    ],
    sources: [
      {
        label: "APA Dictionary of Psychology — Five-factor model",
        url: "https://dictionary.apa.org/five-factor-model",
      },
    ],
    cta: {
      title: "Quer entender seus hábitos com dinheiro?",
      description:
        "Conheça o MoneyDNA, voltado ao comportamento financeiro. Veja o resultado inicial gratuito e avalie se deseja comprar o relatório completo.",
      label: "Conhecer o MoneyDNA",
    },
  },
  {
    slug: "how-decision-style-affects-work",
    relatedQuizSlug: "moneydna",
    title: "Como tomar decisões melhores sem cair na análise excessiva",
    subtitle: "Um processo prático para escolhas no trabalho, nas compras e na vida cotidiana.",
    excerpt:
      "Aprenda como tomar decisões com critérios claros, reconhecer a análise excessiva e lidar com escolhas financeiras com mais consciência.",
    sections: [
      section(
        "Por que até escolhas pequenas podem cansar?",
        `Você abre várias abas para comparar um produto e, meia hora depois, está menos seguro do que no começo. Ou aceita uma proposta rapidamente e só depois lembra das perguntas que precisava fazer. Os dois caminhos são comuns: procurar certeza demais e decidir antes de entender o problema.

      Tomar uma boa decisão não significa garantir um bom resultado. Você pode escolher com cuidado e enfrentar um imprevisto. O que dá para melhorar é o processo: esclarecer a pergunta, selecionar informações relevantes e definir o que fazer quando a incerteza permanecer.

      Comece escrevendo a decisão em uma frase. “Preciso mudar tudo na minha vida profissional” é amplo. “Vou conversar com meu gestor sobre a distribuição das tarefas nesta semana?” abre espaço para uma ação concreta e proporcional.`,
      ),
      section(
        "Separe decisões reversíveis das que exigem mais cuidado",
        `Testar uma ferramenta gratuita por alguns dias é diferente de assinar um contrato longo. Quanto maior o custo, o compromisso ou a dificuldade de voltar atrás, mais sentido faz examinar condições, alternativas e possíveis perdas.

      Para uma decisão fácil de desfazer, um pequeno experimento pode ensinar mais do que muitas horas de comparação. Você pode testar um novo horário de estudo durante uma semana e registrar o resultado. Não precisa escolher hoje uma rotina definitiva para o ano inteiro.

      Já para decisões com efeitos duradouros, reserve tempo e procure apoio adequado quando necessário. Uma obrigação financeira relevante pede leitura das condições e análise do orçamento. Questões jurídicas, de saúde ou de investimento podem exigir orientação específica.`,
      ),
      section(
        "Defina critérios antes de olhar as opções",
        `Imagine que você procura um curso. Antes de comparar anúncios, anote três critérios: cabe no orçamento, tem um horário viável e aborda a habilidade que você precisa desenvolver. Isso reduz a chance de escolher só porque uma oferta parece urgente ou popular.

      Depois distinga requisitos de preferências. Um curso que acontece no horário do seu trabalho pode ser inviável, mesmo com uma boa reputação. Um material visualmente bonito pode ser agradável, mas talvez não compense a falta do conteúdo essencial.

      Use uma comparação simples, com vantagens, custos e dúvidas de cada opção. Não é necessário atribuir números exatos a tudo. Uma tabela pode organizar a conversa, mas não transforma impressões em medidas objetivas nem elimina o julgamento pessoal.`,
      ),
      section(
        "Como sair da paralisia por análise",
        `Pergunte qual informação ainda poderia mudar sua escolha. Se você já conhece preço, condições e adequação à sua necessidade, assistir a mais dez avaliações talvez apenas adie o desconforto de decidir. Buscar dados úteis é diferente de tentar eliminar qualquer possibilidade de arrependimento.

      Defina um prazo compatível com a importância da decisão e uma condição de encerramento. Por exemplo: comparar três alternativas que atendam aos requisitos, esclarecer a dúvida principal e escolher até sexta-feira. O limite precisa fazer sentido para o caso, sem virar pressa artificial.

      Se nenhuma alternativa atende ao básico, adiar pode ser uma decisão válida. Você também pode reduzir o tamanho do passo: fazer uma conversa exploratória antes de trocar de emprego, ou experimentar uma versão simples antes de assumir uma despesa recorrente.`,
      ),
      section(
        "Emoções e dinheiro: crie uma pausa que funcione",
        `Depois de um dia difícil, uma compra pode parecer uma recompensa merecida. O problema não é sentir vontade de se agradar. É perceber tarde demais que a decisão comprometeu outra prioridade. Observar o contexto ajuda a desenhar uma pausa que você consiga cumprir.

      Para compras não essenciais, experimente salvar o item e revisitar a ideia no dia seguinte. Confira o custo total, a forma de pagamento e o espaço no orçamento. Se a despesa compromete necessidades básicas, a questão pede reorganização financeira, não apenas um exercício de autocontrole.

      O MoneyDNA convida você a refletir sobre planejamento, impulsividade e tolerância a risco. O resultado inicial é gratuito; o relatório completo é uma opção de compra para quem deseja aprofundar a leitura dos próprios padrões. Ele não indica investimentos nem garante melhores resultados financeiros.`,
      ),
      section(
        "Como avaliar a decisão depois",
        `Registre o motivo da escolha antes de conhecer o desfecho. Depois, compare o que você sabia com o que aconteceu. Assim fica mais fácil distinguir uma suposição frágil de um imprevisto que não estava ao seu alcance.

      Devo confiar sempre na intuição? Ela pode ser útil quando existe experiência relevante, mas também pode reproduzir hábitos e impressões. Em uma situação nova ou de grande impacto, vale conferir evidências e alternativas.

      Existe um estilo de decisão perfeito? Não. A mesma pessoa pode precisar de rapidez numa escolha simples e de mais análise em outra. Um processo útil se adapta ao contexto e deixa claro quando buscar ajuda, testar uma hipótese ou encerrar a comparação.`,
      ),
    ],
    keyTakeaways: [
      "Defina a pergunta e os critérios antes de comparar opções.",
      "A profundidade da análise deve acompanhar o impacto da escolha.",
      "Revisar o processo ensina mais do que julgar apenas o resultado.",
    ],
    cta: {
      title: "Entenda como você decide sobre dinheiro",
      description:
        "Explore seus padrões no MoneyDNA. Comece pelo resultado inicial gratuito e conheça a opção de comprar o relatório completo.",
      label: "Explorar meu comportamento financeiro",
    },
  },
  {
    slug: "perfil-financeiro-comportamental",
    relatedQuizSlug: "moneydna",
    title: "Perfil financeiro comportamental: como entender sua relação com o dinheiro",
    subtitle:
      "Planejamento, medo de gastar e compras por impulso podem contar histórias diferentes sobre a sua rotina.",
    excerpt:
      "Entenda o que é perfil financeiro comportamental, como observar seus hábitos com dinheiro e a diferença para o perfil de investidor.",
    sections: [
      section(
        "O que é perfil financeiro comportamental?",
        `Duas pessoas com renda parecida podem lidar de formas bem diferentes com o dinheiro. Uma acompanha cada saída, mas sente culpa até com um gasto planejado. Outra evita olhar o saldo e só descobre o tamanho da fatura no vencimento. O valor recebido importa, mas não explica sozinho essas experiências.

      Perfil financeiro comportamental é uma forma de organizar tendências nas decisões com dinheiro: como você planeja, reage à incerteza, lida com desejos e pensa no futuro. Não é uma identidade fixa nem um julgamento sobre responsabilidade ou sucesso.

      Também não apaga as condições concretas da vida. Uma renda insuficiente, uma despesa de saúde ou o cuidado com familiares pode limitar escolhas mesmo quando existe organização. Antes de atribuir tudo ao comportamento, vale entender o contexto do orçamento.`,
      ),
      section(
        "Observe planejamento, impulso e reação ao risco",
        `No planejamento, repare se você sabe quais contas vencem nas próximas semanas e se costuma reservar recursos para elas. Não precisa ter uma planilha complexa. Um calendário e uma lista de compromissos podem ser suficientes para começar.

      Sobre impulsividade, observe o intervalo entre querer e comprar. Você costuma conferir se precisa do produto? Compara o custo completo? Consegue esperar? Uma compra espontânea ocasional não define o perfil; interessa perceber quando um padrão se repete e quais consequências aparecem.

      Na reação ao risco, pense em situações de incerteza. Você evita qualquer mudança mesmo quando entende as condições, ou aceita uma proposta sem investigar a possibilidade de perda? A disposição emocional é apenas uma parte da decisão. A capacidade real de suportar uma perda depende do seu orçamento e das suas obrigações.`,
      ),
      section(
        "Perfil comportamental é igual a perfil de investidor?",
        `Não. Um perfil comportamental pode explorar hábitos cotidianos, como organização, consumo e relação emocional com dinheiro. Já o processo de adequação de investimentos considera informações específicas sobre objetivos, situação financeira, experiência e disposição para risco, conforme o contexto e as regras aplicáveis.

      Você pode gostar de novidades e ainda precisar preservar recursos que serão usados em breve. Também pode ser cauteloso nas compras e desconhecer os riscos de um produto financeiro. Uma descrição de comportamento não autoriza concluir que determinado investimento é adequado.

      Por isso, não use um quiz de autoconhecimento como recomendação de carteira, crédito ou operação. Quando houver necessidade de orientação financeira individual, procure um profissional qualificado e confira as condições e os riscos de cada decisão.`,
      ),
      section(
        "Um exercício de sete dias para conhecer seus hábitos",
        `Durante uma semana, registre algumas decisões com dinheiro, inclusive as que não terminaram em compra. Anote o contexto, o que você queria resolver, o valor envolvido e como se sentiu depois. Evite escrever “fui irresponsável”; prefira “comprei depois de discutir no trabalho e não conferi o saldo”.

      Ao final, procure repetições. As compras acontecem quando você está cansado? Você adia contas por não saber por onde começar? Recusa todo lazer por receio, mesmo quando separou dinheiro para isso? Essas perguntas ajudam a escolher um ajuste específico.

      Em seguida, teste uma mudança pequena. Se o problema é esquecer vencimentos, crie um lembrete. Se são compras sem planejamento, inclua uma etapa de conferência do orçamento. Acompanhe se o ajuste reduziu o problema real, sem exigir uma rotina perfeita.`,
      ),
      section(
        "Como o MoneyDNA entra nessa reflexão",
        `O MoneyDNA, da Meqyro, apresenta situações e perguntas sobre comportamento financeiro. Ele pode servir como uma estrutura para você refletir sobre planejamento, impulsividade e tolerância a risco, em vez de depender apenas de uma impressão vaga sobre si mesmo.

      Você começa pelo teste e recebe um resultado inicial gratuito. Se quiser uma leitura mais aprofundada, pode avaliar a compra do relatório completo na oferta apresentada após a conclusão. Antes de decidir, confira o conteúdo oferecido e as condições de pagamento na página.

      Responda pensando no que costuma fazer, não no que parece ser a resposta mais admirável. O relatório depende das respostas e deve ser interpretado com contexto. Ele não é diagnóstico, não mede seu valor e não promete resolver dívidas ou aumentar renda.`,
      ),
      section(
        "Perguntas frequentes sobre perfil financeiro",
        `Meu perfil pode mudar? Seus hábitos e circunstâncias podem mudar. Uma nova renda, uma responsabilidade familiar ou a prática de uma rotina podem influenciar decisões. Trate o resultado como uma leitura do momento, não como destino.

      Preciso ganhar muito para me organizar? Não existe renda mínima para começar a observar hábitos. Mas organização não cria recursos que não existem. Se o orçamento não cobre o essencial, reconhecer essa insuficiência é parte da análise.

      O que fazer depois de descobrir um padrão? Escolha um comportamento e uma ação verificável para as próximas semanas. Em vez de “vou ser melhor com dinheiro”, tente “vou conferir os compromissos da semana toda segunda-feira”. O autoconhecimento ganha utilidade quando orienta um passo possível.`,
      ),
    ],
    keyTakeaways: [
      "Comportamento financeiro precisa ser interpretado junto com renda e obrigações.",
      "Perfil comportamental não é recomendação de investimento.",
      "Use a reflexão para escolher um ajuste pequeno e acompanhar o efeito.",
    ],
    sources: [
      {
        label: "Banco Central do Brasil — Cidadania Financeira",
        url: "https://www.bcb.gov.br/cidadaniafinanceira",
      },
    ],
    cta: {
      title: "Conheça seus padrões com dinheiro",
      description:
        "Faça o MoneyDNA e veja o resultado inicial gratuito. Se fizer sentido para você, conheça a opção de comprar o relatório completo.",
      label: "Conhecer meu perfil no MoneyDNA",
    },
  },
  {
    slug: "como-evitar-compras-por-impulso",
    relatedQuizSlug: "moneydna",
    title: "Como evitar compras por impulso: 7 atitudes para testar na rotina",
    subtitle: "Entenda o que acontece antes da compra e crie pausas que caibam na sua vida.",
    excerpt:
      "Veja como evitar compras por impulso com sete atitudes práticas: reconhecer gatilhos, conferir o custo total e criar espaço para decidir.",
    sections: [
      section(
        "Quando uma compra se torna um problema?",
        `Você entra no aplicativo para olhar uma oferta e sai com uma compra que não estava nos planos. Na hora, parece um pequeno presente. Depois, vem a dúvida sobre como encaixar aquela parcela entre os outros compromissos. Se a cena é familiar, observar o caminho até a compra pode ajudar.

      Nem toda compra não planejada é prejudicial. Encontrar um item necessário e acessível pode ser uma decisão razoável. O sinal de atenção está na repetição, na dificuldade de interromper o comportamento e nas consequências para o orçamento ou o bem-estar.

      As atitudes abaixo são experiências de organização, não tratamento. Se comprar causa sofrimento persistente, conflitos ou sensação de perda de controle, procure apoio profissional. Você não precisa esperar que o problema se agrave para conversar sobre ele.`,
      ),
      section(
        "1. Reconheça o que aconteceu antes da vontade",
        `Durante alguns dias, anote o momento em que surge o desejo de comprar. Você estava entediado, cansado, frustrado ou comemorando algo? Tinha acabado de ver um anúncio ou conversar com alguém sobre um produto? O objetivo é reconhecer situações, sem culpar a si mesmo.

      Depois pergunte o que esperava obter: descanso, distração, pertencimento ou uma solução prática? Se a necessidade é descansar, talvez a compra ofereça apenas uma pausa curta e acrescente uma despesa. Conhecer a necessidade abre outras possibilidades de resposta.`,
      ),
      section(
        "2. Crie um intervalo antes de pagar",
        `Para um item não essencial, salve o produto e escolha um momento posterior para revisar a decisão. Pode ser no dia seguinte ou depois de conferir o orçamento. Esse intervalo não precisa seguir uma regra universal; precisa ser suficiente para você sair da urgência do anúncio.

      Se a oferta acabar, avalie o que você perdeu de fato. Deixar de comprar algo desnecessário não gera prejuízo só porque havia um desconto. Para compras essenciais ou urgentes, adapte o processo à necessidade real.`,
      ),
      section(
        "3. Confira o custo total, além da parcela",
        `Some preço, frete, taxas e possíveis despesas recorrentes. Uma assinatura barata por mês vira um compromisso anual; um equipamento pode exigir acessórios ou manutenção. Pergunte também quais parcelas já estarão presentes na próxima fatura.

      Faça a comparação com os recursos disponíveis depois dos compromissos essenciais. Um limite de cartão aprovado não equivale a dinheiro livre. Se a conta só fecha deixando uma obrigação importante para depois, a compra precisa ser revista.`,
      ),
      section(
        "4. Diminua os atalhos para compras repetidas",
        `Se notificações de promoção costumam iniciar o ciclo, experimente desativá-las. Se finalizar uma compra em segundos impede qualquer conferência, retirar o cartão salvo pode criar uma pausa útil. Escolha o ajuste ligado ao seu padrão, sem tentar eliminar toda conveniência da vida.

      Outra possibilidade é visitar lojas com uma lista e um objetivo. Para compras online, feche a página depois de encontrar o que precisava. O ambiente pode facilitar uma escolha; reconhecer isso permite reorganizá-lo.`,
      ),
      section(
        "5. Reserve espaço para desejos possíveis",
        `Um orçamento que proíbe qualquer prazer pode ser difícil de manter. Quando houver margem depois das necessidades e dos compromissos, considere separar um valor para gastos livres. Isso permite desfrutar de algo sem renegociar todo o planejamento a cada vez.

      Se não existe margem, não force uma reserva fictícia. A prioridade pode ser reorganizar despesas, negociar condições ou buscar apoio para entender o orçamento. O método precisa respeitar os recursos e as responsabilidades atuais.`,
      ),
      section(
        "6. Planeje uma alternativa para o gatilho mais comum",
        `Se você costuma comprar quando termina um dia estressante, escolha antecipadamente outra forma de encerrar o expediente. Pode ser conversar com alguém, caminhar ou fazer uma atividade acessível que ofereça descanso. A alternativa deve atender à necessidade, não funcionar como castigo.

      Na hora da vontade, tente descrever a situação: “estou cansado e procurando alívio”. Essa frase não elimina o desejo, mas ajuda a decidir se o produto resolve o que você está sentindo. Se ainda quiser comprar depois, retome a conferência do orçamento.`,
      ),
      section(
        "7. Revise os episódios sem transformar um erro em desistência",
        `Se uma compra atrapalhou seus planos, confira primeiro as condições reais de cancelamento ou devolução. Depois registre o que poderia ter criado uma pausa. Evite concluir que toda tentativa falhou por causa de um episódio.

      O MoneyDNA pode complementar essa observação ao explorar padrões de comportamento financeiro. Na Meqyro, você pode fazer o teste, conhecer o resultado inicial gratuito e avaliar a compra do relatório completo. Use a leitura para formular perguntas sobre seus hábitos, sem esperar uma solução automática.`,
      ),
      section(
        "Dúvidas comuns sobre compras por impulso",
        `Esperar antes de comprar sempre funciona? Não existe garantia. A pausa é uma ferramenta que pode ajudar em algumas situações. Se a dificuldade persiste e gera prejuízo ou sofrimento, vale buscar apoio especializado.

      Devo parar de usar cartão? Depende de como você o utiliza e das alternativas disponíveis. O importante é acompanhar obrigações e custos. Trocar a forma de pagamento sem entender o padrão pode apenas deslocar o problema.

      Por onde começar hoje? Escolha a atitude ligada ao episódio mais recente. Uma mudança pequena e repetível é um ponto de partida mais concreto do que prometer nunca mais comprar por impulso.`,
      ),
    ],
    keyTakeaways: [
      "Observe gatilhos e consequências, sem julgar cada compra isoladamente.",
      "Crie uma pausa e confira o custo completo antes de pagar.",
      "Procure apoio se houver sofrimento ou dificuldade persistente de controle.",
    ],
    cta: {
      title: "O que costuma guiar suas compras?",
      description:
        "Explore seu comportamento no MoneyDNA, veja o resultado inicial gratuito e conheça a opção de comprar o relatório completo.",
      label: "Explorar meus hábitos com dinheiro",
    },
  },
  {
    slug: "teste-de-compatibilidade-de-casal",
    relatedQuizSlug: "coupledna",
    title: "Teste de compatibilidade de casal: o que ele pode revelar?",
    subtitle:
      "Entenda como usar diferenças e afinidades para abrir conversas mais claras sobre a relação.",
    excerpt:
      "Saiba como funciona um teste de compatibilidade de casal, quais temas conversar e o que uma comparação de perfis não pode prever.",
    sections: [
      section(
        "Compatibilidade não exige pensar igual em tudo",
        `Uma pessoa prefere decidir as férias meses antes. A outra gosta de escolher o destino perto da viagem. Isso significa que a relação não combina? A diferença, sozinha, não responde. Importa saber como vocês negociam orçamento, expectativas e o espaço de cada um.

      Compatibilidade pode ser entendida como a possibilidade de construir uma vida compartilhada com respeito às diferenças e aos limites. Gostos parecidos ajudam em alguns momentos, mas não substituem confiança, responsabilidade e disposição para conversar.

      Um teste de compatibilidade de casal pode organizar temas que o cotidiano deixa de lado. Ele não comprova que duas pessoas são almas gêmeas, não prevê separação e não determina se alguém deve continuar numa relação.`,
      ),
      section(
        "O que vale a pena observar além dos gostos em comum",
        `Comece pela comunicação: como cada pessoa pede algo, reage a uma discordância e entende que foi ouvida? Às vezes, um parceiro acha que está oferecendo uma solução, enquanto o outro precisava primeiro explicar o que sentia.

      Depois olhe para a rotina. Divisão de tarefas, tempo juntos, privacidade, contato com familiares e uso do dinheiro podem gerar atritos mesmo quando existe afeto. Perguntas específicas costumam ajudar mais do que “a gente combina?”.

      Projetos de futuro também merecem espaço. Mudança de cidade, filhos, trabalho e prioridades financeiras podem envolver diferenças importantes. Nenhum questionário resolve essas decisões por vocês, mas uma conversa estruturada pode tornar as expectativas mais visíveis.`,
      ),
      section(
        "Como responder a um teste em dupla",
        `Cada pessoa deve responder por si, pensando no comportamento habitual. Combinar respostas para obter um resultado bonito reduz a utilidade da experiência. Também não vale acompanhar a tela do outro para cobrar uma resposta ou corrigir uma percepção.

      Escolham um momento em que ambos queiram participar. Se uma das pessoas não deseja responder ou compartilhar, respeitem a decisão. Autoconhecimento em dupla exige escolha, e a comparação não deve virar uma prova de amor ou de lealdade.

      No CoupleDNA, a comparação bilateral depende da participação e da autorização das duas pessoas, além das condições de conclusão e pagamento do fluxo. Antes de comprar ou enviar o convite, confiram as instruções apresentadas pela Meqyro.`,
      ),
      section(
        "Como conversar sobre diferenças no resultado",
        `Escolham um único ponto para começar. Se aparecer uma diferença na percepção de apoio, perguntem o que cada pessoa entende por apoiar: ouvir, ajudar numa tarefa, oferecer ideias ou respeitar um tempo de silêncio? A mesma palavra pode representar expectativas distintas.

      Usem exemplos recentes, sem fazer um inventário de falhas. “Quando cheguei cansado na terça, queria conversar por alguns minutos” abre uma situação concreta. “Você nunca me apoia” transforma a conversa numa disputa sobre toda a história da relação.

      Procurem um acordo pequeno que ambos possam experimentar. Por exemplo, perguntar “você quer que eu escute ou que eu ajude a pensar numa solução?”. Depois de alguns dias, retomem a conversa e avaliem se a mudança atendeu à necessidade.`,
      ),
      section(
        "O que uma pontuação de compatibilidade não conta",
        `Uma pontuação não conhece toda a história do casal e depende das respostas dadas. Uma pessoa pode interpretar uma pergunta de modo diferente, responder num dia difícil ou perceber a relação de uma forma que o parceiro não compartilha. Essas diferenças merecem escuta, não uma sentença.

      Resultado semelhante não garante uma relação saudável. Diferenças também não condenam o vínculo. Respeito, consentimento e segurança não devem ser relativizados por um teste ou por uma descrição positiva de perfil.

      Se existe medo, controle, ameaça ou violência, priorize segurança e apoio especializado. Nessas situações, uma conversa em dupla ou o compartilhamento de respostas pode não ser seguro. Um teste não substitui proteção nem acompanhamento profissional.`,
      ),
      section(
        "Vale a pena comprar um relatório de casal?",
        `A compra pode fazer sentido quando os dois querem uma leitura mais detalhada e entendem as limitações da proposta. Antes de pagar, confiram o que está incluído, as condições de acesso e as etapas exigidas para a comparação. Evitem comprar esperando uma resposta definitiva sobre o futuro da relação.

      O CoupleDNA oferece uma forma estruturada de explorar percepções em dupla. Na Meqyro, vocês podem conhecer o teste e a oferta do relatório completo. Para a comparação bilateral, ambos precisam concluir sua participação e autorizar o compartilhamento conforme o fluxo.

      O que fazer depois da leitura? Reservem um momento tranquilo, escolham uma pergunta e terminem com um combinado possível. Se os mesmos conflitos se repetem e vocês não conseguem avançar, um profissional pode ajudar a compreender a dinâmica com mais contexto do que um questionário permite.`,
      ),
    ],
    keyTakeaways: [
      "Compatibilidade envolve negociar diferenças, além de compartilhar gostos.",
      "Cada participante deve responder e autorizar o compartilhamento livremente.",
      "O relatório apoia a conversa e não prevê o futuro da relação.",
    ],
    cta: {
      title: "Abram uma conversa sobre o jeito de vocês",
      description:
        "Conheçam o CoupleDNA e as condições do relatório completo. A comparação em dupla exige conclusão, autorização dos dois participantes e pagamento confirmado.",
      label: "Conhecer o CoupleDNA",
    },
  },
  {
    slug: "como-melhorar-comunicacao-no-relacionamento",
    relatedQuizSlug: "coupledna",
    title: "Como melhorar a comunicação no relacionamento: um guia prático",
    subtitle:
      "Pequenos ajustes para falar de necessidades, ouvir melhor e construir acordos possíveis.",
    excerpt:
      "Aprenda como melhorar a comunicação no relacionamento com exemplos de pedidos claros, escuta e acordos para conversas difíceis.",
    sections: [
      section(
        "Por que a mesma conversa termina na mesma discussão?",
        `O assunto começa com a louça e termina com “você não se importa comigo”. Muitas vezes, a tarefa é só a parte visível de uma necessidade: descanso, reconhecimento ou uma divisão mais justa. Quando essa necessidade fica implícita, o outro pode responder a um problema diferente.

      Melhorar a comunicação no relacionamento não é encontrar uma frase que faça o parceiro concordar. É criar condições para entender o que está acontecendo, expressar limites e negociar responsabilidades. A conversa precisa permitir discordância, não apenas parecer tranquila.

      As sugestões deste guia se aplicam a relações em que existe segurança para falar. Se você teme a reação da outra pessoa ou enfrenta controle e ameaças, priorize apoio especializado e proteção. Não é sua obrigação resolver violência escolhendo palavras melhores.`,
      ),
      section(
        "Escolha um momento e um assunto de cada vez",
        `Tentar discutir uma decisão importante quando alguém está saindo para trabalhar pode aumentar a tensão. Proponha um momento concreto: “quero conversar sobre as tarefas da semana; podemos reservar alguns minutos depois do jantar?”. O objetivo é dar espaço ao tema, sem exigir disponibilidade imediata.

      Definam qual problema querem tratar. Misturar contas, familiares, tarefas e conflitos antigos pode tornar impossível perceber qualquer avanço. Se outro assunto surgir, anotem e combinem retomá-lo depois.

      Se a conversa ficar intensa, uma pausa pode ajudar, desde que venha com um acordo de retorno. Dizer quando vocês tentarão novamente é diferente de desaparecer ou usar o silêncio para punir. Cada casal precisa encontrar um intervalo que respeite as duas pessoas.`,
      ),
      section(
        "Troque acusações amplas por situações observáveis",
        `Compare “você nunca ajuda” com “nesta semana eu fiz o jantar e organizei a cozinha todos os dias; preciso dividir essas tarefas”. A segunda frase permite discutir fatos e responsabilidades. Ela não garante uma resposta receptiva, mas deixa mais claro o pedido.

      Uma estrutura possível é descrever a situação, dizer o impacto e fazer um pedido específico. Por exemplo: “quando nossos planos mudam sem aviso, tenho dificuldade para organizar meu horário; podemos confirmar até a tarde?”. Use palavras naturais, sem transformar a conversa numa fórmula rígida.

      Evite apresentar interpretações como fatos. “Você chegou depois do combinado” descreve algo verificável. “Você chegou tarde porque não me respeita” atribui uma intenção que precisa ser conversada. O impacto pode ser real mesmo quando a intenção ainda não está clara.`,
      ),
      section(
        "Escute para entender antes de preparar a resposta",
        `Enquanto o outro fala, tente identificar a necessidade que está sendo descrita. Você pode conferir: “entendi que está pesado cuidar disso sozinho; é isso?”. Essa confirmação não exige concordar com toda a interpretação nem assumir uma culpa que você não reconhece.

      Perguntas abertas costumam ajudar: “o que seria uma divisão mais justa para você?” ou “o que ficou faltando naquele momento?”. Depois, apresente também seu contexto. Ouvir não significa que apenas uma pessoa terá espaço na conversa.

      Se houver versões diferentes do mesmo episódio, não é obrigatório decidir imediatamente qual memória está correta. Vocês podem reconhecer que perceberam a situação de formas distintas e discutir como tornar o próximo combinado mais claro.`,
      ),
      section(
        "Transforme a conversa em um acordo verificável",
        `“Vamos melhorar” expressa uma intenção, mas não indica o que muda amanhã. Um acordo mais concreto identifica a tarefa, quem a assume e quando será feita. Na divisão doméstica, inclua o planejamento e o acompanhamento, não só a execução quando alguém pede.

      Confiram se o combinado é viável. Horários de trabalho, saúde e outras responsabilidades podem exigir ajustes. Uma divisão justa não precisa ser idêntica em cada tarefa, mas deve poder ser discutida sem deixar toda a coordenação nas mãos de uma pessoa.

      Marquem uma revisão simples: “no domingo vemos se funcionou”. Se não funcionou, investiguem o obstáculo antes de concluir que faltou interesse. Ao mesmo tempo, promessas repetidas sem mudança também são informações importantes sobre a dinâmica da relação.`,
      ),
      section(
        "Como um teste de casal pode apoiar esse processo",
        `Um questionário pode ajudar a nomear diferenças de percepção que estavam difíceis de explicar. Talvez uma pessoa valorize conversas frequentes, enquanto a outra associe cuidado principalmente a atitudes práticas. Entender a diferença pode orientar perguntas, mas não torna uma necessidade menos legítima.

      O CoupleDNA, da Meqyro, permite explorar percepções em dupla. O relatório completo é uma opção de compra, e a comparação bilateral exige conclusão e autorização de ambos, além do pagamento confirmado. Leiam as condições antes de iniciar a experiência compartilhada.

      Usem o resultado como início de conversa, sem invocá-lo como autoridade para encerrar uma discussão. “O que você reconhece nessa descrição?” abre espaço. “O teste provou que você está errado” transforma uma ferramenta de reflexão em disputa.`,
      ),
      section(
        "Perguntas frequentes sobre comunicação no casal",
        `É normal discordar? Diferenças fazem parte das relações. O cuidado está em como são tratadas: discordância não justifica humilhação, intimidação ou desrespeito a limites.

      Preciso resolver tudo numa conversa? Não. Alguns assuntos pedem tempo e novas informações. Um avanço pode ser entender melhor o problema e combinar o próximo passo, sem pressionar por uma solução imediata.

      Quando buscar ajuda profissional? Quando o sofrimento ou os conflitos persistem, quando as tentativas de diálogo não avançam ou quando vocês querem apoio para compreender a relação. Se houver violência ou medo, procure orientação apropriada para sua segurança; um teste de casal não atende a essa necessidade.`,
      ),
    ],
    keyTakeaways: [
      "Fale de situações concretas e faça pedidos que possam ser compreendidos.",
      "Escutar não exige concordar com tudo nem abrir mão de limites.",
      "Acordos úteis definem ações possíveis e um momento para revisar.",
    ],
    cta: {
      title: "Como cada um percebe a relação?",
      description:
        "Conheçam o CoupleDNA e a opção de comprar o relatório completo. A comparação só acontece com a conclusão e a autorização dos dois participantes, além do pagamento confirmado.",
      label: "Explorar o CoupleDNA em dupla",
    },
  },
];

export const PORTUGUESE_ARTICLES: BlogArticle[] = articles.map((article) => {
  const words = [
    article.title,
    article.subtitle,
    ...article.sections.flatMap((item) => [item.heading, ...item.paragraphs]),
  ]
    .join(" ")
    .split(/\s+/).length;
  return {
    ...article,
    publishedAt:
      article.slug === "how-logical-reasoning-works"
        ? "2026-09-20T10:00:00Z"
        : article.slug === "what-are-big-five-personality-traits"
          ? "2026-09-21T10:00:00Z"
          : article.slug === "how-decision-style-affects-work"
            ? "2026-09-22T10:00:00Z"
            : "2026-10-31T00:00:00Z",
    modifiedAt: "2026-10-31T00:00:00Z",
    readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
  };
});
