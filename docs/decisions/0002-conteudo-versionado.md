# ADR 0002 — Conteúdo e scoring versionados

**Status:** aceito  
**Data:** 25/09/2026

## Decisão

Persistir `quiz_version` e `scoring_version` em sessão e resultado. Conteúdo traduzido segue estados editoriais e não é publicado parcialmente. Resultados guardam dados suficientes para reprodução.

## Consequência

Mudanças metodológicas não alteram resultados antigos e rollbacks editoriais são possíveis. A publicação exige migrations/imports e gates adicionais.
