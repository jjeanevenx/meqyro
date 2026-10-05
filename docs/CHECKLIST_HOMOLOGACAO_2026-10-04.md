# Entrega para homologação — Meqyro

O candidato local implementa os sete quizzes, pagamento exclusivamente pela Stripe, download protegido e entrega do relatório pela Supabase Function. A publicação remota e o aceite de serviços externos continuam pendentes. Este documento substitui o diagnóstico anterior de lacunas de produto.

## Implementação entregue

| Quiz            |                     Perguntas | Jornada automatizada pt/en/es/fr |
| --------------- | ----------------------------: | -------------------------------- |
| BrainRank       | 24, incluindo três lembranças | PASS local                       |
| Personality Map |                            40 | PASS local                       |
| CareerFit       |                            24 | PASS local                       |
| MoneyDNA        |                            20 | PASS local                       |
| CoupleDNA       |           20 por participante | PASS local, inclusive bilateral  |
| DecisionDNA     |                             4 | PASS local                       |
| FocusStyle      | 20, incluindo três lembranças | PASS local                       |

- [x] Memória dentro do total existente: observação breve neutra, lembrança posterior, sem aviso antecipado ou instrução sobre anotações.
- [x] Relatórios específicos nas quatro línguas, com explicações e ações práticas, sem percentis populacionais inventados.
- [x] Download de HTML independente após pagamento confirmado, imprimível em PDF.
- [x] Supabase Function envia resultado completo no corpo do e-mail e o mesmo documento em anexo; valida pagamento, destinatário e grant, com idempotência.
- [x] Pacotes reconhecem os testes do comprador, inclusive os concluídos após a compra.
- [x] CoupleDNA exige dois testes concluídos, consentimento dos dois e pagamento confirmado. Uma compra libera a comparação para ambos; o e-mail vai ao comprador.
- [x] Retirada de autorização bloqueia comparação online; arquivos já entregues não podem ser recolhidos.
- [x] Sem promessa de acesso vitalício: acesso online conforme grant de 24 meses; arquivo baixado mantido pelo comprador.
- [x] Confirmação antecipada do pagamento não regride pedido para pendente/falho.

## Evidências e limites

A [auditoria dos fluxos](audits/homologation-flow-evidence-2026-10-04.json) usa Supabase local real e transportes controlados de pagamento/e-mail. Não comprova pagamento Stripe remoto ou recebimento real em caixa postal. A bateria de compras cobre BR/US/EU; GB exige aceite específico.

O ensaio das 16 migrations e do seed em schema temporário passou e foi revertido. Advisors locais não indicaram problemas de segurança; a [consulta de permissões](audits/homologation-release-security-query.sql) confirmou RLS e proteção da fila.

No navegador foram validados conclusão individual do CoupleDNA, convite com autorização explícita e retirada/restauração do consentimento. Conclusão do segundo participante no navegador e inspeção mobile final continuam no aceite manual; cenários bilaterais estão cobertos por integração.

Os resultados finais dos comandos estão em [validação da entrega](audits/homologation-release-validation.md). O CI exige banco disponível, mas sua execução remota ainda não ocorreu. As alterações locais ainda não foram publicadas como commit.

## Pendências de publicação

- [ ] Acesso ao Supabase `zfdipjfgzkaqcbudfzub`: o conector atual retornou falta de permissão nas consultas.
- [ ] Identificar/configurar projeto Vercel: conta conectada e equipe `JJE-APPS` não retornaram projetos.
- [ ] Conferir histórico remoto, dados e convites duplicados antes de aplicar migrations; não resetar banco.
- [ ] Configurar Preview, Stripe TEST, webhook assinado e segredos de entrega.
- [ ] Publicar `deliver-report`, verificar remetente e comprovar recebimento real.
- [ ] Definir URL HTTPS estável de homologação e reconstruir com ela. Domínios informados: `meqyro.com` e `meqyro.com.br`; publicação de produção não executada.
- [ ] Executar o [runbook e checklist de aceite remoto](runbooks/homologation-release.md).
