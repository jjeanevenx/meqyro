# Meqyro

Mobile-first quiz platform foundation built with Next.js App Router, TypeScript and Supabase.

## Requirements

- Node.js 22+
- pnpm 11.19.0
- Docker Desktop only when running the local Supabase stack

## Local development

```bash
pnpm install
copy .env.example .env.local
pnpm dev
```

The application starts at `http://localhost:3000` and redirects to a localized shell.

## Quality checks

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Supabase

The first migration creates the private `meqyro` schema. It deliberately grants no browser access. Use the secret server client only inside trusted server code. Public Data API grants must be introduced explicitly, with matching RLS policies and tests.

```bash
pnpm supabase start
pnpm supabase db reset
```

The production and staging projects are external prerequisites; no credentials are committed.

Health checks are available at `GET /api/health` and return the correlation ID in both the body and the `x-request-id` response header.

## Structure

- `src/app`: localized App Router pages and metadata routes.
- `src/components`: reusable UI and product patterns.
- `src/lib`: i18n, market, observability and Supabase boundaries.
- `supabase`: local configuration, migrations and seed.
- `tests/unit`: deterministic domain tests.
- `prototype`: verified Phase 0 mobile prototype, kept as a visual reference.

Architecture decisions live in `docs/decisions`; the initial security review is in `docs/security/threat-model.md`.
