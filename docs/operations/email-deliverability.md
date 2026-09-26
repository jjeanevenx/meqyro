# Diretrizes de Entregabilidade de E-mail (SPF, DKIM, DMARC e Resend)

**Versão:** 1.0  
**Data:** 26/09/2026

---

## 1. Configuração de DNS Obrigatória

Para assegurar 99%+ de taxa de entrega na caixa de entrada principal e prevenir rotulação como spam ou phishing, o domínio `meqyro.com` deve manter os seguintes registros no Cloudflare / DNS:

### 1.1 SPF (Sender Policy Framework)
- **Tipo:** `TXT`
- **Nome:** `@`
- **Conteúdo:** `v=spf1 include:resend.com ~all`

### 1.2 DKIM (DomainKeys Identified Mail)
- **Tipo:** `CNAME`
- **Nome:** `resend._domainkey.meqyro.com`
- **Conteúdo:** Fornecido pelo Resend Dashboard (chave RSA 2048-bit)

### 1.3 DMARC (Domain-based Message Authentication)
- **Tipo:** `TXT`
- **Nome:** `_dmarc.meqyro.com`
- **Conteúdo:** `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@meqyro.com`

---

## 2. Separação de Tráfego: Transacional vs. Marketing

- **E-mails Transacionais:** Remetente `relatorios@meqyro.com` ou `acesso@meqyro.com`. Contêm o link de acesso ao resultado e número do pedido. Nunca incluem links de parceiros ou ofertas irrelevantes.
- **E-mails Promocionais:** Remetente `novidades@meqyro.com`. Enviados **exclusivamente** para usuários que marcaram voluntariamente a caixa `MARKETING_PROMOTIONAL`. Todo e-mail promocional inclui obrigatoriamente:
  - Header `List-Unsubscribe: <https://meqyro.com/pt/unsubscribe?token=...>`
  - Rodapé com link de descadastro em 1 clique.

---

## 3. Monitoramento de Reputação e Bounces

- Taxa de rejeição (bounce rate) deve ser mantida abaixo de 2%.
- Taxa de queixas (spam complaint rate) deve ser rigorosamente mantida abaixo de 0,08%.
- Usuários que revogam consentimento via `/api/privacy/unsubscribe` são inseridos imediatamente na lista de supressão append-only auditável.
