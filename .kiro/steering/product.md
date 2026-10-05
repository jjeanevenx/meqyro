---
inclusion: always
---

# Meqyro — Product Overview

Meqyro is a self-discovery assessment platform. Anonymous users take one or more of **seven psychological and cognitive quizzes**, receive a free partial result, and may purchase a premium analytical report. No account is required to start.

## The seven assessments

| Slug              | Name            | Type          | Questions |
| ----------------- | --------------- | ------------- | --------- |
| `brainrank`       | BrainRank       | SINGLE_CHOICE | 24        |
| `personality-map` | Personality Map | LIKERT        | 40        |
| `careerfit`       | CareerFit       | LIKERT        | 24        |
| `moneydna`        | MoneyDNA        | LIKERT        | 20        |
| `coupledna`       | CoupleDNA       | LIKERT        | 20        |
| `decisiondna`     | DecisionDNA     | SCENARIO      | 4         |
| `focusstyle`      | FocusStyle      | LIKERT        | 20        |

## Languages

PT · EN · ES · FR — all four must always be present in every question, UI string, and email.

## Main flow

```
/ → locale detect → /{locale}
Home → Discover → Quiz landing → Quiz play
  → Session created (anonymous cookie)
  → Answers saved per question
  → Complete → score computed SERVER-SIDE
  → Lead capture (optional email)
  → Free result → Premium offer
  → Checkout → Payment (Stripe or InfinitePay)
  → Webhook confirms → Premium unlocked
```

## Payment providers

| Market | Provider                 | Currency |
| ------ | ------------------------ | -------- |
| BR     | InfinitePay (PIX + card) | BRL      |
| US     | Stripe                   | USD      |
| EU     | Stripe                   | EUR      |
| GB     | Stripe                   | GBP      |

**Market ≠ Locale.** Language does not determine payment provider.

## Result access model

- **Free partial** — always available after completion.
- **Premium** — requires a `result_access_grants` row (created only after confirmed payment webhook). Cannot be faked client-side.

## Full documentation

→ `docs/ai/PROJECT_CONTEXT.md`
