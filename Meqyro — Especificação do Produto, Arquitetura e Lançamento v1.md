# Meqyro

**Domínio principal:** `meqyro.com`  
**Produto:** plataforma internacional de quizzes, desafios e experiências de autoconhecimento com resultados gratuitos parciais e relatórios premium.  
**Stack:** Next.js + TypeScript + Supabase + InfinitePay + Stripe + Resend  
**Mercados iniciais:** Brasil + internacional  
**Idiomas:** Português, Inglês, Espanhol e Francês  
**Estratégia:** mobile-first, sem cadastro obrigatório, baixa fricção e monetização desde a primeira versão.

---

# 1. Proposta da marca

## Posicionamento

**Meqyro** não deve ser apresentado como simplesmente um “site de quizzes”.

A proposta:

> **Discover more about you.**

PT:

> **Descubra mais sobre você.**

ES:

> **Descubre más sobre ti.**

FR:

> **Découvrez-en davantage sur vous.**

O usuário deve perceber Meqyro como uma coleção de pequenas experiências que revelam algo interessante sobre comportamento, raciocínio, personalidade, carreira, finanças e relacionamentos.

---

# 2. Os 7 quizzes do lançamento

A primeira versão terá sete produtos.

| #   | Produto         | Tema                     | Potencial principal            |
| --- | --------------- | ------------------------ | ------------------------------ |
| 1   | BrainRank       | raciocínio               | curiosidade + compartilhamento |
| 2   | Personality Map | personalidade            | relatório rico                 |
| 3   | CareerFit       | carreira                 | alto valor percebido           |
| 4   | MoneyDNA        | comportamento financeiro | valor prático                  |
| 5   | CoupleDNA       | relacionamento           | viralidade                     |
| 6   | DecisionDNA     | tomada de decisão        | autoconhecimento               |
| 7   | FocusStyle      | foco e produtividade     | demanda recorrente             |

A escolha propositalmente distribui o portfólio entre cinco gatilhos:

**inteligência + identidade + dinheiro + relacionamento + desempenho.**

Não teremos sete sistemas.

Teremos:

```text
                  MEQYRO
                     │
              Quiz Engine
                     │
 ┌────────┬──────────┼──────────┬──────────┐
 │        │          │          │          │
Brain   Person.    Career     Money      Couple
Rank     Map        Fit        DNA        DNA
                     │
              ┌──────┴───────┐
           Decision        Focus
             DNA           Style
```

---

# 3. Quiz 1 — BrainRank

## Objetivo

Avaliar desempenho em desafios objetivos de raciocínio.

Não deve ser comercializado como um teste clínico de QI.

Nome:

| Idioma | Nome                              |
| ------ | --------------------------------- |
| PT     | BrainRank — Desafio de Raciocínio |
| EN     | BrainRank — Reasoning Challenge   |
| ES     | BrainRank — Reto de Razonamiento  |
| FR     | BrainRank — Défi de Raisonnement  |

### Estrutura

24 desafios.

Tempo esperado: 7–10 minutos.

Dimensões:

```text
Reconhecimento de padrões
Raciocínio lógico
Raciocínio numérico
Atenção
Resolução de problemas
Velocidade
```

Priorizar questões visuais e não verbais para reduzir diferenças entre idiomas.

### Resultado gratuito

```text
BrainRank
782 / 1000

Ponto mais forte:
Reconhecimento de padrões

Seu relatório detalhado está pronto.
```

### Premium

Mostra:

```text
Score geral
6 dimensões
acertos/erros
tempo por categoria
pontos fortes
pontos a desenvolver
comparação de desempenho
explicação das respostas
```

Não exibir “QI = 132”.

Não usar percentis populacionais até existir uma amostra suficientemente grande e metodologia documentada.

Quando houver dados, utilizar:

> “Você ficou acima de 78% dos participantes do Meqyro desta amostra.”

e não:

> “Você é mais inteligente que 78% da população.”

---

# 4. Quiz 2 — Personality Map

## Objetivo

Perfil baseado nas cinco grandes dimensões de personalidade.

Dimensões:

```text
Openness
Conscientiousness
Extraversion
Agreeableness
Emotional Stability
```

Localização:

| PT                    | EN              | ES                   | FR                    |
| --------------------- | --------------- | -------------------- | --------------------- |
| Mapa de Personalidade | Personality Map | Mapa de Personalidad | Carte de Personnalité |

40 afirmações.

Escala:

```text
Discordo totalmente
Discordo
Neutro
Concordo
Concordo totalmente
```

### Resultado premium

Radar das cinco dimensões, interpretação de cada uma, estilo de comunicação, ambiente de trabalho, tomada de decisão, relacionamentos e combinação de traços.

Não diagnosticar transtornos psicológicos.

---

# 5. Quiz 3 — CareerFit

## Objetivo

Identificar preferências profissionais e ambientes de trabalho compatíveis.

| PT                 | EN        | ES                 | FR                 |
| ------------------ | --------- | ------------------ | ------------------ |
| Perfil de Carreira | CareerFit | Perfil Profesional | Profil de Carrière |

30 perguntas.

Dimensões:

```text
Analítico
Criativo
Social
Executor
Empreendedor
Estruturado
```

Resultado:

```text
Seu perfil predominante:

ANALYTICAL BUILDER

1. Analytical
2. Structured
3. Entrepreneurial
```

Premium:

```text
perfil completo
ambiente ideal
tipo de problema preferido
estilo de liderança
forma de aprender
carreiras relacionadas
pontos de atenção
```

Importante: “carreiras relacionadas” e não “a carreira que você deve seguir”.

---

# 6. Quiz 4 — MoneyDNA

## Objetivo

Identificar padrões comportamentais relacionados ao dinheiro.

| PT                | EN       | ES                | FR               |
| ----------------- | -------- | ----------------- | ---------------- |
| Perfil Financeiro | MoneyDNA | Perfil Financiero | Profil Financier |

25 perguntas.

Possíveis arquétipos:

```text
Planner
Builder
Explorer
Protector
Spender
Optimizer
```

Dimensões:

```text
planejamento
impulsividade
tolerância a risco
orientação ao futuro
consumo
controle financeiro
```

Não apresentar como recomendação de investimento.

Premium:

```text
arquétipo
6 dimensões
pontos fortes
pontos de atenção
hábitos observados
plano prático de 7 dias
```

---

# 7. Quiz 5 — CoupleDNA

Maior componente viral da primeira versão.

## Funcionamento

Pessoa A responde.

```text
Quiz concluído.

Convide seu parceiro para descobrir
o quanto suas respostas combinam.

[Enviar link]
```

Gera:

```text
meqyro.com/couple/7QXZ8M
```

Pessoa B responde.

Depois:

```text
Compatibility

Communication     82%
Money             67%
Lifestyle         91%
Future             74%
Conflict            69%
```

O score significa **similaridade/compatibilidade dentro das regras do questionário**, e não previsão científica de sucesso do relacionamento.

Premium:

```text
5 dimensões
onde combinam
onde divergem
perguntas para conversar
comparação das respostas
relatório conjunto
```

É importante que cada participante consinta explicitamente com o compartilhamento das respostas necessárias ao relatório conjunto.

---

# 8. Quiz 6 — DecisionDNA

## Objetivo

Mostrar como a pessoa tende a decidir.

| PT                | EN          | ES                 | FR                 |
| ----------------- | ----------- | ------------------ | ------------------ |
| Perfil de Decisão | DecisionDNA | Perfil de Decisión | Profil de Décision |

24 cenários.

Dimensões:

```text
Analítico × intuitivo
Rápido × deliberativo
Risco × cautela
Independente × social
Curto × longo prazo
Flexível × consistente
```

Premium:

```text
perfil
6 dimensões
decisão sob pressão
decisão profissional
decisão financeira
pontos fortes
armadilhas comuns
estratégias práticas
```

---

# 9. Quiz 7 — FocusStyle

## Objetivo

Identificar estilo de foco e organização.

| PT             | EN         | ES                | FR                     |
| -------------- | ---------- | ----------------- | ---------------------- |
| Estilo de Foco | FocusStyle | Estilo de Enfoque | Style de Concentration |

25 perguntas.

Dimensões:

```text
planejamento
distração
consistência
priorização
energia
execução
```

Possíveis perfis:

```text
Deep Focuser
Sprint Performer
Structured Planner
Adaptive Executor
Explorer
```

Não usar para diagnosticar TDAH ou qualquer condição de saúde.

Premium:

```text
perfil
6 dimensões
melhor ambiente
forma de organizar tarefas
padrões de distração
rotina recomendada
plano de 7 dias
```

---

# 10. Produto gratuito versus premium

Todos os quizzes seguem a mesma lógica.

```text
Landing
   ↓
Quiz
   ↓
Resultado calculado
   ↓
Captura de e-mail
   ↓
Resultado gratuito
   ↓
Paywall
   ↓
Pagamento
   ↓
Relatório completo
   ↓
Compartilhamento
   ↓
Cross-sell
```

O gratuito precisa entregar valor suficiente para gerar confiança.

Não utilizar:

> “Seu resultado está pronto” → pede e-mail → depois informa que absolutamente tudo é pago.

Utilizar:

> “Veja gratuitamente seu perfil básico. Se quiser, desbloqueie a análise completa.”

---

# 11. Captura do e-mail

Tela:

```text
Seu resultado está pronto 🎉

Onde devemos salvar seu resultado?

[email@example.com]

☐ Quero receber novos testes, desafios e ofertas da Meqyro.

[Ver meu resultado]
```

O checkbox de marketing começa **desmarcado**.

O e-mail utilizado para entregar/salvar resultado é separado do consentimento promocional.

Banco:

```text
lead
email
locale
country
marketing_consent
marketing_consent_at
marketing_source
created_at
```

A pessoa deve conseguir cancelar comunicações promocionais com um clique.

---

# 12. Monetização

## Brasil

Gateway:

**InfinitePay**

Métodos prioritários:

```text
PIX
Cartão
```

Preço inicial sugerido:

| Produto         |       BR |
| --------------- | -------: |
| BrainRank       | R$ 12,90 |
| Personality Map |  R$ 9,90 |
| CareerFit       | R$ 12,90 |
| MoneyDNA        |  R$ 9,90 |
| CoupleDNA       | R$ 12,90 |
| DecisionDNA     |  R$ 9,90 |
| FocusStyle      |  R$ 9,90 |

Os valores são hipóteses de lançamento e devem ser testados.

## Internacional

Gateway:

**Stripe Checkout**

Preço inicial:

```text
US$ 2.99–3.99
€ 2.99–3.99
```

O preço não deve ser convertido a cada acesso usando câmbio.

Usar tabela própria:

```text
product_prices

quiz_id
market
currency
amount
active
```

Exemplo:

```text
brainrank | BR | BRL | 1290
brainrank | US | USD | 299
brainrank | EU | EUR | 299
brainrank | GB | GBP | 249
```

---

# 13. Bundles

Depois de uma compra:

```text
Você pagou R$12,90 pelo BrainRank.

Complete sua descoberta.

3 relatórios
R$19,90

Todos os 7
R$39,90
```

Bundles:

```text
Discover Pack
BrainRank
Personality
DecisionDNA

Life Pack
CareerFit
MoneyDNA
FocusStyle

All Access
todos os 7
```

Isso aumenta ticket médio sem depender de adquirir outro usuário.

---

# 14. Seleção do gateway

**Idioma não determina pagamento.**

Um brasileiro usando navegador em inglês continua sendo mercado BR.

Criar:

```text
MarketContext

locale
country
currency
payment_provider
```

Prioridade para identificar mercado:

```text
1. escolha explícita do usuário
2. país determinado pela infraestrutura/CDN
3. locale como fallback
```

Regra:

```text
country == BR
→ InfinitePay
→ BRL

country != BR
→ Stripe
→ moeda configurada para mercado
```

Permitir trocar país manualmente.

---

# 15. Arquitetura

```text
                        meqyro.com
                             │
                        Cloudflare
                             │
                             ▼
                         Vercel
                             │
                    ┌────────┴────────┐
                    │    Next.js      │
                    │   App Router    │
                    └────────┬────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
         Supabase       InfinitePay         Stripe
        PostgreSQL        🇧🇷 BR            🌎 INTL
             │
             │
             ▼
           Resend
             │
       Email + Recovery
```

Não utilizar inicialmente:

```text
microservices
EKS
Redis
Kafka
fila
API .NET separada
Kubernetes
```

Não são necessários para este estágio.

---

# 16. Next.js

Utilizar versão estável atual do Next.js com App Router.

Estrutura:

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx
│   │   ├── quizzes/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       ├── play/
│   │   │       └── result/
│   │   ├── discover/
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── contact/
│   │
│   └── api/
│       ├── sessions/
│       ├── results/
│       ├── leads/
│       ├── checkout/
│       ├── webhooks/
│       │   ├── infinitepay/
│       │   ├── stripe/
│       │   └── resend/
│       └── unsubscribe/
│
├── components/
├── features/
│   ├── quiz/
│   ├── results/
│   ├── checkout/
│   ├── email/
│   └── analytics/
│
├── lib/
│   ├── supabase/
│   ├── payments/
│   ├── analytics/
│   └── security/
│
├── i18n/
│   ├── pt/
│   ├── en/
│   ├── es/
│   └── fr/
│
└── proxy.ts
```

---

# 17. Internacionalização

URLs:

```text
meqyro.com/pt/brainrank
meqyro.com/en/brainrank
meqyro.com/es/brainrank
meqyro.com/fr/brainrank
```

Entrada:

```text
meqyro.com
```

`proxy.ts` lê:

```text
Accept-Language
```

Exemplo:

```text
pt-BR → /pt
en-US → /en
es-MX → /es
fr-FR → /fr
outros → /en
```

Salvar escolha em cookie.

Se o usuário trocar manualmente:

```text
FR → EN
```

a escolha manual sempre vence a detecção automática.

---

# 18. Conteúdo traduzível

Não colocar perguntas diretamente no React.

Modelo:

```text
quiz
question
question_translation
answer_option
answer_option_translation
result_profile
result_profile_translation
```

Exemplo:

```text
question_id: Q001

PT:
"Qual figura completa a sequência?"

EN:
"Which figure completes the sequence?"

ES:
"¿Qué figura completa la secuencia?"

FR:
"Quelle figure complète la séquence ?"
```

Todas as sete experiências só entram em produção quando:

```text
PT = 100%
EN = 100%
ES = 100%
FR = 100%
```

incluindo:

```text
landing
perguntas
opções
feedback
paywall
relatório
e-mails
SEO
mensagens de erro
checkout copy
```

---

# 19. Banco Supabase

Entidades principais:

```text
quizzes
quiz_translations
questions
question_translations
options
option_translations

quiz_sessions
answers

results
result_details

leads
consents

orders
payments
payment_events

couple_invites

email_events

experiments
experiment_assignments

analytics_events
```

---

# 20. Sessions sem login

Não exigir criação de conta.

Ao iniciar:

```text
POST /api/sessions
```

Servidor gera:

```text
session_id = UUID
access_token = 256-bit random
```

Cookie:

```text
HttpOnly
Secure
SameSite=Lax
```

Usuário consegue fazer teste e comprar sem senha.

Conta poderá ser introduzida posteriormente.

---

# 21. Segurança Supabase

Browser:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Servidor:

```text
SUPABASE_SECRET_KEY
```

Nunca expor secret no bundle do browser.

RLS ativada em tabelas expostas.

O frontend não pode:

```text
alterar order
marcar pagamento
desbloquear resultado
alterar preço
consultar result_details diretamente
```

Relatórios premium são retornados exclusivamente por Route Handler server-side depois da autorização.

---

# 22. Payment abstraction

Criar:

```typescript
interface PaymentProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  verifyPayment(input: VerifyInput): Promise<PaymentStatus>;
}
```

Implementações:

```text
InfinitePayProvider
StripeProvider
```

Resolver:

```typescript
getPaymentProvider(market);
```

Isso evita espalhar `if country === BR` pela aplicação.

---

# 23. InfinitePay

Fluxo:

```text
POST /api/checkout
      ↓
server busca preço
      ↓
cria order PENDING
      ↓
InfinitePay create link
      ↓
redirect
      ↓
PIX/cartão
      ↓
webhook
      ↓
payment_check
      ↓
order PAID
      ↓
result unlocked
```

Nunca desbloquear pelo redirect.

Usar:

```text
order_nsu = orders.id
```

Armazenar:

```text
transaction_nsu
capture_method
paid_amount
provider_payload_hash
paid_at
```

Webhook precisa ser idempotente.

---

# 24. Stripe

Fluxo equivalente:

```text
POST /api/checkout
      ↓
Stripe Checkout Session
      ↓
Stripe Checkout
      ↓
webhook
      ↓
checkout.session.completed
      ↓
order PAID
      ↓
result unlocked
```

Metadados:

```text
orderId
quizId
sessionId
```

Validar assinatura do webhook.

Jamais usar `success_url` como prova de pagamento.

---

# 25. Modelo de estado de pedido

```text
CREATED
  ↓
PENDING
  ↓
PAID
  ↓
FULFILLED

Alternativas:

EXPIRED
CANCELLED
REFUNDED
FAILED
```

Pagamento e entrega são estados diferentes.

Isso permite:

```text
PAID
mas relatório ainda não liberado
```

ser identificado e reparado automaticamente.

---

# 26. Idempotência

`payment_events`:

```text
provider
provider_event_id UNIQUE
order_id
received_at
processed_at
payload_hash
```

Mesmo evento recebido 10 vezes:

```text
1ª → processa
2ª → ignora
3ª → ignora
...
```

---

# 27. Resultado premium

Separar:

```text
results
```

de:

```text
result_details
```

`results`:

```text
score
profile
summary
is_unlocked
```

`result_details`:

```text
dimensions
analysis
recommendations
answer_analysis
report
```

O browser não acessa `result_details` diretamente.

---

# 28. E-mail

Fornecedor inicial:

**Resend**

Remetentes:

```text
results@meqyro.com
hello@meqyro.com
```

Separar:

```text
Transactional
Marketing
```

Transacional:

```text
seu resultado
confirmação de compra
recibo/link
recuperação de acesso
```

Marketing:

```text
novos quizzes
cross-sell
promoções
conteúdo
```

Nunca condicionar entrega do resultado ao consentimento de marketing.

---

# 29. Recovery funnel

## Não terminou o quiz

Se tiver e-mail:

```text
+30 min
"Seu teste ainda está esperando por você."
```

## Terminou mas não comprou

```text
T+1h
Seu resultado está pronto

T+24h
Veja o que seu resultado revela

T+72h
Conheça outro teste gratuito
```

Somente comunicações promocionais compatíveis com o consentimento e a legislação aplicável.

## Comprou

```text
Imediato
Seu relatório completo

+2 dias
Experimente Personality Map

+7 dias
3 testes com desconto
```

---

# 30. Segmentação

Criar segmentos comportamentais:

```text
visitor
quiz_started
quiz_completed
lead
checkout_started
customer
repeat_customer
bundle_customer
```

E por interesse:

```text
cognitive
personality
career
finance
relationship
productivity
```

Isso permite não mandar MoneyDNA indiscriminadamente para todos.

---

# 31. Analytics

Eventos obrigatórios:

```text
page_view
quiz_viewed
quiz_started
question_answered
quiz_abandoned
quiz_completed

lead_submitted
marketing_consent

result_previewed
paywall_viewed

checkout_started
checkout_redirected
payment_completed
payment_failed

result_unlocked

share_clicked
share_completed

cross_sell_viewed
cross_sell_clicked
```

Nunca enviar respostas pessoais completas para Google Analytics/Meta etc.

---

# 32. KPIs

Dashboard principal:

```text
Visitors
Quiz Start Rate
Quiz Completion Rate
Lead Capture Rate
Paywall View Rate
Checkout Start Rate
Checkout Conversion Rate
Overall Purchase Rate

Average Order Value
Revenue per Visitor
Refund Rate

Email Open Rate
Email Click Rate
Recovery Revenue

Share Rate
Referral Conversion
Repeat Purchase Rate
```

A métrica mais importante:

```text
Revenue / Unique Visitor
```

e não apenas vendas.

---

# 33. A/B testing

Sistema simples:

```text
experiments
variants
assignments
```

Testes iniciais:

```text
R$9,90 × R$12,90

resultado parcial grande × pequeno

paywall antes do email × depois

“Desbloquear resultado”
×
“Ver minha análise completa”

bundle após compra × bundle no paywall
```

Não alterar muitas variáveis simultaneamente.

---

# 34. SEO

Cada quiz terá landing própria indexável.

Exemplo:

```text
/pt/teste-de-raciocinio
/en/reasoning-test
/es/test-de-razonamiento
/fr/test-de-raisonnement
```

Canonical aponta para a página correta.

Adicionar:

```text
hreflang pt
hreflang en
hreflang es
hreflang fr
```

Além dos quizzes, criar páginas de conteúdo:

```text
/articles
```

Exemplos:

```text
How does logical reasoning work?
What are the Big Five personality traits?
How does decision style affect work?
```

Conteúdo ajuda aquisição orgânica sem exigir que toda visita venha de anúncios.

---

# 35. UX mobile-first

Meta:

**qualquer pessoa precisa conseguir iniciar em segundos.**

Home:

```text
MEQYRO

Discover more about you.

[Start discovering]

Popular tests

BrainRank
7 min
→ Start

Personality Map
6 min
→ Start

MoneyDNA
5 min
→ Start
```

Nada de dashboards complexos.

Durante quiz:

```text
←

7 of 24

████████░░░░

Pergunta

[ resposta ]
[ resposta ]
[ resposta ]
[ resposta ]
```

Um único CTA principal por tela.

Área clicável mínima confortável para toque.

Fontes legíveis.

Nenhum modal desnecessário.

---

# 36. Identidade visual

Meqyro deve parecer:

```text
curioso
inteligente
moderno
confiável
leve
```

Não parecer:

```text
cassino
clickbait
site de horóscopo
app médico
```

Visual minimalista, fundo neutro, uma cor de destaque da marca e cores específicas discretas para cada produto.

---

# 37. Compartilhamento

Gerar cards como:

```text
My BrainRank

782 / 1000

Can you beat me?

meqyro.com
```

Nunca colocar informações potencialmente constrangedoras sem o usuário escolher.

Botões:

```text
WhatsApp
Instagram
X
Facebook
Copy link
```

Links possuem referral:

```text
?ref=ABCD
```

---

# 38. Referral

MVP:

```text
User A compartilha
        ↓
User B entra
        ↓
cookie ref
        ↓
faz teste
        ↓
compra
```

Registrar:

```text
referral_source
referral_session_id
converted
revenue
```

Posteriormente pode virar:

```text
Convide 3 amigos
→ ganhe um relatório
```

Não precisa entrar no lançamento.

---

# 39. Privacidade e conformidade

Criar desde o lançamento:

```text
/privacy
/terms
/cookies
/contact
/data-request
```

Registrar consentimento:

```text
consent_type
policy_version
timestamp
locale
```

Permitir:

```text
unsubscribe
exportação
exclusão
correção
```

Para marketing internacional, aplicar estratégia conservadora de consentimento explícito.

No GDPR, consentimento válido precisa ser informado, específico, livre e dado por ação afirmativa, com retirada fácil.

Nos EUA, e-mails comerciais precisam respeitar requisitos como identificação adequada e mecanismo de opt-out.

---

# 40. Menores

Os quizzes não devem ser direcionados inicialmente a crianças.

Termos:

```text
Meqyro is intended for users aged 16+,
subject to local requirements.
```

Evitar coleta de idade exata se não necessária.

Não criar segmentação comportamental específica para crianças.

---

# 41. Observabilidade

Utilizar:

```text
Vercel Analytics
Sentry
Supabase logs
payment webhook logs
email logs
```

Criar correlation ID:

```text
request_id
session_id
order_id
payment_id
```

Uma compra deve ser rastreável:

```text
Visitor
→ session
→ result
→ order
→ checkout
→ webhook
→ payment
→ unlock
→ email
```

---

# 42. Rate limiting

Proteger:

```text
/api/sessions
/api/leads
/api/checkout
/api/results
/api/share
```

Especialmente:

```text
checkout
email
```

Evitar:

```text
spam
enumeração de resultados
abuso de e-mail
criação automatizada de sessões
```

---

# 43. Anti-fraude básico

Não confiar no client para:

```text
score
tempo
preço
payment status
premium access
```

Para BrainRank, servidor recebe respostas e calcula score.

Opcionalmente detectar:

```text
respostas rápidas impossíveis
sessões automatizadas
repetições extremas
```

Não bloquear agressivamente no MVP.

---

# 44. Repositório

```text
meqyro/
│
├── src/
├── public/
├── supabase/
│   ├── migrations/
│   ├── seed/
│   └── config.toml
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── architecture/
│   ├── quizzes/
│   └── decisions/
│
├── scripts/
├── package.json
├── pnpm-lock.yaml
└── README.md
```

Um único repositório inicialmente.

---

# 45. Testes

Unit:

```text
scoring
pricing
market detection
locale
payment mapping
result generation
```

Integration:

```text
Supabase
checkout creation
webhooks
unlock
email
```

E2E com Playwright:

```text
Home
→ BrainRank
→ answers
→ email
→ preview
→ checkout

e

mock webhook
→ result unlocked
```

Os sete quizzes devem possuir teste de scoring determinístico.

---

# 46. Ambientes

```text
LOCAL
STAGING
PRODUCTION
```

Supabase:

```text
meqyro-staging
meqyro-production
```

Pagamentos:

```text
Stripe test
Stripe live

InfinitePay ambiente/testes disponíveis
→ pagamentos reais controlados antes do lançamento
```

Nunca testar produção usando dados fictícios que possam gerar transações involuntárias.

---

# 47. CI/CD

GitHub:

```text
feature/*
   ↓
Pull Request
   ↓
lint
typecheck
unit tests
integration tests
build
   ↓
Vercel Preview
   ↓
main
   ↓
production
```

Migrations versionadas.

Produção protegida.

Secrets somente:

```text
Vercel Environment Variables
Supabase secrets
```

Nunca no Git.

---

# 48. Domínios

Principal:

```text
https://meqyro.com
```

Se registrar `.com.br`:

```text
meqyro.com.br
301
→ meqyro.com/pt
```

E-mail:

```text
results@meqyro.com
hello@meqyro.com
support@meqyro.com
```

Configurar:

```text
SPF
DKIM
DMARC
```

antes das campanhas.

---

# 49. Cache e performance

Landing pages:

```text
Static / Cached
```

Quiz metadata:

```text
cached
```

Sessões/resultados:

```text
dynamic
no-store quando necessário
```

Meta mobile:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Imagens WebP/AVIF.

Evitar bibliotecas JS pesadas.

---

# 50. Recuperação de pagamento

Fluxo:

```text
checkout_started
      ↓
sem payment_completed em 30 min
      ↓
abandoned checkout
```

Se houver consentimento apropriado:

```text
Email:
"Seu resultado ainda está disponível."
```

Link:

```text
meqyro.com/result/token
```

O link não contém acesso premium antes do pagamento.

---

# 51. Página pós-compra

Não terminar em:

> Obrigado.

Utilizar:

```text
Seu relatório está desbloqueado 🎉

[Ver relatório]

────────

Continue descobrindo

Personality Map
MoneyDNA

Complete 3 testes por R$19,90
```

Pós-compra é parte da monetização.

---

# 52. Roadmap técnico do lançamento

## Incremento 1 — Foundation

```text
Next.js
Supabase
Vercel
design system
i18n
schemas
```

## Incremento 2 — Quiz Engine

```text
question rendering
answers
session
progress
scoring
result
```

## Incremento 3 — 7 quizzes

Inserir conteúdo:

```text
PT
EN
ES
FR
```

e testes de scoring.

## Incremento 4 — Leads

```text
email
consent
result retrieval
```

## Incremento 5 — Payments

```text
InfinitePay
Stripe
webhooks
idempotency
```

## Incremento 6 — Email

```text
transactional
recovery
cross-sell
unsubscribe
```

## Incremento 7 — Growth

```text
analytics
referrals
SEO
sharing
A/B tests
```

## Incremento 8 — Production Hardening

```text
RLS
rate limits
Sentry
security headers
privacy
terms
QA
```

---

# 53. Definition of Done para cada quiz

Um quiz só pode ser publicado se tiver:

```text
perguntas completas
scoring versionado
resultado gratuito
resultado premium
PT
EN
ES
FR
mobile QA
desktop QA
SEO
analytics
email
cross-sell
payment
teste automatizado
disclaimer adequado
```

---

# 54. Versionamento do scoring

Muito importante.

Cada sessão salva:

```text
quiz_version
scoring_version
```

Exemplo:

```text
brainrank
quiz_version = 1.0
scoring_version = 1.0
```

Se mudarmos perguntas posteriormente, resultados antigos continuam reproduzíveis.

---

# 55. Administração

Não construir painel completo no lançamento.

Inicialmente usar Supabase Dashboard para operações.

Criar somente uma área administrativa mínima posteriormente para:

```text
ativar quiz
alterar preço
ver vendas
ver conversão
publicar tradução
```

Isso reduz muito o escopo inicial.

---

# 56. Funil final do Meqyro

```text
TikTok / Instagram / Google / SEO
                  │
                  ▼
              Meqyro
                  │
                  ▼
               Quiz
                  │
                  ▼
              E-mail
                  │
                  ▼
         Resultado gratuito
                  │
                  ▼
              Paywall
            /          \
        compra         não compra
          │               │
          ▼               ▼
       relatório       recovery
          │
          ▼
      cross-sell
          │
          ▼
        bundle
          │
          ▼
     compartilhamento
          │
          ▼
       novo usuário
```

Este é o verdadeiro produto.

Os quizzes são o mecanismo de aquisição e geração de curiosidade.

---

# 57. Meta da primeira versão

O objetivo do lançamento não é construir uma plataforma enorme.

É descobrir:

```text
Quais quizzes atraem?
Quais são concluídos?
Quais capturam email?
Quais convertem?
Qual preço converte?
Qual país compra?
Qual canal gera receita?
Qual quiz gera cross-sell?
```

Após tráfego suficiente, removemos produtos fracos e investimos nos vencedores.

---

# 58. Escopo fechado do MVP v1

**Frontend**

```text
Home
7 landing pages
7 quizzes
resultado parcial
resultado premium
checkout
pós-compra
idioma
country selector
privacy
terms
cookies
contact
unsubscribe
```

**Backend**

```text
sessions
answers
scoring
leads
consents
results
orders
payments
webhooks
email
analytics
referrals
```

**Integrações**

```text
Supabase
InfinitePay
Stripe
Resend
Vercel
Sentry
Analytics
```

**Idiomas**

```text
PT
EN
ES
FR
```

**Pagamentos**

```text
Brasil → InfinitePay
Exterior → Stripe
```

**Sem**

```text
login obrigatório
app mobile
microservices
assinatura
IA generativa obrigatória
painel administrativo complexo
```

---

# 59. Arquitetura final do lançamento

```text
                         USERS
                           │
                           ▼
                     meqyro.com
                           │
                       Cloudflare
                           │
                           ▼
                    Vercel / Next.js
                           │
        ┌──────────────────┼────────────────────┐
        │                  │                    │
        ▼                  ▼                    ▼
     Supabase         Payment Router          Resend
        │                  │                    │
   PostgreSQL       ┌──────┴──────┐        Email flows
   RLS              │             │
   Storage      InfinitePay     Stripe
                Brazil          Global
                    │             │
                    └──────┬──────┘
                           │
                        Webhook
                           │
                           ▼
                         Orders
                           │
                           ▼
                         Result
                           │
                           ▼
                     Cross-sell
                           │
                           ▼
                       Referral
```

Essa será a arquitetura base do **Meqyro v1**.
