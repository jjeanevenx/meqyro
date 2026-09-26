# Matriz editorial e gates de publicação

## Estados

`DRAFT → REVIEWED → APPROVED → PUBLISHED → ARCHIVED`

Um quiz/locale só pode ser ativado quando todos os itens da mesma `quiz_version` estiverem `APPROVED` e o scoring correspondente estiver congelado.

## Matriz inicial

| Quiz            | PT    | EN    | ES    | FR    | Onda | Owner inicial                 |
| --------------- | ----- | ----- | ----- | ----- | ---: | ----------------------------- |
| BrainRank       | DRAFT | DRAFT | DRAFT | DRAFT |  1/3 | Conteúdo + metodologia        |
| Personality Map | DRAFT | DRAFT | DRAFT | DRAFT |  2/3 | Conteúdo + metodologia        |
| CareerFit       | DRAFT | DRAFT | DRAFT | DRAFT |    4 | Conteúdo                      |
| MoneyDNA        | DRAFT | DRAFT | DRAFT | DRAFT |    4 | Conteúdo + revisão financeira |
| FocusStyle      | DRAFT | DRAFT | DRAFT | DRAFT |    4 | Conteúdo                      |
| DecisionDNA     | DRAFT | DRAFT | DRAFT | DRAFT |    5 | Conteúdo                      |
| CoupleDNA       | DRAFT | DRAFT | DRAFT | DRAFT |    5 | Conteúdo + privacidade        |

`DRAFT` aqui indica escopo conhecido, não conteúdo finalizado.

## Checklist por célula quiz × locale

- [ ] nome e slug canônico;
- [ ] landing, FAQ, duração e disclaimer;
- [ ] perguntas/cenários e opções;
- [ ] acessibilidade de conteúdo visual;
- [ ] chaves e explicações de resposta;
- [ ] resultado gratuito;
- [ ] dimensões/perfis e relatório premium;
- [ ] paywall e checkout copy;
- [ ] e-mails transacionais e promocionais;
- [ ] erros, estados vazios e recuperação;
- [ ] title, description, OG e termos de busca;
- [ ] revisão linguística nativa;
- [ ] revisão metodológica e de claims;
- [ ] golden tests atualizados;
- [ ] aceite editorial registrado.

## Owners necessários

- Product owner: aceita escopo e publicação.
- Content owner: coerência, clareza e tom.
- Methodology reviewer: scoring, claims e interpretação.
- Native-language reviewer: idioma e adequação cultural.
- Legal/privacy reviewer: consentimento, disclaimers e termos.
- Engineering owner: schema, versão, importação e testes.
