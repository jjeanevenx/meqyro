# Runbook: Resposta a Incidentes Operacionais (Meqyro)

**Versão:** 1.0  
**Data:** 26/09/2026  
**Classificação:** Confidencial / Operacional

---

## 1. Classificação de Severidade

| Nível | Definição | Exemplo | SLA de Resposta |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Crítico)** | Indisponibilidade de pagamento, falha geral de cálculo de scoring ou vazamento de dados. | Webhooks rejeitando pagamentos; checkout inacessível; relatórios premium bloqueados para 100% dos clientes. | < 15 minutos |
| **SEV-2 (Alto)** | Degradação de canal não impeditiva de compra, lentidão relevante em entrega de e-mails. | Atraso no disparo de confirmação transacional; falha em 1 gateway com fallback disponível. | < 1 hora |
| **SEV-3 (Médio)** | Falha pontual em páginas informativas, erro de tradução ou solicitação manual de suporte. | Inconsistência de copy em landing secundária; falha cosmética de CSS em viewport exótico. | < 8 horas |

---

## 2. Procedimento de Triagem e Mitigação Imediata

1. **Identificar Correlation ID e Logs Estruturados:**
   - Buscar logs por `x-request-id` ou correlation ID emitido:
     ```bash
     # Localização de eventos nos logs estruturados:
     grep "order_fulfillment_failed" app.log
     grep "webhook_signature_invalid" app.log
     ```
2. **Avaliar Integridade dos Provedores Externos:**
   - [Stripe Status Dashboard](https://status.stripe.com)
   - [InfinitePay Status](https://status.infinitepay.io)
   - [Resend Status](https://status.resend.com)
3. **Acionar Feature Flags de Contingência:**
   - Se InfinitePay apresentar instabilidade no Brasil, alternar gateway provisório ou exibir mensagem explicativa de manutenção via `feature-flags.ts`.
4. **Rollback de Deploy:**
   - Se o incidente decorrer de release recente:
     ```bash
     # Executar rollback imediato no Vercel CLI ou dashboard
     vercel rollback [DEPLOYMENT_ID]
     ```

---

## 3. Rotação de Credenciais e Secrets

Se houver suspeita de comprometimento de chaves:
1. **Stripe:** Gerar novo Webhook Secret no Dashboard Stripe (`whsec_...`) e atualizar `STRIPE_WEBHOOK_SECRET` na plataforma de hospedagem.
2. **InfinitePay:** Atualizar segredo compartilhado de webhook e chave de API.
3. **Supabase `service_role`:** Gerar novo Secret no dashboard Supabase e reiniciar aplicação Next.js.
4. **Hash Salt:** Não alterar `SALT_PEPPER` sem migração prévia de dados anonimizados.
