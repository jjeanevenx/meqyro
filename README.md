# Meqyro

Plataforma de alta precisão para testes cognitivos, comportamentais e relacionais construída com Next.js 16 (App Router), TypeScript estrito e arquitetura server-driven com Supabase.

---

## 1. Requisitos de Ambiente

- **Node.js**: >= 20.9.0 (recomendado 22 LTS)
- **Gerenciador de Pacotes**: pnpm >= 9.x (ou 11.x)
- **Docker Desktop**: Opcional. Necessário apenas para rodar a stack local do Supabase via CLI (`pnpm supabase start`).

---

## 2. Como Rodar o Projeto

### Opção A: Execução sem Docker (Fallback em Memória & Testes)

O Meqyro possui fallbacks resilientes em memória (`src/content/quizzes`) para todos os 7 quizzes e suporta execução integral dos testes unitários e desenvolvimento front-end mesmo sem o Supabase local rodando:

```bash
pnpm install
copy .env.example .env.local
pnpm dev
```

Acesse `http://localhost:3000` (redireciona automaticamente para o locale detectado, e.g., `/pt`).

### Opção B: Execução com Docker (Supabase Local)

Para testar a persistência em banco e auditoria de RLS:

```bash
# Iniciar stack local do Supabase
pnpm supabase start

# Aplicar migrações
pnpm supabase db reset

# Iniciar aplicação
pnpm dev
```

---

## 3. Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

| Variável                               | Descrição                                      | Padrão Local                  |
| :------------------------------------- | :--------------------------------------------- | :---------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | URL canônica pública                           | `http://localhost:3000`       |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL da API do Supabase                         | `http://127.0.0.1:54321`      |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave anônima pública                          | Chave local de demo           |
| `SUPABASE_SECRET_KEY`                  | Chave service_role (apenas servidor)           | Chave local de demo           |
| `ADMIN_API_SECRET`                     | Token de autenticação do Admin                 | Segredo de 32+ caracteres     |
| `CRON_SECRET`                          | Token do endpoint de reconciliação             | Segredo de 32+ caracteres     |
| `TOKEN_SECURITY_SECRET`                | Segredo para HMAC de tokens sensíveis          | Segredo de 32+ caracteres     |
| `STRIPE_WEBHOOK_SECRET`                | Segredo de assinatura dos webhooks Stripe      | `whsec_...`                   |
| `INFINITEPAY_WEBHOOK_SECRET`           | Segredo de assinatura dos webhooks InfinitePay | Segredo cadastrado no gateway |

---

## 4. Endpoints Operacionais e de Saúde

- **Health Check:**
  - `GET /api/health`
  - Retorna `status: "healthy"`, timestamp UTC e o correlation ID no body e no header `x-request-id`.

- **Painel Administrativo:**
  - `GET /[locale]/admin?token=<ADMIN_API_SECRET>`
  - Exige autenticação fail-closed via token query, header `x-admin-token` ou cookie de sessão.
  - Bloqueado para indexação (`noindex, nofollow`).

- **API de Métricas Administrativas:**
  - `GET /api/admin/metrics`
  - Header: `x-admin-token: <ADMIN_API_SECRET>` ou `Authorization: Bearer <ADMIN_API_SECRET>`.

- **Rotina de Reconciliação (Cron):**
  - `POST /api/cron/reconcile`
  - Header: `Authorization: Bearer <CRON_SECRET>`.
  - Executa reconciliação de pagamentos unfulfilled, expiração de sessões antigas e limpeza de tokens sob distributed lock.

---

## 5. Fluxo de Verificação e Qualidade

O pipeline de verificação automatizada inclui checagem de estilo, tipagem estrita, testes unitários, testes de integração e smoke test:

```bash
# Formatação
pnpm format:check

# Linter
pnpm lint

# Checagem de tipos TypeScript
pnpm typecheck

# Suíte de testes (Vitest)
pnpm test

# Build de produção Next.js
pnpm build

# Smoke test
pnpm smoke
```

---

## 6. Instruções de Deploy para Produção

1. Configure as variáveis de ambiente de produção (especialmente secrets criptográficos e chaves reais dos gateways).
2. Certifique-se de que `NODE_ENV=production` esteja definido para ativar o modo estritamente fail-closed.
3. Configure uma cron job agendada (ex.: a cada 5 ou 10 minutos) chamando `POST /api/cron/reconcile` com o header `Authorization: Bearer <CRON_SECRET>`.
4. Os webhooks de produção devem apontar para:
   - Stripe: `https://meqyro.com/api/webhooks/stripe`
   - InfinitePay: `https://meqyro.com/api/webhooks/infinitepay`
