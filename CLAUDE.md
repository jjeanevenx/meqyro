@AGENTS.md

# Claude Code — Project Instructions

This file is the entry point for Claude Code sessions on the Meqyro repository. It delegates to `AGENTS.md` for universal rules and to `docs/ai/` for detailed knowledge. Do not duplicate that content here.

---

## Project knowledge

Full documentation lives in `docs/ai/`. Load only what the task requires:

| Document | When to read it |
|---|---|
| `docs/ai/PROJECT_CONTEXT.md` | Any task — understand the product first |
| `docs/ai/ARCHITECTURE.md` | Any structural or server-side change |
| `docs/ai/STRUCTURE.md` | Adding files or unsure where something belongs |
| `docs/ai/TECH_STACK.md` | Checking available libraries before adding one |
| `docs/ai/DOMAIN_RULES.md` | Quiz, scoring, session, order, or consent changes |
| `docs/ai/CONVENTIONS.md` | Writing new code in any layer |
| `docs/ai/WORKFLOWS.md` | Build, test, migration, or seed commands |
| `docs/ai/TESTING.md` | Adding or changing tests |
| `docs/ai/SECURITY.md` | Auth, tokens, payments, PII, webhooks |
| `docs/ai/DO_NOT_DO.md` | **Always — before touching any file** |
| `docs/ai/DECISIONS.md` | Understanding why something is built a certain way |

---

## Mandatory reading before any code change

1. `AGENTS.md`
2. `docs/ai/DO_NOT_DO.md`
3. `docs/ai/PROJECT_CONTEXT.md`
4. `docs/ai/ARCHITECTURE.md`
5. Task-specific document from the table above

---

## Task execution protocol

### 1 · UNDERSTAND
Read the requirement fully. Do not begin coding because the implementation seems obvious.

### 2 · EXPLORE
Before writing anything, locate in the repository:
- existing implementations related to the task
- existing tests for the area being changed
- existing abstractions, services, helpers, or adapters
- architectural boundaries the change must respect

Use search tools to find. Do not assume file locations from names alone.

### 3 · CHECK RULES
Re-read `docs/ai/DO_NOT_DO.md` and `docs/ai/ARCHITECTURE.md` with the specific task in mind.

### 4 · PLAN
Identify the **smallest coherent change** that satisfies the requirement. Write out the list of files that will change and why, before editing any of them. For non-trivial tasks, state this plan explicitly before implementing.

### 5 · IMPLEMENT
Follow existing patterns. Match the naming, structure, and style of the surrounding code. Do not introduce new patterns or abstractions unless required by the task.

### 6 · VALIDATE
Run, in order:
```bash
pnpm typecheck
pnpm test
pnpm build
```
If the environment does not support a DB, unit tests must still pass. Report what could not be validated and why.

### 7 · REVIEW
Inspect the diff before reporting completion. Verify:
- no unrelated files changed
- no accidental formatting-only changes
- no test weakened or removed
- no contract silently altered
- no secret or PII introduced into logs or client code

### 8 · REPORT
```
Changed:
- <file>: <reason>

Reason:
- <why this change was necessary>

Validation:
- pnpm typecheck: PASS / FAIL
- pnpm test: X passed, Y skipped
- pnpm build: PASS / FAIL

Tests not run:
- <what and why>

Assumptions:
- <anything not confirmed by repository evidence>

Potential impact:
- <side effects or areas that may need follow-up>
```

---

## Scope control

Make the change requested. Do not expand scope.

If component A needs fixing, do not refactor B, C, and D because improvements seem possible.

Prefer **minimal coherent change** over architectural cleanup.

---

## Refactoring policy

Refactoring is acceptable only when:
1. explicitly requested by the user, or
2. strictly necessary to implement the requested behavior safely.

When a refactor becomes necessary, keep it as small as possible and explain why in the report.

---

## New abstractions

Before creating an interface, service, adapter, helper, factory, provider, or wrapper, search for an existing equivalent. Every new abstraction must solve a concrete problem in the current task, not a hypothetical future need.

---

## Dependencies

Before adding any package:
1. Check if the framework or Node.js stdlib already provides it.
2. Check packages already installed in `package.json`.
3. Check if a few lines of code would suffice.
4. Only then consider a new dependency — and justify it.

Never upgrade unrelated dependencies as a side effect of another task. Use `pnpm add` only; never `npm install` or `yarn add`.

---

## Architecture preservation

The existing architecture takes precedence over generic best practices. Do not introduce a different architectural style because you prefer it. See `docs/ai/ARCHITECTURE.md` for the actual structure.

Key invariants:
- All scoring logic stays in `src/features/scoring/` — pure, server-side, no I/O.
- All DB access uses `createSupabaseSecretClient()` — never raw Supabase anon client for mutations.
- All feature modules start with `import "server-only"`.
- Client components never import from `src/features/`.
- State transitions always go through `assertTransition()`.
- Market ≠ Locale — never derive payment provider from language.

---

## Avoid overengineering

Prefer the simplest implementation consistent with the existing architecture. Do not introduce without clear need:
- new layers, new services, new microservices
- new design patterns, new queues, new events
- premature extension points or generic frameworks

---

## Critical prohibitions (summary)

Full list in `docs/ai/DO_NOT_DO.md`. Non-negotiable highlights:

- DO NOT move scoring to the client or to Route Handlers.
- DO NOT accept `price`/`amount` from the client request body in checkout.
- DO NOT skip `timingSafeEqual` for token comparison.
- DO NOT create a client-side path to unlock premium access.
- DO NOT use `any`, `@ts-ignore`, or `@ts-expect-error` to suppress type errors.
- DO NOT add `.skip` or `.only` to hide failing tests.
- DO NOT hardcode secrets or put them in `NEXT_PUBLIC_*` variables.
- DO NOT change scoring logic without documenting the change in `docs/ai/DECISIONS.md`.
- DO NOT manually edit `supabase/seed.sql` — regenerate it from `src/content/quizzes/`.
- DO NOT modify existing migration files — always create a new one.
- DO NOT install Stripe SDK, Resend SDK, an ORM, a UI library, or an i18n library.

---

## Security

Never reproduce, log, or hardcode real API keys, tokens, passwords, connection strings, or cloud credentials. Never weaken session token validation or webhook signature verification. See `docs/ai/SECURITY.md`.

---

## Testing

When changing behavior:
1. Identify existing relevant tests in `tests/unit/` and `tests/integration/`.
2. Preserve existing test conventions and assertion strength.
3. Add or update tests when behavior changes.
4. Run `pnpm test` before reporting complete.

Never delete or weaken a test to make the suite pass. Fix the underlying issue.

---

## Git safety

Do not:
- discard existing uncommitted user changes
- force-push or rewrite history
- commit unrelated files
- reset changes outside the task scope

unless explicitly requested.

---

## Uncertainty

Do not transform assumptions into facts. When something cannot be confirmed from the repository:
- state the assumption explicitly
- investigate further using search/read tools
- or mark it as UNKNOWN

Do not fabricate architecture, requirements, or business rules.

---

## Source of truth priority

1. Explicit user requirement for the current task
2. Existing source code and contracts
3. `AGENTS.md` + `docs/ai/`
4. Existing tests
5. Generic engineering practices

If documentation and source code conflict, investigate and report the discrepancy — do not silently follow either.

---

## Context selection by task type

Load only the documents relevant to the task:

**Quiz / scoring change** → `DOMAIN_RULES.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `TESTING.md`, `DO_NOT_DO.md`

**API / Route Handler change** → `ARCHITECTURE.md`, `CONVENTIONS.md`, `SECURITY.md`, `TESTING.md`, `DO_NOT_DO.md`

**Payment / webhook change** → `DOMAIN_RULES.md`, `SECURITY.md`, `ARCHITECTURE.md`, `DO_NOT_DO.md`

**i18n / content change** → `DOMAIN_RULES.md`, `CONVENTIONS.md`, `WORKFLOWS.md`, `DO_NOT_DO.md`

**DB / migration change** → `ARCHITECTURE.md`, `CONVENTIONS.md`, `WORKFLOWS.md`, `SECURITY.md`, `DO_NOT_DO.md`

**UI / component change** → `STRUCTURE.md`, `CONVENTIONS.md`, `TECH_STACK.md`

**Bug fix** → Load files directly related to the affected component and its existing tests.

---

## Compatibility with other agents

Shared architectural knowledge belongs in `docs/ai/`. Universal rules belong in `AGENTS.md`. This file contains only Claude Code-specific behaviour. Do not create conventions here that conflict with `AGENTS.md` — other agents (Kiro, Copilot, Codex, Antigravity) operate from the same shared knowledge base.
