# Modelo de consentimento e retenção v1

Este documento é uma decisão de produto e engenharia; os textos finais precisam de revisão jurídica nos mercados de venda.

## Bases e finalidades

| Dado/ação               | Finalidade                                 | Escolha do usuário                              |
| ----------------------- | ------------------------------------------ | ----------------------------------------------- |
| Cookie de sessão        | executar, salvar e retomar o quiz          | estritamente necessário                         |
| Respostas e score       | gerar e entregar o resultado               | execução do serviço solicitado                  |
| E-mail de entrega       | salvar, entregar e recuperar resultado     | solicitado no fluxo, explicado em contexto      |
| Pagamento               | processar compra, fraude, recibo e suporte | execução contratual/obrigação aplicável         |
| E-mail promocional      | novos quizzes, conteúdo e ofertas          | consentimento separado, desmarcado e revogável  |
| Analytics first-party   | medir funil e qualidade                    | minimizado e pseudonimizado                     |
| Analytics/ads terceiros | atribuição e marketing                     | sujeito a consentimento/cookie policy aplicável |

## Registro de consentimento

Guardar evento append-only com:

```text
consent_type, status, policy_version, locale, market,
source, occurred_at, anonymous_id, lead_id?, request_id
```

Não usar um único booleano para termos, e-mail transacional, marketing e cookies.

## Retenção proposta

| Categoria                             |                                                        Prazo operacional | Destino                                                                           |
| ------------------------------------- | -----------------------------------------------------------------------: | --------------------------------------------------------------------------------- |
| Sessão incompleta sem e-mail          |                                                                  30 dias | excluir token, respostas e eventos identificáveis                                 |
| Resultado gratuito com e-mail         |                                             12 meses desde último acesso | avisar/anonimizar ou excluir                                                      |
| Resultado premium                     | 24 meses desde último acesso; compra preservada conforme obrigação legal | excluir respostas detalhadas quando possível, preservar registro comercial mínimo |
| Consentimentos e opt-out              |                             vigência + 5 anos ou prazo jurídico aprovado | preservar prova mínima                                                            |
| Pedido/pagamento/documento fiscal     |                               prazo legal definido por contador/jurídico | acesso restrito                                                                   |
| Logs operacionais com IDs pseudônimos |                                                                  90 dias | agregar ou excluir                                                                |
| Analytics agregado                    |                                  indefinido sem identificadores pessoais | manter métricas agregadas                                                         |
| Tokens de recuperação                 |                                                                 24 horas | expirar e remover/rotacionar hash                                                 |

Os prazos comerciais/legais finais são gates de go-live. Rotinas de retenção devem suspender exclusão quando houver obrigação legal, disputa ou fraude documentada.

## Direitos e operações

- Unsubscribe de marketing em um clique e efeito imediato na origem.
- Solicitação de acesso, correção, portabilidade quando aplicável e exclusão.
- Verificação por link de e-mail; resposta genérica para evitar enumeração.
- Exclusão separa dados apagáveis de registros que precisam ser preservados legalmente.
- CoupleDNA fica fora do primeiro corte e exigirá consentimento bilateral específico.

## Regras de produto

- Marketing nunca é condição para resultado ou compra.
- Analytics externo nunca recebe respostas, texto de relatório, e-mail ou token.
- E-mail completo não aparece em logs.
- Não coletar data de nascimento; produto declarado para 16+ sujeito a requisitos locais.
- Não usar resultados para decisão de crédito, emprego, saúde ou diagnóstico.
