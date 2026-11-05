# Revisão dos três testes comerciais — 31/10/2026

## Diagnóstico e alterações

| Teste     | Problema observado                                                                                                     | Alteração                                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| BrainRank | Banco de 60 itens com exposição desigual por dificuldade; síntese e exercícios semelhantes para desempenhos distintos. | 96 itens cognitivos, com cada estrato quatro vezes maior que sua cota; síntese pelos índices reais e prática diferenciada por área e faixa de acertos. |
| MoneyDNA  | Os 20 cenários eram todo o banco; orientações pouco sensíveis à prioridade escolhida.                                  | Banco de 80 cenários; interpretação por prioridade e faixa, evidências das escolhas e experimento financeiro com limite e revisão em sete dias.        |
| CoupleDNA | Os mesmos 20 cenários para todos; orientação individual pouco sensível ao polo escolhido.                              | Banco de 80 cenários; interpretação de reflexão individual versus elaboração conjunta em cada tema e acordo prático para revisar em uma semana.        |

Os novos conteúdos incluem dilemas de trabalho, formação, despesas recorrentes, experiências, comunicação, privacidade, responsabilidades e projetos futuros. Não são cópias com novos IDs. Cada cenário tem quatro alternativas, sem resposta considerada correta. As 20 questões originais continuam disponíveis como formulário canônico para compatibilidade. Novas tentativas reais usam o banco ampliado e salvam os IDs sorteados.

A tela do relatório passa a exibir as escolhas que sustentam a leitura, já presentes nos arquivos de download. Somente as respostas do próprio participante são incluídas no relatório individual, inclusive no fluxo bilateral autorizado.

## Interpretação dos 25%

A implementação considera **a chance de uma pergunta respondida por A também aparecer para B**, em tentativas independentes. Não considera uma chance de 25% de receber um formulário inteiro idêntico.

- MoneyDNA e CoupleDNA: 4 questões sorteadas entre 16 por dimensão → 25% de inclusão por item; 5 questões compartilhadas em média entre dois formulários de 20.
- BrainRank: em cada dimensão, 1 entre 4 fáceis, 2 entre 8 médias e 1 entre 4 difíceis → 25% por item antes da distribuição da recuperação de informações. A substituição de três posições por recuperação reduz a exposição dos itens cognitivos. As três recuperações usam o banco existente de 12 narrativas. A repetição média final pode ficar abaixo de 25%.
- Cada par pode compartilhar mais ou menos perguntas; não há teto rígido de seis ou cinco itens por par. Um teto rígido universal exigiria uma política diferente de alocação e restrições ao número de formulários.
- Parceiros ligados por convite no CoupleDNA respondem ao mesmo formulário para permitir comparação direta. Entre casais independentes vale o sorteio.
- A retomada da sessão mantém seu formulário. Prévias estáticas de fallback não são tentativas independentes sorteadas.

## Conteúdo dos relatórios

A síntese identifica todos os empates nos maiores e menores índices. A interpretação usa a dimensão e a faixa do resultado; as faixas são editoriais, sem norma populacional. Ações combinam o exercício próprio da dimensão com um método de execução e revisão adequado ao resultado. No BrainRank, por exemplo, menor precisão orienta prática sem cronômetro e revisão dos erros; maior precisão orienta novos itens com mais complexidade, registrando tempo separadamente.

No MoneyDNA, índice menor descreve prioridade menos escolhida quando disponível; não significa deficiência financeira. A orientação é educacional e não recomenda investimentos. No CoupleDNA, ambos os polos podem ser úteis; o relatório individual não determina a percepção do parceiro, qualidade da relação ou compatibilidade.

Os novos itens e suas dificuldades são conteúdo exploratório editorial. A ampliação não constitui calibração psicométrica ou comprovação de equivalência entre formas. Essa limitação deve acompanhar qualquer afirmação sobre validade do teste.

## Entrega e validação

- Migração aditiva: `supabase/migrations/20261031042037_expand_commercial_question_banks.sql`, gerada por `scripts/question-bank-expansion.ts`. Insere 156 itens novos e traduções, sem reescrever conteúdo histórico ou resultados.
- Seed regenerado a partir das fontes de conteúdo.
- A migração deve ser aplicada antes da publicação do serviço com o orçamento de exposição. Ela foi preparada, mas não aplicada a banco remoto.
- Validação de tipos, testes unitários e build de produção executados. A suíte unitária inclui simulação de 600 pares por teste, cotas por dimensão, banco insuficiente, relatórios em quatro idiomas e concordância bilateral com formulários sorteados.
- Testes de integração não puderam ser concluídos: Supabase local em `127.0.0.1:54321` indisponível. A migração ainda precisa de execução e verificação em banco real.

## Atualização de homologação — 01/11/2026

A migração foi aplicada ao projeto Supabase `meqyro-hml` (`zfdipjfgzkaqcbudfzub`) pelo conector autorizado. O histórico remoto a registrou como `20261101000121_expand_commercial_question_banks`, correspondente ao conteúdo do arquivo local `20261031042037_expand_commercial_question_banks.sql`; o histórico prévio desse ambiente também utiliza timestamps remotos próprios. Não reaplicar por comparação cega de timestamps.

A consulta posterior confirmou 96 itens cognitivos e 12 narrativas de recuperação no BrainRank 1.2 e 80 cenários em cada instrumento comportamental v2. Todos os itens têm quatro traduções e quatro alternativas, sem alternativa com tradução incompleta. As cotas por dimensão/dificuldade correspondem ao blueprint. As 32 tabelas continuam sob RLS. Os dois avisos históricos relacionados à função pública `rls_auto_enable` permanecem fora do escopo desta atualização de conteúdo.

O candidato incorpora a versão de `origin/development` em `c0a9ce6`, preservando as alterações mais recentes de blog, navegação e página inicial. Após integração: 360 testes unitários em 50 arquivos aprovados e verificação de tipos aprovada. A publicação usa apenas Preview no projeto Vercel `meqyro`, equipe `MEQYRO`, com o alias de HML já configurado em `NEXT_PUBLIC_SITE_URL`. Nenhum segredo é incluído no commit.
