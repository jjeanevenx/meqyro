# ADR 0001 — Sessão anônima com token opaco

**Status:** aceito  
**Data:** 25/09/2026

## Decisão

Criar UUID interno e token aleatório de 256 bits. Enviar o token somente em cookie HttpOnly, Secure e SameSite=Lax; persistir apenas hash. UUID ou token público de resultado não bastam como autorização.

Rotacionar o token ao concluir, recuperar por e-mail e elevar acesso. Mutações validam Origin/Host e proteção CSRF proporcional.

## Consequência

Mantém baixa fricção sem transformar IDs enumeráveis em credenciais. Exige fluxo explícito de recuperação e revogação.
