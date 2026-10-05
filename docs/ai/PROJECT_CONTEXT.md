# Project Context

## What is Meqyro?

Meqyro is a self-discovery assessment platform. Anonymous users take short psychological and cognitive quizzes, receive a free preliminary result, and may purchase a premium analytical report. No mandatory account is required to start or complete an assessment.

## Users

- Anonymous visitors who take quizzes without registering.
- Users who optionally provide an email to save their result and receive a recovery link.
- Paying customers who unlock a premium report after quiz completion.
- CoupleDNA participants: two people who each answer a quiz and then see a bilateral comparison (requires mutual consent from both).
- Internal operators who access `/[locale]/admin` and `/api/admin/*` with a server-side secret.

## The seven assessments

| Slug              | Name            | Model                    | Questions | Type          |
| ----------------- | --------------- | ------------------------ | --------- | ------------- |
| `brainrank`       | BrainRank       | Cognitive dimensions (6) | 24        | SINGLE_CHOICE |
| `personality-map` | Personality Map | Big Five (O/C/E/A/ES)    | 40        | LIKERT        |
| `careerfit`       | CareerFit       | Career anchors (6)       | 24        | LIKERT        |
| `moneydna`        | MoneyDNA        | Financial archetypes (5) | 20        | LIKERT        |
| `coupledna`       | CoupleDNA       | Couple dimensions (5)    | 20        | LIKERT        |
| `decisiondna`     | DecisionDNA     | Decision styles (4)      | 4         | SCENARIO      |
| `focusstyle`      | FocusStyle      | Focus styles (4)         | 20        | LIKERT        |

## Languages

Portuguese (pt), English (en), Spanish (es), French (fr). All four must be present in every question, UI string, and email template.

## Main user flow

```
/ (root)
  → locale detection → /[locale]
  → Home (/[locale])
  → Discover (/[locale]/discover) — all 7 quizzes displayed
  → Quiz landing (/[locale]/quizzes/[slug])
  → Quiz play (/[locale]/quizzes/[slug]/play)
      → Session created (anonymous, cookie-bound)
      → Questions answered one at a time, each saved to DB
      → Last question → complete → score computed server-side
  → Lead capture (email, optional)
  → Result view (free partial)
  → Premium offer / paywall
  → Checkout (/[locale]/checkout?session=...&product=...)
      → /api/checkout → price resolved server-side → provider checkout created
      → Redirect to Stripe
  → Payment success → /[locale]/checkout/success
      → Webhook (async) confirms and fulfills the order
  → Premium result unlocked
```

## Payment providers

| Market | Provider | Currency |
| ------ | -------- | -------- |
| BR     | Stripe   | BRL      |
| US     | Stripe   | USD      |
| EU     | Stripe   | EUR      |
| GB     | Stripe   | GBP      |

Market is determined by an explicit cookie (`meqyro_market`) or defaults to US. **Market is independent of locale** — a French-speaking user can be in Brazil and should pay via Stripe in BRL.

## CoupleDNA special flow

Person A starts the quiz → gets an invite link/code → shares with Person B → Person B completes the same quiz → bilateral comparison unlocked only after both complete, consent and payment is confirmed. Two separate `quiz_sessions` are linked via `couple_invites` table.

## Result access model

- **Free partial** — always available after quiz completion; contains overall score, strongest dimension, and dimension breakdown.
- **Premium** — unlocked by a `result_access_grants` row with `grant_type = 'PREMIUM_REPORT'`, created only after webhook confirmation from the payment provider.
- Accessing premium content requires: valid session token + confirmed grant in DB. LocalStorage or URL manipulation cannot bypass this.

## Email

Sent via Resend API. Emails include: result delivery (with recovery link), session recovery, purchase confirmation, refund notification, data request verification, couple invite, couple unlock. All emails are text-only (no HTML body currently).

## Admin / operations

- `/api/admin/*` — protected by `ADMIN_API_SECRET` env var; used for metrics and operations.
- `/api/cron/reconcile` — protected by `CRON_SECRET`; reconciles unpaid/unfulfilled orders.
- `/[locale]/admin` — web admin interface, same secret.

## Privacy (LGPD / GDPR)

Users can request data export, deletion, or rectification via `/[locale]/privacy/data-request`. Requests require email verification. IP addresses are hashed with a server-side salt before storage.

## Referrals

Users can generate shareable referral links. Referral codes are tracked on session creation and converted on order fulfillment.

## Contratos do candidato de homologação

Sessões novas herdam `buyer_id` apenas mediante cookie válido; não há login obrigatório. Grants premium exigem pedido FULFILLED e prazo de 24 meses. Pacotes cobrem testes posteriores do comprador. CoupleDNA exige pagamento, conclusão e autorização dos dois participantes. A entrega completa ocorre por Supabase Function com corpo de texto e anexo HTML, registrada por pedido/sessão.
