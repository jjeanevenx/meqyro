# Meqyro — AI Agent Knowledge Base

This directory is the canonical knowledge base for AI agents working on the Meqyro repository.

## Purpose

- Eliminate repeated codebase discovery across sessions.
- Ensure consistent decisions between different agents and tools.
- Prevent architectural drift and incompatible pattern introductions.
- Document rules that the code itself cannot enforce at compile time.

## Compatible agents

This documentation is designed for:
- **Kiro** — uses `AGENTS.md` (root) + `.kiro/steering/` files
- **GitHub Copilot** — uses `.github/copilot-instructions.md` + this directory
- **OpenAI Codex** — uses `AGENTS.md` (root) as primary context
- **Google Antigravity** — uses `AGENTS.md` (root)
- Any agent that respects an `AGENTS.md` file at the repository root

## Navigation

| Question | Document |
|---|---|
| What is this project and how does it work? | [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) |
| How is the code structured architecturally? | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Where do I put this type of file? | [`STRUCTURE.md`](./STRUCTURE.md) |
| Which libraries and versions are in use? | [`TECH_STACK.md`](./TECH_STACK.md) |
| What are the business/domain rules? | [`DOMAIN_RULES.md`](./DOMAIN_RULES.md) |
| How should I write code in this project? | [`CONVENTIONS.md`](./CONVENTIONS.md) |
| How do I build, run, and test locally? | [`WORKFLOWS.md`](./WORKFLOWS.md) |
| How are tests structured and run? | [`TESTING.md`](./TESTING.md) |
| What security constraints apply? | [`SECURITY.md`](./SECURITY.md) |
| What must I never do? | [`DO_NOT_DO.md`](./DO_NOT_DO.md) |
| Why were key decisions made? | [`DECISIONS.md`](./DECISIONS.md) |

## Freshness policy

**The source code is always authoritative.**

If any document here contradicts the actual implementation:

1. Investigate the inconsistency — do not blindly follow the documentation.
2. Determine whether the code or the documentation should be corrected.
3. Report the discrepancy before acting.

Documentation is updated manually when architectural decisions change. Assume it may lag behind minor implementation details; use it for structural guidance, not line-level truth.
