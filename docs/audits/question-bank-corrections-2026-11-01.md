# Revisão e correção da base de perguntas — 01/11/2026

Os **359 itens** encontrados nas versões publicáveis de homologação foram classificados individualmente. O candidato contém **239 itens** com quatro traduções, após substituir a expansão de 120 cenários genéricos pelos conjuntos de 20 cenários específicos de MoneyDNA e CoupleDNA. A quantidade aplicada por tentativa não mudou. Esta decisão reduz repetição; os dois testes comportamentais passam a ter um conjunto fixo de 20 cenários, sem promessa de variação entre tentativas.

## Correções realizadas

- **BrainRank 1.3:** banco completo de 96 questões centrais e 12 memórias. BR_ATT_02 agora oferece e pontua 10 letras R. As posições corretas das 96 centrais foram equilibradas em 24/24/24/24. Mais cinco itens receberam esclarecimentos: passos exatos dos baldes, premissa de chuva no mesmo instante, definição da progressão por inversos, observação das posições pares/ímpares e contagem visual de exatamente duas ocorrências. Nesta última, as quatro opções agora mostram uma figura cada, sem o distrator ambíguo que agrupava três figuras. Cálculos independentes e verificações de alternativas complementam a revisão editorial.
- **Personality Map 1.1:** 40 afirmações reescritas, com uma ideia central, menos adjetivos valorativos e linguagem mais simples. Preservados cinco grupos de oito itens e a divisão entre quatro diretos e quatro reversos.
- **CareerFit v1.1.0:** 24 afirmações reescritas para expressar preferências profissionais sem confundir experiência, remuneração atual, prestígio ou empreendedorismo com interesse em uma área. Mantidos seis grupos de quatro.
- **FocusStyle v1.1.0:** 20 afirmações reescritas, retirando exigências como quatro horas de silêncio, termos como Pomodoro e linguagem de produtividade idealizada. Preservadas as três questões de memória, pontuadas separadamente, e 20 perguntas por tentativa.
- **DecisionDNA v1.1.0:** quatro novos contextos — escolher um curso, mudar um trajeto, usar tempo livre e comprar um aparelho. Alternativas analíticas, intuitivas, práticas e colaborativas respondem à mesma decisão sem depender de vivência em gestão ou contratação.
- **MoneyDNA v3.0.0:** 20 cenários específicos revisados. A pergunta de empréstimo, que confundia generosidade com preferência por experiências, foi substituída por uma escolha entre evento e poupança. Esclarecidos pagamento antecipado, transporte e reorganização após despesa essencial. Novas chaves MD3.
- **CoupleDNA v3.0.0:** mantidos os 20 cenários contextualizados aprovados na revisão, com novas chaves CD3; cada conjunto de alternativas responde a uma situação concreta. Os 60 itens adicionais de respostas genéricas não são copiados para a nova versão. O índice permanece descritivo, de processamento individual a elaboração conjunta, sem tratar um polo como qualidade superior da relação.

As versões antigas continuam intactas. O gabarito errado permanece apenas no instrumento histórico, para não reinterpretar silenciosamente respostas já fornecidas; novas tentativas usarão o item corrigido após a ativação. Os 120 itens retirados das novas versões continuam disponíveis para retomar sessões históricas.

## Compatibilidade corrigida

O scorer e os relatórios agora buscam o catálogo pela versão fixada na sessão. O snapshot dos 120 cenários antigos adicionados remotamente foi recuperado, junto com a migração exata `20261101000121_expand_commercial_question_banks`. Assim, o código reconhece também as questões 21–80 das versões históricas.

A comparação de CoupleDNA valida os 20 itens realmente atribuídos aos participantes, com quatro por dimensão e conjuntos iguais. A criação de sessão já espelhava o conjunto do iniciador; a comparação agora respeita esse contrato. Continua sem revelar respostas individuais do parceiro.

Todas as avaliações escolhem a versão publicável mais recente de forma determinística. A retomada conserva a versão original. O algoritmo comportamental continua `behavioral-v2`, pois a fórmula não mudou; o instrumento novo é identificado separadamente como v3.0.0. A mudança de gabarito cognitivo recebe conteúdo/scoring 1.3.

## Validação

- **349 testes unitários aprovados em 46 arquivos**, incluindo 25 novos testes.
- `pnpm typecheck`, ESLint dos arquivos alterados e `pnpm build`: aprovados.
- 239 itens: chaves e posições únicas, quatro traduções completas e alternativas distintas; gabarito único nos itens cognitivos e de memória.
- Gabarito de BR_ATT_02 verificado por contagem do texto real nos quatro idiomas; problemas numéricos verificados com cálculos independentes. Figuras validadas após reordenação.
- **400 seleções e cálculos comportamentais**: 100 por teste/versão, cobrindo os bancos históricos de 80 itens e os revisados de 20. Cada resultado foi usado para gerar relatórios nos quatro idiomas, verificando a presença das evidências atribuídas.
- Comparações bilaterais verificadas para concordância total, divergência total e rejeição de conjuntos inválidos; pesos adulterados e chaves de outra versão continuam rejeitados.
- As sete versões foram gravadas em **meqyro-hml como DRAFT**. Consulta posterior comparou todos os 239 itens com as fontes, incluindo enunciados, rótulos, posições, metadados visuais e pontuação: correspondência integral.
- Ativação executada em transação no banco remoto, com verificações de quantidade, algoritmo, traduções e alternativas, seguida de **ROLLBACK**. As sete versões continuam DRAFT; nada foi publicado por essa validação.

A integração local completa não pôde ser executada: a extração da imagem Postgres do Supabase falhou com `no space left on device`. Não foram removidos ou enfraquecidos testes para ocultar essa limitação. A validação remota de conteúdo e a transação de ativação não equivalem ao fluxo HTTP completo. Não foi validado um banco de produção nem realizado deploy. Revisão editorial e testes de software não estabelecem validade psicométrica ou clínica.

## Estado de entrega e publicação

**Conteúdo corrigido e preparado em homologação; publicação ainda não realizada.** A aplicação implantada precisa receber este código antes da ativação dos instrumentos. Publicar v3.0.0 com o código antigo causaria rejeição das novas chaves MD3/CD3.

A migração `20261101010236_reviewed_question_banks.sql` é aditiva e já está aplicada em homologação. O refinamento `20261101010948_clarify_reviewed_brainrank_items.sql` também foi aplicado; ele exige DRAFT e ausência de sessões antes de alterar os cinco itens ainda não utilizados. A primeira migração aplicada não foi reescrita. O arquivo `activate-reviewed-question-banks.sql` faz a ativação transacional após o deploy correspondente, sem apagar perguntas, respostas ou resultados anteriores. O seed local inclui a ativação para testar o candidato em um banco isolado. Antes de publicar, executar a suíte de integração com o seed novo e conferir o fluxo real de sessão, resultado e comparação bilateral no candidato implantado.

## Arquivos de revisão

- `question-bank-item-review-2026-11-01.csv`: decisão para cada um dos 359 itens originais, motivo e vínculo com o instrumento revisado. A substituição dos cenários genéricos é por conjunto temático, não uma substituição numérica 1:1.
- `question-bank-reviewed-catalog-pt-2026-11-01.md`: catálogo dos 239 itens em português, incluindo informação anterior das memórias e gabaritos cognitivos para revisão interna. Questões visuais precisam ser vistas com suas figuras; o texto isolado não representa o desafio.
- Fontes em `src/content/quizzes/*reviewed*` e `reviewed-likert.ts`: quatro idiomas; versões históricas em arquivos separados.
- `question-bank-corrections-2026-11-01.json` e `question-bank-corrections-evidence-2026-11-01/`: resumo e logs de verificação.
