# Fase 0 — Descoberta técnica e protótipo

**Status:** concluída; pendências externas de conta/jurídico permanecem como gates  
**Data:** 25/09/2026  
**Corte vertical:** BrainRank PT-BR, mobile web, do início ao paywall

## Resultado

A Fase 0 transformou a especificação em decisões implementáveis e gates verificáveis para a Fundação:

- fluxos essenciais e estados de exceção definidos;
- direção visual enquadrada como “editorial insight”, com três conceitos para seleção;
- scoring v1 de BrainRank e Personality Map especificado, versionado e com fixtures de referência;
- consentimento, retenção e direitos do titular definidos em nível de produto;
- arquitetura de pagamentos decidida e riscos dos gateways classificados;
- backlog inicial priorizado com critérios de aceite;
- matriz editorial 7 × 4 criada com gates de publicação;
- ADRs iniciais registrados.

## Decisões fechadas

| Tema               | Decisão                                                               |
| ------------------ | --------------------------------------------------------------------- |
| Primeiro fluxo     | BrainRank PT-BR                                                       |
| Superfície         | Web mobile-first; viewport de referência 390 × 844                    |
| Resultado gratuito | Score geral, dimensão mais forte e uma interpretação curta            |
| Conversão          | E-mail transacional antes do preview; marketing separado e desmarcado |
| Brasil             | InfinitePay Checkout Integrado; Pix e crédito                         |
| Internacional      | Stripe Checkout hospedado, modo `payment`                             |
| Liberação premium  | Apenas após evento confirmado no servidor e grant persistido          |
| Scoring            | Servidor, determinístico, versionado e reproduzível                   |
| Retenção           | Prazos por categoria, minimização e rotina de exclusão                |
| Publicação         | Nenhum locale entra parcialmente; gate editorial por versão           |

## Gates ainda abertos

Estes itens exigem acesso do responsável às contas ou validação profissional e não podem ser confirmados apenas pelo repositório:

1. **InfinitePay:** conta aprovada, InfiniteTag, comportamento real de retentativas, autenticação do webhook, ambiente de teste, reembolso e chargeback.
2. **Stripe:** conta comercial ativada, países/moedas efetivamente habilitados, conta bancária de liquidação, descriptor e método fiscal.
3. **Fiscal/jurídico:** entidade vendedora, emissão fiscal, tratamento de IVA/VAT/sales tax e textos legais finais.
4. **Conteúdo:** banco definitivo de questões e revisão metodológica/editorial.
5. **Design:** seleção explícita de uma das três direções visuais antes de construir o protótipo interativo.

## Critérios de saída da Fase 0

| Critério                           | Estado           | Evidência                                                                                  |
| ---------------------------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| Fluxos essenciais fechados         | Concluído        | `fluxos-e-wireframes.md`                                                                   |
| Riscos de gateways conhecidos      | Concluído        | `spike-pagamentos.md`                                                                      |
| Scoring v1 definido                | Concluído        | `../quizzes/brainrank-scoring-v1.md`, `../quizzes/personality-map-scoring-v1.md`           |
| Consentimento e retenção definidos | Concluído        | `privacidade-e-retencao.md`                                                                |
| Backlog e aceite preparados        | Concluído        | `backlog-fase-1.md`                                                                        |
| Matriz de conteúdo criada          | Concluído        | `matriz-de-conteudo.md`                                                                    |
| Protótipo mobile aprovado          | Concluído        | direção 2 “Campo Cognitivo” selecionada e protótipo local verificado em `../../prototype/` |
| Contas/gateways confirmados        | Pendente externo | checklist de acesso e prova real em `spike-pagamentos.md`                                  |

## Recomendação de avanço

Pode-se iniciar a Fase 1 após a escolha visual. Integrações reais de pagamento devem permanecer atrás de feature flag até concluir as provas de conta descritas no spike.
