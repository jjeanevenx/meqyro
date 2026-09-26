# Meqyro v1 — Plano de Implementação

**Base analisada:** `Meqyro — Especificação do Produto, Arquitetura e Lançamento v1.md`  
**Objetivo:** lançar e validar um funil mobile-first de quizzes com resultado parcial gratuito, relatório premium e aquisição orgânica/paga.  
**Data do plano:** 25/09/2026

---

## 1. Resumo executivo

A especificação define corretamente o produto real: o quiz é o mecanismo de aquisição; o negócio é o funil completo entre descoberta, conclusão, captura consentida, compra, entrega, cross-sell e compartilhamento.

A principal recomendação é **não implementar os sete quizzes em paralelo**. A v1 deve ser construída como um motor único e validada primeiro com um corte vertical completo:

1. **BrainRank em PT-BR**, com sessão anônima, scoring, resultado gratuito, InfinitePay, desbloqueio premium, e-mail e analytics.
2. **Personality Map em inglês**, reutilizando o mesmo motor e validando Stripe, localização e SEO internacional.
3. Completar os quatro idiomas e os demais cinco quizzes em ondas, sempre usando o mesmo checklist de publicação.

Isso preserva o escopo final de sete produtos e quatro idiomas, mas evita descobrir problemas críticos de scoring, pagamentos ou conversão depois de produzir 28 combinações de conteúdo.

### Decisões recomendadas

| Área                    | Decisão                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| Arquitetura             | Monólito modular em Next.js App Router; sem microserviços                                          |
| Frontend                | Server Components por padrão; Client Components apenas para interação do quiz                      |
| Banco                   | Supabase Postgres; acesso público mínimo; dados sensíveis via servidor                             |
| Sessão                  | Sessão anônima com token opaco em cookie HttpOnly; nunca usar `session_id` sozinho como credencial |
| Pagamento BR            | InfinitePay, com confirmação server-to-server antes de liberar                                     |
| Pagamento internacional | Stripe Checkout hospedado, via Checkout Sessions                                                   |
| Conteúdo                | Versionado no banco e publicado por estado; traduções validadas antes da ativação                  |
| Analytics               | Eventos próprios first-party no Postgres + analytics de tráfego sem respostas pessoais             |
| Design                  | Sistema único, editorial e leve; cor de destaque por quiz; uma tarefa principal por tela           |
| Lançamento              | Ondas com feature flags, em vez de liberação simultânea dos sete produtos                          |

---

## 2. Premissas e limites

### Incluído no MVP

- Home, catálogo e sete landing pages.
- Motor de quiz configurável.
- Sessões anônimas e retomada por link seguro.
- Resultados gratuito e premium.
- Captura de e-mail e consentimentos separados.
- Pagamentos InfinitePay e Stripe.
- Relatórios, e-mails transacionais e recuperação consentida.
- Compartilhamento, referral básico e cross-sell.
- PT, EN, ES e FR.
- SEO técnico, páginas legais, observabilidade e analytics.

### Fora do MVP

- Aplicativo nativo.
- Login obrigatório ou gestão completa de contas.
- Assinaturas.
- Painel administrativo completo.
- IA generativa em tempo real.
- Programa de recompensas por indicação.
- Percentis populacionais ou alegações clínicas.
- Infraestrutura distribuída, filas externas ou Kubernetes.

### Dependências não técnicas que podem bloquear o lançamento

- Conteúdo final de 192 perguntas/afirmações/cenários, alternativas e explicações.
- Regras de scoring revisadas e versionadas para sete quizzes.
- Quatro traduções completas, incluindo e-mails, SEO e textos de erro.
- Textos legais revisados para LGPD/GDPR e mercados de venda.
- Contas comerciais e domínios verificados nos gateways e no Resend.
- Política fiscal/comercial para venda internacional de bens digitais.

---

## 3. Estratégia de entrega

### O corte vertical inicial

O primeiro marco não é “frontend pronto”; é uma compra real controlada, rastreável do início ao fim:

```text
Landing BrainRank PT-BR
→ iniciar sessão
→ responder 24 perguntas
→ scoring no servidor
→ capturar e-mail
→ mostrar resultado parcial
→ pagar com InfinitePay
→ receber webhook/confirmar pagamento
→ liberar relatório
→ enviar e-mail
→ oferecer próximo quiz
```

Após estabilizar esse fluxo, implementar Personality Map EN com Stripe prova que o motor suporta outro tipo de escala, outro mercado, outra moeda e outro gateway.

### Ondas de produto

| Onda | Produtos                             | Objetivo                                            |
| ---- | ------------------------------------ | --------------------------------------------------- |
| 0    | Protótipo de fluxo                   | Validar linguagem visual e fricção em mobile        |
| 1    | BrainRank PT-BR                      | Validar o funil completo e InfinitePay              |
| 2    | Personality Map EN                   | Validar escala Likert, internacionalização e Stripe |
| 3    | BrainRank + Personality em 4 idiomas | Validar operação editorial e SEO multilíngue        |
| 4    | CareerFit, MoneyDNA, FocusStyle      | Ampliar valor prático e cross-sell                  |
| 5    | DecisionDNA e CoupleDNA              | Incluir cenários e fluxo viral de duas pessoas      |
| 6    | Bundles, experimentos e otimização   | Elevar receita por visitante                        |

CoupleDNA fica por último porque adiciona consentimento bilateral, convite, sincronização de duas sessões, expiração e privacidade compartilhada.

---

## 4. Arquitetura proposta

```text
Cloudflare / DNS / proteção básica
                 │
                 ▼
Vercel — Next.js App Router
  ├─ páginas estáticas/cached: home, landings, artigos e legais
  ├─ páginas dinâmicas: quiz, resultado, checkout e recuperação
  ├─ Server Actions: apenas mutações ligadas à UI e sem endpoint público necessário
  └─ Route Handlers: sessões, webhooks, e-mail, compartilhamento e integrações
                 │
        ┌────────┼───────────┐
        ▼        ▼           ▼
   Supabase   Gateways     Resend
   Postgres   IP / Stripe  e-mail
```

### Princípios de desenho

- **Node.js runtime por padrão** para SDKs de pagamento e bibliotecas de servidor.
- **Server Components por padrão** para landings, resultados e SEO.
- **Client Component isolado** para o runner do quiz, transições e armazenamento temporário.
- O cliente envia respostas; **o servidor calcula score, preço e acesso**.
- Cada integração externa fica atrás de uma interface e de adaptadores próprios.
- As rotas de webhook possuem verificação de autenticidade, idempotência e log correlacionado.
- Conteúdo publicado é cacheável por `quiz_version` e `locale`; sessões e resultados são `no-store`.
- Operações críticas usam transações de banco ou funções SQL pequenas e auditáveis.

### Estrutura sugerida

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx
│   │   │   ├── quizzes/[slug]/page.tsx
│   │   │   ├── articles/[slug]/page.tsx
│   │   │   └── (legal)/...
│   │   └── (experience)/
│   │       ├── quizzes/[slug]/play/page.tsx
│   │       ├── results/[publicToken]/page.tsx
│   │       └── checkout/return/page.tsx
│   ├── api/
│   │   ├── sessions/route.ts
│   │   ├── sessions/[id]/answers/route.ts
│   │   ├── sessions/[id]/complete/route.ts
│   │   ├── leads/route.ts
│   │   ├── checkout/route.ts
│   │   ├── webhooks/{stripe,infinitepay,resend}/route.ts
│   │   ├── results/[token]/route.ts
│   │   └── unsubscribe/route.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   └── manifest.ts
├── features/
│   ├── quiz-engine/
│   ├── scoring/
│   ├── results/
│   ├── leads/
│   ├── payments/
│   ├── email/
│   ├── experiments/
│   ├── referrals/
│   └── analytics/
├── components/
│   ├── ui/
│   └── patterns/
├── lib/
│   ├── supabase/
│   ├── security/
│   ├── observability/
│   └── i18n/
└── content/
    └── dictionaries/
```

Não duplicar `/brainrank`, `/moneydna` etc. como implementações. O slug seleciona conteúdo, scoring e tema de um mesmo motor.

---

## 5. Modelo de domínio e dados

### Ajustes ao modelo da especificação

Separar claramente:

- identidade pública (`slug`, nome, metadata);
- conteúdo versionado;
- sessão e respostas imutáveis após conclusão;
- resultado calculado e sua versão;
- acesso premium adquirido;
- pedido e tentativa de pagamento;
- consentimento e base legal;
- eventos operacionais e analíticos.

### Entidades principais

| Grupo           | Tabelas principais                                                           |
| --------------- | ---------------------------------------------------------------------------- |
| Catálogo        | `quizzes`, `quiz_versions`, `quiz_translations`, `product_prices`            |
| Conteúdo        | `questions`, `question_translations`, `options`, `option_translations`       |
| Execução        | `quiz_sessions`, `answers`, `session_events`                                 |
| Resultado       | `results`, `result_dimensions`, `result_details`, `result_access_grants`     |
| CRM/privacidade | `leads`, `consents`, `unsubscribe_tokens`, `data_requests`                   |
| Comércio        | `orders`, `order_items`, `payment_attempts`, `payment_events`, `refunds`     |
| CoupleDNA       | `couple_invites`, `couple_participants`, `couple_consents`, `couple_results` |
| Growth          | `referrals`, `experiments`, `experiment_variants`, `experiment_assignments`  |
| Operação        | `analytics_events`, `email_deliveries`, `audit_events`                       |

### Regras importantes

- Valores monetários em inteiros na menor unidade e acompanhados de moeda ISO.
- `quiz_version` e `scoring_version` gravados na sessão e no resultado.
- Respostas tornam-se imutáveis quando a sessão chega a `COMPLETED`.
- Um pedido possui um ou mais itens; isso viabiliza bundles sem remodelagem.
- `result_access_grants` é a fonte de verdade do desbloqueio, não um booleano alterável pelo cliente.
- `payment_events(provider, provider_event_id)` é único.
- E-mail normalizado para busca, mantendo original quando necessário; logs não exibem endereço integral.
- Tokens de recuperação/resultado são aleatórios, têm hash persistido, escopo e expiração.
- Retenção de respostas e dados pessoais deve ser definida antes do go-live.

### Estados

```text
QuizSession: STARTED → IN_PROGRESS → COMPLETED → EXPIRED
Order: CREATED → PENDING → PAID → FULFILLED
                      └→ FAILED / EXPIRED / CANCELLED / REFUNDED
PaymentAttempt: CREATED → REDIRECTED → CONFIRMED / FAILED / EXPIRED
EmailDelivery: QUEUED → SENT → DELIVERED / BOUNCED / COMPLAINED
```

Toda transição precisa ter origem, timestamp, request/correlation ID e, nas transições financeiras, um evento externo verificável.

---

## 6. Segurança e privacidade

### Supabase

- Manter tabelas internas em schema não exposto quando não precisarem da Data API.
- Ativar RLS em qualquer tabela de schema exposto.
- Não conceder ao browser acesso direto a `orders`, `payments`, `result_details`, preços administrativos ou eventos.
- Usar chave publicável no browser e chave secreta apenas no servidor.
- Nunca usar metadata editável do usuário em autorização.
- Views expostas devem usar `security_invoker` quando aplicável.
- Políticas de update devem incluir `USING` e `WITH CHECK`.
- Funções privilegiadas ficam em schema privado, com `EXECUTE` revogado por padrão e checagem explícita.
- Rodar os advisors de segurança e performance antes de promover migrations.

### Sessão anônima

- Cookie HttpOnly, Secure, SameSite=Lax, com token aleatório de 256 bits.
- Persistir somente o hash do token; comparar em tempo constante.
- Rotacionar token ao concluir, recuperar por e-mail ou elevar acesso após compra.
- Não aceitar IDs sequenciais ou UUIDs como autorização suficiente.
- CSRF para mutações baseadas em cookie; validação de `Origin`/`Host` nas rotas sensíveis.
- Rate limit por IP, sessão e operação, com limites mais estritos para checkout e e-mail.

### Pagamentos

- O servidor seleciona produto, preço, moeda e gateway.
- Redirect/success URL nunca libera acesso.
- Stripe: Checkout Sessions hospedado; assinatura validada usando corpo bruto do webhook.
- InfinitePay: validar webhook e consultar a transação no provedor antes de confirmar.
- Conferir valor, moeda, `order_nsu`/metadata e status antes de marcar como pago.
- Processamento idempotente e reconciliador periódico para pedidos pagos não entregues.
- Manter payload mínimo ou hash; evitar persistir dados desnecessários do cartão/pagador.

### Privacidade

- Consentimento de marketing separado, desmarcado e versionado.
- CoupleDNA exige consentimento de ambos para comparação compartilhada.
- Analytics externo recebe IDs pseudônimos e eventos, nunca respostas completas ou texto de relatório.
- Implementar exportação, correção, exclusão e unsubscribe desde o lançamento.
- Definir idade mínima e não coletar data de nascimento se não for necessária.

---

## 7. Pagamentos e fulfillment

### Contratos internos

```ts
interface PaymentProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  getPaymentStatus(input: PaymentLookup): Promise<PaymentStatus>;
  verifyWebhook(input: RawWebhookInput): Promise<VerifiedPaymentEvent>;
}
```

Além dessa interface, criar serviços separados:

- `PricingService`: resolve preço aprovado para mercado/moeda.
- `OrderService`: cria pedido e garante transições válidas.
- `FulfillmentService`: concede acesso e agenda confirmação por e-mail.
- `ReconciliationService`: corrige casos `PAID` não `FULFILLED`.

### Stripe

- Usar Checkout Sessions no modo `payment`, com preço obtido no servidor.
- Incluir apenas identificadores internos mínimos em metadata.
- Confirmar a conclusão por webhook assinado.
- Tratar ao menos conclusão, expiração e reembolso/chargeback relevantes.
- Fixar a versão da API/SDK usada pelo projeto e atualizar deliberadamente.

### InfinitePay

- Fazer uma prova técnica na primeira semana: ambiente, API disponível, criação de link, assinatura/validação do webhook, consulta de pagamento e política de reembolso.
- Caso a API não ofereça todos os sinais esperados, encapsular a diferença no adaptador, não no fluxo de negócio.
- Fazer pagamentos reais de baixo valor em staging controlado antes do lançamento.

### Bundles

Modelar bundles como produtos com itens componentes. A compra gera grants para cada relatório incluído. Não codificar “3” ou “7” em condicionais do frontend.

---

## 8. Internacionalização e mercados

Tratar como conceitos distintos:

```ts
type MarketContext = {
  locale: "pt" | "en" | "es" | "fr";
  country: string;
  market: string;
  currency: string;
  paymentProvider: "infinitepay" | "stripe";
  source: "user" | "edge" | "locale-fallback";
};
```

Regras:

- Preferência explícita de idioma e país sempre vence a detecção.
- Idioma fica em URL; país/mercado fica em cookie e pode ser alterado.
- `/` redireciona uma vez usando preferência/`Accept-Language`; páginas localizadas não redirecionam silenciosamente.
- Landing pages usam slugs localizados e um mapa canônico por `quiz_id`.
- `generateStaticParams` produz as rotas publicáveis; metadata gera canonical e `hreflang`.
- Incluir `x-default` apontando para a experiência internacional padrão.
- Checkout usa tabela editorial de preços; não câmbio em tempo real.
- Formatação de data/número/moeda usa locale, mas o valor vem do mercado.

### Pipeline editorial

Estados por tradução:

```text
DRAFT → REVIEWED → APPROVED → PUBLISHED → ARCHIVED
```

Um quiz só fica ativo em um locale quando landings, perguntas, opções, perfis, resultado, e-mails, SEO, disclaimers e erros estiverem aprovados para a mesma versão.

---

## 9. Design e experiência mobile-first

### Direção visual recomendada

As referências de quiz no Dribbble mostram padrões úteis — cartões de resposta grandes, progresso claro, resultados visuais e transições curtas — mas muitas adotam leaderboard, moedas, personagens e estética infantil. A Meqyro deve aproveitar a clareza desses padrões e rejeitar o tom de “jogo que paga”.

Direção proposta: **editorial insight**.

- Fundo marfim/cinza muito claro, texto grafite e uma cor primária profunda.
- Tipografia sem serifa humanista e legível; números de score com fonte display contida.
- Muito espaço em branco, bordas suaves e sombras quase imperceptíveis.
- Uma cor semântica discreta por produto, sempre com contraste WCAG AA.
- Ilustrações abstratas/geometria apenas onde ajudam a identidade; evitar stock photos genéricas.
- Gráficos simples e explicáveis; não usar radar como única forma de comunicar dados.
- Microinterações de 150–250 ms e respeito a `prefers-reduced-motion`.

### Referências úteis

- [Quizzer — Quiz Mobile App](https://dribbble.com/shots/24013360-Quizzer-Quiz-Mobile-App): ritmo mobile e hierarquia de cartões.
- [UI Elements — Quiz App](https://dribbble.com/shots/20712646-UI-Elements-Quiz-App): biblioteca coerente de elementos do fluxo.
- [Quiz App Mobile Design](https://dribbble.com/shots/14012432-Quiz-App-Mobile-Design): estados de pergunta e tema claro/escuro.
- [Team Personality Quiz App Design](https://dribbble.com/shots/27467288-Team-Personality-Quiz-App-Design): aproximação com personalidade e relatório.

Essas referências são inspiração de composição, não especificação funcional nem fonte de assets.

### Fluxos essenciais a prototipar antes do código

1. Home → landing → início.
2. Questão objetiva e questão Likert.
3. Interrupção e retomada.
4. Captura de e-mail com consentimento separado.
5. Resultado gratuito → paywall.
6. Retorno de checkout pendente/pago/falhou.
7. Resultado premium e cross-sell.
8. CoupleDNA A → convite → B → consentimento → comparação.

### Regras de UI

- Conteúdo principal cabe confortavelmente em 360 px sem zoom ou scroll horizontal.
- Alvos de toque mínimos de 44×44 px; respostas preferencialmente com 48–56 px de altura.
- Uma ação primária por tela.
- Barra de progresso indica posição, não promete precisão científica.
- Seleção deve ter estado visual, texto e foco; não depender apenas de cor.
- Ao avançar, anunciar nova pergunta para leitor de tela e manter foco previsível.
- A pessoa pode voltar sem perder respostas; o envio final pede confirmação se houver questões sem resposta.
- Skeletons não substituem feedback explícito de pagamento/processamento.

### Sistema de componentes inicial

```text
Button, IconButton, Link, Input, Checkbox, RadioCard, LikertScale,
ProgressBar, QuizHeader, QuestionCard, ResultHero, DimensionBar,
InsightCard, PriceCard, TrustNote, ConsentField, Toast, InlineError,
ShareCard, ProductCard, LocaleSelector, CountrySelector, LegalFooter
```

---

## 10. SEO e aquisição orgânica

### Fundamentos técnicos

- HTML renderizado no servidor nas páginas indexáveis.
- `metadataBase`, canonical e alternates por locale.
- `sitemap.xml` separado por tipo se o volume crescer; `robots.txt` explícito.
- Bloquear indexação de play, resultado pessoal, checkout e URLs com tokens.
- Open Graph por quiz/locale; cards de compartilhamento pessoais separados e opt-in.
- JSON-LD somente com schemas suportados e conteúdo visível; evitar alegações de teste médico.
- Slugs editoriais estáveis e redirecionamentos 301 ao renomear.
- Core Web Vitals monitorados por rota e dispositivo.

### Conteúdo inicial

Publicar primeiro clusters ligados aos quizzes disponíveis. Cada landing deve responder intenção, explicar método de forma honesta, duração, privacidade, amostra do resultado e FAQ. Artigos levam ao quiz, mas não devem existir apenas para repetir palavras-chave.

### Checklist por landing

- Keyword/intenção principal por locale.
- Title e description únicos.
- H1 único, estrutura semântica e FAQ real.
- Canonical próprio e quatro `hreflang` recíprocos.
- OG/Twitter image localizada.
- Links internos para artigo, outro quiz e páginas de confiança.
- Disclaimer específico do produto.

---

## 11. Analytics, experimentos e métricas

### Taxonomia

Todo evento deve ter:

```text
event_name, occurred_at, anonymous_id, session_id, locale, market,
quiz_id, quiz_version, experiment_assignments, request_id
```

Eventos de compra incluem `order_id`, moeda e valor; nunca respostas ou textos de interpretação.

### Métricas de lançamento

| Etapa       | Métrica                            | Alerta inicial                    |
| ----------- | ---------------------------------- | --------------------------------- |
| Aquisição   | Landing → quiz started             | queda por canal/locale            |
| Engajamento | Completion rate                    | abandono concentrado por questão  |
| Lead        | Completed → lead submitted         | fricção ou confiança insuficiente |
| Monetização | Paywall → checkout → paid          | preço/copy/gateway                |
| Negócio     | Revenue per unique visitor         | métrica norteadora                |
| Qualidade   | Refund, complaint, payment failure | confiança/operação                |
| Growth      | Share e referral conversion        | força viral real                  |

### Experimentos

- Atribuição determinística server-side antes da exposição.
- Um experimento primário por etapa do funil.
- Registrar exposição, não apenas assignment.
- Definir hipótese, métrica principal, guardrails e janela antes de iniciar.
- Não testar várias mudanças simultâneas com tráfego baixo.
- Não experimentar consentimento, clareza de preço ou acesso a direitos legais.

---

## 12. Observabilidade e operação

- `request_id` em toda requisição; propagar `session_id`, `order_id` e provider IDs.
- Sentry com source maps e remoção de PII.
- Logs estruturados para checkout, webhook, fulfillment e e-mail.
- Alertas para: webhook inválido, crescimento de falhas, `PAID` não `FULFILLED`, bounce/complaint e erro de scoring.
- Painel operacional mínimo por consultas salvas no Supabase; não construir admin completo.
- Runbooks para pagamento pendente, reenvio de relatório, reembolso, exclusão de dados e rollback de conteúdo.
- Backups e restore testados; não basta habilitar backup.

### Jobs sem infraestrutura extra

Usar agendamento gerenciado para:

- reconciliar pedidos pendentes;
- expirar sessões/tokens;
- enviar recovery consentido;
- processar retenção/exclusão;
- materializar KPIs diários.

Evitar fila dedicada no MVP. Quando uma tarefa assíncrona precisar confiabilidade, usar padrão outbox no Postgres e processamento idempotente.

---

## 13. Estratégia de testes

### Pirâmide

| Nível       | Cobertura                                                                |
| ----------- | ------------------------------------------------------------------------ |
| Unitário    | scoring, mercado, preços, versões, transições, tokens e consentimento    |
| Contrato    | payloads Stripe/InfinitePay/Resend e adaptadores                         |
| Integração  | banco, RLS, sessão, conclusão, webhook, grant, e-mail                    |
| E2E         | fluxos mobile/desktop e quatro locales                                   |
| Visual/a11y | componentes críticos, contraste, foco, overflow, redução de movimento    |
| Segurança   | autorização, enumeração, CSRF, replay, rate limit e manipulação de preço |

### Golden tests de scoring

Cada quiz possui fixtures versionadas com respostas e resultado esperado. Mudança no scoring só passa quando:

- incrementa `scoring_version` quando altera significado;
- preserva fixtures antigas;
- inclui novos casos limítrofes;
- gera o mesmo resultado no servidor em execuções repetidas.

### E2E prioritários

1. Visitante conclui BrainRank, vê preview, compra e acessa o relatório.
2. Webhook duplicado não duplica grant/e-mail.
3. Redirect falso sem webhook não libera relatório.
4. Preço manipulado no browser é ignorado.
5. Link expirado/aleatório não revela resultado.
6. Usuário troca idioma sem mudar indevidamente país/moeda.
7. Unsubscribe bloqueia marketing e preserva transacional necessário.
8. CoupleDNA não revela resposta antes do consentimento bilateral.

---

## 14. Plano por fases e entregáveis

Estimativa para uma equipe enxuta de **2 engenheiros full-stack, 1 designer/produto e suporte part-time de conteúdo/tradução/QA**. Com uma pessoa, considerar aproximadamente 1,7–2,2× o calendário e reduzir o lançamento inicial a dois quizzes.

### Fase 0 — Descoberta técnica e protótipo (1 semana)

- Confirmar APIs, webhooks, testes e reembolso do InfinitePay.
- Confirmar conta Stripe, moedas e política comercial/fiscal.
- Fechar fluxos, wireframes e direção visual.
- Definir scoring v1 de BrainRank e Personality Map.
- Definir modelo de consentimento e retenção.
- Preparar backlog, ADRs e matriz de conteúdo.

**Saída:** protótipo mobile aprovado, riscos dos gateways conhecidos e critérios de go-live acordados.

### Fase 1 — Fundação (1–2 semanas)

- Next.js/TypeScript, lint, formatação, testes e CI.
- Ambientes local/staging/prod.
- Tokens, componentes base e acessibilidade.
- i18n, locale/country selector e `MarketContext`.
- Supabase local, migrations, seeds e clientes server/browser.
- Observabilidade, correlation IDs e gestão de secrets.

**Aceite:** preview deployado, smoke tests verdes, quatro shells de locale e RLS sem findings críticos.

### Fase 2 — Quiz Engine (2 semanas)

- Catálogo e conteúdo versionado.
- Sessão anônima segura, retomada e expiração.
- Renderers de escolha única, visual, Likert e cenário.
- Persistência de respostas, progresso, voltar/avançar.
- Contrato de scoring por quiz e golden tests.
- Conclusão e geração de resultado parcial.

**Aceite:** BrainRank e Personality Map rodam com fixtures, refresh não perde progresso e score não é calculado no cliente.

### Fase 3 — Lead, resultado e privacidade (1–2 semanas)

- E-mail de entrega separado do consentimento promocional.
- Resultado gratuito e premium protegido.
- Tokens de recuperação e resend transacional.
- Unsubscribe e primeira versão de data request.
- Páginas legais e versionamento de políticas.

**Aceite:** resultado básico tem valor real; marketing só é habilitado por consentimento explícito auditável.

### Fase 4 — Comércio e fulfillment (2 semanas)

- Pricing, orders, items, attempts, events e grants.
- InfinitePay e Stripe por adapters.
- Webhooks assinados/idempotentes.
- Return pages para pendente, sucesso e falha.
- Fulfillment, e-mail de compra e reconciliador.
- Sandbox + pagamentos reais controlados.

**Aceite:** duplicação/reordenação de webhook é segura; redirect não libera; `PAID` não entregue é detectado e reparado.

### Fase 5 — Growth e SEO (1–2 semanas)

- Eventos e KPIs do funil.
- Landings, metadata, sitemap, canonical, hreflang e OG.
- Compartilhamento seguro e referral básico.
- Pós-compra, cross-sell e bundles.
- Framework simples de experimento e feature flags.

**Aceite:** cada etapa do funil é mensurável e cada landing publicada passa no checklist SEO/localização.

### Fase 6 — Conteúdo dos sete quizzes (3–6 semanas, parcialmente paralela)

- Inserir, revisar e aprovar conteúdo por ondas.
- Implementar plugins de scoring e relatórios.
- QA linguístico nos quatro idiomas.
- Disclaimers específicos e amostras de resultados.
- CoupleDNA e consentimento bilateral.

**Aceite:** checklist Definition of Done completo por quiz/locale, sem ativação parcial acidental.

### Fase 7 — Hardening e lançamento (1–2 semanas)

- Testes E2E, carga leve, a11y e matriz mobile.
- Security review, headers, RLS/advisors e rate limiting.
- Restore drill e runbooks.
- SPF, DKIM, DMARC e reputação de envio.
- Ensaios de webhook, reembolso e suporte.
- Soft launch por feature flag e ramp-up de tráfego.

**Aceite:** zero severidade crítica/alta, rollback testado, alertas ativos e owner definido para incidentes.

### Calendário indicativo

```text
Semanas 1–2   Descoberta + protótipo + fundação
Semanas 3–4   Quiz Engine
Semanas 5–6   Lead, resultado e privacidade
Semanas 7–8   Payments e fulfillment
Semanas 9–10  SEO, analytics, sharing e soft launch BrainRank
Semanas 11–12 Personality Map internacional
Semanas 13–16 Conteúdo/QA das ondas restantes e lançamento progressivo
```

Prazo real depende mais da prontidão e validação do conteúdo multilíngue do que do número de telas.

---

## 15. Backlog priorizado

### P0 — obrigatório para qualquer venda

- Sessão anônima segura e scoring server-side versionado.
- Resultado gratuito honesto e premium protegido.
- Preço server-side, orders, webhooks, idempotência e fulfillment.
- E-mail transacional e recuperação de acesso.
- Consentimento, unsubscribe, privacy/terms/data request.
- RLS, rate limit, logs, alertas e testes do caminho de compra.
- Analytics do funil sem respostas pessoais.
- Mobile/a11y e páginas SEO do produto lançado.

### P1 — necessário para o lançamento comercial completo

- Dois gateways e mercado/moeda editável.
- Quatro idiomas completos.
- Sete quizzes e relatórios.
- Compartilhamento, referrals, cross-sell e bundles.
- Recovery consentido e eventos de e-mail.
- CoupleDNA com consentimento bilateral.

### P2 — após dados iniciais

- Experimentos de preço/copy.
- Artigos em escala e novas landings.
- Admin mínimo.
- Recompensa por referral.
- Novos métodos de pagamento/mercados.
- Percentis de amostra, somente com metodologia e volume adequados.

---

## 16. Critérios de go-live

### Produto

- O resultado gratuito entrega informação concreta.
- Preço, moeda e conteúdo premium estão claros antes do checkout.
- Todos os claims possuem disclaimer correto.
- Fluxo pode ser concluído com uma mão em viewport de 360 px.

### Conteúdo

- 100% aprovado no locale ativado.
- Scoring e relatório com versão congelada.
- Golden tests e revisão editorial concluídos.
- Nenhum texto clínico, determinista ou financeiro indevido.

### Comércio

- Compra, falha, expiração, duplicação, reembolso e reconciliação testados.
- Valor/moeda/provider conferidos no servidor.
- Acesso premium depende exclusivamente de evento confirmado.
- Suporte consegue localizar uma compra pelo e-mail/order ID sem ver dados excessivos.

### Segurança/privacidade

- Nenhum secret no bundle/log.
- RLS/advisors sem finding crítico.
- Enumeração de resultados e replay bloqueados.
- Consentimento e retirada auditáveis.
- Exclusão/exportação ensaiadas.

### Operação

- Domínio, SSL, SPF, DKIM e DMARC corretos.
- Alertas, dashboards e runbooks ativos.
- Restore e rollback ensaiados.
- Owner e procedimento de incidente definidos.

---

## 17. Riscos e mitigação

| Risco                                           | Impacto | Mitigação                                                           |
| ----------------------------------------------- | ------- | ------------------------------------------------------------------- |
| Sete quizzes × quatro idiomas atrasam a entrega | Alto    | lançamento em ondas e pipeline editorial com gates                  |
| InfinitePay tem limitações de API/teste         | Alto    | spike na semana 1 e adaptador isolado                               |
| Claims soam científicos/diagnósticos            | Alto    | revisão editorial/metodológica e disclaimers por produto            |
| Resultado premium vazado por URL/API            | Alto    | token com hash/expiração + grant server-side + testes de enumeração |
| Webhook duplicado ou fora de ordem              | Alto    | tabela de eventos única, transações e state machine                 |
| País detectado incorretamente                   | Médio   | escolha manual persistente e preço confirmado antes do checkout     |
| Baixa entregabilidade                           | Médio   | SPF/DKIM/DMARC, domínio aquecido, bounce/complaint monitorado       |
| Analytics viola privacidade                     | Alto    | schema allowlist e proibição técnica de answers/report em terceiros |
| Baixa conversão após grande investimento        | Alto    | vertical slice, soft launch e instrumentação antes de replicar      |
| Scoring muda e invalida histórico               | Alto    | versionamento + fixtures imutáveis + resultado reproduzível         |

---

## 18. Primeiras 20 tarefas

1. Validar o contrato da API e webhook do InfinitePay.
2. Definir matriz de conteúdo/owner/status para 7 × 4 locales.
3. Congelar scoring v1 e fixtures do BrainRank.
4. Criar mapa dos oito fluxos essenciais e protótipo mobile.
5. Aprovar tokens visuais e componentes base.
6. Inicializar Next.js, TypeScript, testes, CI e preview.
7. Criar Supabase local/staging/prod e política de migrations.
8. Escrever ADRs de sessão anônima, conteúdo, pagamentos e analytics.
9. Implementar `MarketContext` e seletores de idioma/país.
10. Criar schema inicial e seeds do BrainRank.
11. Implementar sessão/token seguro e rate limit.
12. Implementar runner e persistência de respostas.
13. Implementar scoring server-side e golden tests.
14. Implementar lead/consentimento e resultado parcial.
15. Implementar pricing/order/grant e adapters de pagamento.
16. Implementar webhook idempotente e reconciliador.
17. Implementar relatório premium, recuperação e e-mails.
18. Instrumentar funil e painel de KPIs.
19. Executar E2E, a11y, segurança e pagamento real controlado.
20. Fazer soft launch do BrainRank PT-BR com feature flag e orçamento limitado.

---

## 19. Resultado esperado da primeira validação

A primeira versão bem-sucedida não é aquela que apenas publica sete quizzes. É aquela que responde, com dados confiáveis:

- qual origem traz usuários que concluem;
- onde ocorre abandono;
- qual preview gera confiança;
- qual produto e preço convertem;
- quanto cada visitante gera de receita;
- quais compras produzem cross-sell;
- qual resultado as pessoas escolhem compartilhar;
- quais conteúdos devem ser retirados ou aprofundados.

O motor técnico deve ser construído para aprender rapidamente e remover complexidade, não para antecipar uma plataforma grande antes de o funil provar valor.
