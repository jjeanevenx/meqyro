# ADR 0005 — Schema privado e grants explícitos

**Status:** aceito  
**Data:** 25/09/2026

## Decisão

Tabelas internas começam no schema `meqyro`, sem grants para `anon` ou `authenticated`. O browser não consulta catálogo administrativo, preços ou conteúdo premium diretamente. Casos futuros de Data API devem ser introduzidos explicitamente, com grants, RLS e testes próprios.

## Motivo

O Supabase passou a não expor novas tabelas automaticamente em 2026. A decisão também reduz a superfície do MVP e mantém autorização sensível no servidor.
