# Backlog preparado para a Fase 1

## P0 — fundação executável

### F1-01 — Inicializar aplicação e qualidade

**Aceite:** Next.js App Router + TypeScript; lint, formatação, unit tests e build reproduzíveis; CI em pull request; README local.

### F1-02 — Shell localizado

**Aceite:** `/pt`, `/en`, `/es`, `/fr`; fallback documentado; escolha manual persiste e vence detecção; quatro shells passam smoke test.

### F1-03 — MarketContext

**Aceite:** locale, country, market, currency, provider e source resolvidos no servidor; troca de idioma não altera país silenciosamente; preço vem de tabela editorial.

### F1-04 — Tokens visuais e componentes base

**Aceite:** direção selecionada implementada; Button, Input, Checkbox, RadioCard, ProgressBar e InlineError; foco visível; 44 px mínimo; contraste AA; reduced motion.

### F1-05 — Supabase e migrations

**Aceite:** projetos/ambientes definidos; migrations versionadas; schemas público/privado decididos; RLS em tudo que for exposto; seed mínimo de catálogo.

### F1-06 — Clientes e fronteiras de segredo

**Aceite:** cliente publicável isolado; chave secreta apenas no servidor; validação de ambiente falha cedo; nenhum secret em bundle ou log.

### F1-07 — Observabilidade básica

**Aceite:** `request_id` por requisição; logs estruturados e redigidos; captura de erro em staging; IDs de sessão/pedido correlacionáveis sem PII.

### F1-08 — Contratos de domínio

**Aceite:** tipos e state machines de sessão, pedido, tentativa, evento e grant; transições inválidas testadas; dinheiro em minor units + ISO currency.

### F1-09 — ADRs e threat model inicial

**Aceite:** decisões de sessão, conteúdo, pagamento e analytics revisadas; ameaças de enumeração, CSRF, replay, manipulação de preço e vazamento premium mapeadas.

### F1-10 — Preview e smoke tests

**Aceite:** preview acessível à equipe; viewport 360 px sem overflow; rotas localizadas e página de saúde verificadas; zero finding crítico de RLS/configuração.

## Dependências externas

- Escolher a direção visual antes de F1-04.
- Criar/confirmar Supabase e Vercel antes de F1-05/F1-10.
- Credenciais reais não são necessárias para construir adaptadores, mas são necessárias para o gate de pagamento.

## Definition of Ready para Fase 2

- CI e preview verdes;
- quatro locales navegáveis;
- MarketContext testado;
- schema inicial migrável do zero;
- componentes críticos acessíveis;
- secrets e logs revisados;
- ADRs aceitos;
- nenhuma pendência crítica de arquitetura.
