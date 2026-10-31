# Meqyro e MyIQ — comparação e primeira adaptação

Data: 30/10/2026. Fontes diretas lidas nesta execução: https://myiq.com/pt/start e https://myiq.com/pt. Meqyro: código atual do workspace, commit-base 27b67f2. Não foi possível capturar telas: a skill Browser está disponível, mas nenhuma ferramenta de navegador foi exposta. Este documento é uma comparação de conteúdo e implementação, não uma auditoria visual nem um teste completo do concorrente. Conversão, faturamento, CAC, retenção e reembolsos do concorrente não estão disponíveis.

## Diferenças observáveis

| Aspecto         | MyIQ: conteúdo público extraído                                                               | Meqyro: código atual                                           | Decisão                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Promessa        | Pontuação de QI e perfil cognitivo                                                            | Raciocínio, dinheiro e relacionamento                          | Manter três propostas concretas, sem anunciar personalidade fora do catálogo comercial                       |
| Início          | /pt/start informa 60 perguntas e seis alternativas; /pt informa 40 perguntas e até 20 minutos | BrainRank: 24 desafios, estimativa de 7–10 minutos             | Apresentar escopo consistente; tempos são estimativas, não vantagem comprovada por medição                   |
| Resultado       | Exemplos de pontuação, percentil e certificado                                                | Resumo gratuito e relatório opcional                           | Explicar o que será recebido antes do teste; não inventar percentis ou validação psicométrica                |
| Cobrança        | Na leitura realizada: US$ 1 por sete dias e US$ 29,99 por 28 dias com renovação automática    | Oferta paga após o resumo inicial                              | Dar visibilidade ao resumo sem cadastro/cartão e à compra opcional; não alterar preços ou modelo de cobrança |
| Prova social    | A página declara 80 milhões de participantes e 4,1/5 com 151.263 avaliações                   | Sem dados equivalentes verificados                             | Não reutilizar números, depoimentos ou selos do concorrente                                                  |
| Continuidade    | Página anuncia exercícios e cursos                                                            | Relatório com sugestões práticas                               | Competir com utilidade do relatório; cursos e treino exigiriam produto e validação próprios                  |
| Situações reais | Não verificadas no fluxo interativo                                                           | MoneyDNA/CoupleDNA v2 usam 20 cenários com quatro alternativas | Mostrar exemplo vindo da mesma versão de conteúdo entregue pelo catálogo                                     |

A divergência de 40/60 perguntas no conteúdo extraído pode refletir variantes, personalização ou desatualização; sem percorrer o fluxo não é possível determinar a causa. Preço e moeda podem variar por mercado.

## Primeira adaptação implementada

1. Home em pt/en/es/fr: promessa alinhada aos três produtos efetivamente comercializados.
2. Landing dos três produtos: benefício específico e distinção explícita entre resumo gratuito e relatório opcional pago.
3. MoneyDNA/CoupleDNA: quantidade descrita como situações quando o catálogo serve behavioral-v2; exemplo expansível com enunciado e alternativas reais. É leitura, sem envio de resposta ou exposição dos pesos de scoring.
4. CoupleDNA: requisitos de conclusão, consentimento bilateral e pagamento expostos antes do início.
5. MoneyDNA: retirada a promessa de medir impulsividade e tolerância a investimento do catálogo; o escopo real é explorar prioridades de escolha.
6. Nenhuma alteração no scoring, pagamentos, versões históricas ou respostas salvas.

## Próximas prioridades

P0: oferecer escolha clara entre retomar tentativa antiga e iniciar a versão atual. Hoje o cookie retoma automaticamente a tentativa anterior, o que já confundiu a homologação. Preservar histórico, convites e acesso comprado; não migrar respostas antigas silenciosamente.

P1: demonstrar um relatório completo com exemplo explicitamente fictício, separado dos resultados individuais. Verificar checkout e entrega real em homologação antes de aquisição paga.

P1: revisar o percurso no celular, incluindo começo, perguntas, salvamento, retomada, resultado, consentimento e compra; capturar evidências de navegador quando disponível.

P2: construir hábito com sugestões e acompanhamento somente após demonstrar que as pessoas usam o relatório. Não adicionar assinatura apenas para imitar receita aparente do concorrente.

## Como medir sucesso

Usar eventos existentes: quiz_viewed → quiz_started → quiz_completed → result_viewed → checkout_started → payment_completed. Conferir origem e deduplicação antes de interpretar taxas. Não há linha de base validada nesta análise.

- Início: tentativas novas / visitantes elegíveis da landing.
- Conclusão: tentativas concluídas / tentativas novas, na mesma coorte.
- Compra: compradores únicos com pagamento confirmado / pessoas com resultado gratuito, com janela definida.
- Economia: receita líquida após tarifas, reembolsos e aquisição por visitante elegível.
- Guardrails: reembolso, reclamação de cobrança, erros de sessão, falha de entrega e tempo para receber relatório.

Segmentar por produto, dispositivo, país e canal. Definir janela de atribuição e unidade de randomização antes de um experimento. Calcular amostra com a linha de base real; não fixar tamanho arbitrário. Mudanças só podem ser chamadas de vencedoras com dados e sem piorar reembolso e satisfação. Não é possível garantir que o Meqyro terá mais sucesso que o MyIQ com as evidências disponíveis.

## Validação desta entrega

- TypeScript: aprovado (`pnpm typecheck`).
- Unitários: 324 testes em 45 arquivos aprovados (`pnpm test:unit`).
- ESLint dos arquivos TS/TSX alterados: aprovado.
- Diff sem erros de whitespace.
- Build: compilação concluída, mas o Next.js falhou ao interpretar a saída de `tsc --showConfig`. Reprodução isolada pela função `runTypeScriptCli` do Next retornou código 0 e stdout vazio; a chamada direta de `node node_modules/typescript/bin/tsc --showConfig` retornou JSON normalmente. Não foram alteradas dependências nem desativada a checagem para contornar a falha.
- Navegação, layout no celular, teclado e checkout: não verificados nesta execução por ausência de ferramenta de navegador. O exemplo usa `details/summary` nativo e foco visível, mas isso não constitui conformidade de acessibilidade comprovada.
- Integrações com banco/pagamento não foram executadas; não houve alteração nesses serviços.
- Alterações locais, ainda não publicadas em homologação.

## Execução autorizada em 31/10/2026

Implementado: escolha explícita de retomada/nova tentativa, com versões visíveis e conteúdo vinculado à tentativa ao retomar. O início de uma nova tentativa preserva a credencial previamente autenticada, mantendo o acesso aos endereços antigos. Nenhuma resposta, convite ou grant foi apagado ou reescrito. Links de convite não retomam uma tentativa sem relação com o convite. O filtro por quiz agora ocorre no banco antes do limite da busca, evitando que uma tentativa mais recente de outro produto esconda a correta.

Exemplos públicos completos de MoneyDNA e CoupleDNA adicionados em `/[locale]/quizzes/[slug]/example`. Usam respostas fictícias determinísticas e o scoring e gerador de relatório reais, sem ler dados pessoais ou liberar relatórios de sessões reais. Os quatro idiomas identificam a demonstração como fictícia.

Validação: 335 testes unitários passaram em 47 arquivos, incluindo 11 novos casos sobre retomada/credencial e conteúdo dos relatórios de exemplo. Tipagem e lint dos arquivos alterados aprovados. A suíte completa também foi iniciada; testes que exigem o Supabase em 127.0.0.1:54321 não têm banco disponível neste ambiente. Isso não comprova integração remota, entrega de e-mail ou compra real.

Limites da execução: ferramenta de navegador continua indisponível. Checkout externo e recebimento real de e-mail não podem ser confirmados apenas por leitura HTTP. Permanecem como aceite operacional de homologação; não iniciar aquisição paga como se essas verificações tivessem passado. A fase de hábito/cursos permanece condicionada ao uso comprovado dos relatórios, conforme o plano.

Medição: os eventos de início/conclusão/resultado/checkout/pagamento já existem e o agregado comercial é protegido em `/[locale]/admin`. O índice atual de pedidos/sessões é uma razão operacional, não uma taxa causal ou por coorte; não tratá-lo como prova de ganho. Antes do experimento, extrair sessões distintas por produto e data de início, observar conclusão e pagamento na mesma janela de sete dias e separar moedas. Eventos de page view sem identificador de visitante não permitem calcular visitantes únicos nem taxa de início confiável. Não foram inventados resultados ou ativado um experimento sem linha de base.
