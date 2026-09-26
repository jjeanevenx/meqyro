# ADR 0004 — Analytics first-party com allowlist

**Status:** aceito  
**Data:** 25/09/2026

## Decisão

Eventos de funil são gravados primeiro no Postgres com schema allowlist. Ferramentas externas recebem apenas eventos e IDs pseudônimos; respostas, e-mail, texto de relatório e tokens são proibidos.

## Consequência

Melhora auditabilidade e privacidade, ao custo de um pipeline mínimo de agregação e retenção.
